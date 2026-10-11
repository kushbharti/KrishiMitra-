from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends, Request
from schemas.disease import SupportedCropsResponse, DiseasePredictionResponse, LeafValidationResult, LeafValidationStatus
from services.disease_service import DiseaseModelService, get_disease_service
from services.image_validation_service import (
    ImageValidationService,
    get_image_validation_service,
    InvalidImageFileError,
    ValidationAuthError,
    ValidationRateLimitError,
    ValidationTimeoutError,
    ValidationServiceUnavailableError,
    ValidationResponseError,
    ImageValidationError,
)
from db.mongodb import get_database
from utils.data_loader import load_json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/supported-crops", response_model=SupportedCropsResponse)
async def get_supported_crops(service: DiseaseModelService = Depends(get_disease_service)):
    """Fetch the dynamically configured list of 24 supported crops."""
    try:
        crops = service.get_supported_crops()
        return SupportedCropsResponse(success=True, crops=crops)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load supported crops: {str(e)}")


@router.post("/validate", response_model=LeafValidationResult)
async def validate_image(
    image: UploadFile = File(..., description="The image file to validate as a plant leaf"),
    validation_service: ImageValidationService = Depends(get_image_validation_service),
):
    """
    Dedicated endpoint to validate whether an image contains a recognizable plant leaf.
    Fails closed if the validation service is unavailable or encounters an error.
    """
    try:
        contents = await image.read()
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read the uploaded image file.")

    try:
        result = validation_service.validate_leaf_image(contents)
        return result
    except InvalidImageFileError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValidationAuthError as e:
        raise HTTPException(status_code=503, detail="Image validation service authentication failed. Please check backend API configuration.")
    except ValidationRateLimitError as e:
        raise HTTPException(status_code=429, detail="Image validation rate limit reached. Please wait a moment and try again.")
    except ValidationTimeoutError as e:
        raise HTTPException(status_code=504, detail="Image validation timed out. Please try again.")
    except ValidationServiceUnavailableError as e:
        raise HTTPException(status_code=503, detail="Image validation service is currently unavailable. Please try again later.")
    except ValidationResponseError as e:
        raise HTTPException(status_code=502, detail="Image validation returned an invalid response. Please try again.")
    except ImageValidationError as e:
        raise HTTPException(status_code=500, detail=f"Image validation error: {str(e)}")


@router.post("/predict", response_model=DiseasePredictionResponse)
async def predict_disease(
    request: Request,
    crop: str = Form(..., description="The name of the selected supported crop"),
    image: UploadFile = File(..., description="The leaf image to analyze"),
    service: DiseaseModelService = Depends(get_disease_service),
    validation_service: ImageValidationService = Depends(get_image_validation_service),
    db=Depends(get_database),
):
    """
    Analyze uploaded leaf image against the selected crop model and return predictions.
    
    Processing Order:
    1. Read uploaded image bytes.
    2. Validate file format, size, and decodability safely.
    3. Call Gemini Vision API to validate leaf presence.
    4. Parse and evaluate validation status.
       - NON_LEAF: Stop inference, return farmer-friendly rejection error.
       - UNCERTAIN: Stop inference, return image clarity guidance error.
    5. Crop validation: Check if crop is supported by the disease model.
    6. Disease inference (EfficientNet-B0): Only executed for validated LEAF images.
    """
    # 1. Read Uploaded Image Bytes
    try:
        contents = await image.read()
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read the uploaded image file.")

    # 2. File Format, Extension, and Integrity Pre-Validation
    allowed_extensions = {"jpg", "jpeg", "png", "webp"}
    file_ext = image.filename.split(".")[-1].lower() if image.filename else ""
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension '.{file_ext}'. Only JPG, JPEG, PNG, and WEBP files are permitted."
        )

    if image.content_type and not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid content type. Please upload a valid image file."
        )

    try:
        # Validates structural integrity, supported format (JPEG, PNG, WEBP), and size limit
        validation_service.verify_and_decode_image(contents)
    except InvalidImageFileError as img_err:
        raise HTTPException(status_code=400, detail=str(img_err))

    # 3 & 4. Gemini Vision Leaf Validation
    try:
        validation_result = validation_service.validate_leaf_image(contents)
    except InvalidImageFileError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValidationAuthError:
        raise HTTPException(
            status_code=503,
            detail="Image validation service authentication failed. Please check backend API configuration."
        )
    except ValidationRateLimitError:
        raise HTTPException(
            status_code=429,
            detail="Image validation rate limit reached. Please wait a moment and try again."
        )
    except ValidationTimeoutError:
        raise HTTPException(
            status_code=504,
            detail="Image validation timed out. Please try again."
        )
    except ValidationServiceUnavailableError:
        raise HTTPException(
            status_code=503,
            detail="Image validation service is currently unavailable. Please try again later."
        )
    except ValidationResponseError:
        raise HTTPException(
            status_code=502,
            detail="Image validation returned an invalid response. Please try again."
        )
    except ImageValidationError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image validation failed: {str(e)}"
        )

    # 5. Evaluate Validation Outcome
    if validation_result.status == LeafValidationStatus.NON_LEAF:
        logger.info(f"[Disease] Rejected NON_LEAF image: {validation_result.reason}")
        raise HTTPException(
            status_code=400,
            detail="Please upload a clear plant leaf image for disease detection."
        )

    if validation_result.status == LeafValidationStatus.UNCERTAIN:
        logger.info(f"[Disease] Rejected UNCERTAIN image: {validation_result.reason}")
        raise HTTPException(
            status_code=400,
            detail="We could not verify this image. Please upload a clearer leaf photo."
        )

    # 6. Supported Crop Validation (executed after leaf image is confirmed valid)
    if not service.validate_crop(crop):
        raise HTTPException(
            status_code=400,
            detail=f"This crop '{crop}' is not supported by the current disease detection model."
        )

    # 7. Perform Disease Inference (EfficientNet-B0) — Invariant: Only reaches here if LEAF is valid
    try:
        result = service.predict(image_bytes=contents, selected_crop=crop)
        prediction_response = DiseasePredictionResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

    # 5. Save scan log to MongoDB (optional — if user is authenticated)
    try:
        access_token = request.cookies.get("access_token")
        if access_token:
            from services.jwt_service import JWTService
            payload = JWTService.verify_access_token(access_token)
            user_id = payload.get("sub") if payload else None
            if user_id:
                top_pred = prediction_response.details
                severity = top_pred.severity if top_pred else "Unknown"
                disease_name = top_pred.disease_name if top_pred else "Unknown"
                await db.scan_logs.insert_one({
                    "user_id": user_id,
                    "crop": crop,
                    "disease": disease_name,
                    "confidence": round(prediction_response.confidence, 2),
                    "severity": severity,
                    "healthy": prediction_response.details.healthy,
                    "timestamp": datetime.utcnow(),
                })
    except Exception as log_err:
        logger.warning(f"[Disease] Scan log write failed (non-critical): {log_err}")

    return prediction_response
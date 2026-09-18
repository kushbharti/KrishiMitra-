from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends, Request
from schemas.disease import SupportedCropsResponse, DiseasePredictionResponse
from services.disease_service import DiseaseModelService, get_disease_service
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


@router.post("/predict", response_model=DiseasePredictionResponse)
async def predict_disease(
    request: Request,
    crop: str = Form(..., description="The name of the selected supported crop"),
    image: UploadFile = File(..., description="The leaf image to analyze"),
    service: DiseaseModelService = Depends(get_disease_service),
    db=Depends(get_database),
):
    """Analyze uploaded leaf image against the selected crop model and return top 4 predictions."""
    
    # 1. Crop Validation
    if not service.validate_crop(crop):
        raise HTTPException(
            status_code=400,
            detail=f"This crop '{crop}' is not supported by the current disease detection model."
        )

    # 2. File Type & Extension Validation
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

    # 3. File Size Validation (Max 5 MB)
    try:
        contents = await image.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds the 5MB limit. Please compress or resize your image."
            )
        if len(contents) == 0:
            raise HTTPException(
                status_code=400,
                detail="The uploaded image file is empty."
            )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read the uploaded image file.")

    # 4. Perform Inference
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
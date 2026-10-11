import io
import os
import pytest
from unittest.mock import MagicMock, patch
from PIL import Image
from fastapi import FastAPI
from fastapi.testclient import TestClient

from schemas.disease import (
    LeafValidationResult,
    LeafValidationStatus,
    DiseasePredictionResponse,
)
from services.image_validation_service import (
    ImageValidationService,
    InvalidImageFileError,
    ValidationAuthError,
    ValidationRateLimitError,
    ValidationTimeoutError,
    ValidationServiceUnavailableError,
    ValidationResponseError,
    get_image_validation_service,
)
from services.disease_service import get_disease_service
from db.mongodb import get_database
from modules.disease_detection import router as disease_router


# ============================================================================
# Helpers to generate synthetic test images
# ============================================================================

def create_image_bytes(format="JPEG", size=(100, 100), color=(40, 160, 40)) -> bytes:
    """Create valid in-memory image bytes."""
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()


# ============================================================================
# Test Fixtures & Test Client Setup
# ============================================================================

@pytest.fixture
def test_app():
    """Create a standalone FastAPI app mounting the disease router with mocked dependencies."""
    app = FastAPI()
    app.include_router(disease_router, prefix="/api/disease")
    
    # Mock MongoDB
    app.dependency_overrides[get_database] = lambda: MagicMock()
    return app


@pytest.fixture
def mock_disease_service():
    """Mock the EfficientNet-B0 disease detection model service."""
    mock = MagicMock()
    # Support Tomato, Potato, Apple
    mock.validate_crop.side_effect = lambda c: c in ["Tomato", "Potato", "Apple"]
    mock.predict.return_value = {
        "success": True,
        "selected_crop": "Tomato",
        "detected_crop": "Tomato",
        "crop_match": True,
        "confidence": 94.5,
        "predictions": [
            {
                "crop": "Tomato",
                "disease": "Tomato Early Blight",
                "confidence": 94.5,
                "healthy": False,
                "symptoms": ["Dark brown spots with concentric rings"],
                "causes": "Alternaria solani fungal infection",
                "treatment": ["Apply copper-based fungicide"],
                "prevention": ["Rotate crops every 2-3 years"],
                "fungicide": "Mancozeb 75% WP",
                "severity": "Medium",
                "recovery_tips": "Avoid overhead watering",
            }
        ],
        "details": {
            "disease_name": "Tomato Early Blight",
            "crop_name": "Tomato",
            "confidence": 94.5,
            "healthy": False,
            "symptoms": ["Dark brown spots with concentric rings"],
            "causes": "Alternaria solani fungal infection",
            "treatment": ["Apply copper-based fungicide"],
            "prevention": ["Rotate crops every 2-3 years"],
            "fungicide": "Mancozeb 75% WP",
            "severity": "Medium",
            "recovery_tips": "Avoid overhead watering",
        },
        "low_confidence": False,
        "message": "Detected Tomato Early Blight with 94.5% confidence.",
    }
    return mock


# ============================================================================
# 1 & 2: Valid Leaf Tests (Healthy & Diseased)
# ============================================================================

def test_healthy_leaf_proceeds_to_disease_inference(test_app, mock_disease_service):
    """A healthy leaf validated by Gemini must proceed to EfficientNet-B0 inference."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.return_value = LeafValidationResult(
        status=LeafValidationStatus.LEAF,
        reason="Clear single healthy plant leaf visible.",
        suggested_action=None,
    )

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("leaf.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["detected_crop"] == "Tomato"
    # Invariant: disease inference was executed
    mock_disease_service.predict.assert_called_once()


def test_diseased_or_discolored_leaf_proceeds_to_disease_inference(test_app, mock_disease_service):
    """A diseased/yellowed/spotted leaf must be classified as LEAF and reach inference."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.return_value = LeafValidationResult(
        status=LeafValidationStatus.LEAF,
        reason="Plant leaf with brown spots, yellow margins, and necrosis.",
        suggested_action=None,
    )

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG", color=(180, 130, 20))

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("diseased_leaf.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 200
    mock_disease_service.predict.assert_called_once()


# ============================================================================
# 3, 4, 5: Non-Leaf Rejection Tests (Humans, Animals, Vehicles, Soil, Fruits)
# ============================================================================

@pytest.mark.parametrize("non_leaf_desc", [
    "A sedan car on an asphalt road",
    "A portrait of a human face",
    "A dairy cow in a barn",
    "Dry bare agricultural soil without any foliage",
    "A brick wall of a farmhouse",
    "Only an apple fruit without any attached leaf",
])
def test_non_leaf_images_rejected_before_inference(test_app, mock_disease_service, non_leaf_desc):
    """Non-leaf subjects must be rejected and EfficientNet-B0 must NEVER be called."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.return_value = LeafValidationResult(
        status=LeafValidationStatus.NON_LEAF,
        reason=non_leaf_desc,
        suggested_action="Please photograph a plant leaf.",
    )

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("object.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 400
    assert "Please upload a clear plant leaf image for disease detection." in response.json()["detail"]
    # Critical invariant: EfficientNet-B0 must NOT execute!
    mock_disease_service.predict.assert_not_called()


# ============================================================================
# 6: Blurry / Uncertain Image Tests
# ============================================================================

def test_blurry_or_ambiguous_image_returns_uncertain(test_app, mock_disease_service):
    """Blurry or out-of-focus images must return UNCERTAIN and stop inference."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.return_value = LeafValidationResult(
        status=LeafValidationStatus.UNCERTAIN,
        reason="Extreme motion blur; plant leaf features cannot be verified.",
        suggested_action="Hold camera steady under bright daylight.",
    )

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("blurry.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 400
    assert "We could not verify this image. Please upload a clearer leaf photo." in response.json()["detail"]
    # Critical invariant: disease model not executed
    mock_disease_service.predict.assert_not_called()


# ============================================================================
# 7, 8, 9, 10: File Integrity Pre-Validation Tests
# ============================================================================

def test_empty_file_rejected_without_calling_gemini(test_app, mock_disease_service):
    """An empty file (0 bytes) must be rejected immediately."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.side_effect = InvalidImageFileError("The uploaded image file is empty.")

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("empty.jpg", b"", "image/jpeg")},
    )

    assert response.status_code == 400
    mock_val_service.validate_leaf_image.assert_not_called()
    mock_disease_service.predict.assert_not_called()


def test_corrupt_file_rejected_without_calling_gemini(test_app, mock_disease_service):
    """A corrupted binary payload must be rejected before Gemini or inference."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.side_effect = InvalidImageFileError("Invalid or corrupted image file.")

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("corrupted.jpg", b"PK\x03\x04not_an_image_data", "image/jpeg")},
    )

    assert response.status_code == 400
    mock_val_service.validate_leaf_image.assert_not_called()
    mock_disease_service.predict.assert_not_called()


def test_oversized_file_rejected(test_app, mock_disease_service):
    """Files exceeding 5MB must be rejected locally."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.side_effect = InvalidImageFileError("File size exceeds the 5MB limit.")

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("huge.jpg", b"x" * 100, "image/jpeg")},
    )

    assert response.status_code == 400
    mock_val_service.validate_leaf_image.assert_not_called()
    mock_disease_service.predict.assert_not_called()


def test_unsupported_file_extension_rejected(test_app, mock_disease_service):
    """Disallowed file extension (e.g. .gif, .pdf, .exe) must be rejected."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("document.pdf", b"%PDF-1.4...", "application/pdf")},
    )

    assert response.status_code == 400
    assert "Invalid file extension" in response.json()["detail"]
    mock_val_service.validate_leaf_image.assert_not_called()
    mock_disease_service.predict.assert_not_called()


# ============================================================================
# 11, 12, 13, 14, 15: Gemini API Failure & Fail-Closed Invariant Tests
# ============================================================================

def test_missing_api_credentials_fails_closed(test_app, mock_disease_service):
    """Missing API key must fail closed with 503 and NEVER run disease inference."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.side_effect = ValidationAuthError("API key not configured.")

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("leaf.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 503
    mock_disease_service.predict.assert_not_called()


def test_api_timeout_fails_closed(test_app, mock_disease_service):
    """API timeout must return 504 and fail closed without executing inference."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.side_effect = ValidationTimeoutError("Timed out.")

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("leaf.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 504
    mock_disease_service.predict.assert_not_called()


def test_rate_limit_quota_exhaustion_fails_closed(test_app, mock_disease_service):
    """Rate limit 429 must return 429 and fail closed."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.side_effect = ValidationRateLimitError("Quota exceeded.")

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("leaf.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 429
    mock_disease_service.predict.assert_not_called()


def test_malformed_ai_response_fails_closed(test_app, mock_disease_service):
    """Malformed or unexpected model response must return 502 and fail closed."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.side_effect = ValidationResponseError("Malformed JSON.")

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("leaf.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 502
    mock_disease_service.predict.assert_not_called()


def test_provider_service_error_fails_closed(test_app, mock_disease_service):
    """Provider 503 error must return 503 and fail closed."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.side_effect = ValidationServiceUnavailableError("Gemini server 503.")

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    response = client.post(
        "/api/disease/predict",
        data={"crop": "Tomato"},
        files={"image": ("leaf.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 503
    mock_disease_service.predict.assert_not_called()



# ============================================================================
# 16: Supported Crop Rules (Executed only after valid leaf)
# ============================================================================

def test_unsupported_crop_with_valid_leaf_rejected(test_app, mock_disease_service):
    """If image is a valid leaf, but crop is not supported, crop check must reject."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.verify_and_decode_image.return_value = (Image.new("RGB", (100, 100)), "image/jpeg")
    mock_val_service.validate_leaf_image.return_value = LeafValidationResult(
        status=LeafValidationStatus.LEAF,
        reason="Clear plant leaf.",
        suggested_action=None,
    )

    test_app.dependency_overrides[get_disease_service] = lambda: mock_disease_service
    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="JPEG")

    # "Dragonfruit" is not supported
    response = client.post(
        "/api/disease/predict",
        data={"crop": "Dragonfruit"},
        files={"image": ("leaf.jpg", img_bytes, "image/jpeg")},
    )

    assert response.status_code == 400
    assert "not supported" in response.json()["detail"]
    mock_disease_service.predict.assert_not_called()


# ============================================================================
# 17: Dedicated /api/disease/validate Endpoint Test
# ============================================================================

def test_dedicated_validate_endpoint(test_app):
    """Verify standalone /api/disease/validate endpoint returns LeafValidationResult."""
    mock_val_service = MagicMock(spec=ImageValidationService)
    mock_val_service.validate_leaf_image.return_value = LeafValidationResult(
        status=LeafValidationStatus.LEAF,
        reason="A healthy grapevine leaf.",
        suggested_action=None,
    )

    test_app.dependency_overrides[get_image_validation_service] = lambda: mock_val_service

    client = TestClient(test_app)
    img_bytes = create_image_bytes(format="PNG")

    response = client.post(
        "/api/disease/validate",
        files={"image": ("grape.png", img_bytes, "image/png")},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "LEAF"
    assert data["reason"] == "A healthy grapevine leaf."


# ============================================================================
# 18: Real Service Unit Tests (Verifying verify_and_decode_image directly)
# ============================================================================

def test_real_verify_and_decode_image_valid_formats():
    """Test actual PIL decoding on valid JPEG, PNG, and WEBP formats."""
    for fmt, mime in [("JPEG", "image/jpeg"), ("PNG", "image/png"), ("WEBP", "image/webp")]:
        b = create_image_bytes(format=fmt)
        img, detected_mime = ImageValidationService.verify_and_decode_image(b)
        assert img is not None
        assert detected_mime == mime


def test_real_verify_and_decode_image_invalid_data():
    """Test actual PIL decoding failure on corrupted / invalid bytes."""
    with pytest.raises(InvalidImageFileError):
        ImageValidationService.verify_and_decode_image(b"not an image")

    with pytest.raises(InvalidImageFileError):
        ImageValidationService.verify_and_decode_image(b"")


def test_real_verify_and_decode_image_oversized():
    """Test actual file size enforcement."""
    with pytest.raises(InvalidImageFileError) as exc_info:
        ImageValidationService.verify_and_decode_image(b"x" * 100, max_size_bytes=50)
    assert "limit" in str(exc_info.value)


# ============================================================================
# 19: Optional Real Gemini API Integration Test
# ============================================================================

@pytest.mark.skipif(
    not os.getenv("GEMINI_API_KEY"),
    reason="GEMINI_API_KEY environment variable is not configured for live integration test"
)
def test_real_gemini_vision_api_live_integration():
    """
    Live integration test against Google's Gemini Vision API.
    Runs ONLY when valid GEMINI_API_KEY is supplied in the environment.
    """
    service = ImageValidationService(api_key=os.getenv("GEMINI_API_KEY"))
    img_bytes = create_image_bytes(format="JPEG", color=(34, 139, 34))

    result = service.validate_leaf_image(img_bytes)
    assert result.status in [
        LeafValidationStatus.LEAF,
        LeafValidationStatus.NON_LEAF,
        LeafValidationStatus.UNCERTAIN,
    ]
    assert len(result.reason) > 0

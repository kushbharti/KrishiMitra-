import io
import time
import logging
from typing import Optional, Tuple
from PIL import Image

from core.config import settings
from schemas.disease import LeafValidationResult, LeafValidationStatus

logger = logging.getLogger(__name__)

# ============================================================================
# Exception Hierarchy
# ============================================================================

class ImageValidationError(Exception):
    """Base exception for all image validation failures."""
    pass


class InvalidImageFileError(ImageValidationError):
    """Raised when file is empty, oversized, corrupt, or unsupported format."""
    pass


class ValidationServiceUnavailableError(ImageValidationError):
    """Raised when Gemini vision API is unavailable, unconfigured, or down."""
    pass


class ValidationAuthError(ImageValidationError):
    """Raised when Gemini API key is missing, invalid, or unauthorized."""
    pass


class ValidationRateLimitError(ImageValidationError):
    """Raised when Gemini API rate limit or quota is exhausted."""
    pass


class ValidationTimeoutError(ImageValidationError):
    """Raised when Gemini API request times out."""
    pass


class ValidationResponseError(ImageValidationError):
    """Raised when Gemini API returns malformed or unexpected data."""
    pass


# ============================================================================
# Validation Prompt Definition
# ============================================================================

LEAF_VALIDATION_PROMPT = """
You are an expert plant pathologist and computer vision validator for KrishiMitra, an AI farmer advisory platform.
Your task is to determine whether the uploaded image contains a recognizable plant leaf suitable for disease classification.

EVALUATION CRITERIA:
1. 'LEAF':
   - A recognizable plant leaf, multiple leaves, foliage, or a crop canopy is present.
   - CRITICAL REQUIREMENT: Leaves that are diseased, blighted, spotted, curled, pest-damaged, wilted, necrotic, or discolored (yellow, brown, black, purple) MUST be classified as LEAF.
   - Leaves photographed outdoors with natural backgrounds (soil, field, farmer's hand holding a leaf) are standard and MUST be classified as LEAF if a leaf is present.
   - Do NOT reject an image simply because the leaf is unhealthy or not green.
2. 'NON_LEAF':
   - The image does NOT contain a recognizable plant leaf suitable for plant pathology analysis.
   - Examples include: Human faces, people, animals, livestock, insects alone without a leaf, vehicles, tractors, buildings, roads, household items, soil/ground alone without leaves, tree bark/trunks alone without leaves, fruits alone, flowers alone, screenshots, line drawings, text/documents, or unrelated objects.
3. 'UNCERTAIN':
   - The image is too blurry, completely out of focus, severely underexposed (too dark), severely overexposed (heavy glare), or has resolution too low to distinguish leaf structures.

Respond with a strictly valid JSON object matching the requested schema:
- status: 'LEAF', 'NON_LEAF', or 'UNCERTAIN'
- reason: A concise explanation of what is detected in the image.
- suggested_action: Helpful farmer-friendly guidance if rejected or uncertain.
""".strip()


# ============================================================================
# Service Implementation
# ============================================================================

class ImageValidationService:
    """Pre-inference image validation service using the Gemini Vision API."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self._api_key = api_key or settings.GEMINI_API_KEY
        self._model_name = model_name or settings.GEMINI_MODEL
        self._max_size_bytes = settings.MAX_IMAGE_SIZE_BYTES
        self._client = None

    def _get_client(self):
        """Lazily initialize and return the Google Gen AI client."""
        if not self._api_key:
            raise ValidationAuthError(
                "Gemini API key is not configured on the backend server. "
                "Please configure GEMINI_API_KEY in the environment."
            )

        if self._client is None:
            try:
                from google import genai
                self._client = genai.Client(api_key=self._api_key)
            except Exception as e:
                logger.error(f"[ImageValidationService] Failed to initialize Gemini client: {e}")
                raise ValidationServiceUnavailableError(
                    f"Failed to initialize vision API client: {str(e)}"
                )
        return self._client

    @staticmethod
    def verify_and_decode_image(
        image_bytes: bytes,
        max_size_bytes: int = 5 * 1024 * 1024
    ) -> Tuple[Image.Image, str]:
        """
        Validate raw image bytes before making external API requests.
        
        Checks:
        1. Non-empty file content
        2. Maximum file size limit
        3. Structural image decodability using Pillow
        4. Valid image format (JPEG, PNG, WEBP only)
        
        Returns:
            Tuple[PIL.Image.Image, str]: The decoded PIL image and its MIME type.
            
        Raises:
            InvalidImageFileError: When file is empty, oversized, corrupt, or unsupported.
        """
        if not image_bytes or len(image_bytes) == 0:
            raise InvalidImageFileError("The uploaded image file is empty.")

        if len(image_bytes) > max_size_bytes:
            max_mb = max_size_bytes / (1024 * 1024)
            actual_mb = len(image_bytes) / (1024 * 1024)
            raise InvalidImageFileError(
                f"File size exceeds the {max_mb:.0f}MB limit ({actual_mb:.2f}MB uploaded). "
                "Please compress or resize your image."
            )

        try:
            stream = io.BytesIO(image_bytes)
            # 1. Structural integrity check
            with Image.open(stream) as probe_img:
                probe_img.verify()
                detected_format = probe_img.format
        except Exception:
            raise InvalidImageFileError(
                "Invalid or corrupted image file. Please upload a valid image (JPG, PNG, or WEBP)."
            )

        # 2. Check supported formats
        allowed_formats = {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}
        if not detected_format or detected_format.upper() not in allowed_formats:
            fmt_name = detected_format or "Unknown"
            raise InvalidImageFileError(
                f"Unsupported image format '{fmt_name}'. Only JPG, PNG, and WEBP files are permitted."
            )

        mime_type = allowed_formats[detected_format.upper()]

        # 3. Decode into memory as RGB (verify() invalidates probe_img stream)
        try:
            stream.seek(0)
            img = Image.open(stream)
            img = img.convert("RGB")
            return img, mime_type
        except Exception as e:
            raise InvalidImageFileError(f"Failed to decode image data: {str(e)}")

    def _prepare_image_for_gemini(self, pil_img: Image.Image, mime_type: str) -> bytes:
        """
        Resize image only for the Gemini validation request to minimize
        latency and token footprint, without touching the original image.
        """
        max_dim = 1024
        w, h = pil_img.size
        if max(w, h) > max_dim:
            scale = max_dim / max(w, h)
            new_size = (int(w * scale), int(h * scale))
            img_to_send = pil_img.resize(new_size, Image.Resampling.LANCZOS)
        else:
            img_to_send = pil_img

        out_stream = io.BytesIO()
        save_format = "PNG" if mime_type == "image/png" else "JPEG"
        img_to_send.save(out_stream, format=save_format, quality=85)
        return out_stream.getvalue()

    def validate_leaf_image(self, image_bytes: bytes) -> LeafValidationResult:
        """
        Validate whether the uploaded image contains a recognizable plant leaf.
        
        Workflow:
        1. Validates file integrity, format, and decodability locally.
        2. Sends optimized image to Gemini Vision API with structured JSON output schema.
        3. Parses and validates the response using Pydantic.
        4. Fails closed on any error (never bypasses validation).
        
        Returns:
            LeafValidationResult with status LEAF, NON_LEAF, or UNCERTAIN.
        """
        # Step 1: Pre-validate file before external API call
        pil_img, mime_type = self.verify_and_decode_image(
            image_bytes,
            max_size_bytes=self._max_size_bytes
        )

        # Step 2: Initialize client
        client = self._get_client()

        # Step 3: Prepare image payload for Gemini
        prepared_bytes = self._prepare_image_for_gemini(pil_img, mime_type)

        from google.genai import types

        image_part = types.Part.from_bytes(
            data=prepared_bytes,
            mime_type=mime_type,
        )

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=LeafValidationResult,
            temperature=0.0,
        )

        # Step 4: Execute Gemini Vision API call with bounded retry
        max_retries = 1
        last_error = None

        for attempt in range(max_retries + 1):
            try:
                response = client.models.generate_content(
                    model=self._model_name,
                    contents=[image_part, LEAF_VALIDATION_PROMPT],
                    config=config,
                )
                break
            except Exception as exc:
                last_error = exc
                err_str = str(exc).lower()

                # Detect authentication issues
                if any(x in err_str for x in ["api_key_invalid", "401", "unauthenticated", "invalid api key", "permission_denied", "403"]):
                    logger.error("[ImageValidationService] Gemini authentication failed.")
                    raise ValidationAuthError("Gemini Vision API authentication failed. Please verify GEMINI_API_KEY.")

                # Detect rate limit / quota exhaustion
                if any(x in err_str for x in ["429", "resource_exhausted", "quota", "rate limit"]):
                    logger.warning("[ImageValidationService] Gemini rate limit reached.")
                    raise ValidationRateLimitError("Gemini Vision API rate limit reached. Please try again later.")

                # Detect timeout
                if any(x in err_str for x in ["timeout", "deadline", "timed out"]):
                    if attempt < max_retries:
                        logger.warning(f"[ImageValidationService] Timeout on attempt {attempt+1}, retrying once...")
                        time.sleep(1.0)
                        continue
                    raise ValidationTimeoutError("Gemini Vision API request timed out. Please try again.")

                # Transient server errors (500, 503, connection reset)
                if attempt < max_retries and any(x in err_str for x in ["503", "500", "unavailable", "connection reset", "broken pipe"]):
                    logger.warning(f"[ImageValidationService] Transient error on attempt {attempt+1}, retrying...")
                    time.sleep(1.0)
                    continue

                logger.error(f"[ImageValidationService] Vision API call failed: {exc}")
                raise ValidationServiceUnavailableError(
                    f"Image validation service error: {str(exc)}"
                )

        # Step 5: Parse and strictly validate the model's output
        if not response or not response.text:
            raise ValidationResponseError("Gemini Vision API returned an empty response.")

        try:
            validation_result = LeafValidationResult.model_validate_json(response.text)
        except Exception as parse_err:
            logger.error(f"[ImageValidationService] Failed to parse model response: {response.text} ({parse_err})")
            raise ValidationResponseError(
                f"Malformed validation response from vision model: {str(parse_err)}"
            )

        # Ensure the status is recognized
        if validation_result.status not in {
            LeafValidationStatus.LEAF,
            LeafValidationStatus.NON_LEAF,
            LeafValidationStatus.UNCERTAIN,
        }:
            raise ValidationResponseError(
                f"Unexpected status '{validation_result.status}' returned by validation model."
            )

        logger.info(
            f"[ImageValidationService] Result: status={validation_result.status}, "
            f"reason='{validation_result.reason}'"
        )
        return validation_result


# ============================================================================
# Dependency Provider
# ============================================================================

_validation_service: Optional[ImageValidationService] = None

def get_image_validation_service() -> ImageValidationService:
    """Dependency provider returning a singleton ImageValidationService instance."""
    global _validation_service
    if _validation_service is None:
        _validation_service = ImageValidationService()
    return _validation_service

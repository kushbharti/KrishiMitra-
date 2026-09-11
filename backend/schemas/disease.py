from typing import List, Optional
from pydantic import BaseModel, Field

class SupportedCropsResponse(BaseModel):
    success: bool
    crops: List[str]


class TopPrediction(BaseModel):
    crop: str = Field(..., description="The botanical crop associated with this prediction")
    disease: str = Field(..., description="Name of the disease or 'Healthy'")
    confidence: float = Field(..., description="Confidence score expressed as a percentage (0-100)")
    healthy: bool = Field(..., description="True if the prediction represents a healthy crop")
    symptoms: List[str] = []
    causes: str = "N/A"
    treatment: List[str] = []
    prevention: List[str] = []
    fungicide: Optional[str] = None
    severity: str = "Low"
    recovery_tips: Optional[str] = None


class DiseaseDetails(BaseModel):
    disease_name: str
    crop_name: str
    confidence: float
    healthy: bool
    symptoms: List[str]
    causes: str
    treatment: List[str]
    prevention: List[str]
    fungicide: Optional[str] = None
    severity: str
    recovery_tips: Optional[str] = None


class DiseasePredictionResponse(BaseModel):
    success: bool
    selected_crop: str
    detected_crop: str
    crop_match: bool
    confidence: float
    predictions: List[TopPrediction]
    details: DiseaseDetails
    low_confidence: bool
    message: str
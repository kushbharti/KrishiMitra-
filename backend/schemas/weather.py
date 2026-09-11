from typing import List, Literal, Optional, Dict, Any
from pydantic import BaseModel, Field

RainfallLevel = Literal["none", "light", "moderate", "heavy"]
RiskSeverity = Literal["Critical", "High", "Medium", "Low", "None"]
DayOption = Literal["yesterday", "today", "tomorrow"]

class WeatherInput(BaseModel):
    temperature: float = Field(..., description="Ambient temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    rainfall: RainfallLevel = Field(..., description="Categorical rainfall intensity")

class Alert(BaseModel):
    id: str = Field(..., description="Unique identifier for the agricultural alert")
    risk_name: str = Field(..., description="Title of the agricultural vulnerability")
    severity: RiskSeverity = Field(..., description="Risk severity tier")
    description: str = Field(..., description="Detailed explanation of the biological/environmental stress")
    affected_crops: List[str] = Field(..., description="List of crops sensitive to this condition")
    recommended_action: str = Field(..., description="Agronomist recommended intervention")

class WeatherResult(BaseModel):
    overall_risk: RiskSeverity
    risk_count: int
    message: str
    alerts: List[Alert]

class LiveWeatherRequest(BaseModel):
    location: str = Field(..., example="Saravali, Maharashtra", description="City, village, or district name")
    day: DayOption = Field(default="today", description="Timeline selection")
    overrides: Optional[Dict[str, Any]] = Field(default=None, description="Manual farmer telemetry overrides")

class LiveWeatherResponse(BaseModel):
    result: WeatherResult
    liveTelemetry: WeatherInput
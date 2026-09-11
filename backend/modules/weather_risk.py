from fastapi import APIRouter
from pydantic import BaseModel

from utils.data_loader import load_json

router = APIRouter()

SEVERITY_ORDER = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}


class WeatherInput(BaseModel):
    temperature: float   # Celsius
    humidity: float      # 0–100 percent
    rainfall: str        # none | light | moderate | heavy


class WeatherAlert(BaseModel):
    id: str
    risk_name: str
    severity: str
    affected_crops: list[str]
    description: str
    recommended_action: str


class WeatherResult(BaseModel):
    alerts: list[WeatherAlert]
    risk_count: int
    overall_risk: str
    message: str


def matches_condition(rule: dict, temperature: float, humidity: float, rainfall: str) -> bool:
    """Check if a weather risk rule matches the given conditions."""
    cond = rule.get("condition", {})

    temp_min = cond.get("temperature_min", -999)
    temp_max = cond.get("temperature_max", 999)
    hum_min = cond.get("humidity_min", 0)
    hum_max = cond.get("humidity_max", 100)
    rule_rainfall = cond.get("rainfall", None)

    if not (temp_min <= temperature <= temp_max):
        return False
    if not (hum_min <= humidity <= hum_max):
        return False
    if rule_rainfall and rule_rainfall.lower() != rainfall.lower():
        return False

    return True


@router.post("/analyze", response_model=WeatherResult)
async def analyze_weather(request: WeatherInput) -> WeatherResult:
    """Analyze weather conditions and return matching risk alerts."""
    valid_rainfall = ["none", "light", "moderate", "heavy"]
    if request.rainfall.lower() not in valid_rainfall:
        request.rainfall = "none"

    risk_rules = load_json("weather_risks.json")
    alerts: list[WeatherAlert] = []

    for rule in risk_rules:
        if matches_condition(rule, request.temperature, request.humidity, request.rainfall):
            alerts.append(WeatherAlert(
                id=rule["id"],
                risk_name=rule["risk_name"],
                severity=rule["severity"],
                affected_crops=rule["affected_crops"],
                description=rule["description"],
                recommended_action=rule["recommended_action"]
            ))

    # Sort by severity (Critical first)
    alerts.sort(key=lambda a: SEVERITY_ORDER.get(a.severity, 99))

    # Determine overall risk level
    if any(a.severity == "Critical" for a in alerts):
        overall_risk = "Critical"
    elif any(a.severity == "High" for a in alerts):
        overall_risk = "High"
    elif any(a.severity == "Medium" for a in alerts):
        overall_risk = "Medium"
    elif alerts:
        overall_risk = "Low"
    else:
        overall_risk = "None"

    # Build message
    if not alerts:
        message = "Conditions look favorable. No significant weather-related risks detected. Continue regular crop monitoring."
    elif overall_risk == "Critical":
        message = f"⚠️ CRITICAL ALERT: {len(alerts)} risk(s) detected. Immediate action required to protect your crops."
    elif overall_risk == "High":
        message = f"🔴 High risk conditions detected. {len(alerts)} alert(s) require your attention within 24 hours."
    else:
        message = f"🟡 {len(alerts)} moderate risk(s) detected. Review recommendations and take preventive action."

    return WeatherResult(
        alerts=alerts,
        risk_count=len(alerts),
        overall_risk=overall_risk,
        message=message
    )

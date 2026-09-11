import uuid
from typing import List
from schemas.weather import WeatherInput, WeatherResult, Alert, RiskSeverity

class RiskEngine:
    SEVERITY_HIERARCHY = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1, "None": 0}

    @classmethod
    def evaluate(cls, telemetry: WeatherInput) -> WeatherResult:
        alerts: List[Alert] = []

        temp = telemetry.temperature
        humidity = telemetry.humidity
        rain = telemetry.rainfall

        # Rule 1: Waterlogging and Root Asphyxiation Risk
        if rain == "heavy" and humidity >= 75:
            alerts.append(Alert(
                id=f"risk-{uuid.uuid4().hex[:8]}",
                risk_name="Waterlogging and Root Asphyxiation Risk",
                severity="High",
                description="Heavy rainfall causes waterlogging in clay-heavy soils, depriving crop roots of oxygen. Plants show wilting within 24–48 hours despite saturated soil.",
                affected_crops=["cotton", "soybean", "groundnut", "chickpea", "mustard"],
                recommended_action="Open drainage channels urgently — create bunds to divert water. Do not fertilize waterlogged field. Spray nutrient solution on foliage. Assess re-sowing if 50%+ stand is damaged."
            ))

        # Rule 2: Storm Lodging Risk for Tall Crops
        if rain in ["moderate", "heavy"] and temp >= 26:
            alerts.append(Alert(
                id=f"risk-{uuid.uuid4().hex[:8]}",
                risk_name="Storm Lodging Risk for Tall Crops",
                severity="Medium",
                description="Heavy rainfall combined with strong winds can cause lodging (stem bending/breaking) in tall cereal crops at grain-filling stage, making harvest difficult and reducing quality.",
                affected_crops=["wheat", "maize", "sugarcane", "rice", "jowar"],
                recommended_action="Apply silicon-based fertilizer to strengthen cell walls before storm season. Consider windbreak plantings on field perimeter. Harvest mature crop promptly. Brush lodged plants upright if mild lodging occurs."
            ))

        # Rule 3: Late Blight Fungal Epidemic
        if 15.0 <= temp <= 25.0 and humidity >= 80 and rain != "none":
            alerts.append(Alert(
                id=f"risk-{uuid.uuid4().hex[:8]}",
                risk_name="Late Blight Fungal Infection Risk",
                severity="Critical",
                description="Saturated atmospheric moisture combined with cool-to-moderate temperatures creates an ideal breeding window for Phytophthora infestans (Late Blight). Spores germinate rapidly.",
                affected_crops=["tomato", "potato", "chili", "bell pepper"],
                recommended_action="Apply preventive copper-based fungicides or mancozeb immediately. Avoid overhead sprinkler irrigation; switch to drip lines to keep canopy foliage dry."
            ))

        # Rule 4: Powdery Mildew Outbreak
        if 22.0 <= temp <= 30.0 and 60.0 <= humidity <= 78.0 and rain == "none":
            alerts.append(Alert(
                id=f"risk-{uuid.uuid4().hex[:8]}",
                risk_name="Powdery Mildew Epidemic Risk",
                severity="Medium",
                description="Warm, humid airflow without direct washing rainfall encourages powdery mildew colonization on leaf surfaces, impeding photosynthesis.",
                affected_crops=["grapes", "cucurbits", "peas", "mango", "gourd"],
                recommended_action="Spray wettable sulfur or potassium bicarbonate solutions. Prune dense foliage to increase sunlight penetration and air circulation across lower branches."
            ))

        # Rule 5: Extreme Heat & Pollen Sterility
        if temp >= 38.0:
            alerts.append(Alert(
                id=f"risk-{uuid.uuid4().hex[:8]}",
                risk_name="Extreme Heat & Pollen Sterility Stress",
                severity="High",
                description="Ambient temperatures exceeding 38°C during flowering cause pollen desiccation and flower abortion, drastically reducing kernel/fruit set percentage.",
                affected_crops=["maize", "wheat", "rice", "tomato", "cotton"],
                recommended_action="Schedule light irrigation during peak afternoon hours to lower micro-climate soil temperatures. Apply potassium silicate to enhance plant thermal tolerance."
            ))

        # Calculate Overall Risk Score
        overall_risk: RiskSeverity = "None"
        max_score = 0
        for alert in alerts:
            score = cls.SEVERITY_HIERARCHY.get(alert.severity, 0)
            if score > max_score:
                max_score = score
                overall_risk = alert.severity

        message = (
            f"Evaluated {len(alerts)} active agricultural threat models for current environmental conditions."
            if len(alerts) > 0
            else "Environmental parameters remain optimal for standard agricultural operations."
        )

        return WeatherResult(
            overall_risk=overall_risk,
            risk_count=len(alerts),
            message=message,
            alerts=alerts
        )
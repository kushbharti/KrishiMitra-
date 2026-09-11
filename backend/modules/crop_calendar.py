from fastapi import APIRouter
from pydantic import BaseModel

from utils.data_loader import load_json

router = APIRouter()

ACTIVITY_MILESTONES = [
    {"week": 1, "activity": "Land preparation and sowing"},
    {"week": 4, "activity": "First irrigation and weed management"},
    {"week": 6, "activity": "Fertilizer application (Nitrogen — Urea)"},
    {"week": 8, "activity": "Second irrigation and thinning if required"},
    {"week": 10, "activity": "Pest and disease field monitoring"},
    {"week": 12, "activity": "Potassium and phosphorus top dressing"},
    {"week": 14, "activity": "Pre-harvest preparation and stop irrigation"},
    {"week": 16, "activity": "Harvest and threshing"}
]

CATEGORY_MILESTONES = {
    "vegetable": [
        {"week": 1, "activity": "Nursery preparation and sowing"},
        {"week": 3, "activity": "Transplanting seedlings to main field"},
        {"week": 5, "activity": "First fertilizer application"},
        {"week": 7, "activity": "Staking and trellising (if required)"},
        {"week": 9, "activity": "Pest scouting and spray schedule"},
        {"week": 11, "activity": "Fruit or vegetable development monitoring"},
        {"week": 13, "activity": "Harvesting begins (continuous picking)"},
        {"week": 15, "activity": "Final harvest and field clearing"}
    ],
    "fruit": [
        {"week": 1, "activity": "Pit digging and soil preparation"},
        {"week": 4, "activity": "Planting and initial irrigation"},
        {"week": 8, "activity": "Root zone fertilizer application"},
        {"week": 12, "activity": "Pruning and training of plant structure"},
        {"week": 20, "activity": "Flowering and fruit set monitoring"},
        {"week": 30, "activity": "Fruit development and thinning"},
        {"week": 40, "activity": "Pre-harvest management"},
        {"week": 52, "activity": "Harvest and post-harvest handling"}
    ],
    "cash_crop": [
        {"week": 1, "activity": "Field preparation and soil testing"},
        {"week": 2, "activity": "Seed treatment and sowing"},
        {"week": 4, "activity": "Germination monitoring and gap filling"},
        {"week": 8, "activity": "First top dressing and weed control"},
        {"week": 12, "activity": "Integrated pest management spray"},
        {"week": 16, "activity": "Second top dressing (potash)"},
        {"week": 20, "activity": "Pre-harvest assessment"},
        {"week": 24, "activity": "Harvest and initial processing"}
    ]
}


class ActivityMilestone(BaseModel):
    week: int
    activity: str


class CalendarCrop(BaseModel):
    id: str
    name: str
    category: str
    season: str
    sow_month: int
    harvest_month: int
    duration_days: int
    water_need: str
    risk_level: str
    activity_milestones: list[ActivityMilestone]


@router.get("/crops", response_model=list[CalendarCrop])
async def get_calendar_crops(
    season: str = "All",
    category: str = "All"
) -> list[CalendarCrop]:
    """Return all crops with activity milestones for the calendar view."""
    crops = load_json("crops.json")

    # Apply season filter
    if season.lower() != "all":
        crops = [c for c in crops if c["season"].lower() == season.lower()]

    # Apply category filter
    if category.lower() != "all":
        crops = [c for c in crops if c["category"].lower() == category.lower()]

    result = []
    for crop in crops:
        cat = crop.get("category", "cereal")
        milestones = CATEGORY_MILESTONES.get(cat, ACTIVITY_MILESTONES)
        result.append(
            CalendarCrop(
                id=crop["id"],
                name=crop["name"],
                category=crop["category"],
                season=crop["season"],
                sow_month=crop["sow_month"],
                harvest_month=crop["harvest_month"],
                duration_days=crop["duration_days"],
                water_need=crop["water_need"],
                risk_level=crop["risk_level"],
                activity_milestones=[ActivityMilestone(**m) for m in milestones]
            )
        )

    return result

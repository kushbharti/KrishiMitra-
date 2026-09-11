from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from utils.data_loader import load_json

router = APIRouter()


class IncomeRequest(BaseModel):
    land_size_acres: float = Field(..., gt=0, le=10000, description="Farm land size in acres")
    season: str = Field(..., description="Season filter: Kharif | Rabi | Zaid | Annual | All")
    selected_crop: Optional[str] = Field(None, description="Optional specific crop to include")


class CropRecommendation(BaseModel):
    id: str
    name: str
    category: str
    season: str
    revenue_per_acre: int
    cost_per_acre: int
    profit_per_acre: int
    total_revenue: float
    total_cost: float
    total_profit: float
    water_need: str
    risk_level: str
    soil_types: list[str]
    recommended: bool
    rank: int


class IncomeResult(BaseModel):
    recommendations: list[CropRecommendation]
    best_crop: str
    best_crop_profit: float
    season_filter: str
    land_size_acres: float


def format_crop(crop: dict, land_size: float, rank: int, recommended: bool) -> CropRecommendation:
    total_revenue = crop["revenue_per_acre"] * land_size
    total_cost = crop["cost_per_acre"] * land_size
    total_profit = crop["profit_per_acre"] * land_size
    return CropRecommendation(
        id=crop["id"],
        name=crop["name"],
        category=crop["category"],
        season=crop["season"],
        revenue_per_acre=crop["revenue_per_acre"],
        cost_per_acre=crop["cost_per_acre"],
        profit_per_acre=crop["profit_per_acre"],
        total_revenue=round(total_revenue, 2),
        total_cost=round(total_cost, 2),
        total_profit=round(total_profit, 2),
        water_need=crop["water_need"],
        risk_level=crop["risk_level"],
        soil_types=crop.get("soil_types", []),
        recommended=recommended,
        rank=rank
    )


@router.post("/calculate", response_model=IncomeResult)
async def calculate_income(request: IncomeRequest) -> IncomeResult:
    """Calculate crop profitability and return top 5 recommendations."""
    all_crops = load_json("crops.json")

    # Filter by season
    if request.season and request.season.lower() != "all":
        filtered = [
            c for c in all_crops
            if c["season"].lower() == request.season.lower()
        ]
        if not filtered:
            filtered = all_crops  # Fall back if no match
    else:
        filtered = all_crops

    # Sort by profit descending
    filtered.sort(key=lambda c: c["profit_per_acre"], reverse=True)

    # Build top 5
    result_crops: list[CropRecommendation] = []
    selected_handled = False

    # If selected_crop is provided, ensure it's first
    if request.selected_crop:
        selected = next(
            (c for c in filtered if c["id"].lower() == request.selected_crop.lower()
             or c["name"].lower() == request.selected_crop.lower()),
            None
        )
        if selected:
            result_crops.append(format_crop(selected, request.land_size_acres, 1, True))
            filtered = [c for c in filtered if c["id"] != selected["id"]]
            selected_handled = True

    # Fill remaining slots up to 5 crops
    best = None
    for i, crop in enumerate(filtered):
        if len(result_crops) >= 5:
            break
        rank = len(result_crops) + 1
        is_recommended = not selected_handled and rank == 1
        rec = format_crop(crop, request.land_size_acres, rank, is_recommended)
        if best is None:
            best = rec
        result_crops.append(rec)

    # Mark the highest-profit as recommended if no selected crop
    if result_crops and not selected_handled:
        result_crops[0] = result_crops[0].model_copy(update={"recommended": True})
        best = result_crops[0]

    best_crop_name = result_crops[0].name if result_crops else "N/A"
    best_crop_profit = result_crops[0].total_profit if result_crops else 0.0

    return IncomeResult(
        recommendations=result_crops,
        best_crop=best_crop_name,
        best_crop_profit=round(best_crop_profit, 2),
        season_filter=request.season,
        land_size_acres=request.land_size_acres
    )

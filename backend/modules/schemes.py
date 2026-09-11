import math
from fastapi import APIRouter, Query
from pydantic import BaseModel

from utils.data_loader import load_json

router = APIRouter()


class GovernmentScheme(BaseModel):
    id: str
    name: str
    full_name: str
    ministry: str
    category: str
    benefit_summary: str
    benefits: list[str]
    eligibility: list[str]
    official_website: str
    last_updated: str


class SchemeResult(BaseModel):
    schemes: list[GovernmentScheme]
    categories: list[str]
    total: int
    page: int
    total_pages: int
    limit: int


@router.get("", response_model=SchemeResult)
async def get_schemes(
    search: str = Query(default=""),
    category: str = Query(default="All"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=8, ge=1, le=50),
) -> SchemeResult:
    """Retrieve government schemes with search, category filter, and pagination."""
    all_schemes = load_json("schemes.json")

    categories = sorted({
        s.get("category", "").strip()
        for s in all_schemes
        if s.get("category", "").strip()
    })
    categories = ["All", *categories]

    filtered_schemes = all_schemes

    if category.lower() != "all":
        filtered_schemes = [
            s for s in filtered_schemes
            if s.get("category", "").lower() == category.lower()
        ]

    if search.strip():
        search_lower = search.strip().lower()
        filtered = []

        for s in filtered_schemes:
            searchable = " ".join([
                s.get("name", ""),
                s.get("full_name", ""),
                s.get("benefit_summary", ""),
                " ".join(s.get("eligibility", [])),
                " ".join(s.get("benefits", [])),
            ]).lower()

            if search_lower in searchable:
                filtered.append(s)

        filtered_schemes = filtered

    total = len(filtered_schemes)
    total_pages = max(1, math.ceil(total / limit))
    page = min(page, total_pages)

    start = (page - 1) * limit
    end = start + limit
    paginated = filtered_schemes[start:end]

    return SchemeResult(
        schemes=[GovernmentScheme(**s) for s in paginated],
        categories=categories,
        total=total,
        page=page,
        total_pages=total_pages,
        limit=limit,
    )
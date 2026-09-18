"""
Dashboard API — Farmer-specific statistics and recent scan history.

Endpoints:
  GET /api/dashboard/stats          — Returns real-time stats for the authenticated farmer
  GET /api/dashboard/recent-scans   — Returns the farmer's last N disease scans
"""

import logging
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from db.mongodb import get_database
from middleware.auth import get_current_user
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

logger = logging.getLogger(__name__)
router = APIRouter()


class DashboardStats(BaseModel):
    scan_count: int
    disease_count: int
    ai_consultation_count: int
    eligible_schemes_count: int
    last_updated: str


class RecentScan(BaseModel):
    id: str
    crop: str
    disease: str
    confidence: float
    severity: str
    timestamp: str


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Returns real farmer-specific statistics for the dashboard KPI cards."""
    user_id = str(current_user["_id"])

    # Count total scans by this farmer
    scan_count = await db.scan_logs.count_documents({"user_id": user_id})

    # Count scans where a disease was detected (non-healthy)
    disease_count = await db.scan_logs.count_documents({
        "user_id": user_id,
        "disease": {"$nin": ["Healthy", "healthy", ""]}
    })

    # Count AI assistant consultations by this farmer
    ai_count = await db.ai_logs.count_documents({"user_id": user_id})

    return DashboardStats(
        scan_count=scan_count,
        disease_count=disease_count,
        ai_consultation_count=ai_count,
        eligible_schemes_count=10,  # Static count from schemes.json (real schemes data)
        last_updated=datetime.utcnow().isoformat(),
    )


@router.get("/recent-scans", response_model=list[RecentScan])
async def get_recent_scans(
    limit: int = Query(default=4, ge=1, le=20),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Returns the farmer's most recent disease scan results."""
    user_id = str(current_user["_id"])

    cursor = db.scan_logs.find(
        {"user_id": user_id},
        sort=[("timestamp", -1)],
    ).limit(limit)

    scans = []
    async for doc in cursor:
        scans.append(RecentScan(
            id=str(doc["_id"]),
            crop=doc.get("crop", "Unknown"),
            disease=doc.get("disease", "Unknown"),
            confidence=doc.get("confidence", 0.0),
            severity=doc.get("severity", "Unknown"),
            timestamp=doc.get("timestamp", datetime.utcnow()).isoformat()
            if isinstance(doc.get("timestamp"), datetime)
            else str(doc.get("timestamp", "")),
        ))

    return scans

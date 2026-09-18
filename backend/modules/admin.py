from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List, Dict, Any, Optional
from db.mongodb import get_database
from middleware.auth import get_current_user
from services.admin_service import AdminService
import time

router = APIRouter()

# Track startup time for uptime calculation
_START_TIME = time.time()

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/overview-metrics", response_model=Dict[str, Any])
async def get_admin_overview_metrics(db=Depends(get_database), admin=Depends(get_admin_user)):
    service = AdminService(db)
    return await service.get_overview_metrics()

@router.get("/farmers", response_model=List[Dict[str, Any]])
async def get_farmers(language: Optional[str] = "all", db=Depends(get_database), admin=Depends(get_admin_user)):
    service = AdminService(db)
    return await service.get_farmers_directory(language_filter=language)

@router.get("/disease-telemetry", response_model=Dict[str, Any])
async def get_disease_telemetry(db=Depends(get_database), admin=Depends(get_admin_user)):
    service = AdminService(db)
    return await service.get_disease_telemetry()

@router.get("/ai-assistant-telemetry", response_model=Dict[str, Any])
async def get_ai_assistant_telemetry(db=Depends(get_database), admin=Depends(get_admin_user)):
    service = AdminService(db)
    return await service.get_ai_assistant_telemetry()

@router.get("/system-status", response_model=Dict[str, Any])
async def get_system_status(db=Depends(get_database), admin=Depends(get_admin_user)):
    """Returns system health metrics: DB status, uptime, collection counts."""
    uptime_seconds = int(time.time() - _START_TIME)
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    try:
        total_users = await db.users.count_documents({})
        total_farmers = await db.users.count_documents({"role": "FARMER"})
        total_admins = await db.users.count_documents({"role": "ADMIN"})
        db_status = "connected"
    except Exception:
        total_users = total_farmers = total_admins = 0
        db_status = "error"
    
    return {
        "db_status": db_status,
        "uptime": f"{hours}h {minutes}m {seconds}s",
        "uptime_seconds": uptime_seconds,
        "total_users": total_users,
        "total_farmers": total_farmers,
        "total_admins": total_admins,
        "provider": "MongoDB Atlas",
        "region": "ap-south-1 (Mumbai)",
    }

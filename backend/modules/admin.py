from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List, Dict, Any, Optional
from db.mongodb import get_database
from middleware.auth import get_current_user
from services.admin_service import AdminService

router = APIRouter()

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

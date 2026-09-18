import uvicorn
import os
import firebase_admin
from firebase_admin import credentials
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from db.mongodb import connect_to_mongo, close_mongo_connection

# Routers
from modules.auth import router as auth_router
from modules.disease_detection import router as disease_router
from modules.income_advisor import router as income_router
from modules.crop_calendar import router as calendar_router
from modules.ai_assistant import router as assistant_router
from modules.schemes import router as schemes_router
from modules.profile import router as profile_router
from modules.admin import router as admin_router
from modules.dashboard import router as dashboard_router
from api.weather_api import router as weather_router
from services.disease_service import get_disease_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Connect to MongoDB Atlas
    print("[KrishiMitra] Connecting to Database...")
    try:
        await connect_to_mongo()
    except Exception as db_exc:
        # connect_to_mongo already printed a structured error message.
        # Re-raise so uvicorn/FastAPI aborts startup with a clear exit code.
        print(f"[KrishiMitra] CRITICAL: Cannot start without a database connection. Aborting.")
        raise

    # 2. Initialize Firebase Admin SDK
    if not firebase_admin._apps:
        cred_path = os.path.join(os.path.dirname(__file__), "firebase-service-account.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("[Firebase] Admin SDK Initialized Successfully.")
        else:
            print("[WARNING] firebase-service-account.json not found! Authentication will fail.")

    # 3. Initialize AI model
    print("[KrishiMitra] Loading AI Models into memory...")
    try:
        get_disease_service()
        print("[KrishiMitra] Disease Detection Model loaded successfully.")
    except Exception as e:
        print(f"[KrishiMitra CRITICAL WARNING] Failed to pre-load Disease Model: {e}")
    
    yield
    
    # 4. Shutdown
    print("[KrishiMitra] Shutting down application... Closing DB connections.")
    await close_mongo_connection()


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Smart Agriculture Assistant — Backend API",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register all module routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])
app.include_router(profile_router, prefix="/api/profile", tags=["Farmer Profile"])
app.include_router(disease_router, prefix="/api/disease", tags=["Disease Detection"])
app.include_router(income_router, prefix="/api/income", tags=["Income Advisor"])
app.include_router(calendar_router, prefix="/api/calendar", tags=["Crop Calendar"])
app.include_router(assistant_router, prefix="/api/assistant", tags=["AI Assistant"])
app.include_router(weather_router, prefix="/api/weather", tags=["Weather Risk"])
app.include_router(schemes_router, prefix="/api/schemes", tags=["Government Schemes"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Farmer Dashboard"])

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "KrishiMitra API running", "version": settings.VERSION}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
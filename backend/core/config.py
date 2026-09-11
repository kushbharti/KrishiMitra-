from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "KrishiMitra AI Backend"
    VERSION: str = "2.4.0"
    DEBUG: bool = False
    OPENWEATHER_API_KEY: str = ""
    GROK_API_KEY: str = ""
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # ==========================================
    # ADDED FOR AUTHENTICATION
    # ==========================================
    MONGODB_URL: str = "mongodb://localhost:27017" # Replace with your Atlas URI in .env
    MONGODB_DB_NAME: str = "krishimitra"
    
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key" # Override in .env
    JWT_REFRESH_SECRET_KEY: str = "your-super-secret-refresh-key" # Override in .env
    ALGORITHM: str = "HS256"
    JWT_ALGORITHM: str = "HS256"   # Alias read by JWTService — keep in sync with ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    GOOGLE_CLIENT_ID: str = ""
    # ==========================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore" # Ignores extra variables in .env to prevent crashes
    )

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = None
    role: str = "FARMER"
    provider: str = "GOOGLE"
    isVerified: bool = True
    language: str = "en"
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    farmSize: Optional[float] = None
    preferredCrops: list[str] = []

class UserCreate(UserBase):
    googleId: str

class UserInDB(UserCreate):
    id: str = Field(alias="_id")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    lastLogin: datetime = Field(default_factory=datetime.utcnow)
    refreshTokenHash: Optional[str] = None

    class Config:
        populate_by_name = True

class UserResponse(UserBase):
    id: str
    createdAt: datetime
    lastLogin: datetime
"""
Pydantic schemas for the Farmer Profile feature.

- ProfileUpdatePayload  : Accepted PATCH body. Email is intentionally absent.
- FarmerProfileResponse : Shape of a user document returned to the frontend.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator
import re


class ProfileUpdatePayload(BaseModel):
    """
    Fields the farmer is allowed to update through PATCH /api/profile/me.

    Email, role, firebaseUid, createdAt are NOT present here — they are
    controlled by the authentication system and must never be client-writable.
    Any extra fields sent by the client are silently rejected by Pydantic's
    model_config (extra='ignore' is set in core config, but we add it here
    explicitly for safety).
    """

    full_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100,
        description="Full legal name of the farmer",
    )
    phone: Optional[str] = Field(
        default=None,
        description="Mobile number (10 digits, Indian format)",
    )
    state: Optional[str] = Field(
        default=None,
        max_length=60,
        description="Indian state name",
    )
    district: Optional[str] = Field(
        default=None,
        max_length=80,
        description="District within the state",
    )
    village: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Village or town name",
    )
    primary_crop: Optional[str] = Field(
        default=None,
        max_length=80,
        description="Main crop grown on the farm",
    )
    land_size_acres: Optional[float] = Field(
        default=None,
        gt=0,
        le=100_000,
        description="Total agricultural land in acres",
    )
    farming_experience_years: Optional[int] = Field(
        default=None,
        ge=0,
        le=80,
        description="Years of farming experience",
    )

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        digits = re.sub(r"\D", "", v)
        if len(digits) != 10:
            raise ValueError("Phone number must be exactly 10 digits.")
        return digits  # store normalised digits

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        stripped = v.strip()
        if not stripped:
            raise ValueError("Full name cannot be blank.")
        return stripped

    model_config = {"extra": "ignore"}  # silently drop unknown fields


class FarmerProfileResponse(BaseModel):
    """
    Safe user document shape returned to the frontend.
    Omits firebaseUid and any internal fields.
    """

    id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    primary_crop: Optional[str] = None
    land_size_acres: Optional[float] = None
    farming_experience_years: Optional[int] = None


class ProfileUpdateResponse(BaseModel):
    message: str
    user: FarmerProfileResponse

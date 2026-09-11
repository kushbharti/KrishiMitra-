"""
Profile routes: GET and PATCH /api/profile/me

Authorization is enforced via get_current_user dependency which reads the
HttpOnly JWT cookie, verifies it, and looks up the user in MongoDB.
The authenticated user_id comes exclusively from the verified token — it is
never accepted from the request body.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime

from db.mongodb import get_database
from middleware.auth import get_current_user
from schemas.profile import (
    ProfileUpdatePayload,
    FarmerProfileResponse,
    ProfileUpdateResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter()


def _document_to_response(doc: dict) -> FarmerProfileResponse:
    """Convert a raw MongoDB user document to the safe API response shape."""
    return FarmerProfileResponse(
        id=str(doc["_id"]),
        email=doc.get("email") or "",
        name=doc.get("full_name") or doc.get("name") or "",
        picture=doc.get("picture"),
        role=doc.get("role", "FARMER"),
        phone=doc.get("phone"),
        state=doc.get("state"),
        district=doc.get("district"),
        village=doc.get("village"),
        primary_crop=doc.get("primary_crop"),
        land_size_acres=doc.get("land_size_acres"),
        farming_experience_years=doc.get("farming_experience_years"),
    )


@router.get(
    "/me",
    response_model=FarmerProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get authenticated farmer's profile",
)
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> FarmerProfileResponse:
    """
    Returns the full farmer profile for the currently authenticated user.
    The user_id is derived from the verified JWT cookie — never from the URL.
    """
    user_id = current_user["_id"]
    doc = await db.users.find_one({"_id": ObjectId(user_id)})
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found.",
        )
    return _document_to_response(doc)


@router.patch(
    "/me",
    response_model=ProfileUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update authenticated farmer's profile",
)
async def update_profile(
    payload: ProfileUpdatePayload,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> ProfileUpdateResponse:
    """
    Partially updates the farmer's profile using PATCH semantics.

    - The user_id is sourced from the verified JWT cookie only.
    - Email, role, firebaseUid are never updatable via this endpoint.
    - Only fields explicitly provided in the payload are written;
      absent fields are left unchanged (true partial update via $set).
    """
    user_id = current_user["_id"]

    # Build a dict of only the non-None fields the client supplied.
    # model_dump(exclude_none=True) gives us PATCH semantics: fields the
    # client omitted are simply not included in the $set operation.
    updates = payload.model_dump(exclude_none=True)

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update.",
        )

    updates["updatedAt"] = datetime.utcnow()

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": updates},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found.",
        )

    # Fetch the updated document to return confirmed, persisted data.
    updated_doc = await db.users.find_one({"_id": ObjectId(user_id)})
    if updated_doc is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile updated but could not be retrieved.",
        )

    logger.info("Profile updated for authenticated user %s", user_id)
    return ProfileUpdateResponse(
        message="Profile updated successfully.",
        user=_document_to_response(updated_doc),
    )

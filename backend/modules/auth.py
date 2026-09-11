from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from pydantic import BaseModel
from typing import Optional
from firebase_admin import auth as firebase_auth
from db.mongodb import get_database
from services.jwt_service import JWTService
from middleware.auth import get_current_user
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter()

class FirebaseTokenRequest(BaseModel):
    token: Optional[str] = None
    role: Optional[str] = "FARMER"  # "FARMER" or "ADMIN" — used only on first registration

@router.post("/sync", status_code=status.HTTP_200_OK)
async def sync_user_route(request: Request, response: Response, body: Optional[FirebaseTokenRequest] = None, db=Depends(get_database)):
    try:
        token = body.token if body and body.token else None
        requested_role = (body.role or "FARMER").upper() if body else "FARMER"
        # Security: only allow valid roles
        if requested_role not in ("FARMER", "ADMIN"):
            requested_role = "FARMER"

        if not token:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            raise HTTPException(status_code=400, detail="Authentication token is required.")

        print("[Backend Auth] Verifying Firebase token...")
        decoded_token = firebase_auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        name = decoded_token.get("name", "")
        picture = decoded_token.get("picture", "")
        
        print(f"[Backend Auth] Syncing MongoDB user: {email}")
        user = await db.users.find_one({"firebaseUid": uid})
        if not user:
            # New user — apply the requested role
            new_user = {
                "firebaseUid": uid,
                "email": email,
                "name": name,
                "picture": picture,
                "role": requested_role,
                "createdAt": datetime.utcnow(),
                "lastLogin": datetime.utcnow()
            }
            result = await db.users.insert_one(new_user)
            user_id = str(result.inserted_id)
            role = requested_role
            print(f"[Backend Auth] New user created with role: {role}")
        else:
            # Existing user — preserve their stored role
            user_id = str(user["_id"])
            role = user.get("role", "FARMER")
            await db.users.update_one(
                {"_id": ObjectId(user_id)}, 
                {"$set": {"lastLogin": datetime.utcnow(), "picture": picture, "name": name or user.get("name", "")}}
            )

        access_token = JWTService.create_access_token({"sub": user_id, "role": role}, expires_delta=timedelta(days=7))

        import os
        is_production = os.environ.get("ENVIRONMENT", "development") == "production"

        print("[Backend Auth] Success. Setting cookie and returning to Next.js.")
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=is_production,  # Only True in production (HTTPS). False on localhost HTTP.
            samesite="lax",
            max_age=86400 * 7, # 7 days
            path="/"
        )
        return {
            "message": "Authentication successful",
            "token": access_token,
            "user": {"id": user_id, "email": email, "name": name, "role": role}
        }
    except firebase_auth.InvalidIdTokenError:
        print("[Backend Auth Error] Invalid Firebase Token.")
        raise HTTPException(status_code=401, detail="Invalid Firebase Token.")
    except Exception as e:
        print(f"[Backend Auth Error] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database sync failed: {str(e)}")

@router.get("/me", status_code=status.HTTP_200_OK)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    current_user["name"] = current_user.get("full_name") or current_user.get("name") or ""
    if "_id" in current_user:
        current_user["_id"] = str(current_user["_id"])
    return {"user": current_user}

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logged out successfully"}
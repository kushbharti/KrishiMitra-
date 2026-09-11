from fastapi import Request, HTTPException, status, Depends
from services.jwt_service import JWTService
from db.mongodb import get_database
from bson import ObjectId

async def get_current_user(request: Request, db=Depends(get_database)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Authentication token missing in cookies"
        )
    
    payload = JWTService.verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired authentication token"
        )
    
    user_id = payload.get("sub")
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User account no longer exists"
        )
    
    user["_id"] = str(user["_id"])
    return user
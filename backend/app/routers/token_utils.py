from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.routers.auth import get_current_user, User
from app.services.auth_service import create_access_token
from app.settings import settings


router = APIRouter(prefix="/token-utils", tags=["token-utils"])

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int


@router.post("/refresh-token")
async def refresh_token(current_user: User = Depends(get_current_user)) -> TokenResponse:
    """Refresh authentication token"""
    new_token = create_access_token(
        {"sub": current_user.username}, 
        secret_key=settings.jwt_secret, 
        expires_minutes=1440  # 24 hours
    )
    
    return TokenResponse(
        access_token=new_token,
        token_type="bearer",
        expires_in=86400  # 24 hours in seconds
    )


@router.get("/validate-token")
async def validate_token(current_user: User = Depends(get_current_user)) -> dict:
    """Validate if token is still valid"""
    return {
        "valid": True,
        "user": current_user.username,
        "message": "Token is valid"
    }

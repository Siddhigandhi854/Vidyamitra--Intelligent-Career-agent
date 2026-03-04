from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from app.services.auth_service import (
    create_access_token,
    decode_access_token,
    hash_password,
    user_exists,
    get_user_password_hash,
    create_user,
    verify_password,
)
from app.settings import settings


router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
security = HTTPBearer()


class AuthRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class User(BaseModel):
    username: str


@router.post("/register", response_model=AuthResponse)
def register(payload: AuthRequest) -> AuthResponse:
    try:
        if user_exists(payload.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )

        # Validate password before hashing
        if not payload.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password cannot be empty",
            )
        
        # Check password length in bytes
        password_bytes = payload.password.encode('utf-8')
        if len(password_bytes) > 72:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is too long (maximum 72 bytes)",
            )
        
        password_hash = hash_password(payload.password)
        create_user(payload.username, password_hash)

        token = create_access_token({"sub": payload.username}, secret_key=settings.jwt_secret, expires_minutes=1440)  # 24 hours
        return AuthResponse(access_token=token)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        error_msg = str(e)
        # Provide a more user-friendly error message
        if "72 bytes" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is too long. Please use a shorter password (maximum 72 characters).",
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {error_msg}",
        )


@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest) -> AuthResponse:
    stored_hash = get_user_password_hash(payload.username)
    if not stored_hash or not verify_password(payload.password, stored_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = create_access_token({"sub": payload.username}, secret_key=settings.jwt_secret, expires_minutes=1440)  # 24 hours
    return AuthResponse(access_token=token)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    token = credentials.credentials
    payload: Optional[dict] = decode_access_token(token, secret_key=settings.jwt_secret)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return User(username=str(payload["sub"]))


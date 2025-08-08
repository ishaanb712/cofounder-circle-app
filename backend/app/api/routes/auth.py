from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.services.supabase_service import supabase_service
from app.core.auth import create_access_token, get_password_hash, get_current_user
from app.schemas.user import TokenData
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        # Hash the password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user in Supabase Auth
        user_metadata = {
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "user_type": user_data.user_type.value,
            "company": user_data.company,
            "use_case": user_data.use_case
        }
        
        user = await supabase_service.create_user(
            email=user_data.email,
            password=hashed_password,
            user_metadata=user_metadata
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        # Create user profile in our custom table
        profile_data = {
            "user_id": user["id"],
            "email": user_data.email,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "user_type": user_data.user_type.value,
            "company": user_data.company,
            "use_case": user_data.use_case,
            "linkedin_url": str(user_data.linkedin_url) if user_data.linkedin_url else None,
            "phone": user_data.phone,
            "location": user_data.location,
            "bio": user_data.bio
        }
        
        await supabase_service.create_user_profile(profile_data)
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.email, "user_id": user["id"]},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "email": user_data.email,
                "user_type": user_data.user_type.value
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user"""
    try:
        # Authenticate with Supabase
        user = await supabase_service.authenticate_user(
            email=user_credentials.email,
            password=user_credentials.password
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_credentials.email, "user_id": user["id"]},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "email": user_credentials.email
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/verify")
async def verify_token(token_data: TokenData, current_user: TokenData = Depends(get_current_user)):
    """Verify JWT token"""
    return {
        "valid": True,
        "user": {
            "email": current_user.email,
            "user_id": current_user.user_id
        }
    } 
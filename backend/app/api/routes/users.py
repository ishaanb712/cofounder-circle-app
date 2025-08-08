from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user import UserResponse, UserUpdate
from app.services.supabase_service import supabase_service
from app.core.auth import get_current_user
from app.schemas.user import TokenData
from typing import List

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: TokenData = Depends(get_current_user)):
    """Get current user's profile"""
    try:
        profile = await supabase_service.get_user_profile(current_user.user_id)
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        return UserResponse(**profile)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get profile: {str(e)}"
        )

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    update_data: UserUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """Update current user's profile"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        # Add updated_at timestamp
        from datetime import datetime
        update_dict["updated_at"] = datetime.utcnow().isoformat()
        
        updated_profile = await supabase_service.update_user_profile(
            current_user.user_id,
            update_dict
        )
        
        if not updated_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        return UserResponse(**updated_profile)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.get("/all", response_model=List[UserResponse])
async def get_all_users(current_user: TokenData = Depends(get_current_user)):
    """Get all users (admin function)"""
    try:
        users = await supabase_service.get_all_users()
        return [UserResponse(**user) for user in users]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get users: {str(e)}"
        ) 
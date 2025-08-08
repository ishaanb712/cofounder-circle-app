from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.founder import FounderCreate, FounderUpdate, FounderResponse
from app.services.founder_service import founder_service
from app.core.auth import get_current_user
from app.schemas.user import TokenData
from typing import List
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=FounderResponse)
async def create_founder(founder_data: FounderCreate):
    """Create a new founder record"""
    try:
        # Generate a new user_id
        user_id = str(uuid.uuid4())
        
        # Prepare data for insertion
        founder_dict = founder_data.model_dump(exclude_unset=True)
        founder_dict["user_id"] = user_id
        founder_dict["created_at"] = datetime.utcnow().isoformat()
        
        # Create founder record
        created_founder = await founder_service.create_founder(founder_dict)
        
        if not created_founder:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create founder record"
            )
        
        return FounderResponse(**created_founder)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create founder: {str(e)}"
        )

@router.get("/{user_id}", response_model=FounderResponse)
async def get_founder(user_id: str):
    """Get founder by user_id"""
    try:
        founder = await founder_service.get_founder(user_id)
        
        if not founder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Founder not found"
            )
        
        return FounderResponse(**founder)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get founder: {str(e)}"
        )

@router.put("/{user_id}", response_model=FounderResponse)
async def update_founder(
    user_id: str,
    update_data: FounderUpdate
):
    """Update founder record"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        updated_founder = await founder_service.update_founder(user_id, update_dict)
        
        if not updated_founder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Founder not found"
            )
        
        return FounderResponse(**updated_founder)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update founder: {str(e)}"
        )

@router.get("/", response_model=List[FounderResponse])
async def get_all_founders():
    """Get all founders"""
    try:
        founders = await founder_service.get_all_founders()
        return [FounderResponse(**founder) for founder in founders]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get founders: {str(e)}"
        )

@router.delete("/{user_id}")
async def delete_founder(user_id: str):
    """Delete founder record"""
    try:
        success = await founder_service.delete_founder(user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Founder not found"
            )
        
        return {"message": "Founder deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete founder: {str(e)}"
        ) 
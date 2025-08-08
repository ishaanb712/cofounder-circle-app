from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.mentor import MentorCreate, MentorUpdate, MentorResponse
from app.services.mentor_service import mentor_service
from app.core.auth import get_current_user
from app.schemas.user import TokenData
from typing import List
from datetime import datetime
from pydantic import ValidationError

router = APIRouter()

@router.post("/", response_model=MentorResponse)
async def create_mentor(mentor_data: MentorCreate):
    """Create a new mentor record"""
    try:
        print(f"🔍 Received mentor data: {mentor_data}")
        
        # Prepare data for insertion
        mentor_dict = mentor_data.model_dump(exclude_unset=True)
        mentor_dict["created_at"] = datetime.utcnow().isoformat()
        
        # Ensure phone is a string
        if 'phone' in mentor_dict and mentor_dict['phone'] is not None:
            mentor_dict['phone'] = str(mentor_dict['phone'])
        
        print(f"📝 Prepared mentor dict: {mentor_dict}")
        
        # Create mentor record
        created_mentor = await mentor_service.create_mentor(mentor_dict)
        
        if not created_mentor:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create mentor record"
            )
        
        # Ensure phone is string in response
        if created_mentor.get('phone') is not None:
            created_mentor['phone'] = str(created_mentor['phone'])
        
        return MentorResponse(**created_mentor)
        
    except ValidationError as e:
        print(f"❌ Validation error: {e}")
        print(f"❌ Validation error details: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error: {e.errors()}"
        )
    except Exception as e:
        print(f"❌ Error creating mentor: {e}")
        print(f"❌ Error type: {type(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create mentor: {str(e)}"
        )

@router.get("/{user_id}", response_model=MentorResponse)
async def get_mentor(user_id: str):
    """Get mentor by user_id"""
    try:
        mentor = await mentor_service.get_mentor(user_id)
        
        if not mentor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mentor not found"
            )
        
        return MentorResponse(**mentor)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get mentor: {str(e)}"
        )

@router.put("/{user_id}", response_model=MentorResponse)
async def update_mentor(
    user_id: str,
    update_data: MentorUpdate
):
    """Update mentor record"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        updated_mentor = await mentor_service.update_mentor(user_id, update_dict)
        
        if not updated_mentor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mentor not found"
            )
        
        return MentorResponse(**updated_mentor)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update mentor: {str(e)}"
        )

@router.get("/", response_model=List[MentorResponse])
async def get_all_mentors():
    """Get all mentors"""
    try:
        mentors = await mentor_service.get_all_mentors()
        return [MentorResponse(**mentor) for mentor in mentors]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get mentors: {str(e)}"
        )

@router.delete("/{user_id}")
async def delete_mentor(user_id: str):
    """Delete mentor record"""
    try:
        success = await mentor_service.delete_mentor(user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mentor not found"
            )
        
        return {"message": "Mentor deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete mentor: {str(e)}"
        ) 
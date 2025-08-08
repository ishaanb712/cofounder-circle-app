from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.working_professional import WorkingProfessionalCreate, WorkingProfessionalUpdate, WorkingProfessionalResponse
from app.services.working_professional_service import working_professional_service
from app.core.auth import get_current_user
from app.schemas.user import TokenData
from typing import List
from datetime import datetime
from pydantic import ValidationError

router = APIRouter()

@router.post("/", response_model=WorkingProfessionalResponse)
async def create_working_professional(professional_data: WorkingProfessionalCreate):
    """Create a new working professional record"""
    try:
        print(f"🔍 Received working professional data: {professional_data}")
        
        # Prepare data for insertion
        professional_dict = professional_data.model_dump(exclude_unset=True)
        professional_dict["created_at"] = datetime.utcnow().isoformat()
        
        # Ensure phone is a string
        if 'phone' in professional_dict and professional_dict['phone'] is not None:
            professional_dict['phone'] = str(professional_dict['phone'])
        
        print(f"📝 Prepared professional dict: {professional_dict}")
        
        # Create working professional record
        created_professional = await working_professional_service.create_working_professional(professional_dict)
        
        if not created_professional:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create working professional record"
            )
        
        # Ensure phone is string in response
        if created_professional.get('phone') is not None:
            created_professional['phone'] = str(created_professional['phone'])
        
        return WorkingProfessionalResponse(**created_professional)
        
    except ValidationError as e:
        print(f"❌ Validation error: {e}")
        print(f"❌ Validation error details: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error: {e.errors()}"
        )
    except Exception as e:
        print(f"❌ Error creating working professional: {e}")
        print(f"❌ Error type: {type(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create working professional: {str(e)}"
        )

@router.get("/{user_id}", response_model=WorkingProfessionalResponse)
async def get_working_professional(user_id: str):
    """Get working professional by user_id"""
    try:
        professional = await working_professional_service.get_working_professional(user_id)
        
        if not professional:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Working professional not found"
            )
        
        return WorkingProfessionalResponse(**professional)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get working professional: {str(e)}"
        )

@router.put("/{user_id}", response_model=WorkingProfessionalResponse)
async def update_working_professional(
    user_id: str,
    update_data: WorkingProfessionalUpdate
):
    """Update working professional record"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        updated_professional = await working_professional_service.update_working_professional(user_id, update_dict)
        
        if not updated_professional:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Working professional not found"
            )
        
        return WorkingProfessionalResponse(**updated_professional)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update working professional: {str(e)}"
        )

@router.get("/", response_model=List[WorkingProfessionalResponse])
async def get_all_working_professionals():
    """Get all working professionals"""
    try:
        professionals = await working_professional_service.get_all_working_professionals()
        return [WorkingProfessionalResponse(**professional) for professional in professionals]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get working professionals: {str(e)}"
        )

@router.delete("/{user_id}")
async def delete_working_professional(user_id: str):
    """Delete working professional record"""
    try:
        success = await working_professional_service.delete_working_professional(user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Working professional not found"
            )
        
        return {"message": "Working professional deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete working professional: {str(e)}"
        ) 
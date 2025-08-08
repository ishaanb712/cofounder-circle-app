from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse
from app.services.vendor_service import vendor_service
from app.core.auth import get_current_user
from app.schemas.user import TokenData
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=VendorResponse)
async def create_vendor(vendor_data: VendorCreate):
    """Create a new vendor record"""
    try:
        # Prepare data for insertion
        vendor_dict = vendor_data.model_dump(exclude_unset=True)
        vendor_dict["created_at"] = datetime.utcnow().isoformat()
        
        # Create vendor record
        created_vendor = await vendor_service.create_vendor(vendor_dict)
        
        if not created_vendor:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create vendor record"
            )
        
        return VendorResponse(**created_vendor)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create vendor: {str(e)}"
        )

@router.get("/{user_id}", response_model=VendorResponse)
async def get_vendor(user_id: str):
    """Get vendor by user_id"""
    try:
        vendor = await vendor_service.get_vendor(user_id)
        
        if not vendor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vendor not found"
            )
        
        return VendorResponse(**vendor)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get vendor: {str(e)}"
        )

@router.put("/{user_id}", response_model=VendorResponse)
async def update_vendor(
    user_id: str,
    update_data: VendorUpdate
):
    """Update vendor record"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        updated_vendor = await vendor_service.update_vendor(user_id, update_dict)
        
        if not updated_vendor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vendor not found"
            )
        
        return VendorResponse(**updated_vendor)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update vendor: {str(e)}"
        )

@router.get("/", response_model=List[VendorResponse])
async def get_all_vendors():
    """Get all vendors"""
    try:
        vendors = await vendor_service.get_all_vendors()
        return [VendorResponse(**vendor) for vendor in vendors]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get vendors: {str(e)}"
        )

@router.delete("/{user_id}")
async def delete_vendor(user_id: str):
    """Delete vendor record"""
    try:
        success = await vendor_service.delete_vendor(user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vendor not found"
            )
        
        return {"message": "Vendor deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete vendor: {str(e)}"
        ) 
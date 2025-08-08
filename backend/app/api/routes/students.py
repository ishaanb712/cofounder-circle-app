from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse
from app.services.student_service import student_service
from app.core.auth import get_current_user
from app.schemas.user import TokenData
from typing import List
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=StudentResponse)
async def create_student(student_data: StudentCreate):
    """Create a new student record"""
    try:
        print(f"Received student data: {student_data}")
        
        # Generate a new user_id
        user_id = str(uuid.uuid4())
        
        # Prepare data for insertion
        student_dict = student_data.model_dump()
        student_dict["user_id"] = user_id
        student_dict["created_at"] = datetime.utcnow().isoformat()
        
        # Convert phone to bigint if it's a string (required by the database schema)
        if isinstance(student_dict.get("phone"), str):
            try:
                student_dict["phone"] = int(student_dict["phone"])
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number must be a valid integer"
                )
        
        print(f"Prepared student dict: {student_dict}")
        
        # Create student record
        created_student = await student_service.create_student(student_dict)
        
        if not created_student:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create student record"
            )
        
        return StudentResponse(**created_student)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create student: {str(e)}"
        )

@router.get("/{user_id}", response_model=StudentResponse)
async def get_student(user_id: str):
    """Get student by user_id"""
    try:
        student = await student_service.get_student(user_id)
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        return StudentResponse(**student)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get student: {str(e)}"
        )

@router.put("/{user_id}", response_model=StudentResponse)
async def update_student(
    user_id: str,
    update_data: StudentUpdate
):
    """Update student record"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        updated_student = await student_service.update_student(user_id, update_dict)
        
        if not updated_student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        return StudentResponse(**updated_student)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update student: {str(e)}"
        )

@router.get("/", response_model=List[StudentResponse])
async def get_all_students():
    """Get all students"""
    try:
        students = await student_service.get_all_students()
        return [StudentResponse(**student) for student in students]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get students: {str(e)}"
        )

@router.delete("/{user_id}")
async def delete_student(user_id: str):
    """Delete student record"""
    try:
        success = await student_service.delete_student(user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        return {"message": "Student deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete student: {str(e)}"
        ) 
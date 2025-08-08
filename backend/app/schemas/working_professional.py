from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class WorkingProfessionalBase(BaseModel):
    user_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    years_of_experience: Optional[int] = Field(None, ge=0, le=50)
    role: Optional[str] = None
    company: Optional[str] = None
    linkedin: Optional[str] = None
    startup_interest: Optional[List[str]] = None
    startup_exposure: Optional[List[str]] = None
    functional_expertise: Optional[List[str]] = None
    industry_knowledge: Optional[List[str]] = None
    resume_url: Optional[str] = None
    availability: Optional[str] = None
    compensation_model: Optional[str] = None
    stage_preference: Optional[List[str]] = None

class WorkingProfessionalCreate(WorkingProfessionalBase):
    pass

class WorkingProfessionalUpdate(WorkingProfessionalBase):
    pass

class WorkingProfessionalResponse(WorkingProfessionalBase):
    created_at: datetime

    model_config = {
        "from_attributes": True
    } 
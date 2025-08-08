from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class FounderBase(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[int] = None
    city: Optional[str] = None
    state: Optional[str] = None
    years_of_experience: Optional[int] = None
    role: Optional[str] = None
    company: Optional[str] = None
    linkedin: Optional[str] = None
    startup_status: Optional[str] = None
    startup_name: Optional[str] = None
    startup_url: Optional[str] = None
    description: Optional[str] = None
    elevator_pitch: Optional[str] = Field(None, max_length=300)
    help_needed: Optional[List[str]] = None
    category: Optional[List[str]] = None

class FounderCreate(FounderBase):
    pass

class FounderUpdate(FounderBase):
    pass

class FounderResponse(FounderBase):
    user_id: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    } 
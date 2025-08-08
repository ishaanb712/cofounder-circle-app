from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class MentorBase(BaseModel):
    user_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    organisation: Optional[str] = None
    url: Optional[str] = None
    linkedin: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    incubator_type: Optional[str] = None
    focus_areas: Optional[List[str]] = None
    preferred_startup_stage: Optional[List[str]] = None

class MentorCreate(MentorBase):
    pass

class MentorUpdate(MentorBase):
    pass

class MentorResponse(MentorBase):
    created_at: datetime

    model_config = {
        "from_attributes": True
    } 
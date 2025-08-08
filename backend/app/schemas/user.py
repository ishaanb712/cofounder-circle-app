from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional
from enum import Enum
from datetime import datetime

class UserType(str, Enum):
    FOUNDER = "founder"
    INVESTOR = "investor"
    MENTOR = "mentor"
    JOB_SEEKER = "job_seeker"
    SERVICE_PROVIDER = "service_provider"

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    user_type: UserType
    company: Optional[str] = None
    use_case: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None
    use_case: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None

class UserResponse(UserBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None 
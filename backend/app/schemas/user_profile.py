from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserProfileBase(BaseModel):
    user_id: str = Field(..., description="Firebase Auth UID")
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    google_id: Optional[str] = None
    user_type: str = Field(default="student", description="User type")

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    google_id: Optional[str] = None
    user_type: Optional[str] = None

class UserProfileResponse(UserProfileBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class FirebaseTokenRequest(BaseModel):
    firebase_token: str = Field(..., description="Firebase ID token")

class UserProfileRequest(BaseModel):
    firebase_token: str = Field(..., description="Firebase ID token")
    profile_data: Optional[UserProfileCreate] = None

class UserProfileUpdateRequest(BaseModel):
    firebase_token: str = Field(..., description="Firebase ID token")
    updates: UserProfileUpdate 
from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import Optional, List
from datetime import datetime

class StudentBase(BaseModel):
    # Basic Info (Step 1)
    name: str = Field(..., description="Student's full name")
    email: EmailStr = Field(..., description="Student's email address")
    phone: int = Field(..., description="Student's phone number")
    college: str = Field(..., description="Student's college/university name")
    year: int = Field(..., description="Current year of study")
    course: str = Field(..., description="Student's course/degree program")
    city: str = Field(..., description="Student's city")
    
    # Career Goals (Step 2)
    career_goals: List[str] = Field(default=[], description="Career goals (Internship, Project, Job, Side Hustle)")
    interest_area: List[str] = Field(default=[], description="Interest areas (Marketing, Product, Tech, Operations, Design, Other)")
    interest_level: Optional[str] = Field(None, description="Startup interest level")
    
    # Skills & Portfolio (Step 3)
    resume_url: Optional[str] = Field(None, description="Resume URL")
    linkedin_url: Optional[str] = Field(None, description="LinkedIn profile URL")
    github_url: Optional[str] = Field(None, description="GitHub profile URL")
    portfolio_url: Optional[str] = Field(None, description="Portfolio/website URL")
    
    # Preferences (Step 4)
    availability: Optional[str] = Field(None, description="Available hours per week")
    payment_terms: Optional[str] = Field(None, description="Payment preference")
    location_preference: Optional[str] = Field(None, description="Location preference")
    extra_text: Optional[str] = Field(None, description="Additional information about interests")

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    # Basic Info
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[int] = None
    college: Optional[str] = None
    year: Optional[int] = None
    course: Optional[str] = None
    city: Optional[str] = None
    
    # Career Goals
    career_goals: Optional[List[str]] = None
    interest_area: Optional[List[str]] = None
    interest_level: Optional[str] = None
    
    # Skills & Portfolio
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    
    # Preferences
    availability: Optional[str] = None
    payment_terms: Optional[str] = None
    location_preference: Optional[str] = None
    extra_text: Optional[str] = None

class StudentResponse(StudentBase):
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }

# Multi-step form data models
class StudentBasicInfo(BaseModel):
    name: str
    email: EmailStr
    phone: int
    college: str
    year: int
    course: str
    city: str

class StudentCareerGoals(BaseModel):
    career_goals: List[str]
    interest_area: List[str]
    interest_level: str

class StudentSkillsPortfolio(BaseModel):
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class StudentPreferences(BaseModel):
    availability: str
    payment_terms: str
    location_preference: str
    extra_text: Optional[str] = None 
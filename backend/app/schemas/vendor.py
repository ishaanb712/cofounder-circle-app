from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class VendorBase(BaseModel):
    business_name: Optional[str] = None
    url: Optional[str] = None
    category: Optional[List[str]] = None
    years_of_experience: Optional[int] = None
    locations: Optional[List[str]] = None
    team_size: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorUpdate(VendorBase):
    pass

class VendorResponse(VendorBase):
    user_id: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    } 
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional, Dict, Any, List
import os

class WorkingProfessionalService:
    def __init__(self):
        # Use placeholder values if environment variables are not set
        supabase_url = settings.SUPABASE_URL if settings.SUPABASE_URL != "your-supabase-project-url" else "https://placeholder.supabase.co"
        supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY
        
        try:
            self.supabase: Client = create_client(supabase_url, supabase_key)
        except Exception as e:
            print(f"Warning: Could not initialize Supabase client: {e}")
            self.supabase = None
    
    async def create_working_professional(self, professional_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new working professional record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                **professional_data,
                "user_id": "mock-professional-id",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.table("landing_working_professional").insert(professional_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating working professional: {e}")
            raise
    
    async def get_working_professional(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get working professional by user_id"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                "user_id": user_id,
                "name": "Sarah Johnson",
                "email": "sarah@techcompany.com",
                "phone": 1234567890,
                "city": "San Francisco",
                "state": "CA",
                "years_of_experience": 5,
                "role": "Senior Software Engineer",
                "company": "TechCorp Inc.",
                "linkedin": "https://linkedin.com/in/sarahjohnson",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.table("landing_working_professional").select("*").eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error getting working professional: {e}")
            return None
    
    async def update_working_professional(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update working professional record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {**update_data, "user_id": user_id, "updated_at": "2024-01-01T00:00:00Z"}
        
        try:
            response = self.supabase.table("landing_working_professional").update(update_data).eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating working professional: {e}")
            return None
    
    async def get_all_working_professionals(self) -> List[Dict[str, Any]]:
        """Get all working professionals"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return [
                {
                    "user_id": "professional-1",
                    "name": "Sarah Johnson",
                    "email": "sarah@techcompany.com",
                    "phone": 1234567890,
                    "city": "San Francisco",
                    "state": "CA",
                    "years_of_experience": 5,
                    "role": "Senior Software Engineer",
                    "company": "TechCorp Inc.",
                    "linkedin": "https://linkedin.com/in/sarahjohnson",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "user_id": "professional-2",
                    "name": "Michael Chen",
                    "email": "michael@startup.com",
                    "phone": 9876543210,
                    "city": "New York",
                    "state": "NY",
                    "years_of_experience": 8,
                    "role": "Product Manager",
                    "company": "StartupXYZ",
                    "linkedin": "https://linkedin.com/in/michaelchen",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "user_id": "professional-3",
                    "name": "Lisa Rodriguez",
                    "email": "lisa@consulting.com",
                    "phone": 5551234567,
                    "city": "Austin",
                    "state": "TX",
                    "years_of_experience": 12,
                    "role": "Senior Consultant",
                    "company": "Consulting Partners",
                    "linkedin": "https://linkedin.com/in/lisarodriguez",
                    "created_at": "2024-01-01T00:00:00Z"
                }
            ]
        
        try:
            response = self.supabase.table("landing_working_professional").select("*").order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Error getting all working professionals: {e}")
            return []
    
    async def delete_working_professional(self, user_id: str) -> bool:
        """Delete working professional record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock success")
            return True
        
        try:
            response = self.supabase.table("landing_working_professional").delete().eq("user_id", user_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting working professional: {e}")
            return False

# Global instance
working_professional_service = WorkingProfessionalService() 
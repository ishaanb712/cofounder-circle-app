from supabase import create_client, Client
from app.core.config import settings
from typing import Optional, Dict, Any, List
import os

class MentorService:
    def __init__(self):
        # Use placeholder values if environment variables are not set
        supabase_url = settings.SUPABASE_URL if settings.SUPABASE_URL != "your-supabase-project-url" else "https://placeholder.supabase.co"
        supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY
        
        try:
            self.supabase: Client = create_client(supabase_url, supabase_key)
        except Exception as e:
            print(f"Warning: Could not initialize Supabase client: {e}")
            self.supabase = None
    
    async def create_mentor(self, mentor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new mentor record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                **mentor_data,
                "user_id": "mock-mentor-id",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.table("landing_mentors").insert(mentor_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating mentor: {e}")
            raise
    
    async def get_mentor(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get mentor by user_id"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                "user_id": user_id,
                "name": "Dr. Sarah Johnson",
                "email": "sarah@mentor.com",
                "phone": 1234567890,
                "organisation": "TechMentor Inc.",
                "url": "https://techmentor.com",
                "linkedin": "https://linkedin.com/in/sarahjohnson",
                "city": "San Francisco",
                "state": "CA",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.table("landing_mentors").select("*").eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error getting mentor: {e}")
            return None
    
    async def update_mentor(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update mentor record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {**update_data, "user_id": user_id, "updated_at": "2024-01-01T00:00:00Z"}
        
        try:
            response = self.supabase.table("landing_mentors").update(update_data).eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating mentor: {e}")
            return None
    
    async def get_all_mentors(self) -> List[Dict[str, Any]]:
        """Get all mentors"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return [
                {
                    "user_id": "mentor-1",
                    "name": "Dr. Sarah Johnson",
                    "email": "sarah@mentor.com",
                    "phone": 1234567890,
                    "organisation": "TechMentor Inc.",
                    "url": "https://techmentor.com",
                    "linkedin": "https://linkedin.com/in/sarahjohnson",
                    "city": "San Francisco",
                    "state": "CA",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "user_id": "mentor-2",
                    "name": "Michael Chen",
                    "email": "michael@startupguide.com",
                    "phone": 9876543210,
                    "organisation": "StartupGuide Consulting",
                    "url": "https://startupguide.com",
                    "linkedin": "https://linkedin.com/in/michaelchen",
                    "city": "New York",
                    "state": "NY",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "user_id": "mentor-3",
                    "name": "Lisa Rodriguez",
                    "email": "lisa@venturementor.com",
                    "phone": 5551234567,
                    "organisation": "VentureMentor",
                    "url": "https://venturementor.com",
                    "linkedin": "https://linkedin.com/in/lisarodriguez",
                    "city": "Austin",
                    "state": "TX",
                    "created_at": "2024-01-01T00:00:00Z"
                }
            ]
        
        try:
            response = self.supabase.table("landing_mentors").select("*").order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Error getting all mentors: {e}")
            return []
    
    async def delete_mentor(self, user_id: str) -> bool:
        """Delete mentor record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock success")
            return True
        
        try:
            response = self.supabase.table("landing_mentors").delete().eq("user_id", user_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting mentor: {e}")
            return False

# Global instance
mentor_service = MentorService() 
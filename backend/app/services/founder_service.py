from app.services.supabase_service import supabase_service
from typing import Optional, Dict, Any, List

class FounderService:
    def __init__(self):
        self.supabase = supabase_service
    
    async def create_founder(self, founder_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new founder record"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                **founder_data,
                "user_id": "mock-founder-id",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            print(f"Creating founder record in Supabase: {founder_data}")
            response = self.supabase.supabase.table("landing_founders").insert(founder_data).execute()
            
            if response.data:
                result = response.data[0]
                print(f"Successfully created founder with ID: {result.get('id')}")
                return result
            else:
                print("No data returned from insert")
                return None
                
        except Exception as e:
            print(f"Error creating founder: {e}")
            raise
    
    async def get_founder(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get founder by user_id"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                "user_id": user_id,
                "name": "Mock Founder",
                "email": "mock@founder.com",
                "phone": 1234567890,
                "city": "San Francisco",
                "state": "CA",
                "linkedin": "https://linkedin.com/in/mockfounder",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.supabase.table("landing_founders").select("*").eq("user_id", user_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error getting founder: {e}")
            return None
    
    async def update_founder(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update founder record"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {**update_data, "user_id": user_id, "updated_at": "2024-01-01T00:00:00Z"}
        
        try:
            response = self.supabase.supabase.table("landing_founders").update(update_data).eq("user_id", user_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error updating founder: {e}")
            return None
    
    async def get_all_founders(self) -> List[Dict[str, Any]]:
        """Get all founders"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return [
                {
                    "user_id": "founder-1",
                    "name": "John Startup",
                    "email": "john@startup.com",
                    "phone": 1234567890,
                    "city": "San Francisco",
                    "state": "CA",
                    "linkedin": "https://linkedin.com/in/johnstartup",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "user_id": "founder-2",
                    "name": "Sarah Innovator",
                    "email": "sarah@innovator.com",
                    "phone": 9876543210,
                    "city": "New York",
                    "state": "NY",
                    "linkedin": "https://linkedin.com/in/sarahinnovator",
                    "created_at": "2024-01-01T00:00:00Z"
                }
            ]
        
        try:
            response = self.supabase.supabase.table("landing_founders").select("*").order("created_at", desc=True).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error getting all founders: {e}")
            return []
    
    async def delete_founder(self, user_id: str) -> bool:
        """Delete founder record"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock success")
            return True
        
        try:
            response = self.supabase.supabase.table("landing_founders").delete().eq("user_id", user_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting founder: {e}")
            return False

# Global instance
founder_service = FounderService() 
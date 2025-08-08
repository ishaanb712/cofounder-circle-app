from supabase import create_client, Client
from app.core.config import settings
from typing import Optional, Dict, Any, List
import os

class VendorService:
    def __init__(self):
        # Use placeholder values if environment variables are not set
        supabase_url = settings.SUPABASE_URL if settings.SUPABASE_URL != "your-supabase-project-url" else "https://placeholder.supabase.co"
        supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY
        
        try:
            self.supabase: Client = create_client(supabase_url, supabase_key)
        except Exception as e:
            print(f"Warning: Could not initialize Supabase client: {e}")
            self.supabase = None
    
    async def create_vendor(self, vendor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new vendor record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                **vendor_data,
                "user_id": "mock-vendor-id",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.table("landing_vendor").insert(vendor_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating vendor: {e}")
            raise
    
    async def get_vendor(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get vendor by user_id"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                "user_id": user_id,
                "business_name": "TechSolutions Pro",
                "url": "https://techsolutionspro.com",
                "category": ["Software Development", "Cloud Services", "Consulting"],
                "years_of_experience": 8,
                "locations": ["San Francisco", "New York", "Austin"],
                "team_size": "50-100",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.table("landing_vendor").select("*").eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error getting vendor: {e}")
            return None
    
    async def update_vendor(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update vendor record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {**update_data, "user_id": user_id, "updated_at": "2024-01-01T00:00:00Z"}
        
        try:
            response = self.supabase.table("landing_vendor").update(update_data).eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating vendor: {e}")
            return None
    
    async def get_all_vendors(self) -> List[Dict[str, Any]]:
        """Get all vendors"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return [
                {
                    "user_id": "vendor-1",
                    "business_name": "TechSolutions Pro",
                    "url": "https://techsolutionspro.com",
                    "category": ["Software Development", "Cloud Services", "Consulting"],
                    "years_of_experience": 8,
                    "locations": ["San Francisco", "New York", "Austin"],
                    "team_size": "50-100",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "user_id": "vendor-2",
                    "business_name": "Digital Marketing Hub",
                    "url": "https://digitalmarketinghub.com",
                    "category": ["Digital Marketing", "SEO", "Content Creation"],
                    "years_of_experience": 5,
                    "locations": ["Los Angeles", "Chicago"],
                    "team_size": "10-25",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "user_id": "vendor-3",
                    "business_name": "LegalTech Partners",
                    "url": "https://legaltechpartners.com",
                    "category": ["Legal Services", "Compliance", "Contract Management"],
                    "years_of_experience": 12,
                    "locations": ["Washington DC", "Boston"],
                    "team_size": "25-50",
                    "created_at": "2024-01-01T00:00:00Z"
                }
            ]
        
        try:
            response = self.supabase.table("landing_vendor").select("*").order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Error getting all vendors: {e}")
            return []
    
    async def delete_vendor(self, user_id: str) -> bool:
        """Delete vendor record"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock success")
            return True
        
        try:
            response = self.supabase.table("landing_vendor").delete().eq("user_id", user_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting vendor: {e}")
            return False

# Global instance
vendor_service = VendorService() 
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional, Dict, Any
import os

class SupabaseService:
    def __init__(self):
        # Use service role key for backend operations
        supabase_url = settings.SUPABASE_URL
        supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY
        
        print(f"Initializing Supabase with URL: {supabase_url}")
        
        # Check if environment variables are set
        if not supabase_key:
            print("Warning: SUPABASE_SERVICE_ROLE_KEY not set")
            self.supabase = None
            return
            
        print(f"API Key length: {len(supabase_key)}")
        print(f"API Key starts with: {supabase_key[:50]}...")
        print(f"API Key ends with: ...{supabase_key[-20:]}")
        
        # Verify this is a service role key
        import base64
        import json
        try:
            parts = supabase_key.split('.')
            if len(parts) == 3:
                payload = base64.urlsafe_b64decode(parts[1] + '==').decode('utf-8')
                payload_data = json.loads(payload)
                if payload_data.get('role') != 'service_role':
                    print(f"Warning: Expected service_role key, got role: {payload_data.get('role')}")
            else:
                print("Warning: Invalid JWT format for service role key")
        except Exception as e:
            print(f"Warning: Could not parse service role key: {e}")
        
        try:
            self.supabase: Client = create_client(supabase_url, supabase_key)
            print("Supabase client initialized successfully")
        except Exception as e:
            print(f"Warning: Could not initialize Supabase client: {e}")
            self.supabase = None
    
    async def create_user_profile(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a user profile in the user_profiles table"""
        print(f"\n=== CREATE USER PROFILE DEBUG ===")
        print(f"Supabase client initialized: {self.supabase is not None}")
        
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {**user_data, "id": "mock-id", "created_at": "2024-01-01T00:00:00Z"}
        
        try:
            print(f"User data to insert: {user_data}")
            print(f"User data type: {type(user_data)}")
            print(f"User data keys: {list(user_data.keys())}")
            
            # Check if user_id exists and is valid
            user_id = user_data.get('user_id')
            print(f"User ID: {user_id}")
            print(f"User ID type: {type(user_id)}")
            print(f"User ID length: {len(user_id) if user_id else 0}")
            
            # Check table name
            table_name = "landing_page_user_profiles"
            print(f"Table name: {table_name}")
            
            # Attempt the insert
            print(f"Attempting to insert into {table_name}...")
            response = self.supabase.table(table_name).insert(user_data).execute()
            print(f"Supabase response received")
            print(f"Response type: {type(response)}")
            print(f"Response data: {response.data}")
            print(f"Response count: {len(response.data) if response.data else 0}")
            
            if response.data:
                result = response.data[0]
                print(f"Successfully created profile with ID: {result.get('id')}")
                return result
            else:
                print("No data returned from insert")
                return None
                
        except Exception as e:
            print(f"ERROR creating user profile: {e}")
            print(f"Error type: {type(e)}")
            print(f"Error class: {e.__class__.__name__}")
            print(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No __dict__'}")
            
            # Try to get more specific error information
            if hasattr(e, 'message'):
                print(f"Error message: {e.message}")
            if hasattr(e, 'detail'):
                print(f"Error detail: {e.detail}")
            if hasattr(e, 'code'):
                print(f"Error code: {e.code}")
                
            raise
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile by user_id"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                "id": "mock-id",
                "user_id": user_id,
                "email": "mock@example.com",
                "first_name": "Mock",
                "last_name": "User",
                "user_type": "founder",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.table("landing_page_user_profiles").select("*").eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return None
    
    async def update_user_profile(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user profile"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {**update_data, "id": "mock-id", "user_id": user_id, "updated_at": "2024-01-01T00:00:00Z"}
        
        try:
            response = self.supabase.table("landing_page_user_profiles").update(update_data).eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating user profile: {e}")
            return None
    
    async def get_all_users(self) -> list:
        """Get all user profiles"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return [
                {
                    "id": "mock-1",
                    "user_id": "user-1",
                    "email": "founder@example.com",
                    "first_name": "John",
                    "last_name": "Founder",
                    "user_type": "founder",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "id": "mock-2",
                    "user_id": "user-2",
                    "email": "investor@example.com",
                    "first_name": "Jane",
                    "last_name": "Investor",
                    "user_type": "investor",
                    "created_at": "2024-01-01T00:00:00Z"
                }
            ]
        
        try:
            response = self.supabase.table("landing_page_user_profiles").select("*").order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Error getting all users: {e}")
            return []
    
    async def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with Supabase Auth"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock user")
            return {
                "id": "mock-user-id",
                "email": email,
                "user_metadata": {
                    "first_name": "Mock",
                    "last_name": "User"
                }
            }
        
        try:
            response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            return response.user
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
    
    async def create_user(self, email: str, password: str, user_metadata: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new user with Supabase Auth"""
        if not self.supabase:
            print("Warning: Supabase not initialized, returning mock user")
            return {
                "id": "mock-user-id",
                "email": email,
                "user_metadata": user_metadata
            }
        
        try:
            response = self.supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": user_metadata
                }
            })
            return response.user
        except Exception as e:
            print(f"Error creating user: {e}")
            return None

# Global instance
supabase_service = SupabaseService() 
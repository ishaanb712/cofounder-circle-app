from typing import Dict, Any, Optional
from datetime import datetime
from app.services.supabase_service import supabase_service
from app.core.auth import verify_firebase_token
from app.schemas.user_profile import UserProfileCreate, UserProfileUpdate, UserProfileResponse

class UserProfileService:
    def __init__(self):
        self.supabase = supabase_service

    async def create_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user profile - BACKEND ONLY"""
        print(f"\n=== USER PROFILE SERVICE DEBUG ===")
        print(f"Input user_id: {user_id}")
        print(f"Input profile_data: {profile_data}")
        print(f"Input profile_data type: {type(profile_data)}")
        
        try:
            # Validate user_id format
            if not user_id or len(user_id) < 10:
                print(f"ERROR: Invalid user ID format - user_id: '{user_id}', length: {len(user_id) if user_id else 0}")
                raise ValueError("Invalid user ID format")

            print(f"User ID validation passed")

            # Prepare profile data without timestamps (database will handle them)
            prepared_profile_data = {
                "user_id": user_id,
                "email": profile_data.get("email"),
                "full_name": profile_data.get("full_name"),
                "avatar_url": profile_data.get("avatar_url"),
                "google_id": profile_data.get("google_id"),
                "user_type": profile_data.get("user_type", "student")
            }
            
            print(f"Prepared profile data: {prepared_profile_data}")
            print(f"Prepared data keys: {list(prepared_profile_data.keys())}")

            # Create profile in Supabase
            print(f"Calling supabase.create_user_profile...")
            result = await self.supabase.create_user_profile(prepared_profile_data)
            print(f"Supabase returned: {result}")
            
            if result:
                print(f"Profile creation successful")
                return {"success": True, "data": result}
            else:
                print(f"Profile creation failed - no result returned")
                return {"success": False, "error": "Failed to create profile"}
                
        except Exception as e:
            print(f"ERROR in user profile service: {e}")
            print(f"Error type: {type(e)}")
            print(f"Error class: {e.__class__.__name__}")
            print(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No __dict__'}")
            
            error_message = str(e)
            if hasattr(e, 'message'):
                error_message = e.message
            elif hasattr(e, 'detail'):
                error_message = e.detail
            return {"success": False, "error": f"Profile creation failed: {error_message}"}

    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile by ID - BACKEND ONLY"""
        try:
            # Validate user_id format
            if not user_id or len(user_id) < 10:
                raise ValueError("Invalid user ID format")

            # Get profile from Supabase
            profile = await self.supabase.get_user_profile(user_id)
            return profile
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return None

    async def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile - BACKEND ONLY"""
        try:
            # Validate user_id format
            if not user_id or len(user_id) < 10:
                raise ValueError("Invalid user ID format")

            # Don't set updated_at - database will handle it automatically
            # Remove updated_at from updates if it exists
            if "updated_at" in updates:
                del updates["updated_at"]

            # Update profile in Supabase
            result = await self.supabase.update_user_profile(user_id, updates)
            return {"success": True, "data": result}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def delete_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Delete user profile - BACKEND ONLY"""
        try:
            # Validate user_id format
            if not user_id or len(user_id) < 10:
                raise ValueError("Invalid user ID format")

            # Delete profile from Supabase
            result = await self.supabase.delete_user_profile(user_id)
            return {"success": True, "data": result}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def verify_and_get_profile(self, firebase_token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase token and get user profile - BACKEND ONLY"""
        try:
            # Verify Firebase token
            user_data = verify_firebase_token(firebase_token)
            if not user_data:
                return None

            # Get user profile
            profile = await self.get_user_profile(user_data["uid"])
            return profile
        except Exception as e:
            print(f"Error verifying token and getting profile: {e}")
            return None

# Create service instance
user_profile_service = UserProfileService() 
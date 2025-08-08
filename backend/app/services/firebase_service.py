# import firebase_admin
# from firebase_admin import credentials, auth, firestore
from app.core.config import settings
from typing import Optional, Dict, Any
import os

class FirebaseService:
    def __init__(self):
        # Firebase Admin SDK initialization commented out until credentials are available
        # try:
        #     # Initialize Firebase Admin SDK
        #     if not firebase_admin._apps:
        #         # Use service account key file if available
        #         if os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_KEY):
        #             cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_KEY)
        #         else:
        #             # Use environment variables for service account
        #             cred = credentials.Certificate({
        #                 "type": "service_account",
        #                 "project_id": settings.FIREBASE_PROJECT_ID,
        #                 "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
        #                 "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
        #                 "client_email": os.getenv("FIREBASE_CLIENT_EMAIL", ""),
        #                 "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
        #                 "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        #                 "token_uri": "https://oauth2.googleapis.com/token",
        #                 "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        #                 "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL", "")
        #             })
        #         
        #         firebase_admin.initialize_app(cred)
        #     
        #     self.db = firestore.client()
        #     self.auth = auth
        # except Exception as e:
        #     print(f"Warning: Could not initialize Firebase Admin SDK: {e}")
        #     self.db = None
        #     self.auth = None
        
        # Mock Firebase service for testing
        print("Firebase Admin SDK not initialized - using mock data")
        self.db = None
        self.auth = None
    
    async def create_user_profile(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a user profile in the user_profiles collection"""
        if not self.db:
            print("Warning: Firebase not initialized, returning mock data")
            return {**user_data, "id": "mock-id", "created_at": "2024-01-01T00:00:00Z"}
        
        try:
            doc_ref = self.db.collection('user_profiles').document(user_data['id'])
            doc_ref.set(user_data)
            return user_data
        except Exception as e:
            print(f"Error creating user profile: {e}")
            raise
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile by user_id"""
        if not self.db:
            print("Warning: Firebase not initialized, returning mock data")
            return {
                "id": "mock-id",
                "user_id": user_id,
                "email": "mock@example.com",
                "full_name": "Mock User",
                "user_type": "founder",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            doc_ref = self.db.collection('user_profiles').document(user_id)
            doc = doc_ref.get()
            return doc.to_dict() if doc.exists else None
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return None
    
    async def update_user_profile(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user profile"""
        if not self.db:
            print("Warning: Firebase not initialized, returning mock data")
            return {**update_data, "id": "mock-id", "user_id": user_id, "updated_at": "2024-01-01T00:00:00Z"}
        
        try:
            doc_ref = self.db.collection('user_profiles').document(user_id)
            doc_ref.update(update_data)
            return await self.get_user_profile(user_id)
        except Exception as e:
            print(f"Error updating user profile: {e}")
            return None
    
    async def get_all_users(self) -> list:
        """Get all user profiles"""
        if not self.db:
            print("Warning: Firebase not initialized, returning mock data")
            return [
                {
                    "id": "mock-1",
                    "user_id": "user-1",
                    "email": "founder@example.com",
                    "full_name": "John Founder",
                    "user_type": "founder",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "id": "mock-2",
                    "user_id": "user-2",
                    "email": "investor@example.com",
                    "full_name": "Jane Investor",
                    "user_type": "investor",
                    "created_at": "2024-01-01T00:00:00Z"
                }
            ]
        
        try:
            docs = self.db.collection('user_profiles').stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"Error getting all users: {e}")
            return []
    
    async def verify_id_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase ID token"""
        if not self.auth:
            print("Warning: Firebase Auth not initialized, returning mock user")
            return {
                "uid": "mock-user-id",
                "email": "mock@example.com",
                "display_name": "Mock User"
            }
        
        try:
            decoded_token = self.auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            print(f"Token verification error: {e}")
            return None
    
    async def get_user_by_uid(self, uid: str) -> Optional[Dict[str, Any]]:
        """Get user by UID from Firebase Auth"""
        if not self.auth:
            print("Warning: Firebase Auth not initialized, returning mock user")
            return {
                "uid": uid,
                "email": "mock@example.com",
                "display_name": "Mock User"
            }
        
        try:
            user_record = self.auth.get_user(uid)
            return {
                "uid": user_record.uid,
                "email": user_record.email,
                "display_name": user_record.display_name,
                "photo_url": user_record.photo_url
            }
        except Exception as e:
            print(f"Error getting user by UID: {e}")
            return None

# Global instance
firebase_service = FirebaseService() 
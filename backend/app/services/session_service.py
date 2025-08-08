import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from app.services.supabase_service import supabase_service
from app.core.config import settings

class SessionService:
    def __init__(self):
        self.supabase = supabase_service

    def create_session(self, user_id: str, ip_address: Optional[str] = None, 
                      user_agent: Optional[str] = None, device_info: Optional[str] = None) -> Dict[str, Any]:
        """
        Create a new session for a user
        """
        try:
            session_token = str(uuid.uuid4())
            
            session_data = {
                "user_id": user_id,
                "session_token": session_token,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "device_info": device_info,
                "is_active": True,
                "login_time": datetime.utcnow().isoformat()
            }
            
            if not self.supabase.supabase:
                print("Warning: Supabase not initialized, returning mock session")
                return {
                    "success": True,
                    "session_id": "mock-session-id",
                    "session_token": session_token,
                    "login_time": session_data["login_time"]
                }
            
            result = self.supabase.supabase.table("user_sessions").insert(session_data).execute()
            
            if result.data:
                return {
                    "success": True,
                    "session_id": result.data[0]["id"],
                    "session_token": session_token,
                    "login_time": result.data[0]["login_time"]
                }
            else:
                return {"success": False, "error": "Failed to create session"}
                
        except Exception as e:
            print(f"Error creating session: {e}")
            return {"success": False, "error": str(e)}

    def end_session(self, session_token: str) -> Dict[str, Any]:
        """
        End a session (logout)
        """
        try:
            if not self.supabase.supabase:
                print("Warning: Supabase not initialized, returning mock logout")
                return {"success": True, "logout_time": datetime.utcnow().isoformat()}
            
            result = self.supabase.supabase.table("user_sessions").update({
                "logout_time": datetime.utcnow().isoformat(),
                "is_active": False
            }).eq("session_token", session_token).execute()
            
            if result.data:
                return {"success": True, "logout_time": result.data[0]["logout_time"]}
            else:
                return {"success": False, "error": "Session not found"}
                
        except Exception as e:
            print(f"Error ending session: {e}")
            return {"success": False, "error": str(e)}

    def get_active_sessions(self, user_id: str) -> Dict[str, Any]:
        """
        Get all active sessions for a user
        """
        try:
            if not self.supabase.supabase:
                print("Warning: Supabase not initialized, returning mock sessions")
                return {
                    "success": True,
                    "sessions": [{
                        "id": "mock-session-1",
                        "user_id": user_id,
                        "session_token": "mock-token",
                        "is_active": True,
                        "login_time": datetime.utcnow().isoformat()
                    }]
                }
            
            result = self.supabase.supabase.table("user_sessions").select("*").eq("user_id", user_id).eq("is_active", True).execute()
            
            return {
                "success": True,
                "sessions": result.data
            }
                
        except Exception as e:
            print(f"Error getting active sessions: {e}")
            return {"success": False, "error": str(e)}

    def get_session_history(self, user_id: str, limit: int = 10) -> Dict[str, Any]:
        """
        Get session history for a user
        """
        try:
            if not self.supabase.supabase:
                print("Warning: Supabase not initialized, returning mock history")
                return {
                    "success": True,
                    "sessions": [{
                        "id": "mock-session-1",
                        "user_id": user_id,
                        "session_token": "mock-token",
                        "is_active": False,
                        "login_time": datetime.utcnow().isoformat(),
                        "logout_time": datetime.utcnow().isoformat()
                    }]
                }
            
            result = self.supabase.supabase.table("user_sessions").select("*").eq("user_id", user_id).order("login_time", desc=True).limit(limit).execute()
            
            return {
                "success": True,
                "sessions": result.data
            }
                
        except Exception as e:
            print(f"Error getting session history: {e}")
            return {"success": False, "error": str(e)}

    def validate_session(self, session_token: str) -> Dict[str, Any]:
        """
        Validate if a session is active
        """
        try:
            if not self.supabase.supabase:
                print("Warning: Supabase not initialized, returning mock validation")
                return {"success": True, "session": {
                    "id": "mock-session-id",
                    "session_token": session_token,
                    "is_active": True,
                    "login_time": datetime.utcnow().isoformat()
                }}
            
            result = self.supabase.supabase.table("user_sessions").select("*").eq("session_token", session_token).eq("is_active", True).execute()
            
            if result.data:
                return {"success": True, "session": result.data[0]}
            else:
                return {"success": False, "error": "Invalid or expired session"}
                
        except Exception as e:
            print(f"Error validating session: {e}")
            return {"success": False, "error": str(e)}

    def end_all_user_sessions(self, user_id: str) -> Dict[str, Any]:
        """
        End all active sessions for a user (force logout from all devices)
        """
        try:
            if not self.supabase.supabase:
                print("Warning: Supabase not initialized, returning mock logout all")
                return {"success": True, "sessions_ended": 1}
            
            result = self.supabase.supabase.table("user_sessions").update({
                "logout_time": datetime.utcnow().isoformat(),
                "is_active": False
            }).eq("user_id", user_id).eq("is_active", True).execute()
            
            return {
                "success": True,
                "sessions_ended": len(result.data) if result.data else 0
            }
                
        except Exception as e:
            print(f"Error ending all user sessions: {e}")
            return {"success": False, "error": str(e)}

session_service = SessionService() 
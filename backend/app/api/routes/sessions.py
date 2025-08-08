from fastapi import APIRouter, Depends, HTTPException, Request, Header
from typing import Dict, Any, Optional
from app.services.session_service import session_service
from app.services.user_profile_service import user_profile_service
from app.core.auth import verify_firebase_token

router = APIRouter(tags=["sessions"])

async def get_firebase_user_data(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Extract and verify Firebase token from Authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    user_data = verify_firebase_token(token)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return user_data

@router.post("/create")
async def create_session_auto(request: Request, user_data: Dict[str, Any] = Depends(get_firebase_user_data)):
    """
    Automatically create a new session when user logs in
    """
    try:
        user_id = user_data.get("uid")
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")
        
        # First, ensure user profile exists
        try:
            # Try to get existing profile
            profile_result = user_profile_service.get_user_profile(user_id)
            if not profile_result["success"]:
                # Profile doesn't exist, create it
                profile_data = {
                    "user_id": user_id,
                    "email": user_data.get("email"),
                    "full_name": user_data.get("name"),
                    "avatar_url": user_data.get("picture"),
                    "google_id": user_id,
                    "user_type": "student"  # Default type, can be updated later
                }
                
                create_result = user_profile_service.create_user_profile(user_id, profile_data)
                if not create_result["success"]:
                    print(f"Warning: Failed to create user profile: {create_result.get('error')}")
                    # Continue anyway, session creation might still work
        except Exception as profile_error:
            print(f"Warning: Error handling user profile: {profile_error}")
            # Continue with session creation anyway
        
        # Get client information
        client_ip = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        
        # Create session
        result = session_service.create_session(
            user_id=user_id,
            ip_address=client_ip,
            user_agent=user_agent,
            device_info=f"IP: {client_ip}, User-Agent: {user_agent}"
        )
        
        if result["success"]:
            return {
                "success": True,
                "session_token": result["session_token"],
                "login_time": result["login_time"],
                "message": "Session created successfully"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login_session(request: Request, user_data: Dict[str, Any] = Depends(get_firebase_user_data)):
    """
    Create a new session when user logs in
    """
    try:
        user_id = user_data.get("uid")
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")
        
        # Get client information
        client_ip = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        
        # Create session
        result = session_service.create_session(
            user_id=user_id,
            ip_address=client_ip,
            user_agent=user_agent,
            device_info=f"IP: {client_ip}, User-Agent: {user_agent}"
        )
        
        if result["success"]:
            return {
                "success": True,
                "session_token": result["session_token"],
                "login_time": result["login_time"],
                "message": "Session created successfully"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout_session(request: Request, user_data: Dict[str, Any] = Depends(get_firebase_user_data)):
    """
    End the current session when user logs out
    """
    try:
        session_token = request.headers.get("x-session-token")
        if not session_token:
            raise HTTPException(status_code=400, detail="Session token not provided")
        
        result = session_service.end_session(session_token)
        
        if result["success"]:
            return {
                "success": True,
                "logout_time": result["logout_time"],
                "message": "Session ended successfully"
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/active")
async def get_active_sessions(user_data: Dict[str, Any] = Depends(get_firebase_user_data)):
    """
    Get all active sessions for the current user
    """
    try:
        user_id = user_data.get("uid")
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")
        
        result = session_service.get_active_sessions(user_id)
        
        if result["success"]:
            return {
                "success": True,
                "sessions": result["sessions"],
                "count": len(result["sessions"])
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_session_history(user_data: Dict[str, Any] = Depends(get_firebase_user_data)):
    """
    Get session history for the current user
    """
    try:
        user_id = user_data.get("uid")
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")
        
        result = session_service.get_session_history(user_id)
        
        if result["success"]:
            return {
                "success": True,
                "sessions": result["sessions"],
                "count": len(result["sessions"])
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout-all")
async def logout_all_sessions(user_data: Dict[str, Any] = Depends(get_firebase_user_data)):
    """
    End all active sessions for the current user (force logout from all devices)
    """
    try:
        user_id = user_data.get("uid")
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")
        
        result = session_service.end_all_user_sessions(user_id)
        
        if result["success"]:
            return {
                "success": True,
                "sessions_ended": result["sessions_ended"],
                "message": f"Ended {result['sessions_ended']} active sessions"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/validate")
async def validate_session(request: Request):
    """
    Validate if a session token is active
    """
    try:
        session_token = request.headers.get("x-session-token")
        if not session_token:
            raise HTTPException(status_code=400, detail="Session token not provided")
        
        result = session_service.validate_session(session_token)
        
        if result["success"]:
            return {
                "success": True,
                "session": result["session"],
                "message": "Session is valid"
            }
        else:
            return {
                "success": False,
                "error": result["error"],
                "message": "Session is invalid or expired"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
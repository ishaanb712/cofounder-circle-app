from fastapi import APIRouter, HTTPException, Depends, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.services.user_profile_service import user_profile_service
from app.schemas.user_profile import (
    UserProfileRequest, 
    UserProfileUpdateRequest, 
    UserProfileResponse,
    FirebaseTokenRequest
)
from app.core.auth import verify_firebase_token

router = APIRouter(tags=["user-profiles"])
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase token and get current user - BACKEND ONLY"""
    print(f"\n=== GET CURRENT USER DEBUG ===")
    print(f"Credentials received: {credentials}")
    print(f"Credentials type: {type(credentials)}")
    
    try:
        token = credentials.credentials
        print(f"Extracted token: {token[:50]}..." if token else "No token")
        
        print(f"Calling verify_firebase_token...")
        user_data = verify_firebase_token(token)
        print(f"Firebase verification returned: {user_data}")
        
        if not user_data:
            print(f"ERROR: No user data returned from Firebase verification")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        print(f"User data verified successfully: {user_data}")
        return user_data
    except Exception as e:
        print(f"ERROR in get_current_user: {e}")
        print(f"Error type: {type(e)}")
        print(f"Error class: {e.__class__.__name__}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/create", response_model=dict)
async def create_user_profile(
    profile_data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """Create a new user profile - BACKEND ONLY"""
    print(f"\n=== CREATE ENDPOINT CALLED ===")
    print(f"Profile data received: {profile_data}")
    print(f"Profile data type: {type(profile_data)}")
    print(f"Profile data keys: {list(profile_data.keys()) if isinstance(profile_data, dict) else 'Not a dict'}")
    print(f"Current user: {current_user}")
    print(f"Current user uid: {current_user.get('uid')}")
    print(f"Current user email: {current_user.get('email')}")
    
    try:
        # Use the provided profile data, ensuring user_id matches current user
        if profile_data.get("user_id") != current_user["uid"]:
            profile_data["user_id"] = current_user["uid"]
        
        # Ensure required fields are present
        if not profile_data.get("email"):
            profile_data["email"] = current_user["email"]
        
        # Validate required fields
        required_fields = ["user_id", "email"]
        missing_fields = [field for field in required_fields if not profile_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Missing required fields: {missing_fields}"
            )
        
        print(f"Profile data prepared: {profile_data}")
        print(f"Calling user_profile_service.create_user_profile...")
        
        result = await user_profile_service.create_user_profile(
            current_user["uid"], 
            profile_data
        )
        
        print(f"Service returned: {result}")
        
        if not result["success"]:
            print(f"Service returned error: {result['error']}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result["error"]
            )
        
        print(f"Profile creation successful")
        return {"success": True, "message": "User profile created successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR in API route: {e}")
        print(f"Error type: {type(e)}")
        print(f"Error class: {e.__class__.__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user profile: {str(e)}"
        )

@router.get("/me", response_model=Optional[dict])
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user)
):
    """Get current user's profile - BACKEND ONLY"""
    try:
        profile = await user_profile_service.get_user_profile(current_user["uid"])
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        return profile
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user profile: {str(e)}"
        )

@router.put("/me", response_model=dict)
async def update_current_user_profile(
    request: UserProfileUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update current user's profile - BACKEND ONLY"""
    try:
        # Convert Pydantic model to dict
        updates = request.updates.dict(exclude_unset=True)
        
        result = await user_profile_service.update_user_profile(
            current_user["uid"], 
            updates
        )
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result["error"]
            )
        
        return {"success": True, "message": "User profile updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user profile: {str(e)}"
        )

@router.delete("/me", response_model=dict)
async def delete_current_user_profile(
    current_user: dict = Depends(get_current_user)
):
    """Delete current user's profile - BACKEND ONLY"""
    try:
        result = await user_profile_service.delete_user_profile(current_user["uid"])
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result["error"]
            )
        
        return {"success": True, "message": "User profile deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user profile: {str(e)}"
        )

@router.post("/verify", response_model=dict)
async def verify_token_and_get_profile(
    request: FirebaseTokenRequest
):
    """Verify Firebase token and get user profile - BACKEND ONLY"""
    try:
        user_data = verify_firebase_token(request.firebase_token)
        
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase token"
            )
        
        profile = await user_profile_service.get_user_profile(user_data["uid"])
        
        return {
            "success": True,
            "user": user_data,
            "profile": profile
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token verification failed: {str(e)}"
        ) 
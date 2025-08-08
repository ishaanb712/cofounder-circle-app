from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import Response
import uvicorn
from dotenv import load_dotenv
import os

# Load environment variables FIRST
load_dotenv()

from app.api.routes import auth, users, students, founders, mentors, vendors, working_professionals, user_profiles, sessions
from app.core.config import settings
from app.core.performance import PerformanceMiddleware

# Custom middleware to handle COOP headers
class COOPMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        # Set COOP header to allow popups for OAuth flows
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
        return response

app = FastAPI(
    title="StartupConnect API",
    description="Backend API for StartupConnect platform connecting founders, investors, mentors, and service providers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add performance middleware first
app.add_middleware(PerformanceMiddleware)

# Add COOP middleware
app.add_middleware(COOPMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL, 
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(founders.router, prefix="/api/founders", tags=["Founders"])
app.include_router(mentors.router, prefix="/api/mentors", tags=["Mentors"])
app.include_router(vendors.router, prefix="/api/vendors", tags=["Vendors"])
app.include_router(working_professionals.router, prefix="/api/working-professionals", tags=["Working Professionals"])
app.include_router(user_profiles.router, prefix="/api/user-profiles", tags=["User Profiles"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])

@app.get("/")
async def root():
    return {
        "message": "StartupConnect API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "StartupConnect API is running",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.get("/test")
async def test_endpoint():
    print("=== TEST ENDPOINT CALLED ===")
    print("Backend is receiving requests!")
    return {
        "message": "Test endpoint working",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.get("/test-supabase")
async def test_supabase():
    """Test Supabase connectivity and table structure"""
    from app.services.supabase_service import supabase_service
    
    try:
        # Test basic connectivity
        if not supabase_service.supabase:
            return {
                "status": "error",
                "message": "Supabase client not initialized"
            }
        
        # Test user_profiles table
        try:
            response = supabase_service.supabase.table("landing_page_user_profiles").select("count", count="exact").limit(1).execute()
            user_profiles_ok = True
        except Exception as e:
            user_profiles_ok = False
            user_profiles_error = str(e)
        
        # Test user_sessions table
        try:
            response = supabase_service.supabase.table("user_sessions").select("count", count="exact").limit(1).execute()
            user_sessions_ok = True
        except Exception as e:
            user_sessions_ok = False
            user_sessions_error = str(e)
        
        return {
            "status": "success",
            "supabase_initialized": True,
            "tables": {
                "landing_page_user_profiles": {
                    "status": "ok" if user_profiles_ok else "error",
                    "error": user_profiles_error if not user_profiles_ok else None
                },
                "user_sessions": {
                    "status": "ok" if user_sessions_ok else "error", 
                    "error": user_sessions_error if not user_sessions_ok else None
                }
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Supabase test failed: {str(e)}"
        }

@app.get("/test-profile-creation")
async def test_profile_creation():
    """Test user profile creation with mock data"""
    from app.services.user_profile_service import user_profile_service
    import uuid
    
    try:
        # Mock user data with unique ID
        mock_user_id = f"test-user-{uuid.uuid4().hex[:8]}"
        mock_profile_data = {
            "user_id": mock_user_id,
            "email": f"test-{mock_user_id}@example.com",
            "full_name": "Test User",
            "avatar_url": "https://example.com/avatar.jpg",
            "google_id": f"test-google-{mock_user_id}",
            "user_type": "student"
        }
        
        result = await user_profile_service.create_user_profile(mock_user_id, mock_profile_data)
        
        return {
            "status": "success" if result["success"] else "error",
            "result": result,
            "test_data": mock_profile_data
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Profile creation test failed: {str(e)}"
        }

@app.get("/test-session-creation")
async def test_session_creation():
    """Test session creation with mock data"""
    from app.services.session_service import session_service
    
    try:
        # Mock user data
        mock_user_id = "test-user-123"
        
        result = session_service.create_session(
            user_id=mock_user_id,
            ip_address="127.0.0.1",
            user_agent="Test User Agent",
            device_info="Test Device"
        )
        
        return {
            "status": "success" if result["success"] else "error",
            "result": result,
            "test_data": {
                "user_id": mock_user_id,
                "ip_address": "127.0.0.1",
                "user_agent": "Test User Agent"
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Session creation test failed: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from app.schemas.user import TokenData
import firebase_admin
from firebase_admin import auth, credentials

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token security
security = HTTPBearer()

# Initialize Firebase Admin SDK
try:
    print(f"Initializing Firebase Admin SDK...")
    print(f"Service account key path: {settings.FIREBASE_SERVICE_ACCOUNT_KEY}")
    
    # Check if file exists
    import os
    if not os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_KEY):
        print(f"ERROR: Firebase service account key file not found at {settings.FIREBASE_SERVICE_ACCOUNT_KEY}")
        raise FileNotFoundError(f"Firebase service account key file not found")
    
    print(f"Firebase service account key file exists")
    cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_KEY)
    print(f"Firebase credentials loaded successfully")
    
    firebase_admin.initialize_app(cred)
    print(f"Firebase Admin SDK initialized successfully")
    
except Exception as e:
    print(f"Firebase Admin SDK initialization error: {e}")
    print(f"Error type: {type(e)}")
    print(f"Error class: {e.__class__.__name__}")
    # For development, we'll handle this gracefully
    pass

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def verify_firebase_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify Firebase ID token and return user data - BACKEND ONLY"""
    print(f"\n=== FIREBASE TOKEN VERIFICATION DEBUG ===")
    print(f"Token received: {token[:50]}..." if token else "No token")
    print(f"Token type: {type(token)}")
    
    # Check if Firebase Admin SDK is initialized
    try:
        # Try to get the default app
        app = firebase_admin.get_app()
        print(f"Firebase Admin SDK is initialized")
    except ValueError:
        print(f"ERROR: Firebase Admin SDK is not initialized")
        print(f"Firebase token verification will fail")
        return None
    
    try:
        # Verify the token with Firebase Admin SDK
        print(f"Calling auth.verify_id_token...")
        decoded_token = auth.verify_id_token(token)
        print(f"Token verification successful")
        print(f"Decoded token keys: {list(decoded_token.keys())}")
        
        # Extract user information
        user_data = {
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name"),
            "picture": decoded_token.get("picture"),
            "email_verified": decoded_token.get("email_verified", False),
            "provider_id": decoded_token.get("firebase", {}).get("sign_in_provider")
        }
        
        print(f"Extracted user data: {user_data}")
        return user_data
    except Exception as e:
        print(f"Firebase token verification error: {e}")
        print(f"Error type: {type(e)}")
        print(f"Error class: {e.__class__.__name__}")
        return None

def create_access_token(data: dict, expires_delta: Optional[int] = None):
    """Create JWT access token - BACKEND ONLY"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str):
    """Verify JWT token - BACKEND ONLY"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except jwt.PyJWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(credentials.credentials)
    if token_data is None:
        raise credentials_exception
    
    return token_data 
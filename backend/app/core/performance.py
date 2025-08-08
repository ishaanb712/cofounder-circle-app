import time
import functools
from typing import Callable, Any
from fastapi import Request, Response
from fastapi.middleware.base import BaseHTTPMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PerformanceMiddleware(BaseHTTPMiddleware):
    """Middleware to track request performance"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log performance metrics
        logger.info(f"{request.method} {request.url.path} - {duration:.3f}s")
        
        # Add performance headers
        response.headers["X-Response-Time"] = f"{duration:.3f}s"
        
        return response

def cache_result(ttl: int = 300):
    """Decorator to cache function results"""
    def decorator(func: Callable) -> Callable:
        cache = {}
        
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Create cache key
            key = f"{func.__name__}:{hash(str(args) + str(sorted(kwargs.items())))}"
            
            # Check cache
            if key in cache:
                result, timestamp = cache[key]
                if time.time() - timestamp < ttl:
                    return result
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Cache result
            cache[key] = (result, time.time())
            
            return result
        
        return wrapper
    return decorator

def measure_time(func: Callable) -> Callable:
    """Decorator to measure function execution time"""
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        duration = time.time() - start_time
        
        logger.info(f"{func.__name__} executed in {duration:.3f}s")
        return result
    
    return wrapper

class DatabaseQueryOptimizer:
    """Utility class for optimizing database queries"""
    
    @staticmethod
    def optimize_select_query(fields: list, table: str, conditions: dict = None) -> str:
        """Generate optimized SELECT query"""
        query = f"SELECT {', '.join(fields)} FROM {table}"
        
        if conditions:
            where_clauses = [f"{k} = %s" for k in conditions.keys()]
            query += f" WHERE {' AND '.join(where_clauses)}"
        
        return query
    
    @staticmethod
    def add_pagination(query: str, page: int = 1, limit: int = 20) -> str:
        """Add pagination to query"""
        offset = (page - 1) * limit
        return f"{query} LIMIT {limit} OFFSET {offset}"

class ResponseOptimizer:
    """Utility class for optimizing API responses"""
    
    @staticmethod
    def compress_response(data: Any) -> dict:
        """Compress response data by removing unnecessary fields"""
        if isinstance(data, dict):
            return {k: v for k, v in data.items() if v is not None}
        return data
    
    @staticmethod
    def add_cache_headers(response: Response, max_age: int = 300):
        """Add caching headers to response"""
        response.headers["Cache-Control"] = f"public, max-age={max_age}"
        response.headers["ETag"] = f'"{hash(str(response.body))}"'
        return response 
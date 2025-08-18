from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from app.services.location_service import location_service

router = APIRouter(tags=["locations"])

@router.get("/countries", response_model=List[str])
async def get_countries():
    """Get all available countries"""
    try:
        countries = await location_service.get_countries()
        return countries
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch countries: {str(e)}")

@router.get("/states", response_model=List[str])
async def get_states(country: str = Query(..., description="Country name")):
    """Get states for a specific country"""
    try:
        states = await location_service.get_states(country)
        return states
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch states: {str(e)}")

@router.get("/cities", response_model=List[str])
async def get_cities(state: str = Query(..., description="State name")):
    """Get cities for a specific state"""
    try:
        cities = await location_service.get_cities(state)
        return cities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch cities: {str(e)}")

@router.get("/popular-cities", response_model=List[str])
async def get_popular_cities():
    """Get popular cities for quick selection"""
    try:
        cities = await location_service.get_popular_cities()
        return cities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch popular cities: {str(e)}")

@router.get("/search", response_model=List[Dict])
async def search_locations(
    query: str = Query(..., description="Search query"),
    limit: int = Query(10, description="Maximum number of results", ge=1, le=50)
):
    """Search for locations by query"""
    try:
        results = await location_service.search_locations(query, limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search locations: {str(e)}")

@router.get("/hierarchy", response_model=Dict)
async def get_location_hierarchy():
    """Get the complete location hierarchy (for admin use)"""
    try:
        hierarchy = await location_service.get_location_hierarchy()
        return hierarchy
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch location hierarchy: {str(e)}") 
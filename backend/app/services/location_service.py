from typing import Dict, List, Optional
import json
from fastapi import HTTPException
import os

class LocationService:
    def __init__(self):
        self._cache = {}
        self._load_location_data()
    
    def _load_location_data(self):
        """Load location data from JSON file or use default data"""
        try:
            # Try to load from file first
            data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'locations.json')
            if os.path.exists(data_path):
                with open(data_path, 'r', encoding='utf-8') as f:
                    self._cache = json.load(f)
            else:
                # Use default data if file doesn't exist
                self._cache = self._get_default_location_data()
        except Exception as e:
            print(f"Error loading location data: {e}")
            self._cache = self._get_default_location_data()
    
    def _get_default_location_data(self) -> Dict:
        """Default location data for India and major countries"""
        return {
            "countries": [
                "India",
                "United States",
                "United Kingdom",
                "Canada",
                "Australia",
                "Germany",
                "France",
                "Singapore",
                "Japan",
                "South Korea"
            ],
            "states": {
                "India": [
                    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
                    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
                    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
                    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
                    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
                    "Uttar Pradesh", "Uttarakhand", "West Bengal",
                    "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh",
                    "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep",
                    "Puducherry", "Andaman and Nicobar Islands"
                ],
                "United States": [
                    "Alabama", "Alaska", "Arizona", "Arkansas", "California",
                    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
                    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
                    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
                    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
                    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
                    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
                    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
                    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
                    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
                ]
            },
            "cities": {
                "Maharashtra": [
                    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik",
                    "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded"
                ],
                "Delhi": [
                    "New Delhi", "Delhi", "Gurgaon", "Noida", "Faridabad",
                    "Ghaziabad", "Greater Noida", "Sonipat", "Panipat", "Karnal"
                ],
                "Karnataka": [
                    "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum",
                    "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"
                ],
                "Tamil Nadu": [
                    "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli",
                    "Vellore", "Erode", "Tiruppur", "Dindigul", "Thanjavur"
                ],
                "Telangana": [
                    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam",
                    "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Siddipet"
                ],
                "Gujarat": [
                    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar",
                    "Jamnagar", "Gandhinagar", "Anand", "Bharuch", "Valsad"
                ],
                "Uttar Pradesh": [
                    "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi",
                    "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad"
                ],
                "West Bengal": [
                    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri",
                    "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur"
                ],
                "Rajasthan": [
                    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer",
                    "Udaipur", "Bhilwara", "Alwar", "Sri Ganganagar", "Sikar"
                ],
                "Punjab": [
                    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda",
                    "Hoshiarpur", "Mohali", "Moga", "Firozpur", "Sangrur"
                ]
            },
            "popular_cities": [
                "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
                "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
                "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
                "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara"
            ]
        }
    
    async def get_countries(self) -> List[str]:
        """Get all available countries"""
        return self._cache.get("countries", [])
    
    async def get_states(self, country: str) -> List[str]:
        """Get states for a specific country"""
        states = self._cache.get("states", {}).get(country, [])
        return sorted(states)
    
    async def get_cities(self, state: str) -> List[str]:
        """Get cities for a specific state"""
        cities = self._cache.get("cities", {}).get(state, [])
        return sorted(cities)
    
    async def get_popular_cities(self) -> List[str]:
        """Get popular cities for quick selection"""
        return self._cache.get("popular_cities", [])
    
    async def search_locations(self, query: str, limit: int = 10) -> List[Dict]:
        """Search for locations by query"""
        results = []
        query_lower = query.lower()
        
        # Search in countries
        for country in self._cache.get("countries", []):
            if query_lower in country.lower():
                results.append({"type": "country", "name": country, "value": country})
        
        # Search in states
        for country, states in self._cache.get("states", {}).items():
            for state in states:
                if query_lower in state.lower():
                    results.append({
                        "type": "state",
                        "name": f"{state}, {country}",
                        "value": state,
                        "country": country
                    })
        
        # Search in cities
        for state, cities in self._cache.get("cities", {}).items():
            for city in cities:
                if query_lower in city.lower():
                    results.append({
                        "type": "city",
                        "name": f"{city}, {state}",
                        "value": city,
                        "state": state
                    })
        
        # Return limited results
        return results[:limit]
    
    async def get_location_hierarchy(self) -> Dict:
        """Get the complete location hierarchy"""
        return self._cache

# Create a singleton instance
location_service = LocationService() 
from app.services.supabase_service import supabase_service
from typing import Optional, Dict, Any, List

class StudentService:
    def __init__(self):
        self.supabase = supabase_service
    
    async def create_student(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new student record"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                **student_data,
                "user_id": "mock-student-id",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            print(f"Creating student record in Supabase: {student_data}")
            response = self.supabase.supabase.table("landing_student").insert(student_data).execute()
            
            if response.data:
                result = response.data[0]
                print(f"Successfully created student with ID: {result.get('id')}")
                
                # Convert phone back to string for the response
                if 'phone' in result and isinstance(result['phone'], int):
                    result['phone'] = str(result['phone'])
                
                return result
            else:
                print("No data returned from insert")
                return None
                
        except Exception as e:
            print(f"Error creating student: {e}")
            raise
    
    async def get_student(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get student by user_id"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {
                "user_id": user_id,
                "name": "Mock Student",
                "email": "mock@student.com",
                "college": "Mock University",
                "phone": "1234567890",
                "year": 2024,
                "course": "Computer Science",
                "city": "Mock City",
                "career_goals": ["Internship", "Project"],
                "interest_area": ["Tech", "Product"],
                "interest_level": "Curious",
                "created_at": "2024-01-01T00:00:00Z"
            }
        
        try:
            response = self.supabase.supabase.table("landing_student").select("*").eq("user_id", user_id).execute()
            if response.data:
                result = response.data[0]
                # Convert phone back to string for the response
                if 'phone' in result and isinstance(result['phone'], int):
                    result['phone'] = str(result['phone'])
                return result
            return None
        except Exception as e:
            print(f"Error getting student: {e}")
            return None
    
    async def update_student(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update student record"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return {**update_data, "user_id": user_id, "updated_at": "2024-01-01T00:00:00Z"}
        
        try:
            response = self.supabase.supabase.table("landing_student").update(update_data).eq("user_id", user_id).execute()
            if response.data:
                result = response.data[0]
                # Convert phone back to string for the response
                if 'phone' in result and isinstance(result['phone'], int):
                    result['phone'] = str(result['phone'])
                return result
            return None
        except Exception as e:
            print(f"Error updating student: {e}")
            return None
    
    async def get_all_students(self) -> List[Dict[str, Any]]:
        """Get all students"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock data")
            return [
                {
                    "user_id": "student-1",
                    "name": "John Student",
                    "email": "john@student.com",
                    "college": "Stanford University",
                    "phone": "1234567890",
                    "year": 2024,
                    "course": "Computer Science",
                    "city": "Stanford",
                    "career_goals": ["Internship", "Project"],
                    "interest_area": ["Tech", "Product"],
                    "interest_level": "Curious",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "user_id": "student-2",
                    "name": "Sarah Student",
                    "email": "sarah@student.com",
                    "college": "MIT",
                    "phone": "9876543210",
                    "year": 2024,
                    "course": "Engineering",
                    "city": "Cambridge",
                    "career_goals": ["Job", "Side Hustle"],
                    "interest_area": ["Operations", "Design"],
                    "interest_level": "Want to join one",
                    "created_at": "2024-01-01T00:00:00Z"
                }
            ]
        
        try:
            response = self.supabase.supabase.table("landing_student").select("*").order("created_at", desc=True).execute()
            # Convert phone back to string for all results
            for result in response.data:
                if 'phone' in result and isinstance(result['phone'], int):
                    result['phone'] = str(result['phone'])
            return response.data
        except Exception as e:
            print(f"Error getting all students: {e}")
            return []
    
    async def delete_student(self, user_id: str) -> bool:
        """Delete student record"""
        if not self.supabase.supabase:
            print("Warning: Supabase not initialized, returning mock success")
            return True
        
        try:
            self.supabase.supabase.table("landing_student").delete().eq("user_id", user_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting student: {e}")
            return False

    async def create_student_from_form_data(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create student record from multi-step form data"""
        student_data = {
            "user_id": form_data.get("user_id"),
            "name": form_data.get("name"),
            "email": form_data.get("email"),
            "phone": form_data.get("phone"),
            "college": form_data.get("college"),
            "year": form_data.get("year"),
            "course": form_data.get("course"),
            "city": form_data.get("city"),
            "career_goals": form_data.get("career_goals", []),
            "interest_area": form_data.get("interest_area", []),
            "interest_level": form_data.get("interest_level"),
            "resume_url": form_data.get("resume_url"),
            "linkedin_url": form_data.get("linkedin_url"),
            "github_url": form_data.get("github_url"),
            "portfolio_url": form_data.get("portfolio_url"),
            "availability": form_data.get("availability"),
            "payment_terms": form_data.get("payment_terms"),
            "location_preference": form_data.get("location_preference"),
            "extra_text": form_data.get("extra_text"),
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
        
        return await self.create_student(student_data)

# Global instance
student_service = StudentService() 
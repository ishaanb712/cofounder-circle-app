from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
import os
from typing import Optional

router = APIRouter()

class SearchRequest(BaseModel):
    user_input: str

class SearchResponse(BaseModel):
    role: str
    redirect_url: str
    confidence: Optional[float] = None

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")
print(f"OpenAI API Key set: {'Yes' if openai.api_key else 'No'}")  # Debug log

# Role mapping
ROLE_URLS = {
    "student": "/student",
    "founder": "/founder", 
    "mentor": "/mentor",
    "vendor": "/vendor",
    "working professional": "/professional"
}

@router.post("/ai-search", response_model=SearchResponse)
async def ai_search(request: SearchRequest):
    """
    Analyze user input using OpenAI to determine their role and redirect accordingly
    """
    try:
        print(f"Starting AI search for input: '{request.user_input}'")  # Debug log
        # Prepare the prompt for role classification
        system_prompt = """You are a role classifier for a startup ecosystem platform. 
        Analyze the user's input and determine which category they belong to. 
        Return only one of these exact categories: "student", "founder", "mentor", "vendor", "working professional"
        
        Consider these guidelines:
        - "student": Looking for internships, learning opportunities, career guidance, academic projects
        - "founder": Starting a business, looking for co-founders, investors, startup resources
        - "mentor": Wanting to share expertise, guide others, teach, provide advice
        - "vendor": Providing services, looking for clients, business partnerships
        - "working professional": Career advancement, job opportunities, professional networking
        
        Return only the category name, nothing else."""

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.user_input}
            ],
            max_tokens=10,
            temperature=0.1
        )

        # Extract the classified role
        classified_role = response.choices[0].message.content.strip().lower()
        print(f"OpenAI Response: '{classified_role}'")  # Debug log
        print(f"User Input: '{request.user_input}'")    # Debug log
        
        # Validate the response
        if classified_role not in ROLE_URLS:
            print(f"Invalid role '{classified_role}', falling back to student")  # Debug log
            # Fallback to student if classification is unclear
            classified_role = "student"
        
        # Get the redirect URL
        redirect_url = ROLE_URLS[classified_role]
        
        return SearchResponse(
            role=classified_role,
            redirect_url=redirect_url,
            confidence=0.9  # We can add confidence scoring later if needed
        )
        
    except Exception as e:
        print(f"Error in AI search: {str(e)}")
        # Fallback response
        return SearchResponse(
            role="student",
            redirect_url="/student",
            confidence=0.0
        ) 
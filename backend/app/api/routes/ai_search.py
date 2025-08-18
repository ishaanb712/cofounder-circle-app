from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
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
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
print(f"OpenAI API Key set: {'Yes' if os.getenv("OPENAI_API_KEY") else 'No'}")  # Debug log

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
        system_prompt = """You are an AI assistant for The CoFounder Circle, a comprehensive startup ecosystem platform that connects different stakeholders in the startup world.

## PLATFORM OVERVIEW:
The CoFounder Circle is a unified platform that brings together students, founders, mentors, vendors, and working professionals to create a thriving startup ecosystem. Each user type has access to specific resources, networks, and opportunities tailored to their needs and goals.

## USER CATEGORIES AND THEIR FUNCTIONALITY:

### STUDENTS (/student)
- **Primary Focus**: Learning, skill development, and career preparation
- **Key Features**: Mentorship programs, internship opportunities, career guidance, skill development workshops
- **Ideal For**: Students seeking to learn about entrepreneurship, gain practical experience, find mentors, or prepare for their career journey
- **Examples**: "I'm a student looking for an internship", "I want to learn about startups", "I need career guidance"

### FOUNDERS (/founder)  
- **Primary Focus**: Building and scaling startups, finding resources and connections
- **Key Features**: Investor network, mentorship from experienced entrepreneurs, startup resources, funding opportunities, co-founder matching
- **Ideal For**: Anyone actively building a startup, seeking funding, looking for co-founders, or needing startup-specific resources
- **Examples**: "I'm building a startup", "I need investors", "I want to find a co-founder", "I'm starting a business"

### MENTORS (/mentor)
- **Primary Focus**: Sharing expertise, guiding others, and making investments
- **Key Features**: Mentorship programs, expert network, knowledge sharing platforms, investment opportunities
- **Ideal For**: Experienced professionals wanting to mentor, investors looking for opportunities, experts wanting to share knowledge
- **Examples**: "I want to mentor students", "I'm an investor looking for startups", "I want to share my expertise"

### VENDORS (/vendor)
- **Primary Focus**: Providing services and growing business with startup clients
- **Key Features**: Startup network, business growth opportunities, quality leads, service partnerships
- **Ideal For**: Service providers, suppliers, distributors, and businesses looking to work with startups
- **Examples**: "I provide services to startups", "I'm looking for startup clients", "I supply products to businesses"

### WORKING PROFESSIONALS (/professional)
- **Primary Focus**: Career advancement and professional networking
- **Key Features**: Career growth opportunities, professional network, skill development, global job opportunities
- **Ideal For**: Professionals seeking career advancement, job opportunities, or professional networking
- **Examples**: "I'm looking for a new job", "I want to advance my career", "I'm a freelancer"

## CLASSIFICATION GUIDELINES:
Analyze the user's input holistically, considering:
1. **Current Status**: What they currently are (student, professional, etc.)
2. **Primary Goal**: What they want to achieve (learn, build, mentor, provide services, advance career)
3. **Intent**: Their main motivation and desired outcome
4. **Context**: The broader context of their needs and aspirations

## DECISION FRAMEWORK:
- If someone mentions building/starting a business → FOUNDER (regardless of current status)
- If someone wants to learn/study/develop skills → STUDENT (regardless of current status)  
- If someone wants to teach/mentor/invest → MENTOR
- If someone wants to provide services/products → VENDOR
- If someone wants career advancement/jobs → WORKING PROFESSIONAL

Return only one of these exact categories: "student", "founder", "mentor", "vendor", "working professional"
Nothing else."""

        # Call OpenAI API
        response = client.chat.completions.create(
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
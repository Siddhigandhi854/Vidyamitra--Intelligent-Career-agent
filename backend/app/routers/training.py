from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.routers.auth import get_current_user, User
from app.services.gemini_service import gemini_service


router = APIRouter(prefix="/training", tags=["training"])


class TrainingPlanRequest(BaseModel):
    current_role: str
    target_role: str
    experience_level: str
    skills: List[str]
    goals: List[str]
    timeline: str  # e.g., "3 months", "6 months", "1 year"


class TrainingModule(BaseModel):
    id: int
    title: str
    description: str
    duration_weeks: int
    difficulty: str
    skills_covered: List[str]
    resources: List[str]
    prerequisites: List[str]
    outcomes: List[str]


class TrainingPlanResponse(BaseModel):
    plan_id: str
    user_profile: dict
    modules: List[TrainingModule]
    timeline_months: int
    estimated_hours: int
    success_metrics: List[str]
    next_steps: List[str]


@router.post("/generate-plan", response_model=TrainingPlanResponse)
async def generate_training_plan(
    request: TrainingPlanRequest, current_user: User = Depends(get_current_user)
) -> TrainingPlanResponse:
    """Generate personalized training plan using Gemini AI"""
    
    try:
        # Generate training plan using Gemini
        prompt = f"""
        Create a comprehensive training plan for someone transitioning from {request.current_role} to {request.target_role}.
        
        Current Profile:
        - Experience Level: {request.experience_level}
        - Current Skills: {', '.join(request.skills)}
        - Goals: {', '.join(request.goals)}
        - Timeline: {request.timeline}
        
        Return a JSON response with this exact format:
        {{
            "modules": [
                {{
                    "title": "Module Title",
                    "description": "Detailed description of what this module covers",
                    "duration_weeks": 4,
                    "difficulty": "Beginner/Intermediate/Advanced",
                    "skills_covered": ["skill1", "skill2", "skill3"],
                    "resources": ["Resource 1", "Resource 2", "Resource 3"],
                    "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
                    "outcomes": ["Outcome 1", "Outcome 2"]
                }}
            ],
            "timeline_months": 6,
            "estimated_hours": 120,
            "success_metrics": ["Metric 1", "Metric 2", "Metric 3"],
            "next_steps": ["Step 1", "Step 2", "Step 3"]
        }}
        
        Requirements:
        1. Create 4-6 modules that build on each other
        2. Each module should be 2-6 weeks
        3. Include practical, real-world skills
        4. Provide specific resources (courses, books, projects)
        5. Make it achievable within the timeline
        6. Focus on skills needed for {request.target_role}
        """
        
        response = gemini_service.generate_content(prompt, temperature=0.7, max_tokens=2000)
        
        if not response:
            raise HTTPException(status_code=500, detail="Failed to generate training plan")
        
        # Parse the response
        import json
        try:
            plan_data = json.loads(response)
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Raw response: {response}")
            # Fallback to basic plan
            return _get_fallback_training_plan(request, current_user)
        
        # Convert to our model format
        modules = []
        for i, module_data in enumerate(plan_data["modules"]):
            modules.append(TrainingModule(
                id=i + 1,
                title=module_data["title"],
                description=module_data["description"],
                duration_weeks=module_data["duration_weeks"],
                difficulty=module_data["difficulty"],
                skills_covered=module_data["skills_covered"],
                resources=module_data["resources"],
                prerequisites=module_data["prerequisites"],
                outcomes=module_data["outcomes"]
            ))
        
        return TrainingPlanResponse(
            plan_id=f"plan_{current_user.username}_{hash(str(request)) % 10000}",
            user_profile={
                "current_role": request.current_role,
                "target_role": request.target_role,
                "experience_level": request.experience_level,
                "skills": request.skills,
                "goals": request.goals,
                "timeline": request.timeline
            },
            modules=modules,
            timeline_months=plan_data["timeline_months"],
            estimated_hours=plan_data["estimated_hours"],
            success_metrics=plan_data["success_metrics"],
            next_steps=plan_data["next_steps"]
        )
        
    except Exception as e:
        print(f"Error generating training plan: {e}")
        # Fallback to curated plan
        return _get_fallback_training_plan(request, current_user)


@router.get("/career-paths")
async def get_career_paths(current_user: User = Depends(get_current_user)) -> dict:
    """Get available career transition paths"""
    return {
        "popular_transitions": [
            {
                "from": "Software Developer",
                "to": "Data Scientist",
                "duration_months": 6,
                "difficulty": "Intermediate",
                "key_skills": ["Python", "Statistics", "Machine Learning", "Data Visualization"]
            },
            {
                "from": "Software Developer", 
                "to": "DevOps Engineer",
                "duration_months": 4,
                "difficulty": "Intermediate",
                "key_skills": ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms"]
            },
            {
                "from": "Data Scientist",
                "to": "ML Engineer",
                "duration_months": 5,
                "difficulty": "Advanced",
                "key_skills": ["MLOps", "Model Deployment", "System Design", "Optimization"]
            },
            {
                "from": "Software Developer",
                "to": "Product Manager",
                "duration_months": 8,
                "difficulty": "Intermediate",
                "key_skills": ["User Research", "Market Analysis", "Roadmap Planning", "Stakeholder Management"]
            },
            {
                "from": "Any Role",
                "to": "Full Stack Developer",
                "duration_months": 6,
                "difficulty": "Intermediate",
                "key_skills": ["Frontend", "Backend", "Database", "DevOps"]
            }
        ],
        "skill_domains": [
            {
                "name": "Web Development",
                "roles": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
                "core_skills": ["JavaScript", "React/Vue/Angular", "Node.js", "Databases"]
            },
            {
                "name": "Data Science",
                "roles": ["Data Scientist", "Data Analyst", "ML Engineer"],
                "core_skills": ["Python", "Statistics", "Machine Learning", "SQL"]
            },
            {
                "name": "DevOps",
                "roles": ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer"],
                "core_skills": ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms"]
            },
            {
                "name": "Product Management",
                "roles": ["Product Manager", "Product Owner", "Program Manager"],
                "core_skills": ["User Research", "Analytics", "Communication", "Strategy"]
            }
        ]
    }


@router.get("/resources/{skill}")
async def get_learning_resources(skill: str, current_user: User = Depends(get_current_user)) -> dict:
    """Get learning resources for a specific skill"""
    
    resources = {
        "Python": {
            "courses": [
                {"title": "Python for Data Science", "provider": "Coursera", "duration": "8 weeks", "level": "Beginner"},
                {"title": "Complete Python Bootcamp", "provider": "Udemy", "duration": "12 weeks", "level": "Beginner"},
                {"title": "Advanced Python", "provider": "edX", "duration": "6 weeks", "level": "Advanced"}
            ],
            "books": [
                {"title": "Python Crash Course", "author": "Eric Matthes", "pages": 544},
                {"title": "Fluent Python", "author": "Luciano Ramalho", "pages": 770}
            ],
            "projects": [
                {"title": "Build a Web Scraper", "difficulty": "Beginner", "time": "2 days"},
                {"title": "Data Analysis Dashboard", "difficulty": "Intermediate", "time": "1 week"},
                {"title": "Machine Learning Model", "difficulty": "Advanced", "time": "2 weeks"}
            ]
        },
        "JavaScript": {
            "courses": [
                {"title": "JavaScript Algorithms and Data Structures", "provider": "freeCodeCamp", "duration": "6 weeks", "level": "Intermediate"},
                {"title": "The Complete JavaScript Course", "provider": "Udemy", "duration": "10 weeks", "level": "Beginner"}
            ],
            "books": [
                {"title": "Eloquent JavaScript", "author": "Marijn Haverbeke", "pages": 472},
                {"title": "You Don't Know JS", "author": "Kyle Simpson", "pages": 278}
            ],
            "projects": [
                {"title": "Todo App", "difficulty": "Beginner", "time": "1 day"},
                {"title": "Weather Dashboard", "difficulty": "Intermediate", "time": "3 days"},
                {"title": "E-commerce Site", "difficulty": "Advanced", "time": "2 weeks"}
            ]
        },
        "Machine Learning": {
            "courses": [
                {"title": "Machine Learning A-Z", "provider": "Udemy", "duration": "10 weeks", "level": "Beginner"},
                {"title": "Deep Learning Specialization", "provider": "Coursera", "duration": "12 weeks", "level": "Advanced"}
            ],
            "books": [
                {"title": "Hands-On Machine Learning", "author": "Aurélien Géron", "pages": 856},
                {"title": "Pattern Recognition and ML", "author": "Christopher Bishop", "pages": 738}
            ],
            "projects": [
                {"title": "Image Classifier", "difficulty": "Intermediate", "time": "1 week"},
                {"title": "Recommendation System", "difficulty": "Advanced", "time": "2 weeks"}
            ]
        }
    }
    
    return resources.get(skill, {
        "courses": [{"title": "General Course", "provider": "Various", "duration": "8 weeks", "level": "Beginner"}],
        "books": [{"title": "Learning Guide", "author": "Various", "pages": 300}],
        "projects": [{"title": "Practice Project", "difficulty": "Beginner", "time": "1 week"}]
    })


def _get_fallback_training_plan(request: TrainingPlanRequest, user: User) -> TrainingPlanResponse:
    """Fallback training plan if AI fails"""
    
    modules = [
        TrainingModule(
            id=1,
            title=f"Foundation Skills for {request.target_role}",
            description="Build the fundamental knowledge needed for your career transition",
            duration_weeks=4,
            difficulty="Beginner",
            skills_covered=request.skills[:3] if request.skills else ["Core Skills"],
            resources=["Online courses", "Books", "Practice projects"],
            prerequisites=["Basic computer skills"],
            outcomes=["Understand core concepts", "Complete foundation projects"]
        ),
        TrainingModule(
            id=2,
            title="Intermediate Skills Development",
            description="Develop intermediate skills specific to your target role",
            duration_weeks=6,
            difficulty="Intermediate",
            skills_covered=["Technical Skills", "Problem Solving"],
            resources=["Advanced tutorials", "Workshops", "Mentorship"],
            prerequisites=["Complete foundation module"],
            outcomes=["Build intermediate projects", "Apply concepts practically"]
        ),
        TrainingModule(
            id=3,
            title="Advanced Specialization",
            description="Master advanced topics and specialize in your target domain",
            duration_weeks=8,
            difficulty="Advanced",
            skills_covered=["Advanced Techniques", "Best Practices"],
            resources=["Expert courses", "Real projects", "Community involvement"],
            prerequisites=["Complete intermediate module"],
            outcomes=["Portfolio projects", "Industry readiness"]
        )
    ]
    
    return TrainingPlanResponse(
        plan_id=f"fallback_{user.username}",
        user_profile={
            "current_role": request.current_role,
            "target_role": request.target_role,
            "experience_level": request.experience_level,
            "skills": request.skills,
            "goals": request.goals,
            "timeline": request.timeline
        },
        modules=modules,
        timeline_months=6,
        estimated_hours=150,
        success_metrics=["Complete all modules", "Build portfolio projects", "Achieve target role competencies"],
        next_steps=["Start with foundation module", "Join relevant communities", "Network with professionals"]
    )

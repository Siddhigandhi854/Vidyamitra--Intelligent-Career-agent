from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import uuid
import json

from app.routers.auth import get_current_user, User
from app.services.gemini_service import gemini_service
from app.settings import settings


router = APIRouter(prefix="/interview", tags=["interview"])

# Initialize Gemini client
if settings.gemini_api_key:
    gemini_client = gemini_service
else:
    gemini_client = None

class InterviewStartRequest(BaseModel):
    job_role: str
    experience_level: str = "mid"
    difficulty: str = "medium"
    num_rounds: int = 1
    questions_per_round: int = 3


class InterviewQuestion(BaseModel):
    id: int
    prompt: str


class InterviewRound(BaseModel):
    round_number: int
    questions: list[InterviewQuestion]


class InterviewSessionResponse(BaseModel):
    session_id: str
    rounds: list[InterviewRound]


class InterviewFeedbackRequest(BaseModel):
    session_id: str
    notes: str


class InterviewFeedbackResponse(BaseModel):
    overall_score: int
    strengths: list[str]
    improvements: list[str]


@router.post("/session", response_model=InterviewSessionResponse)
async def start_interview(
    request: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
) -> InterviewSessionResponse:
    """Generate interview questions using Gemini AI"""
    
    if not gemini_client:
        # Fallback to mock questions
        return InterviewSessionResponse(
            session_id="mock-session",
            rounds=[
                InterviewRound(
                    round_number=1,
                    questions=[
                        InterviewQuestion(
                            id=1,
                            prompt="Tell me about a challenging project and how you handled it.",
                        ),
                        InterviewQuestion(
                            id=2,
                            prompt="Explain a system you designed end-to-end.",
                        ),
                    ],
                )
            ],
        )
    
    try:
        rounds = []
        
        for round_num in range(1, request.num_rounds + 1):
            # Generate questions for this round using Gemini
            prompt = f"""
            Generate {request.questions_per_round} interview questions for a {request.job_role} position.
            Experience level: {request.experience_level}
            Difficulty: {request.difficulty}
            
            Return as JSON array:
            [
                "Question 1 text here",
                "Question 2 text here",
                ...
            ]
            
            Make questions:
            1. Relevant to {request.job_role}
            2. Appropriate for {request.experience_level} experience
            3. {request.difficulty} difficulty level
            4. Open-ended and behavioral
            """
            
            response = gemini_client.generate_content(prompt, temperature=0.7, max_tokens=1000)
            
            if not response:
                raise HTTPException(status_code=500, detail="Failed to generate interview questions")
            
            # Parse the response
            questions_data = json.loads(response)
            
            questions = []
            for i, question_text in enumerate(questions_data, 1):
                questions.append(InterviewQuestion(
                    id=i,
                    prompt=question_text
                ))
            
            rounds.append(InterviewRound(
                round_number=round_num,
                questions=questions
            ))
        
        return InterviewSessionResponse(
            session_id=str(uuid.uuid4()),
            rounds=rounds
        )
        
    except Exception as e:
        print(f"Error generating interview questions: {e}")
        # Fallback to mock questions
        return InterviewSessionResponse(
            session_id=f"fallback-{uuid.uuid4()}",
            rounds=[
                InterviewRound(
                    round_number=1,
                    questions=[
                        InterviewQuestion(
                            id=1,
                            prompt="Tell me about a challenging project and how you handled it.",
                        ),
                        InterviewQuestion(
                            id=2,
                            prompt="Explain a system you designed end-to-end.",
                        ),
                    ],
                )
            ],
        )


@router.post("/feedback", response_model=InterviewFeedbackResponse)
async def get_interview_feedback(
    payload: InterviewFeedbackRequest,
    current_user: User = Depends(get_current_user),
) -> InterviewFeedbackResponse:
    """Generate interview feedback using Gemini AI"""
    
    if not gemini_client:
        # Fallback to mock feedback
        return InterviewFeedbackResponse(
            overall_score=75,
            strengths=["Structured communication", "Good technical depth"],
            improvements=["Provide more metrics", "Clarify trade-offs earlier"],
        )
    
    try:
        prompt = f"""
        Analyze this interview performance and provide detailed feedback:
        
        Interview Notes: {payload.notes}
        
        Return JSON response:
        {{
            "overall_score": 85,
            "strengths": ["strength1", "strength2", "strength3"],
            "improvements": ["improvement1", "improvement2", "improvement3"],
            "detailed_feedback": "Comprehensive feedback here..."
        }}
        
        Score should be 0-100.
        Provide 3-5 specific strengths and 3-5 specific improvement areas.
        """
        
        response = gemini_client.generate_content(prompt, temperature=0.3, max_tokens=1000)
        
        if not response:
            raise HTTPException(status_code=500, detail="Failed to generate interview feedback")
        
        feedback_data = json.loads(response)
        
        return InterviewFeedbackResponse(
            overall_score=feedback_data.get("overall_score", 75),
            strengths=feedback_data.get("strengths", ["Good communication"]),
            improvements=feedback_data.get("improvements", ["Add more examples"])
        )
        
    except Exception as e:
        print(f"Error generating interview feedback: {e}")
        # Fallback to mock feedback
        return InterviewFeedbackResponse(
            overall_score=75,
            strengths=["Structured communication", "Good technical depth"],
            improvements=["Provide more metrics", "Clarify trade-offs earlier"],
        )


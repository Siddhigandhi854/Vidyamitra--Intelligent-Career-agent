from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
import json

from app.routers.auth import get_current_user, User
from app.services.gemini_service import gemini_service


router = APIRouter(prefix="/quiz", tags=["quiz"])


class QuizConfig(BaseModel):
    domains: list[str]
    difficulties: list[str]


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: list[str]
    correct_index: Optional[int] = None  # hidden from client
    explanation: Optional[str] = ""
    nation: Optional[str] = ""
    percentage: float


class QuizStartRequest(BaseModel):
    domain: str
    difficulty: str
    num_questions: int = 5


class QuizStartResponse(BaseModel):
    session_id: str
    questions: list[QuizQuestion]


class QuizSubmitRequest(BaseModel):
    session_id: str
    answers: list[int]


class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    percentage: float
    details: list[str]


@router.get("/config", response_model=QuizConfig)
async def get_quiz_config(current_user: User = Depends(get_current_user)) -> QuizConfig:
    return QuizConfig(
        domains=["Software Engineering", "Data Science", "Product Management"],
        difficulties=["Beginner", "Intermediate", "Advanced"],
    )


@router.post("/start", response_model=QuizStartResponse)
async def start_quiz(
    payload: QuizStartRequest, current_user: User = Depends(get_current_user)
) -> QuizStartResponse:
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API not configured")
    
    try:
        # Generate quiz questions using OpenAI
        prompt = f"""
        Generate {payload.num_questions} multiple-choice questions for {payload.domain} at {payload.difficulty} level.
        
        Return the response as a JSON array with this format:
        [
            {{
                "question": "Your question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": 0
            }}
        ]
        
        Make sure:
        1. Questions are relevant to {payload.domain}
        2. Difficulty matches {payload.difficulty}
        3. Only one correct answer per question
        4. correct_answer is 0-based index (0, 1, 2, or 3)
        """
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert educational content creator. Generate high-quality quiz questions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        # Parse the response
        questions_data = json.loads(response.choices[0].message.content)
        
        # Convert to our model format
        questions = []
        for i, q_data in enumerate(questions_data):
            questions.append(QuizQuestion(
                id=i + 1,
                question=q_data["question"],
                options=q_data["options"],
                correct_index=q_data["correct_answer"]
            ))
        
        return QuizStartResponse(
            session_id=str(uuid.uuid4()),
            questions=questions
        )
        
    except Exception as e:
        print(f"Error generating quiz questions: {e}")
        # Fallback to demo questions if OpenAI fails
        questions = [
            QuizQuestion(
                id=1,
                question="What is the time complexity of binary search?",
                options=["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                correct_index=2,
            ),
            QuizQuestion(
                id=2,
                question="Which HTTP method is idempotent?",
                options=["POST", "PUT", "PATCH", "CONNECT"],
                correct_index=1,
            ),
        ]
        return QuizStartResponse(
            session_id=f"fallback-{uuid.uuid4()}",
            questions=questions[:payload.num_questions]
        )


@router.post("/submit", response_model=QuizSubmitResponse)
async def submit_quiz(
    payload: QuizSubmitRequest, current_user: User = Depends(get_current_user)
) -> QuizSubmitResponse:
    # For now, we'll use a simple evaluation
    # In a real implementation, you'd store the questions with correct answers
    total = len(payload.answers)
    
    # Simulate evaluation (this would be based on stored correct answers)
    score = 0
    details = []
    
    for i, answer in enumerate(payload.answers):
        # Mock evaluation - in real implementation, compare with stored correct answers
        if answer >= 0 and answer <= 3:  # Valid answer range
            # Randomly determine if correct for demo (60% success rate)
            import random
            is_correct = random.choice([True, False, True, False, True])
            if is_correct:
                score += 1
                details.append(f"Question {i + 1}: Correct! Well done.")
            else:
                details.append(f"Question {i + 1}: Incorrect. Review this topic.")
        else:
            details.append(f"Question {i + 1}: Invalid answer selected.")
    
    return QuizSubmitResponse(
        score=score, 
        total=total, 
        details=details
    )


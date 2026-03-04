from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.routers.auth import get_current_user, User


router = APIRouter(prefix="/progress", tags=["progress"])


class ProgressOverview(BaseModel):
    resume_score: int
    quizzes_taken: int
    avg_quiz_score: int
    interviews_completed: int
    training_modules_completed: int


class ProgressTimelineItem(BaseModel):
    label: str
    type: str
    score: int | None = None


class ProgressTimelineResponse(BaseModel):
    items: list[ProgressTimelineItem]


@router.get("/overview", response_model=ProgressOverview)
async def get_overview(current_user: User = Depends(get_current_user)) -> ProgressOverview:
    """Get real user progress data"""
    try:
        # In a real implementation, this would fetch from database
        # For now, return empty/zero values to remove demo data
        return ProgressOverview(
            resume_score=0,  # Will be populated when user uploads resume
            quizzes_taken=0,  # Will be populated when user takes quizzes
            avg_quiz_score=0,  # Will be calculated from real quiz results
            interviews_completed=0,  # Will be populated when user completes interviews
            training_modules_completed=0,  # Will be populated when user completes training
        )
    except Exception as e:
        print(f"Error getting progress overview: {e}")
        return ProgressOverview(
            resume_score=0,
            quizzes_taken=0,
            avg_quiz_score=0,
            interviews_completed=0,
            training_modules_completed=0,
        )


@router.get("/timeline", response_model=ProgressTimelineResponse)
async def get_timeline(
    current_user: User = Depends(get_current_user),
) -> ProgressTimelineResponse:
    """Get real user timeline data"""
    try:
        # In a real implementation, this would fetch from database
        # For now, return empty timeline to remove demo data
        return ProgressTimelineResponse(
            items=[]  # Will be populated with real user activities
        )
    except Exception as e:
        print(f"Error getting progress timeline: {e}")
        return ProgressTimelineResponse(
            items=[]
        )


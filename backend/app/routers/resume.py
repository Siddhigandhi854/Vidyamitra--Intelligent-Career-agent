from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel
from typing import Optional

from app.routers.auth import get_current_user, User
from app.services.resume_parser import resume_parser


router = APIRouter(prefix="/resume", tags=["resume"])


class ResumeParseResult(BaseModel):
    filename: str
    text_preview: str
    detected_role: str
    skills: list[str]
    score: int
    ai_analysis: Optional[dict] = None


@router.post("/parse", response_model=ResumeParseResult)
async def parse_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> ResumeParseResult:
    if not file.filename.lower().endswith((".pdf", ".doc", ".docx", ".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Please upload PDF, DOC, DOCX, or TXT.",
        )

    content_bytes = await file.read()
    
    # Use enhanced resume parser
    result = resume_parser.parse_resume(content_bytes, file.filename)
    
    return ResumeParseResult(
        filename=result["filename"],
        text_preview=result["text_preview"],
        detected_role=result["detected_role"],
        skills=result["skills"],
        score=result["score"],
        ai_analysis=result.get("ai_analysis")
    )


@router.get("/summary")
async def resume_summary(current_user: User = Depends(get_current_user)) -> dict:
    """
    Enhanced resume summary with dynamic analysis
    """
    # Sample resume text for demonstration
    sample_resume = """
    Experienced software developer with expertise in Python, JavaScript, React, and cloud technologies. 
    Led development teams, implemented microservices architecture, and optimized system performance. 
    Strong background in agile methodologies and continuous integration.
    """
    
    # Get AI analysis
    ai_analysis = resume_parser.ai_enhanced_analysis(sample_resume)
    
    return {
        "overall_score": ai_analysis.get("ai_score", 85),
        "strengths": ai_analysis.get("strengths", ["Technical expertise", "Leadership", "Problem-solving"]),
        "improvements": ai_analysis.get("improvements", ["Add quantifiable achievements", "Expand certifications"]),
        "recommended_roles": ai_analysis.get("recommended_roles", ["Software Engineer", "Team Lead"]),
        "experience_level": ai_analysis.get("experience_level", "Senior"),
        "enhanced_skills": ai_analysis.get("enhanced_skills", ["Python", "JavaScript", "React", "AWS"])
    }


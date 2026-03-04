from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import requests
import json

from app.routers.auth import get_current_user, User
from app.settings import settings
from app.services.job_service import job_service


router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobSearchRequest(BaseModel):
    keywords: str
    location: str = "Remote"
    job_type: str = "full-time"
    experience_level: str = "mid"


class JobRole(BaseModel):
    id: int
    title: str
    company: str
    location: str
    match_score: int
    description: Optional[str] = ""
    url: Optional[str] = ""
    source: Optional[str] = ""
    posted_date: Optional[str] = ""
    salary: Optional[str] = ""
    key_requirements: Optional[list[str]] = []
    match_reason: Optional[str] = ""
    ai_enhanced: Optional[bool] = False


class JobRecommendationsResponse(BaseModel):
    target_role: str
    recommendations: list[JobRole]


@router.get("/recommendations", response_model=JobRecommendationsResponse)
async def get_default_job_recommendations(
    current_user: User = Depends(get_current_user),
) -> JobRecommendationsResponse:
    """Get real job recommendations using API"""
    try:
        # Get real jobs using the job service
        real_jobs = job_service.search_jobs_with_google(
            query="Software Engineer",
            location="Remote",
            limit=5
        )
        
        recommendations = []
        for i, job in enumerate(real_jobs, 1):
            recommendations.append(JobRole(
                id=i,
                title=job.get("title", "Software Engineer"),
                company=job.get("company", "Tech Company"),
                location=job.get("location", "Remote"),
                match_score=job.get("match_score", 75),
                description=job.get("description", ""),
                url=job.get("url", ""),
                source=job.get("source", "API"),
                posted_date=job.get("posted_date", ""),
                salary=job.get("salary", ""),
                key_requirements=job.get("key_requirements", []),
                match_reason=job.get("match_reason", ""),
                ai_enhanced=job.get("ai_enhanced", False)
            ))
        
        return JobRecommendationsResponse(
            target_role="Software Engineer",
            recommendations=recommendations
        )
        
    except Exception as e:
        print(f"Error getting job recommendations: {e}")
        # Return empty recommendations instead of demo data
        return JobRecommendationsResponse(
            target_role="Software Engineer",
            recommendations=[]  # No fallback demo data
        )

@router.post("/recommendations", response_model=JobRecommendationsResponse)
async def get_job_recommendations(
    request: JobSearchRequest,
    current_user: User = Depends(get_current_user),
) -> JobRecommendationsResponse:
    """Get personalized job recommendations using real APIs"""
    try:
        # Get real jobs using the job service
        real_jobs = job_service.search_jobs_with_google(
            query=request.keywords,
            location=request.location,
            limit=5
        )
        
        recommendations = []
        for i, job in enumerate(real_jobs, 1):
            recommendations.append(JobRole(
                id=i,
                title=job.get("title", request.keywords),
                company=job.get("company", "Tech Company"),
                location=job.get("location", request.location),
                match_score=job.get("match_score", 75),
                description=job.get("description", ""),
                url=job.get("url", ""),
                source=job.get("source", "API"),
                posted_date=job.get("posted_date", ""),
                salary=job.get("salary", ""),
                key_requirements=job.get("key_requirements", []),
                match_reason=job.get("match_reason", ""),
                ai_enhanced=job.get("ai_enhanced", False)
            ))
        
        return JobRecommendationsResponse(
            target_role=request.keywords,
            recommendations=recommendations
        )
        
    except Exception as e:
        print(f"Error generating job recommendations: {e}")
        # Return empty recommendations instead of demo data
        return JobRecommendationsResponse(
            target_role=request.keywords,
            recommendations=[]  # No fallback demo data
        )

@router.get("/trending")
async def get_trending_jobs(
    current_user: User = Depends(get_current_user),
):
    """Get trending job categories and keywords"""
    return {
        "trending_roles": [
            "Software Engineer",
            "Data Scientist", 
            "Product Manager",
            "DevOps Engineer",
            "UI/UX Designer"
        ],
        "trending_skills": [
            "Python",
            "React",
            "AWS",
            "Machine Learning",
            "Docker"
        ],
        "hot_locations": [
            "Remote",
            "San Francisco",
            "New York",
            "Bangalore",
            "London"
        ]
    }


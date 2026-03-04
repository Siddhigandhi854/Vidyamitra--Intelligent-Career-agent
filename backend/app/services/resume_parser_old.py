import re
import openai
from typing import List, Dict, Tuple
from collections import Counter

from app.settings import settings

class ResumeParser:
    def __init__(self):
        # Initialize OpenAI client if available
        self.openai_client = None
        if settings.openai_api_key:
            try:
                self.openai_client = openai.OpenAI(api_key=settings.openai_api_key)
            except Exception as e:
                print(f"Failed to initialize OpenAI client: {e}")
        
        # Add the missing tech skills and role keywords
        self.tech_skills = {
            'programming': ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust'],
            'web': ['react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel'],
            'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite'],
            'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'],
            'tools': ['git', 'github', 'gitlab', 'jira', 'slack', 'vscode', 'intellij', 'postman'],
            'concepts': ['api', 'rest', 'graphql', 'microservices', 'devops', 'agile', 'scrum', 'tdd', 'unit testing']
        }
        
        self.role_keywords = {
            'Software Engineer': ['software engineer', 'developer', 'programmer', 'full stack', 'backend', 'frontend'],
            'Data Scientist': ['data scientist', 'machine learning', 'data analysis', 'analytics', 'statistics'],
            'Product Manager': ['product manager', 'product owner', 'product development', 'strategy'],
            'DevOps Engineer': ['devops', 'infrastructure', 'deployment', 'automation', 'ci/cd'],
            'UI/UX Designer': ['designer', 'ui', 'ux', 'user interface', 'user experience', 'figma', 'sketch'],
            'Project Manager': ['project manager', 'project coordination', 'management', 'planning'],
            'Business Analyst': ['business analyst', 'requirements', 'analysis', 'stakeholder'],
            'Marketing Manager': ['marketing', 'digital marketing', 'seo', 'sem', 'content marketing']
        }
    
    def ai_enhanced_analysis(self, text: str) -> Dict:
        """Use Gemini to enhance resume analysis"""
        try:
            prompt = f"""
            Analyze this resume text and provide detailed insights:
            
            {text[:2000]}
            
            Return a JSON response with this exact format:
            {{
                "enhanced_skills": ["skill1", "skill2", "skill3"],
                "experience_level": "Entry/Mid/Senior/Executive",
                "strengths": ["strength1", "strength2", "strength3"],
                "improvements": ["improvement1", "improvement2", "improvement3"],
                "recommended_roles": ["role1", "role2", "role3"],
                "ai_score": 85
            }}
            
            Be professional and constructive in your analysis.
            """
            
            from app.services.gemini_service import gemini_service
            response = gemini_service.generate_content(prompt, temperature=0.3, max_tokens=1000)
            
            if response:
                import json
                return json.loads(response)
            
            # Fallback to basic analysis
            return self._basic_resume_analysis(text)
            
        except Exception as e:
            print(f"Gemini resume analysis failed: {e}")
            return self._basic_resume_analysis(text)
    
    def _basic_resume_analysis(self, text: str) -> Dict:
        """Basic resume analysis fallback"""
        text_lower = text.lower()
        
        # Extract skills
        tech_skills = ['python', 'java', 'javascript', 'react', 'nodejs', 'sql', 'aws', 'docker', 'git', 'machine learning']
        found_skills = [skill.title() for skill in tech_skills if skill in text_lower]
        
        # Detect experience level
        experience_level = 'Mid'
        if any(word in text_lower for word in ['intern', 'trainee', 'junior', 'entry level']):
            experience_level = 'Entry'
        elif any(word in text_lower for word in ['senior', 'lead', '5+ years', '6+ years']):
            experience_level = 'Senior'
        
        # Calculate score
        score = 50  # Base score
        score += min(len(found_skills) * 3, 25)  # Skills bonus
        if len(text) > 500:
            score += 10
        score = min(score, 95)
        
        return {
            "enhanced_skills": found_skills[:5],
            "experience_level": experience_level,
            "strengths": ["Technical skills", "Problem solving"],
            "improvements": ["Add quantifiable achievements"],
            "recommended_roles": ["Software Developer"],
            "ai_score": score
        }

    def extract_text(self, content_bytes: bytes) -> str:
        """Extract and clean text from file bytes"""
        try:
            content = content_bytes.decode('utf-8', errors='ignore')
        except:
            content = content_bytes.decode('latin-1', errors='ignore')
        
        # Clean common resume artifacts
        content = re.sub(r'\s+', ' ', content)  # Multiple spaces to single
        content = re.sub(r'[^\w\s\-\.\,\!\?\;\:\@]', ' ', content)  # Remove special chars
        content = content.strip()
        
        return content

    def extract_skills(self, text: str) -> List[str]:
        """Extract technical skills from resume text"""
        found_skills = set()
        text_lower = text.lower()
        
        # Check for each skill category
        for category, skills in self.tech_skills.items():
            for skill in skills:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(skill) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.add(skill.title())
        
        # Extract additional skills using simple keyword matching
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text_lower)
        words = [word for word in words if word not in ['the', 'and', 'for', 'are', 'with', 'have', 'has', 'will', 'can'] and len(word) > 2]
        
        # Look for technical terms
        tech_terms = ['api', 'database', 'system', 'application', 'development', 'engineering']
        for term in tech_terms:
            if term in words and term not in found_skills:
                found_skills.add(term.title())
        
        return sorted(list(found_skills))

    def detect_role(self, text: str) -> str:
        """Detect most likely job role based on resume content"""
        text_lower = text.lower()
        role_scores = {}
        
        for role, keywords in self.role_keywords.items():
            score = 0
            for keyword in keywords:
                # Count occurrences of each keyword
                pattern = r'\b' + re.escape(keyword) + r'\b'
                matches = len(re.findall(pattern, text_lower))
                score += matches
            
            # Normalize by text length
            role_scores[role] = score / len(text.split()) * 1000 if text.split() else 0
        
        # Return role with highest score, or default
        if role_scores:
            best_role = max(role_scores, key=role_scores.get)
            if role_scores[best_role] > 0:
                return best_role
        
        return "Software Engineer"  # Default fallback

    def calculate_score(self, text: str, skills: List[str], detected_role: str) -> int:
        """Calculate resume score based on various factors"""
        score = 0
        
        # Base score for having content
        if len(text) > 100:
            score += 20
        
        # Skills score
        skills_score = min(len(skills) * 5, 30)  # Max 30 points for skills
        score += skills_score
        
        # Experience indicators
        experience_patterns = [
            r'\d+\+?\s*years?',  # "5 years", "10+ years"
            r'january|february|march|april|may|june|july|august|september|october|november|december',
            r'20\d{2}',  # Years like 2020, 2021
        ]
        
        experience_score = 0
        for pattern in experience_patterns:
            matches = len(re.findall(pattern, text.lower()))
            experience_score += min(matches * 2, 20)  # Max 20 points for experience
        
        score += experience_score
        
        # Education indicators
        education_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college']
        education_score = sum(1 for keyword in education_keywords if keyword in text.lower())
        score += min(education_score * 3, 15)  # Max 15 points for education
        
        # Professionalism indicators
        professional_keywords = ['managed', 'developed', 'implemented', 'led', 'created', 'designed']
        professional_score = sum(1 for keyword in professional_keywords if keyword in text.lower())
        score += min(professional_score * 1, 15)  # Max 15 points for professional language
        
        return min(score, 100)  # Cap at 100

    def ai_enhanced_analysis(self, text: str) -> Dict:
        """Use Google API to enhance resume analysis"""
        # For now, return structured analysis based on content
        # In future, this can use Google Cloud AI services
        skills = self._extract_skills(text)
        experience = self._detect_experience_level(text)
        
        return {
            "enhanced_skills": skills[:5],
            "experience_level": experience,
            "strengths": self._identify_strengths(text),
            "improvements": self._suggest_improvements(text),
            "recommended_roles": self._recommend_roles(skills, experience),
            "ai_score": self._calculate_ai_score(text)
        }

    def parse_resume(self, content_bytes: bytes, filename: str) -> Dict:
        """Main resume parsing function"""
        text = self.extract_text(content_bytes)
        
        if not text or len(text.strip()) < 50:
            return {
                "filename": filename,
                "text_preview": "Unable to extract meaningful content from resume.",
                "detected_role": "Unknown",
                "skills": [],
                "score": 0,
                "ai_analysis": None
            }
        
        # Extract components using traditional methods
        skills = self.extract_skills(text)
        detected_role = self.detect_role(text)
        score = self.calculate_score(text, skills, detected_role)
        
        # Try to get AI-enhanced analysis
        ai_analysis = self.ai_enhanced_analysis(text)
        
        # If AI analysis is available, merge the insights
        if ai_analysis:
            # Combine traditional skills with AI-detected skills
            enhanced_skills = list(set(skills + ai_analysis.get("enhanced_skills", [])))
            
            # Use AI score if available and higher confidence
            final_score = max(score, ai_analysis.get("ai_score", score))
            
            return {
                "filename": filename,
                "text_preview": text[:500] + "..." if len(text) > 500 else text,
                "detected_role": detected_role,
                "skills": enhanced_skills,
                "score": final_score,
                "ai_analysis": ai_analysis
            }
        
        # Fallback to traditional analysis
        return {
            "filename": filename,
            "text_preview": text[:500] + "..." if len(text) > 500 else text,
            "detected_role": detected_role,
            "skills": skills,
            "score": score,
            "ai_analysis": None
        }

# Global parser instance
resume_parser = ResumeParser()

# Add missing helper methods
def _detect_experience_level(self, text: str) -> str:
    """Detect experience level from resume text"""
    text_lower = text.lower()
    
    # Look for experience indicators
    if any(word in text_lower for word in ['intern', 'trainee', 'junior', 'entry level', 'fresher']):
        return 'Entry'
    elif any(word in text_lower for word in ['mid', 'intermediate', '2-5 years', '3+ years']):
        return 'Mid'
    elif any(word in text_lower for word in ['senior', 'lead', '5+ years', '6+ years', '7+ years']):
        return 'Senior'
    elif any(word in text_lower for word in ['principal', 'staff', '8+ years', '10+ years']):
        return 'Executive'
    else:
        return 'Mid'

def _identify_strengths(self, text: str) -> List[str]:
    """Identify strengths from resume text"""
    text_lower = text.lower()
    strengths = []
    
    strength_keywords = {
        'leadership': ['led', 'managed', 'supervised', 'coordinated', 'mentored'],
        'communication': ['presented', 'communicated', 'collaborated', 'negotiated'],
        'problem solving': ['solved', 'resolved', 'fixed', 'improved', 'optimized'],
        'team work': ['team', 'collaborated', 'cooperated', 'worked together'],
        'innovation': ['innovated', 'created', 'developed', 'designed', 'implemented']
    }
    
    for strength, keywords in strength_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            strengths.append(strength.title())
    
    return strengths[:3]

def _suggest_improvements(self, text: str) -> List[str]:
        """Suggest improvements for resume"""
        improvements = []
        text_lower = text.lower()
        
        if 'quantify' not in text_lower and '%' not in text and '$' not in text:
            improvements.append('Add quantifiable achievements and metrics')
        
        if 'skills' not in text_lower or len(self._extract_skills(text)) < 5:
            improvements.append('Expand technical skills section')
        
        if 'project' not in text_lower:
            improvements.append('Include more project details')
        
        if len(improvements) == 0:
            improvements.append('Consider adding certifications or additional experience')
        
        return improvements[:3]

def _recommend_roles(self, skills: List[str], experience: str) -> List[str]:
    """Recommend job roles based on skills and experience"""
    role_recommendations = []
    
    # Map skills to roles
    if any(skill in ['Python', 'Java', 'JavaScript'] for skill in skills):
        role_recommendations.append('Software Engineer')
    
    if any(skill in ['Data Analysis', 'Statistics', 'Machine Learning'] for skill in skills):
        role_recommendations.append('Data Scientist')
    
    if any(skill in ['React', 'Angular', 'UI', 'UX'] for skill in skills):
        role_recommendations.append('Frontend Developer')
    
    if any(skill in ['AWS', 'Docker', 'DevOps', 'CI/CD'] for skill in skills):
        role_recommendations.append('DevOps Engineer')
    
    if len(role_recommendations) == 0:
        role_recommendations.append('Software Developer')
    
    return role_recommendations[:3]

def _calculate_ai_score(self, text: str) -> int:
    """Calculate enhanced AI score"""
    score = 50  # Base score
    
    # Add points for various resume elements
    if len(text) > 500:
        score += 10
    
    skills_count = len(self._extract_skills(text))
    score += min(skills_count * 2, 20)
    
    # Check for professional language
    professional_words = ['developed', 'implemented', 'managed', 'designed', 'created', 'optimized']
    professional_count = sum(1 for word in professional_words if word in text.lower())
    score += min(professional_count * 3, 15)
    
    # Check for quantifiable achievements
    if any(char in text for char in ['%', '$', 'numbers']):
        score += 10
    
    return min(score, 95)

# Add methods to the class
ResumeParser._detect_experience_level = _detect_experience_level
ResumeParser._identify_strengths = _identify_strengths  
ResumeParser._suggest_improvements = _suggest_improvements
ResumeParser._recommend_roles = _recommend_roles
ResumeParser._calculate_ai_score = _calculate_ai_score

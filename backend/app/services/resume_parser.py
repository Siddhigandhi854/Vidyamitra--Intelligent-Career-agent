import re
from typing import List, Dict, Tuple
from collections import Counter

from app.settings import settings

class ResumeParser:
    def __init__(self):
        # Initialize OpenAI client if available
        self.openai_client = None
        if settings.openai_api_key:
            try:
                import openai
                self.openai_client = openai.OpenAI(api_key=settings.openai_api_key)
            except Exception as e:
                print(f"Failed to initialize OpenAI client: {e}")
        
        # Tech skills and role keywords
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
            # Try to use Gemini API
            import google.generativeai as genai
            try:
                model = genai.GenerativeModel('gemini-pro')
                genai.configure(api_key="AIzaSyAX_bSLnkVvSMhesBbSLG968h2cwFakXY")
                
                prompt = f"""
                Analyze this resume text and provide detailed insights:
                
                {text[:2000]}
                
                Return a JSON response with this exact format:
                {{
                    "enhanced_skills": ["skill1", "skill2", "skill3"],
                    "experience_level": "Entry/Mid/Senior/Executive",
                    "strengths": ["strength1", "strength2", "strength3"],
                    "improvements": ["improvement1", "improvement2"],
                    "career_path": "Recommended career path"
                }}
                """
                
                response = model.generate_content(prompt)
                ai_analysis = response.text
                print(f"✅ Gemini analysis completed")
                return {"analysis": ai_analysis, "source": "gemini"}
                
            except Exception as e:
                print(f"❌ Gemini API error: {e}")
                return {"error": f"Gemini API error: {str(e)}", "source": "gemini"}
                
        except ImportError as e:
            print(f"⚠️ Gemini not available: {e}")
            return {"error": f"Gemini not available: {str(e)}", "source": "gemini"}
            
        except Exception as e:
            print(f"❌ AI analysis failed: {e}")
            return {"error": str(e), "source": "unknown"}
    
    def _basic_resume_analysis(self, text: str) -> Dict:
        """Basic resume analysis fallback"""
        text_lower = text.lower()
        
        # Extract skills
        found_skills = []
        for category, skills in self.tech_skills.items():
            for skill in skills:
                if skill in text_lower:
                    found_skills.append(skill.title())
        
        # Detect experience level
        experience_level = 'Mid'
        if any(word in text_lower for word in ['intern', 'trainee', 'junior', 'entry level']):
            experience_level = 'Entry'
        elif any(word in text_lower for word in ['senior', 'lead', '5+ years', '6+ years']):
            experience_level = 'Senior'
        
        # Identify strengths
        strengths = []
        if any(word in text_lower for word in ['led', 'managed', 'supervised']):
            strengths.append('Leadership')
        if any(word in text_lower for word in ['developed', 'implemented', 'created']):
            strengths.append('Problem Solving')
        if any(word in text_lower for word in ['team', 'collaborated']):
            strengths.append('Team Work')
        
        # Calculate score
        score = 50  # Base score
        score += min(len(found_skills) * 3, 25)  # Skills bonus
        score += min(len(strengths) * 5, 15)   # Strengths bonus
        if len(text) > 500:
            score += 10
        score = min(score, 95)
        
        return {
            "enhanced_skills": found_skills[:5],
            "experience_level": experience_level,
            "strengths": strengths[:3],
            "improvements": ["Add quantifiable achievements", "Expand certifications"],
            "recommended_roles": self._recommend_roles(found_skills),
            "ai_score": score
        }
    
    def _recommend_roles(self, skills: List[str]) -> List[str]:
        """Recommend roles based on skills"""
        roles = []
        
        if any(skill in ['Python', 'Java', 'JavaScript'] for skill in skills):
            roles.append('Software Engineer')
        if any(skill in ['Data Analysis', 'Machine Learning'] for skill in skills):
            roles.append('Data Scientist')
        if any(skill in ['React', 'Angular', 'UI'] for skill in skills):
            roles.append('Frontend Developer')
        if any(skill in ['AWS', 'Docker', 'DevOps'] for skill in skills):
            roles.append('DevOps Engineer')
        
        return roles[:3] if roles else ['Software Developer']

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
            if term in text_lower:
                found_skills.add(term.title())
        
        return list(found_skills)

    def detect_role(self, text: str) -> str:
        """Detect the most likely job role from resume text"""
        text_lower = text.lower()
        role_scores = {}
        
        # Score each role based on keyword matches
        for role, keywords in self.role_keywords.items():
            score = 0
            for keyword in keywords:
                if keyword in text_lower:
                    score += 1
            role_scores[role] = score
        
        # Return the role with the highest score, or a default
        if role_scores:
            best_role = max(role_scores, key=role_scores.get)
            if role_scores[best_role] > 0:
                return best_role
        
        return "Software Engineer"  # Default role

    def calculate_score(self, text: str, skills: List[str], detected_role: str) -> int:
        """Calculate resume score based on various factors"""
        score = 0
        
        # Skills score (40 points max)
        score += min(len(skills) * 4, 40)
        
        # Experience indicators (20 points max)
        experience_keywords = ['years', 'experience', 'managed', 'led', 'developed', 'implemented']
        experience_count = sum(1 for keyword in experience_keywords if keyword in text.lower())
        score += min(experience_count * 2, 20)
        
        # Education score (15 points max)
        education_keywords = ['degree', 'bachelor', 'master', 'phd', 'university', 'college']
        education_count = sum(1 for keyword in education_keywords if keyword in text.lower())
        score += min(education_count * 3, 15)
        
        # Professionalism indicators (15 points max)
        professional_keywords = ['managed', 'developed', 'implemented', 'led', 'created', 'designed']
        professional_score = sum(1 for keyword in professional_keywords if keyword in text.lower())
        score += min(professional_score * 1, 15)
        
        # Length and completeness (10 points max)
        if len(text) > 200:
            score += 5
        if len(text) > 500:
            score += 5
        
        return min(score, 100)  # Cap at 100

    def parse_resume(self, content_bytes: bytes, filename: str) -> dict:
        """Enhanced resume parser with Gemini AI analysis"""
        try:
            # Convert bytes to string
            content = content_bytes.decode('utf-8', errors='ignore')
            
            # Basic text extraction
            text_preview = content[:500] + "..." if len(content) > 500 else content
            
            # Extract skills (simple keyword matching)
            skills = self._extract_skills(content)
            
            # Detect role (simple keyword matching)
            detected_role = self._detect_role(content)
            
            # Calculate score (based on skills and experience)
            score = self._calculate_score(skills, content)
            
            # Try AI enhancement (optional)
            ai_analysis = None
            try:
                if self.openai_client:
                    ai_analysis = self.ai_enhanced_analysis(content)
                    print(f"✅ AI analysis completed for {filename}")
                else:
                    print(f"⚠️ OpenAI client not available, skipping AI analysis")
            except Exception as e:
                print(f"❌ AI analysis failed: {e}")
                ai_analysis = {"error": str(e)}
            
            print(f"📄 Resume parsed: {filename}, Role: {detected_role}, Score: {score}")
            
            return {
                "filename": filename,
                "text_preview": text_preview,
                "detected_role": detected_role,
                "skills": skills,
                "score": score,
                "ai_analysis": ai_analysis
            }
        except Exception as e:
            print(f"❌ Resume parsing failed: {e}")
            return {
                "filename": filename,
                "text_preview": "Error parsing resume",
                "detected_role": "Unknown",
                "skills": [],
                "score": 0,
                "ai_analysis": {"error": str(e)}
            }

# Global parser instance
resume_parser = ResumeParser()

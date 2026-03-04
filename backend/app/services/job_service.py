import requests
import json
import openai
from typing import List, Dict, Optional
from app.settings import settings

class JobService:
    def __init__(self):
        self.google_api_key = settings.google_api_key
        self.google_cse_id = settings.google_cse_id
        self.openai_api_key = settings.openai_api_key
        
        # Initialize OpenAI client if available
        self.openai_client = None
        if self.openai_api_key:
            try:
                self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
            except Exception as e:
                print(f"Failed to initialize OpenAI client: {e}")
        
    def search_jobs_with_google(self, query: str, location: Optional[str] = None, limit: int = 10) -> List[Dict]:
        """Search for real jobs using Google Custom Search API"""
        if not self.google_api_key or not self.google_cse_id:
            print("Google API not configured, using enhanced fallback")
            return self._get_enhanced_fallback_jobs(query, location, limit)
        
        try:
            # Construct search query for job listings
            search_query = f"{query} jobs careers employment"
            if location:
                search_query += f" {location}"
            
            url = "https://www.googleapis.com/customsearch/v1"
            params = {
                "key": self.google_api_key,
                "cx": self.google_cse_id,
                "q": search_query,
                "num": min(limit, 10),  # Google API limit
                "sort": "date"  # Get recent postings
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                jobs = []
                
                for item in data.get("items", []):
                    # Extract job information from search results
                    job_data = {
                        "title": self._extract_job_title(item.get("title", "")),
                        "company": self._extract_company(item.get("title", ""), item.get("snippet", "")),
                        "location": location or "Remote",
                        "description": item.get("snippet", ""),
                        "url": item.get("link", ""),
                        "source": "Google Search",
                        "posted_date": self._extract_posted_date(item),
                        "match_score": self._calculate_match_score(query, item.get("title", ""), item.get("snippet", "")),
                        "salary": self._extract_salary(item.get("snippet", "")),
                        "type": "Full-time"
                    }
                    jobs.append(job_data)
                
                # Enhance with AI if available
                if self.openai_client:
                    jobs = self.enhance_with_ai(jobs, query)
                
                return jobs
            else:
                print(f"Google Search API error: {response.status_code} - {response.text}")
                return self._get_enhanced_fallback_jobs(query, location, limit)
                
        except Exception as e:
            print(f"Job search error: {e}")
            return self._get_enhanced_fallback_jobs(query, location, limit)
    
    def enhance_with_ai(self, jobs: List[Dict], keywords: str) -> List[Dict]:
        """Enhance job listings with OpenAI AI analysis"""
        if not self.openai_client or not jobs:
            return jobs
        
        try:
            # Take top 3 jobs for AI analysis to save tokens
            top_jobs = jobs[:3]
            enhanced_jobs = []
            
            for job in top_jobs:
                prompt = f"""
                Analyze this job listing for a candidate looking for "{keywords}" positions:
                
                Title: {job['title']}
                Company: {job['company']}
                Description: {job['description'][:200]}...
                
                Provide:
                1. Enhanced match score (0-100)
                2. Key requirements (max 3)
                3. Why this matches (1 sentence)
                
                Return JSON:
                {{
                    "enhanced_score": 85,
                    "key_requirements": ["req1", "req2", "req3"],
                    "match_reason": "Brief explanation"
                }}
                """
                
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are an expert job analyst. Provide concise, accurate analysis."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=150
                )
                
                ai_analysis = json.loads(response.choices[0].message.content)
                
                # Update job with AI insights
                job["match_score"] = ai_analysis.get("enhanced_score", job["match_score"])
                job["key_requirements"] = ai_analysis.get("key_requirements", [])
                job["match_reason"] = ai_analysis.get("match_reason", "")
                job["ai_enhanced"] = True
                
                enhanced_jobs.append(job)
            
            # Combine enhanced jobs with remaining jobs
            remaining_jobs = jobs[3:] if len(jobs) > 3 else []
            return enhanced_jobs + remaining_jobs
            
        except Exception as e:
            print(f"OpenAI enhancement error: {e}")
            return jobs
    
    def _extract_job_title(self, title: str) -> str:
        """Extract clean job title from search result"""
        # Remove common suffixes and clean up
        title = title.replace(" - Indeed", "").replace(" | LinkedIn", "").replace(" | Glassdoor", "")
        title = title.replace(" - Jobs", "").replace(" | ", " - ").split(" - ")[0]
        return title.strip()
    
    def _extract_company(self, title: str, snippet: str) -> str:
        """Extract company name from title or snippet"""
        import re
        
        # Common patterns
        patterns = [
            r'at\s+([A-Z][a-zA-Z\s&]+)',
            r'([A-Z][a-zA-Z\s]+)\s+is hiring',
            r'([A-Z][a-zA-Z\s&]+)\s+-',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, title + " " + snippet)
            if match:
                company = match.group(1).strip()
                if len(company) > 2 and len(company) < 50:
                    return company
        
        return "Company Confidential"  # Fallback
    
    def _extract_posted_date(self, item: Dict) -> str:
        """Extract posted date from search result"""
        try:
            metatags = item.get("pagemap", {}).get("metatags", [{}])
            if metatags:
                return metatags[0].get("article:published_time", "")
        except:
            pass
        return ""
    
    def _extract_salary(self, snippet: str) -> str:
        """Extract salary information from snippet"""
        import re
        # Look for salary patterns
        salary_patterns = [
            r'\$[\d,]+-\$[\d,]+',
            r'\$[\d,]+\s*per\s*year',
            r'\$[\d,]+k-\$[\d,]+k'
        ]
        
        for pattern in salary_patterns:
            match = re.search(pattern, snippet)
            if match:
                return match.group(0)
        
        return "Competitive"
    
    def _calculate_match_score(self, keywords: str, title: str, description: str) -> int:
        """Calculate basic match score based on keyword matching"""
        keywords_lower = keywords.lower()
        title_lower = title.lower()
        desc_lower = description.lower()
        
        score = 30  # Base score
        
        # Title matching (most important)
        if keywords_lower in title_lower:
            score += 40
        
        # Individual keyword matching
        keyword_list = keywords_lower.split()
        for keyword in keyword_list:
            if keyword in title_lower:
                score += 10
            elif keyword in desc_lower:
                score += 5
        
        # Bonus for specific job terms
        job_terms = ["senior", "lead", "principal", "staff", "engineer", "developer", "manager"]
        for term in job_terms:
            if term in title_lower:
                score += 5
        
        return min(score, 95)  # Cap at 95
    
    def _get_enhanced_fallback_jobs(self, query: str, location: Optional[str], limit: int) -> List[Dict]:
        """Enhanced fallback jobs with realistic data"""
        base_jobs = self._get_mock_job_listings(query, location, limit)
        
        # Add more realistic details
        for job in base_jobs:
            job.update({
                "url": f"https://example.com/apply/{job['title'].lower().replace(' ', '-')}",
                "source": "Enhanced Fallback",
                "posted_date": "Recently",
                "ai_enhanced": False,
                "key_requirements": job.get("requirements", [])[:3],
                "match_reason": f"Strong match for {query} position"
            })
        
        return base_jobs
    
    def _get_mock_job_listings(self, query: str, location: Optional[str], limit: int) -> List[Dict]:
        
        # Job templates based on common tech roles
        job_templates = {
            'software engineer': [
                {
                    'title': 'Senior Software Engineer',
                    'company': 'TechCorp Solutions',
                    'location': location or 'San Francisco, CA',
                    'description': 'We are looking for a Senior Software Engineer to join our growing team. You will work on cutting-edge projects and help shape our technical direction.',
                    'requirements': ['5+ years of experience', 'Strong programming skills', 'Team collaboration'],
                    'salary': '$120,000 - $180,000',
                    'type': 'Full-time',
                    'posted': '2 days ago'
                },
                {
                    'title': 'Full Stack Developer',
                    'company': 'Digital Innovations Inc',
                    'location': location or 'New York, NY',
                    'description': 'Join our team as a Full Stack Developer and work on exciting web applications using modern technologies.',
                    'requirements': ['React/Node.js experience', 'Database knowledge', 'Problem-solving skills'],
                    'salary': '$100,000 - $150,000',
                    'type': 'Full-time',
                    'posted': '1 week ago'
                }
            ],
            'data scientist': [
                {
                    'title': 'Data Scientist',
                    'company': 'Analytics Pro',
                    'location': location or 'Boston, MA',
                    'description': 'We are seeking a Data Scientist to help us derive insights from complex datasets and build predictive models.',
                    'requirements': ['Python/R expertise', 'Machine learning knowledge', 'Statistics background'],
                    'salary': '$110,000 - $160,000',
                    'type': 'Full-time',
                    'posted': '3 days ago'
                }
            ],
            'product manager': [
                {
                    'title': 'Product Manager',
                    'company': 'Innovation Labs',
                    'location': location or 'Seattle, WA',
                    'description': 'Looking for an experienced Product Manager to drive product strategy and work with cross-functional teams.',
                    'requirements': ['Product management experience', 'Technical background', 'Leadership skills'],
                    'salary': '$130,000 - $180,000',
                    'type': 'Full-time',
                    'posted': '1 day ago'
                }
            ]
        }
        
        # Default jobs if no specific match
        default_jobs = [
            {
                'title': 'Software Developer',
                'company': 'Tech Startup',
                'location': location or 'Remote',
                'description': 'Join our innovative team and help build the next generation of software solutions.',
                'requirements': ['Programming experience', 'Problem-solving skills', 'Team player'],
                'salary': '$80,000 - $120,000',
                'type': 'Full-time',
                'posted': '4 days ago'
            },
            {
                'title': 'Junior Developer',
                'company': 'Growth Company',
                'location': location or 'Austin, TX',
                'description': 'Great opportunity for junior developers to grow their skills and advance their careers.',
                'requirements': ['Basic programming knowledge', 'Eagerness to learn', 'Good communication'],
                'salary': '$60,000 - $80,000',
                'type': 'Full-time',
                'posted': '1 week ago'
            }
        ]
        
        # Find matching jobs
        query_lower = query.lower()
        matched_jobs = []
        
        for role, jobs in job_templates.items():
            if role in query_lower:
                matched_jobs.extend(jobs)
        
        # If no specific matches, use default jobs
        if not matched_jobs:
            matched_jobs = default_jobs
        
        # Limit results
        return matched_jobs[:limit]
    
    def _get_fallback_jobs(self, query: str, limit: int) -> List[Dict]:
        """Fallback job listings when API is unavailable"""
        return self._get_mock_job_listings(query, None, limit)
    
    def get_job_recommendations(self, skills: List[str], experience_level: str = "mid") -> List[Dict]:
        """Get job recommendations based on user skills"""
        
        # Map skills to job roles
        skill_to_jobs = {
            'python': ['Python Developer', 'Data Scientist', 'Backend Engineer'],
            'javascript': ['Frontend Developer', 'Full Stack Developer', 'JavaScript Developer'],
            'react': ['React Developer', 'Frontend Developer', 'UI Engineer'],
            'sql': ['Database Developer', 'Data Analyst', 'Backend Engineer'],
            'aws': ['DevOps Engineer', 'Cloud Engineer', 'Solutions Architect'],
            'machine learning': ['ML Engineer', 'Data Scientist', 'AI Researcher']
        }
        
        recommended_jobs = []
        
        for skill in skills:
            skill_lower = skill.lower()
            if skill_lower in skill_to_jobs:
                for job_title in skill_to_jobs[skill_lower]:
                    job = {
                        'title': job_title,
                        'company': 'Tech Company',
                        'location': 'Remote/Hybrid',
                        'description': f'Perfect match for your {skill} skills!',
                        'requirements': [f'Experience with {skill}', 'Team collaboration', 'Problem-solving'],
                        'salary': '$90,000 - $140,000',
                        'type': 'Full-time',
                        'posted': 'Recently',
                        'match_score': 85
                    }
                    recommended_jobs.append(job)
        
        return recommended_jobs[:8]  # Return top 8 recommendations

# Global job service instance
job_service = JobService()

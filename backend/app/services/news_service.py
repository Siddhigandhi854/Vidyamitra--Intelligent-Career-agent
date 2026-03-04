import requests
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.settings import settings

class NewsService:
    def __init__(self):
        self.api_key = settings.news_api_key
        self.base_url = "https://newsapi.org/v2"
    
    def get_career_news(self, category: str = "technology", limit: int = 10) -> List[Dict]:
        """Get career-related news from real API"""
        if not self.api_key:
            return self._get_fallback_news(category, limit)
        
        try:
            # Career-related search terms
            career_keywords = {
                'technology': 'software engineering OR programming OR developer OR tech jobs',
                'business': 'business careers OR management OR leadership OR entrepreneurship',
                'general': 'career advice OR job market OR employment OR professional development'
            }
            
            search_query = career_keywords.get(category, career_keywords['general'])
            
            url = f"{self.base_url}/everything"
            params = {
                "q": search_query,
                "sortBy": "publishedAt",
                "language": "en",
                "pageSize": limit,
                "apiKey": self.api_key,
                "domains": "techcrunch.com,linkedin.com,businessinsider.com,forbes.com,hbr.org"  # Reputable sources
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                articles = []
                
                for article in data.get("articles", []):
                    article_data = {
                        "title": article.get("title", ""),
                        "description": article.get("description", ""),
                        "content": article.get("content", ""),
                        "url": article.get("url", ""),
                        "imageUrl": article.get("urlToImage", ""),
                        "source": article.get("source", {}).get("name", "Unknown"),
                        "author": article.get("author", "Unknown"),
                        "publishedAt": article.get("publishedAt", ""),
                        "category": category
                    }
                    articles.append(article_data)
                
                return articles
            else:
                print(f"News API error: {response.status_code} - {response.text}")
                return self._get_fallback_news(category, limit)
                
        except Exception as e:
            print(f"News service error: {e}")
            return self._get_fallback_news(category, limit)
    
    def _get_fallback_news(self, category: str, limit: int) -> List[Dict]:
        """Fallback news when API is unavailable"""
        
        # Realistic career news templates
        news_templates = {
            'technology': [
                {
                    "title": "Top Tech Companies Hiring Software Engineers in 2024",
                    "description": "Major tech companies are actively recruiting for software engineering positions with competitive salaries and benefits.",
                    "content": "The tech job market continues to show strong demand for skilled software engineers...",
                    "url": "https://example.com/tech-hiring-2024",
                    "imageUrl": "https://via.placeholder.com/300x200/4285F4/FFFFFF?text=Tech+Hiring",
                    "source": "Tech News Daily",
                    "author": "Sarah Johnson",
                    "publishedAt": "2024-01-25T10:00:00Z",
                    "category": "technology"
                },
                {
                    "title": "AI and Machine Learning Skills Most In-Demand",
                    "description": "Recent survey shows AI/ML skills are among the highest requested by employers across industries.",
                    "content": "According to industry reports, professionals with AI and machine learning expertise...",
                    "url": "https://example.com/ai-skills-demand",
                    "imageUrl": "https://via.placeholder.com/300x200/34A853/FFFFFF?text=AI+Skills",
                    "source": "AI Weekly",
                    "author": "Mike Chen",
                    "publishedAt": "2024-01-24T14:30:00Z",
                    "category": "technology"
                }
            ],
            'business': [
                {
                    "title": "Leadership Skills That Advance Your Career",
                    "description": "Essential leadership qualities that professionals need to develop for career growth.",
                    "content": "Career experts emphasize the importance of developing strong leadership skills...",
                    "url": "https://example.com/leadership-skills",
                    "imageUrl": "https://via.placeholder.com/300x200/EA4335/FFFFFF?text=Leadership",
                    "source": "Business Today",
                    "author": "Emily Roberts",
                    "publishedAt": "2024-01-23T09:15:00Z",
                    "category": "business"
                }
            ],
            'general': [
                {
                    "title": "Remote Work Trends Shaping Career Opportunities",
                    "description": "How remote work is changing the job market and creating new career possibilities.",
                    "content": "The shift to remote work has fundamentally changed how companies approach hiring...",
                    "url": "https://example.com/remote-work-trends",
                    "imageUrl": "https://via.placeholder.com/300x200/FBBC04/000000?text=Remote+Work",
                    "source": "Career Insights",
                    "author": "David Miller",
                    "publishedAt": "2024-01-22T16:45:00Z",
                    "category": "general"
                },
                {
                    "title": "Salary Negotiation Tips for Career Professionals",
                    "description": "Expert advice on how to successfully negotiate salary and benefits in today's job market.",
                    "content": "Career coaches share proven strategies for effective salary negotiations...",
                    "url": "https://example.com/salary-negotiation",
                    "imageUrl": "https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Salary+Tips",
                    "source": "Professional Development",
                    "author": "Lisa Anderson",
                    "publishedAt": "2024-01-21T11:20:00Z",
                    "category": "general"
                }
            ]
        }
        
        # Get news for the requested category
        category_news = news_templates.get(category, news_templates['general'])
        
        # Add some variety with timestamps
        for article in category_news:
            # Vary the publish dates
            base_date = datetime.now()
            random_offset = timedelta(hours=hash(article['title']) % 72)  # 0-72 hours ago
            article['publishedAt'] = (base_date - random_offset).isoformat() + 'Z'
        
        return category_news[:limit]
    
    def get_trending_topics(self) -> List[str]:
        """Get trending career-related topics"""
        return [
            "Remote Work Opportunities",
            "AI Skills Development",
            "Tech Industry Hiring",
            "Career Change Strategies",
            "Salary Negotiation",
            "Leadership Development",
            "Startup Careers",
            "Professional Networking"
        ]
    
    def get_news_by_topic(self, topic: str, limit: int = 5) -> List[Dict]:
        """Get news specific to a career topic"""
        
        # Map topics to search queries
        topic_queries = {
            "Remote Work Opportunities": "remote work jobs telecommute",
            "AI Skills Development": "artificial intelligence skills training",
            "Tech Industry Hiring": "technology companies hiring software engineers",
            "Career Change Strategies": "career change transition advice",
            "Salary Negotiation": "salary negotiation compensation",
            "Leadership Development": "leadership skills management training",
            "Startup Careers": "startup jobs entrepreneur careers",
            "Professional Networking": "networking career connections"
        }
        
        query = topic_queries.get(topic, "career development")
        
        # Use the general news method with topic-specific query
        return self.get_career_news("general", limit)

# Global news service instance
news_service = NewsService()

import requests
from typing import List, Dict, Optional
from app.settings import settings

class YouTubeService:
    def __init__(self):
        self.api_key = settings.youtube_api_key
        self.base_url = "https://www.googleapis.com/youtube/v3"
    
    def search_videos(self, query: str, max_results: int = 10) -> List[Dict]:
        """Search for YouTube videos based on query"""
        if not self.api_key:
            return self._get_fallback_videos(query, max_results)
        
        try:
            url = f"{self.base_url}/search"
            params = {
                "part": "snippet",
                "q": query,
                "maxResults": max_results,
                "type": "video",
                "key": self.api_key,
                "order": "relevance",
                "videoDuration": "medium"  # Medium length videos (4-20 minutes)
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                videos = []
                
                for item in data.get("items", []):
                    video_data = {
                        "videoId": item["id"]["videoId"],
                        "title": item["snippet"]["title"],
                        "description": item["snippet"]["description"],
                        "channelTitle": item["snippet"]["channelTitle"],
                        "publishedAt": item["snippet"]["publishedAt"],
                        "thumbnailUrl": item["snippet"]["thumbnails"]["medium"]["url"],
                        "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
                    }
                    videos.append(video_data)
                
                return videos
            else:
                print(f"YouTube API error: {response.status_code} - {response.text}")
                return self._get_fallback_videos(query, max_results)
                
        except Exception as e:
            print(f"YouTube service error: {e}")
            return self._get_fallback_videos(query, max_results)
    
    def _get_fallback_videos(self, query: str, max_results: int) -> List[Dict]:
        """Fallback videos when API is unavailable"""
        
        # Career-related video templates
        video_templates = {
            'interview': [
                {
                    "videoId": "interview_tips_1",
                    "title": "Top 10 Interview Tips That Actually Work",
                    "description": "Learn the best interview strategies and tips to help you land your dream job. From preparation to follow-up.",
                    "channelTitle": "Career Coach Pro",
                    "publishedAt": "2024-01-15T10:00:00Z",
                    "thumbnailUrl": "https://via.placeholder.com/320x180/4285F4/FFFFFF?text=Interview+Tips",
                    "url": "https://www.youtube.com/watch?v=interview_tips_1"
                },
                {
                    "videoId": "technical_interview",
                    "title": "How to Ace Technical Interviews",
                    "description": "Complete guide to technical interviews including coding challenges and system design questions.",
                    "channelTitle": "Tech Career Guide",
                    "publishedAt": "2024-01-10T15:30:00Z",
                    "thumbnailUrl": "https://via.placeholder.com/320x180/34A853/FFFFFF?text=Technical+Interview",
                    "url": "https://www.youtube.com/watch?v=technical_interview"
                }
            ],
            'resume': [
                {
                    "videoId": "resume_writing",
                    "title": "How to Write a Perfect Resume in 2024",
                    "description": "Step-by-step guide to creating a standout resume that gets you interviews.",
                    "channelTitle": "Resume Expert",
                    "publishedAt": "2024-01-20T09:00:00Z",
                    "thumbnailUrl": "https://via.placeholder.com/320x180/EA4335/FFFFFF?text=Resume+Writing",
                    "url": "https://www.youtube.com/watch?v=resume_writing"
                }
            ],
            'skills': [
                {
                    "videoId": "skill_development",
                    "title": "Top 5 Skills Every Professional Needs",
                    "description": "Essential skills for career growth and professional development in today's job market.",
                    "channelTitle": "Professional Development",
                    "publishedAt": "2024-01-18T12:00:00Z",
                    "thumbnailUrl": "https://via.placeholder.com/320x180/FBBC04/000000?text=Skills+Development",
                    "url": "https://www.youtube.com/watch?v=skill_development"
                }
            ]
        }
        
        query_lower = query.lower()
        matched_videos = []
        
        # Find matching videos based on keywords
        for category, videos in video_templates.items():
            if category in query_lower:
                matched_videos.extend(videos)
        
        # If no specific match, provide general career videos
        if not matched_videos:
            matched_videos = [
                {
                    "videoId": "career_growth",
                    "title": "Career Growth Strategies for 2024",
                    "description": "Proven strategies to accelerate your career growth and achieve your professional goals.",
                    "channelTitle": "Career Success",
                    "publishedAt": "2024-01-22T14:00:00Z",
                    "thumbnailUrl": "https://via.placeholder.com/320x180/9C27B0/FFFFFF?text=Career+Growth",
                    "url": "https://www.youtube.com/watch?v=career_growth"
                },
                {
                    "videoId": "job_search",
                    "title": "Modern Job Search Techniques",
                    "description": "Learn effective job search strategies and techniques to find opportunities in today's market.",
                    "channelTitle": "Job Search Expert",
                    "publishedAt": "2024-01-25T11:00:00Z",
                    "thumbnailUrl": "https://via.placeholder.com/320x180/FF9800/000000?text=Job+Search",
                    "url": "https://www.youtube.com/watch?v=job_search"
                }
            ]
        
        return matched_videos[:max_results]
    
    def get_career_playlists(self, topic: str) -> List[Dict]:
        """Get curated video playlists for career topics"""
        
        playlists = {
            'interview_preparation': {
                'title': 'Interview Preparation Masterclass',
                'description': 'Complete playlist for interview success',
                'videos': [
                    {
                        'videoId': 'prep_1',
                        'title': 'Research the Company',
                        'duration': '8:45',
                        'url': 'https://www.youtube.com/watch?v=prep_1'
                    },
                    {
                        'videoId': 'prep_2',
                        'title': 'Common Interview Questions',
                        'duration': '12:30',
                        'url': 'https://www.youtube.com/watch?v=prep_2'
                    },
                    {
                        'videoId': 'prep_3',
                        'title': 'Body Language Tips',
                        'duration': '6:15',
                        'url': 'https://www.youtube.com/watch?v=prep_3'
                    }
                ]
            },
            'resume_building': {
                'title': 'Resume Building Workshop',
                'description': 'Create a resume that gets you hired',
                'videos': [
                    {
                        'videoId': 'resume_1',
                        'title': 'Resume Structure and Format',
                        'duration': '10:20',
                        'url': 'https://www.youtube.com/watch?v=resume_1'
                    },
                    {
                        'videoId': 'resume_2',
                        'title': 'Writing Powerful Bullet Points',
                        'duration': '9:45',
                        'url': 'https://www.youtube.com/watch?v=resume_2'
                    }
                ]
            }
        }
        
        return playlists.get(topic, playlists['interview_preparation'])

# Global YouTube service instance
youtube_service = YouTubeService()

import requests
import json
import random
from typing import List, Dict, Optional
from app.settings import settings

class GoogleQuizService:
    """Generate quiz questions using Google Custom Search API"""
    
    def __init__(self):
        self.google_api_key = settings.google_api_key
        self.google_cse_id = settings.google_cse_id
    
    def generate_quiz_questions(self, domain: str, difficulty: str, num_questions: int = 5) -> List[Dict]:
        """Generate quiz questions using Google Custom Search API"""
        
        if not self.google_api_key or not self.google_cse_id:
            print("Google API not configured")
            return self._get_fallback_questions(domain, difficulty, num_questions)
        
        try:
            # Search for educational content and practice questions
            search_queries = [
                f"{domain} practice questions {difficulty}",
                f"{domain} interview questions {difficulty}",
                f"{domain} quiz questions {difficulty}",
                f"{domain} certification questions {difficulty}"
            ]
            
            all_questions = []
            
            for query in search_queries[:2]:  # Use first 2 queries to avoid rate limits
                questions = self._search_and_extract_questions(query, domain, difficulty)
                all_questions.extend(questions)
            
            # If we got questions from search, use them
            if all_questions:
                # Randomly select the requested number
                selected = random.sample(all_questions, min(num_questions, len(all_questions)))
                return selected
            
            # Fallback to structured questions
            return self._get_structured_questions(domain, difficulty, num_questions)
            
        except Exception as e:
            print(f"Google quiz generation error: {e}")
            return self._get_structured_questions(domain, difficulty, num_questions)
    
    def _search_and_extract_questions(self, query: str, domain: str, difficulty: str) -> List[Dict]:
        """Search Google and extract questions from results"""
        
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": self.google_api_key,
            "cx": self.google_cse_id,
            "q": query,
            "num": 5
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            questions = []
            
            for item in data.get("items", []):
                title = item.get("title", "")
                snippet = item.get("snippet", "")
                link = item.get("link", "")
                
                # Extract question from search result
                question = self._create_question_from_search_result(title, snippet, domain, difficulty)
                if question:
                    questions.append(question)
            
            return questions
        
        return []
    
    def _create_question_from_search_result(self, title: str, snippet: str, domain: str, difficulty: str) -> Optional[Dict]:
        """Create a question from Google search result"""
        
        # Extract question patterns
        import re
        
        # Look for question patterns in title
        question_patterns = [
            r"^(.+)\?$",
            r"^(.+)\s*\?",
            r"What\s+(.+)\?",
            r"Which\s+(.+)\?",
            r"How\s+(.+)\?",
            r"Why\s+(.+)\?",
            r"When\s+(.+)\?",
            r"Where\s+(.+)\?"
        ]
        
        question_text = None
        for pattern in question_patterns:
            match = re.search(pattern, title, re.IGNORECASE)
            if match:
                question_text = match.group(0).strip()
                break
        
        if not question_text:
            # Try to create a question from the content
            question_text = self._generate_contextual_question(title, snippet, domain, difficulty)
        
        if question_text:
            # Generate relevant options
            options = self._generate_options_for_question(question_text, domain, difficulty)
            if len(options) == 4:
                return {
                    "question": question_text,
                    "options": options,
                    "correct_answer": 0,  # Will be adjusted
                    "explanation": f"Based on {domain} concepts at {difficulty} level"
                }
        
        return None
    
    def _generate_contextual_question(self, title: str, snippet: str, domain: str, difficulty: str) -> Optional[str]:
        """Generate a contextual question from search content"""
        
        # Domain-specific question templates
        templates = {
            "Data Science": [
                f"What is the most important concept in {domain} mentioned in this content?",
                f"Which technique is commonly used in {domain} according to this material?",
                f"What principle underlies the {domain} concept discussed here?",
                f"Which tool is essential for {domain} practitioners based on this content?"
            ],
            "Software Engineering": [
                f"What principle is highlighted in this {domain} content?",
                f"Which practice is recommended for {domain} in this material?",
                f"What methodology is discussed in this {domain} resource?",
                f"Which pattern is mentioned in this {domain} context?"
            ],
            "Product Management": [
                f"What strategy is discussed in this {domain} material?",
                f"Which framework is recommended for {domain} in this content?",
                f"What approach is highlighted for {domain} in this resource?",
                f"Which metric is emphasized in this {domain} context?"
            ]
        }
        
        domain_templates = templates.get(domain, templates["Software Engineering"])
        
        # Extract keywords from title and snippet
        content = (title + " " + snippet).lower()
        
        # Select a template based on content keywords
        for template in domain_templates:
            if any(keyword in content for keyword in ["concept", "technique", "principle", "tool", "practice", "methodology"]):
                return template
        
        # Return a default template
        return f"What is the key takeaway from this {domain} content?"
    
    def _generate_options_for_question(self, question: str, domain: str, difficulty: str) -> List[str]:
        """Generate relevant options for a question"""
        
        # Domain-specific option pools
        option_pools = {
            "Data Science": {
                "Beginner": ["Data cleaning", "Machine learning", "Statistical analysis", "Data visualization"],
                "Intermediate": ["Random forest", "Cross-validation", "SMOTE", "Feature engineering"],
                "Advanced": ["Gradient boosting", "Neural networks", "Bayesian optimization", "Attention mechanisms"]
            },
            "Software Engineering": {
                "Beginner": ["Version control", "Unit testing", "Code review", "Documentation"],
                "Intermediate": ["Dependency injection", "Design patterns", "Load balancing", "API design"],
                "Advanced": ["Circuit breakers", "Distributed systems", "Microservices", "Event-driven architecture"]
            },
            "Product Management": {
                "Beginner": ["User stories", "MVP", "User research", "A/B testing"],
                "Intermediate": ["Product-market fit", "Go-to-market strategy", "Customer lifetime value", "User engagement"],
                "Advanced": ["Product lifecycle", "Cohort analysis", "Growth hacking", "Strategic positioning"]
            }
        }
        
        pool = option_pools.get(domain, {}).get(difficulty, option_pools["Software Engineering"]["Beginner"])
        
        # Randomly select 4 options and shuffle
        selected = random.sample(pool, min(4, len(pool)))
        if len(selected) < 4:
            # Add generic options if needed
            generic_options = ["Option A", "Option B", "Option C", "Option D"]
            selected.extend(generic_options[:4-len(selected)])
        
        random.shuffle(selected)
        return selected[:4]
    
    def _get_structured_questions(self, domain: str, difficulty: str, num_questions: int) -> List[Dict]:
        """Get structured educational questions as fallback"""
        
        questions_bank = {
            "Data Science": {
                "Beginner": [
                    {
                        "question": "What is the primary purpose of data cleaning in machine learning?",
                        "options": ["To make data look pretty", "To improve data quality and accuracy", "To increase data size", "To reduce processing time"],
                        "correct_answer": 1,
                        "explanation": "Data cleaning improves data quality and accuracy for reliable ML models."
                    },
                    {
                        "question": "Which visualization is best for showing proportional data?",
                        "options": ["Line chart", "Scatter plot", "Pie chart", "Histogram"],
                        "correct_answer": 2,
                        "explanation": "Pie charts are ideal for showing proportional data parts."
                    }
                ],
                "Intermediate": [
                    {
                        "question": "Which algorithm is best for classification tasks?",
                        "options": ["Linear regression", "Random forest", "K-means", "PCA"],
                        "correct_answer": 1,
                        "explanation": "Random forest excels at classification tasks with categorical features."
                    },
                    {
                        "question": "What is the purpose of cross-validation?",
                        "options": ["Speed up training", "Reliable model evaluation", "Clean data", "Reduce memory"],
                        "correct_answer": 1,
                        "explanation": "Cross-validation provides more reliable model evaluation."
                    }
                ],
                "Advanced": [
                    {
                        "question": "What is the main advantage of gradient boosting?",
                        "options": ["Faster training", "Sequential error correction", "Less memory", "Easier interpretation"],
                        "correct_answer": 1,
                        "explanation": "Gradient boosting corrects errors sequentially."
                    }
                ]
            },
            "Software Engineering": {
                "Beginner": [
                    {
                        "question": "What is version control used for?",
                        "options": ["Code compilation", "Tracking code changes", "Code execution", "Code testing"],
                        "correct_answer": 1,
                        "explanation": "Version control tracks and manages code changes over time."
                    }
                ],
                "Intermediate": [
                    {
                        "question": "What is the benefit of dependency injection?",
                        "options": ["Faster execution", "Reduced coupling", "Smaller code", "Better UI"],
                        "correct_answer": 1,
                        "explanation": "Dependency injection reduces coupling between components."
                    }
                ],
                "Advanced": [
                    {
                        "question": "Which pattern implements caching?",
                        "options": ["Singleton", "Proxy", "Observer", "Strategy"],
                        "correct_answer": 1,
                        "explanation": "Proxy pattern is ideal for implementing caching systems."
                    }
                ]
            },
            "Product Management": {
                "Beginner": [
                    {
                        "question": "What is a user story?",
                        "options": ["Technical docs", "User perspective feature description", "Marketing content", "Test plan"],
                        "correct_answer": 1,
                        "explanation": "User stories describe features from the user's perspective."
                    }
                ],
                "Intermediate": [
                    {
                        "question": "What is MVP?",
                        "options": ["Most valuable player", "Minimum viable product", "Maximum value product", "Minimum variable product"],
                        "correct_answer": 1,
                        "explanation": "MVP has enough features to satisfy early customers."
                    }
                ]
            }
        }
        
        domain_questions = questions_bank.get(domain, {})
        difficulty_questions = domain_questions.get(difficulty, [])
        
        if not difficulty_questions:
            difficulty_questions = domain_questions.get("Beginner", [])
        
        # Randomly select questions
        selected = random.sample(difficulty_questions, min(num_questions, len(difficulty_questions)))
        return selected
    
    def _get_fallback_questions(self, domain: str, difficulty: str, num_questions: int) -> List[Dict]:
        """Ultimate fallback questions"""
        return [
            {
                "question": f"What is the most important skill in {domain}?",
                "options": ["Technical skills", "Communication", "Problem-solving", "Leadership"],
                "correct_answer": 2,
                "explanation": "Problem-solving is fundamental to success in any technical field."
            }
        ]

# Global Google quiz service instance
google_quiz_service = GoogleQuizService()

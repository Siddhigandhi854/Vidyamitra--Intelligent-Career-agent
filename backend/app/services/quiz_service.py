import requests
import json
import random
from typing import List, Dict, Optional
from app.settings import settings

class QuizService:
    def __init__(self):
        self.openai_api_key = settings.openai_api_key
        self.google_api_key = settings.google_api_key
        
        # Initialize OpenAI client if available
        self.openai_client = None
        if self.openai_api_key:
            try:
                import openai
                self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
            except Exception as e:
                print(f"Failed to initialize OpenAI client: {e}")
    
    def generate_quiz_questions(self, domain: str, difficulty: str, num_questions: int = 5) -> List[Dict]:
        """Generate quiz questions using multiple APIs"""
        
        # Try OpenAI first
        if self.openai_client:
            try:
                questions = self._generate_with_openai(domain, difficulty, num_questions)
                if questions:
                    return questions
            except Exception as e:
                print(f"OpenAI quiz generation failed: {e}")
        
        # Fallback to Google Search for educational content
        if self.google_api_key:
            try:
                questions = self._generate_with_google_search(domain, difficulty, num_questions)
                if questions:
                    return questions
            except Exception as e:
                print(f"Google quiz generation failed: {e}")
        
        # Final fallback to curated question bank
        return self._generate_curated_questions(domain, difficulty, num_questions)
    
    def _generate_with_openai(self, domain: str, difficulty: str, num_questions: int) -> List[Dict]:
        """Generate questions using OpenAI"""
        prompt = f"""
        Generate {num_questions} multiple-choice questions for {domain} at {difficulty} level.
        
        Return JSON array:
        [
            {{
                "question": "Clear question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": 0,
                "explanation": "Brief explanation of the answer"
            }}
        ]
        
        Requirements:
        - Questions relevant to {domain}
        - Difficulty appropriate for {difficulty}
        - Only one correct answer (0-3 index)
        - Educational and practical content
        """
        
        response = self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert educational content creator. Generate high-quality, practical quiz questions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        questions_data = json.loads(response.choices[0].message.content)
        return questions_data
    
    def _generate_with_google_search(self, domain: str, difficulty: str, num_questions: int) -> List[Dict]:
        """Generate questions using Google Search to find educational content"""
        
        # Search for practice questions in the domain
        search_query = f"{domain} practice questions {difficulty} interview"
        
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": self.google_api_key,
            "cx": settings.google_cse_id,
            "q": search_query,
            "num": 5
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            questions = []
            
            # Create questions based on search results
            for i, item in enumerate(data.get("items", [])[:num_questions]):
                title = item.get("title", "")
                snippet = item.get("snippet", "")
                
                # Extract question concepts from search results
                question = self._create_question_from_content(title, snippet, domain, i)
                if question:
                    questions.append(question)
            
            return questions
        
        return []
    
    def _create_question_from_content(self, title: str, snippet: str, domain: str, index: int) -> Optional[Dict]:
        """Create a question from search content"""
        
        # Question templates based on domain
        question_templates = {
            "Data Science": [
                {
                    "question": f"Based on {title}, what is the most important concept in data science?",
                    "options": ["Data cleaning", "Machine learning", "Statistical analysis", "Data visualization"],
                    "correct_answer": 2,
                    "explanation": "Statistical analysis is fundamental to data science"
                },
                {
                    "question": f"What technique is commonly mentioned in {domain} practices?",
                    "options": ["Regression analysis", "Network programming", "Database design", "UI development"],
                    "correct_answer": 0,
                    "explanation": "Regression analysis is a core technique in data science"
                }
            ],
            "Software Engineering": [
                {
                    "question": f"What principle is highlighted in {title}?",
                    "options": ["SOLID principles", "Agile methodology", "Waterfall model", "Spiral model"],
                    "correct_answer": 1,
                    "explanation": "Agile methodology is widely adopted in software engineering"
                },
                {
                    "question": f"Which practice is essential for {domain}?",
                    "options": ["Code testing", "Graphic design", "Marketing", "Sales"],
                    "correct_answer": 0,
                    "explanation": "Code testing is crucial for software quality"
                }
            ],
            "Product Management": [
                {
                    "question": f"What key skill is emphasized in {title}?",
                    "options": ["Technical coding", "User research", "Database administration", "Network security"],
                    "correct_answer": 1,
                    "explanation": "User research is fundamental to product management"
                },
                {
                    "question": f"Which framework is mentioned in {domain} best practices?",
                    "options": ["React framework", "Agile framework", "Django framework", "Spring framework"],
                    "correct_answer": 1,
                    "explanation": "Agile framework is commonly used in product management"
                }
            ]
        }
        
        templates = question_templates.get(domain, question_templates["Software Engineering"])
        return templates[index % len(templates)] if templates else None
    
    def _generate_curated_questions(self, domain: str, difficulty: str, num_questions: int) -> List[Dict]:
        """Generate questions from curated question bank"""
        
        question_bank = {
            "Data Science": {
                "Beginner": [
                    {
                        "question": "What is the primary purpose of data cleaning?",
                        "options": ["To make data look pretty", "To improve data quality", "To increase data size", "To reduce processing time"],
                        "correct_answer": 1,
                        "explanation": "Data cleaning improves data quality and accuracy"
                    },
                    {
                        "question": "Which visualization is best for showing proportions?",
                        "options": ["Line chart", "Scatter plot", "Pie chart", "Histogram"],
                        "correct_answer": 2,
                        "explanation": "Pie charts are ideal for showing proportional data"
                    },
                    {
                        "question": "What does 'overfitting' mean in machine learning?",
                        "options": ["Model is too simple", "Model memorizes training data", "Model is perfect", "Model is too fast"],
                        "correct_answer": 1,
                        "explanation": "Overfitting occurs when a model memorizes training data instead of learning patterns"
                    }
                ],
                "Intermediate": [
                    {
                        "question": "Which algorithm is best for classification tasks?",
                        "options": ["Linear regression", "Random forest", "K-means", "PCA"],
                        "correct_answer": 1,
                        "explanation": "Random forest is excellent for classification tasks"
                    },
                    {
                        "question": "What is the purpose of cross-validation?",
                        "options": ["To speed up training", "To evaluate model performance", "To clean data", "To visualize results"],
                        "correct_answer": 1,
                        "explanation": "Cross-validation helps evaluate model performance on unseen data"
                    }
                ],
                "Advanced": [
                    {
                        "question": "Which technique handles imbalanced datasets best?",
                        "options": ["Remove majority class", "SMOTE", "Ignore imbalance", "Use accuracy only"],
                        "correct_answer": 1,
                        "explanation": "SMOTE synthesizes minority class samples to balance the dataset"
                    }
                ]
            },
            "Software Engineering": {
                "Beginner": [
                    {
                        "question": "What is version control used for?",
                        "options": ["Code compilation", "Tracking code changes", "Code execution", "Code testing"],
                        "correct_answer": 1,
                        "explanation": "Version control tracks and manages code changes over time"
                    },
                    {
                        "question": "Which principle states 'a class should have only one reason to change'?",
                        "options": ["DRY", "Single Responsibility", "Open/Closed", "Liskov Substitution"],
                        "correct_answer": 1,
                        "explanation": "Single Responsibility Principle states a class should have one reason to change"
                    }
                ],
                "Intermediate": [
                    {
                        "question": "What is the purpose of dependency injection?",
                        "options": ["To improve performance", "To reduce coupling", "To increase memory", "To simplify syntax"],
                        "correct_answer": 1,
                        "explanation": "Dependency injection reduces coupling between components"
                    }
                ],
                "Advanced": [
                    {
                        "question": "Which pattern is best for implementing a caching system?",
                        "options": ["Singleton", "Observer", "Proxy", "Decorator"],
                        "correct_answer": 2,
                        "explanation": "Proxy pattern is ideal for implementing caching systems"
                    }
                ]
            },
            "Product Management": {
                "Beginner": [
                    {
                        "question": "What is a user story?",
                        "options": ["Technical documentation", "Feature description from user perspective", "Marketing content", "Test plan"],
                        "correct_answer": 1,
                        "explanation": "User stories describe features from the user's perspective"
                    }
                ],
                "Intermediate": [
                    {
                        "question": "What is MVP?",
                        "options": ["Most Valuable Player", "Minimum Viable Product", "Maximum Value Product", "Minimum Variable Product"],
                        "correct_answer": 1,
                        "explanation": "MVP (Minimum Viable Product) has enough features to satisfy early customers"
                    }
                ]
            }
        }
        
        # Get questions for domain and difficulty
        domain_questions = question_bank.get(domain, {})
        difficulty_questions = domain_questions.get(difficulty, domain_questions.get("Beginner", []))
        
        # If no specific questions, get from beginner level
        if not difficulty_questions:
            difficulty_questions = domain_questions.get("Beginner", [])
        
        # Randomly select questions
        selected = random.sample(difficulty_questions, min(num_questions, len(difficulty_questions)))
        
        # Add variation to make them unique
        for i, question in enumerate(selected):
            question_copy = question.copy()
            question_copy["id"] = i + 1
            selected[i] = question_copy
        
        return selected
    
    def evaluate_quiz_answers(self, questions: List[Dict], answers: List[int]) -> Dict:
        """Evaluate quiz answers and provide detailed feedback"""
        
        total = len(answers)
        score = 0
        details = []
        
        for i, (question, answer) in enumerate(zip(questions, answers)):
            if i < len(questions):
                correct_answer = question.get("correct_answer", 0)
                explanation = question.get("explanation", "")
                
                if answer == correct_answer:
                    score += 1
                    details.append(f"Question {i + 1}: Correct! {explanation}")
                else:
                    details.append(f"Question {i + 1}: Incorrect. {explanation}")
            else:
                details.append(f"Question {i + 1}: No question found for this answer.")
        
        return {
            "score": score,
            "total": total,
            "percentage": round((score / total) * 100, 1) if total > 0 else 0,
            "details": details
        }

# Global quiz service instance
quiz_service = QuizService()

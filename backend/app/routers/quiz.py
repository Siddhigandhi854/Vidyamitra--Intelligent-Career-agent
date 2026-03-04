from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
import json

from app.routers.auth import get_current_user, User
from app.services.gemini_service import gemini_service


router = APIRouter(prefix="/quiz", tags=["quiz"])


class QuizConfig(BaseModel):
    domains: list[str]
    difficulties: list[str]


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: list[str]
    correct_index: Optional[int] = None
    explanation: Optional[str] = ""


class QuizStartRequest(BaseModel):
    domain: str
    difficulty: str
    num_questions: int = 5


class QuizStartResponse(BaseModel):
    session_id: str
    questions: list[QuizQuestion]


class QuizSubmitRequest(BaseModel):
    session_id: str
    answers: list[int]


class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    percentage: float
    details: list[str]


@router.get("/config", response_model=QuizConfig)
async def get_quiz_config(current_user: User = Depends(get_current_user)) -> QuizConfig:
    return QuizConfig(
        domains=["Software Engineering", "Data Science", "Product Management"],
        difficulties=["Beginner", "Intermediate", "Advanced"],
    )


@router.post("/start", response_model=QuizStartResponse)
async def start_quiz(
    payload: QuizStartRequest, current_user: User = Depends(get_current_user)
) -> QuizStartResponse:
    """Start a quiz with Gemini-generated questions"""
    
    try:
        # Generate quiz questions using Gemini
        prompt = f"""
        Generate {payload.num_questions} multiple-choice questions for {payload.domain} at {payload.difficulty} level.
        
        Return the response as a JSON array with this format:
        [
            {{
                "question": "Clear question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": 0,
                "explanation": "Brief explanation of why this answer is correct"
            }}
        ]
        
        Requirements:
        1. Questions must be relevant to {payload.domain}
        2. Difficulty must match {payload.difficulty}
        3. Only one correct answer per question (0-based index: 0, 1, 2, or 3)
        4. Provide educational explanations
        5. Make questions practical and realistic
        """
        
        response = gemini_service.generate_content(prompt, temperature=0.7, max_tokens=2000)
        
        if not response:
            raise HTTPException(status_code=500, detail="Failed to generate quiz questions")
        
        # Parse the response with better error handling
        try:
            questions_data = json.loads(response)
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Raw response: {response}")
            # Try to extract JSON from markdown
            if "```json" in response:
                json_start = response.find("```json") + 7
                json_end = response.find("```", json_start)
                if json_end > json_start:
                    json_content = response[json_start:json_end].strip()
                    questions_data = json.loads(json_content)
                else:
                    raise HTTPException(status_code=500, detail="Invalid JSON format in response")
            else:
                raise HTTPException(status_code=500, detail="Could not parse quiz questions")
        
        # Ensure we have a list
        if not isinstance(questions_data, list):
            raise HTTPException(status_code=500, detail="Invalid quiz format")
        
        # Convert to our model format
        questions = []
        for i, q_data in enumerate(questions_data):
            questions.append(QuizQuestion(
                id=i + 1,
                question=q_data["question"],
                options=q_data["options"],
                correct_index=q_data.get("correct_answer"),
                explanation=q_data.get("explanation", "")
            ))
        
        return QuizStartResponse(
            session_id=str(uuid.uuid4()),
            questions=questions
        )
        
    except Exception as e:
        print(f"Error generating quiz questions: {e}")
        # Fallback to curated questions
        questions = _get_fallback_questions(payload.domain, payload.difficulty, payload.num_questions)
        
        return QuizStartResponse(
            session_id=str(uuid.uuid4()),
            questions=questions
        )

def _get_fallback_questions(domain: str, difficulty: str, num_questions: int) -> List[QuizQuestion]:
    """Get fallback educational questions"""
    
    fallback_questions = {
        "Data Science": [
            QuizQuestion(
                id=1,
                question="What is the primary purpose of data cleaning in machine learning?",
                options=["Make data look pretty", "Improve data quality", "Increase data size", "Reduce processing time"],
                correct_index=1,
                explanation="Data cleaning improves data quality and accuracy for reliable ML models"
            ),
            QuizQuestion(
                id=2,
                question="Which visualization is best for showing proportional data?",
                options=["Line chart", "Scatter plot", "Pie chart", "Histogram"],
                correct_index=2,
                explanation="Pie charts are ideal for showing proportional data parts"
            ),
            QuizQuestion(
                id=3,
                question="What does 'overfitting' mean in machine learning?",
                options=["Model is too simple", "Model memorizes training data", "Model is perfect", "Model processes too fast"],
                correct_index=1,
                explanation="Overfitting occurs when a model memorizes training data instead of learning patterns"
            ),
            QuizQuestion(
                id=4,
                question="What is the purpose of cross-validation?",
                options=["Speed up training", "Test model on unseen data", "Reduce memory usage", "Simplify model"],
                correct_index=1,
                explanation="Cross-validation tests model performance on unseen data"
            ),
            QuizQuestion(
                id=5,
                question="Which algorithm is best for classification tasks?",
                options=["Linear regression", "Random forest", "K-means clustering", "PCA"],
                correct_index=1,
                explanation="Random forest is excellent for classification tasks"
            ),
            QuizQuestion(
                id=6,
                question="What is the curse of dimensionality?",
                options=["Too much data", "Too many features", "Too few samples", "Too slow training"],
                correct_index=1,
                explanation="Curse of dimensionality refers to problems with high-dimensional data"
            ),
            QuizQuestion(
                id=7,
                question="What is precision in classification?",
                options=["True positive rate", "True positive / (true positive + false positive)", "True positive / (true positive + false negative)", "Overall accuracy"],
                correct_index=1,
                explanation="Precision measures true positive rate among positive predictions"
            ),
            QuizQuestion(
                id=8,
                question="What is the purpose of feature scaling?",
                options=["Increase data size", "Normalize feature ranges", "Reduce features", "Speed up training"],
                correct_index=1,
                explanation="Feature scaling normalizes feature ranges for better model performance"
            ),
            QuizQuestion(
                id=9,
                question="What is ensemble learning?",
                options=["Single model training", "Combining multiple models", "Data preprocessing", "Model deployment"],
                correct_index=1,
                explanation="Ensemble learning combines multiple models for better performance"
            ),
            QuizQuestion(
                id=10,
                question="What is the difference between supervised and unsupervised learning?",
                options=["No difference", "Supervised uses labeled data, unsupervised uses unlabeled", "Supervised is faster", "Unsupervised is more accurate"],
                correct_index=1,
                explanation="Supervised learning uses labeled data, unsupervised uses unlabeled data"
            )
        ],
        "Software Engineering": [
            QuizQuestion(
                id=1,
                question="What is version control used for?",
                options=["Code compilation", "Tracking code changes", "Code execution", "Code testing"],
                correct_index=1,
                explanation="Version control tracks and manages code changes over time"
            ),
            QuizQuestion(
                id=2,
                question="Which principle states 'a class should have only one reason to change'?",
                options=["DRY principle", "Single Responsibility Principle", "Open/Closed Principle", "Liskov Substitution Principle"],
                correct_index=1,
                explanation="Single Responsibility Principle states that a class should have only one reason to change"
            ),
            QuizQuestion(
                id=3,
                question="What is the time complexity of binary search?",
                options=["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                correct_index=2,
                explanation="Binary search has O(log n) time complexity"
            ),
            QuizQuestion(
                id=4,
                question="What does REST stand for?",
                options=["Representational State Transfer", "Remote State Transfer", "Resource State Transfer", "Representational Service Transfer"],
                correct_index=0,
                explanation="REST stands for Representational State Transfer"
            ),
            QuizQuestion(
                id=5,
                question="Which HTTP method is idempotent?",
                options=["GET", "POST", "PUT", "DELETE"],
                correct_index=2,
                explanation="PUT method is idempotent in HTTP"
            ),
            QuizQuestion(
                id=6,
                question="What is the purpose of dependency injection?",
                options=["Code obfuscation", "Loose coupling", "Code optimization", "Memory management"],
                correct_index=1,
                explanation="Dependency injection promotes loose coupling between components"
            ),
            QuizQuestion(
                id=7,
                question="What is a microservice?",
                options=["Large monolithic application", "Small independent service", "Database design pattern", "UI component"],
                correct_index=1,
                explanation="Microservice is a small, independently deployable service"
            ),
            QuizQuestion(
                id=8,
                question="What is the difference between SQL and NoSQL?",
                options=["No difference", "SQL is relational, NoSQL is non-relational", "SQL is faster", "NoSQL is more secure"],
                correct_index=1,
                explanation="SQL databases are relational, NoSQL databases are non-relational"
            ),
            QuizQuestion(
                id=9,
                question="What is continuous integration?",
                options=["Manual testing", "Automated building and testing", "Code deployment", "Code review"],
                correct_index=1,
                explanation="CI involves automated building and testing of code changes"
            ),
            QuizQuestion(
                id=10,
                question="What is the purpose of a load balancer?",
                options=["Code compilation", "Distribute traffic across servers", "Database optimization", "Security enhancement"],
                correct_index=1,
                explanation="Load balancer distributes incoming traffic across multiple servers"
            )
        ],
        "Product Management": [
            QuizQuestion(
                id=1,
                question="What is a user story?",
                options=["Technical documentation", "Feature description from user's perspective", "Marketing content", "Test plan"],
                correct_index=1,
                explanation="User stories describe features from the user's perspective"
            ),
            QuizQuestion(
                id=2,
                question="What does MVP stand for?",
                options=["Most Valuable Player", "Minimum Viable Product", "Maximum Value Product", "Minimum Variable Product"],
                correct_index=1,
                explanation="MVP has enough features to satisfy early customers and provide feedback"
            ),
            QuizQuestion(
                id=3,
                question="What is product-market fit?",
                options=["Technical perfection", "Strong market demand", "Most features", "Cheapest price"],
                correct_index=1,
                explanation="Product-market fit occurs when a product satisfies strong market demand"
            ),
            QuizQuestion(
                id=4,
                question="What is a product roadmap?",
                options=["Technical specifications", "Strategic product plan", "Marketing materials", "User manual"],
                correct_index=1,
                explanation="Product roadmap outlines strategic product development plans"
            ),
            QuizQuestion(
                id=5,
                question="What is the purpose of user personas?",
                options=["Technical documentation", "Represent target users", "Marketing content", "Test cases"],
                correct_index=1,
                explanation="User personas represent characteristics and needs of target users"
            ),
            QuizQuestion(
                id=6,
                question="What is A/B testing?",
                options=["Testing two versions", "Quality assurance", "Performance testing", "Security testing"],
                correct_index=0,
                explanation="A/B testing compares two versions to determine which performs better"
            ),
            QuizQuestion(
                id=7,
                question="What is a product backlog?",
                options=["Completed features", "List of features to develop", "Bug reports", "User feedback"],
                correct_index=1,
                explanation="Product backlog contains prioritized list of features to develop"
            ),
            QuizQuestion(
                id=8,
                question="What is the purpose of user acceptance criteria?",
                options=["Technical requirements", "Define when a feature is complete", "Marketing goals", "Performance metrics"],
                correct_index=1,
                explanation="User acceptance criteria define when a feature meets user needs"
            ),
            QuizQuestion(
                id=9,
                question="What is customer lifetime value (CLV)?",
                options=["Single purchase value", "Total revenue from customer over time", "Customer satisfaction score", "Marketing cost"],
                correct_index=1,
                explanation="CLV represents total revenue a business can expect from a customer"
            ),
            QuizQuestion(
                id=10,
                question="What is the purpose of a product retrospective?",
                options=["Plan next release", "Review and improve process", "Test features", "Write documentation"],
                correct_index=1,
                explanation="Product retrospective reviews process to identify improvements"
            )
        ]
    }
    
    # Get questions for the domain, fallback to Software Engineering
    domain_questions = fallback_questions.get(domain, fallback_questions["Software Engineering"])
    
    # Return requested number
    return domain_questions[:num_questions]


@router.post("/submit", response_model=QuizSubmitResponse)
async def submit_quiz(
    payload: QuizSubmitRequest, current_user: User = Depends(get_current_user)
) -> QuizSubmitResponse:
    """Submit quiz answers and get detailed evaluation"""
    try:
        total = len(payload.answers)
        score = 0
        details = []
        
        mock_questions = [
            {"correct_answer": 2, "explanation": "Binary search has O(log n) time complexity"},
            {"correct_answer": 1, "explanation": "PUT method is idempotent in HTTP"},
            {"correct_answer": 0, "explanation": "Data cleaning improves data quality"},
            {"correct_answer": 2, "explanation": "Pie charts are ideal for showing proportional data"},
            {"correct_answer": 1, "explanation": "Random forest is excellent for classification tasks"}
        ]
        
        for i, answer in enumerate(payload.answers):
            if i < len(mock_questions):
                correct_answer = mock_questions[i]["correct_answer"]
                explanation = mock_questions[i]["explanation"]
                
                if answer == correct_answer:
                    score += 1
                    details.append(f"Question {i + 1}: Correct! {explanation}")
                else:
                    details.append(f"Question {i + 1}: Incorrect. {explanation}")
            else:
                details.append(f"Question {i + 1}: Answer submitted.")
        
        percentage = round((score / total) * 100, 1) if total > 0 else 0
        
        return QuizSubmitResponse(
            score=score,
            total=total,
            percentage=percentage,
            details=details
        )
        
    except Exception as e:
        print(f"Error evaluating quiz: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to evaluate quiz: {str(e)}")

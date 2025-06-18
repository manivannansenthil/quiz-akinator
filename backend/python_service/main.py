from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import os
from dotenv import load_dotenv
from openai import OpenAI
from motor.motor_asyncio import AsyncIOMotorClient

# Load the .env file from the parent directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))
print("Loaded OpenAI API key:", os.getenv("OPENAI_API_KEY"))

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
mongo_client = AsyncIOMotorClient(MONGODB_URI)
db = mongo_client["quizakinator"]  # <-- replace with your actual db name

# Initialize FastAPI app
app = FastAPI(title="Quiz Generator AI Service")

# Configure CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4000",
        "https://quiz-akinator.vercel.app",
        "https://quiz-akinator-git-main-manivannansenthils-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Data models
class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correctAnswer: str

class QuizResponse(BaseModel):
    quizId: str
    questions: List[Question]

def generate_quiz_prompt(topic: str) -> str:
    return f"""Generate a quiz about {topic} with 5 multiple choice questions.
    Each question should have 4 options (A, B, C, D) and one correct answer.
    Format the response as a JSON object with the following structure:
    {{
        "quizId": "unique-id",
        "questions": [
            {{
                "id": 1,
                "question": "Question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "A"
            }}
        ]
    }}
    Make sure the questions are challenging but fair, and the options are well-distributed."""

@app.get("/")
async def root():
    return {"message": "Quiz Generator AI Service is running!"}

@app.get("/generate")
async def generate_quiz(topic: str) -> QuizResponse:
    try:
        # Generate quiz using OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a quiz generator. Generate quizzes in JSON format."},
                {"role": "user", "content": generate_quiz_prompt(topic)}
            ],
            temperature=0.7
        )
        
        # Parse the response
        quiz_data = response.choices[0].message.content
        return QuizResponse.model_validate_json(quiz_data)
    
    except Exception as e:
        import traceback
        print("Error in /generate:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001) 
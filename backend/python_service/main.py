from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import os
from dotenv import load_dotenv
from openai import OpenAI
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

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
           "http://localhost:3000",
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

class GradeFeedback(BaseModel):
    id: int
    yourAnswer: str
    correctAnswer: str

class GradeResponse(BaseModel):
    correct: int
    total: int
    feedback: List[GradeFeedback]

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
        quiz_data = response.choices[0].message.content
        quiz = QuizResponse.model_validate_json(quiz_data)

        # Generate a unique quizId and assign it
        quiz.quizId = str(uuid.uuid4())

        # Save to MongoDB
        await db.quizakinatorcollect.insert_one(quiz.model_dump())

        return quiz
    except Exception as e:
        import traceback
        print("Error in /generate:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/quiz")
async def get_quiz(quizId: str) -> QuizResponse:
    quiz_doc = await db.quizakinatorcollect.find_one({"quizId": quizId})
    if not quiz_doc:
        raise HTTPException(status_code=404, detail="Quiz not found")
    # Remove MongoDB's _id field before returning
    quiz_doc.pop("_id", None)
    return QuizResponse(**quiz_doc)

@app.post("/grade", response_model=GradeResponse)
async def grade_quiz(request: Request, quizId: str):
    data = await request.json()
    answers = data.get("answers", {})
    quiz_doc = await db.quizakinatorcollect.find_one({"quizId": quizId})
    if not quiz_doc:
        raise HTTPException(status_code=404, detail="Quiz not found")
    questions = quiz_doc["questions"]
    correct = 0
    feedback = []
    for q in questions:
        qid = str(q["id"])
        your_answer = answers.get(qid, "")
        correct_answer = q["correctAnswer"]
        if your_answer == correct_answer:
            correct += 1
        feedback.append(GradeFeedback(id=q["id"], yourAnswer=your_answer, correctAnswer=correct_answer))
    return GradeResponse(correct=correct, total=len(questions), feedback=feedback)

@app.on_event("startup")
async def list_routes():
    print("Registered routes:")
    for route in app.routes:
        print(route.path)

# Run the server
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port) 
# 🌟 Quiz Akinator

A full-stack application that lets users generate, take, and grade 5-question multiple-choice quizzes on **any** topic—all in under 10 seconds.

<p align="center">
  ![Alt text](https://github.com/user-attachments/assets/f88a1309-f42e-42f1-b825-47151d8d7c33)
</p>

---

## ✨ Live Demo

| Service | URL |
|---------|-----|
| Front-end (Next.js) | 🔸 https://quiz-akinator.vercel.app |
| Back-end API        | 🔸 https://quiz-akinator-1.onrender.com |
---

## 🗺️  Architecture

                         ┌──────────────────────────────┐
                         │      Frontend (Next.js)       │
                         │      TypeScript + Tailwind    │
                         └──────────────┬───────────────┘
                                        │
           User enters topic            │
         ─────────────────────────────▶ │
                                        ▼
                         ┌──────────────────────────────┐
                         │     Express Backend (TS)      │
                         │  /generate    /grade          │
                         └──────┬─────────┬─────────────┘
                                │         │
           Calls AI             │         │ Grades + feedback
           via HTTP             ▼         ▼
                      ┌────────────────────────┐
                      │  FastAPI AI Service     │
                      │  Python + OpenAI GPT-4  │
                      └────────────┬───────────┘
                                   │
                        Prompts LLM to generate
                                   ▼
                       ┌──────────────────────┐
                       │   MongoDB Atlas       │
                       │   Stores quizzes      │
                       └──────────────────────┘
---

## 🧑‍💻  Tech Stack

| Layer             | Tech |
|-------------------|------|
| **Front-end**     | Next.js 15, TypeScript, Tailwind CSS, Framer-Motion |
| **API**           | Node.js 20, Express 5, TypeScript, Zod (validation) |
| **AI Service**    | Python 3.11, FastAPI, Pydantic, OpenAI GPT-4o |
| **Database**      | MongoDB Atlas (serverless M0) |
| **Deployment**    | Front-end on Vercel; Back-end & AI on Render |
| **CI & Lint**     | GitHub Actions, ESLint, Prettier |

---

## 🚀  Local Development

### 1. Clone & install:

```
git clone https://github.com/<your-org>/topic-quiz-creator.git
cd topic-quiz-creator
pnpm install   # or npm / yarn
```

You will need to create your own key here https://platform.openai.com/api-keys

# .env
OPENAI_API_KEY=sk-••••
MONGODB_URI=[point towards local mongodb instance]

# back-end
cd backend && pnpm dev
# AI service
cd ai-service && uvicorn app:app --reload
# front-end
cd frontend && pnpm dev

📑  API Reference

GET /generate?topic=<topic>

200 OK
{
  "quizId": "64f9…",
  "questions": [
    { "id": 1, "text": "…", "options": ["A","B","C","D"] },
    …
  ]
}

POST /grade?quizId=<id>

Body
{ "answers": { "1": "B", "2": "D", … } }

200 OK
{
  "correct": 4,
  "total": 5,
  "feedback": [
    { "id": 1, "yourAnswer":"B", "correctAnswer":"B" },
    …
  ]
}

## 🏗️ Architectural Trade-offs

- **Separation of Concerns:** The AI service is isolated from the main API for security and modularity.
- **Cold Start Latency:** Free-tier deployments (Render) may have slow cold starts.
- **Monorepo vs. Polyrepo:** Chose monorepo for easier local dev, but each service is containerized for flexibility.
- **No Auth:** For demo simplicity, no user accounts or quiz history.
  
## 🧪 Pseudo-Tests (What to Test)

- **Unit Tests**
  - `/generate` returns 5 questions for valid topic
  - `/grade` returns correct score for valid answers
  - Validation rejects malformed requests

- **Integration Tests**
  - Full quiz flow: generate → answer → grade
  - Handles invalid/missing topic gracefully
  - Handles AI service downtime gracefully

- **Front-end**
  - Renders quiz and feedback correctly
  - Shows loading and error states
  - Disables submit until all questions answered

## 🛠️ Troubleshooting

- **Build fails on Vercel:** Try clearing build cache and redeploying.
- **API 500 errors:** Check environment variables and AI service health.
- **MongoDB connection issues:** Ensure IP whitelist and correct URI.

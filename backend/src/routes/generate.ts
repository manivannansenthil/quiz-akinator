import { Router } from "express";

const router = Router();

// Helper to generate mock questions
function generateMockQuiz(topic: string) {
  return {
    quizId: "abc123",
    questions: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      text: `Sample question ${i + 1} about ${topic}?`,
      options: ["A", "B", "C", "D"],
    })),
  };
}

// GET /generate?topic=<topic>
router.get("/", (req, res) => {
  const topic = req.query.topic || "general";
  const quiz = generateMockQuiz(String(topic));
  res.json(quiz);
});

export default router;

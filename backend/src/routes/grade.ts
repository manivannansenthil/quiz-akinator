import { Router } from "express";

const router = Router();

type Answer = {
  [key: string]: string;
};

type Feedback = {
  id: number;
  yourAnswer: string;
  correctAnswer: string;
};

type GradeResponse = {
  correct: number;
  total: number;
  feedback: Feedback[];
};

// Mock quiz data (this would come from MongoDB in production)
const mockQuizzes: { [key: string]: any } = {
  abc123: {
    questions: [
      {
        id: 1,
        text: "Sample question 1?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
      },
      {
        id: 2,
        text: "Sample question 2?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
      },
      {
        id: 3,
        text: "Sample question 3?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
      },
      {
        id: 4,
        text: "Sample question 4?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
      },
      {
        id: 5,
        text: "Sample question 5?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
      },
    ],
  },
};

router.post("/", (req, res) => {
  const { quizId } = req.query;
  const { answers } = req.body;

  if (!quizId || !answers) {
    return res.status(400).json({ error: "Missing quizId or answers" });
  }

  const quiz = mockQuizzes[quizId as string];
  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  let correct = 0;
  const feedback: Feedback[] = [];

  quiz.questions.forEach((question: any) => {
    const yourAnswer = answers[question.id.toString()];
    const isCorrect = yourAnswer === question.correctAnswer;
    if (isCorrect) correct++;

    feedback.push({
      id: question.id,
      yourAnswer: yourAnswer || "Not answered",
      correctAnswer: question.correctAnswer,
    });
  });

  const response: GradeResponse = {
    correct,
    total: quiz.questions.length,
    feedback,
  };

  res.json(response);
});

export default router;

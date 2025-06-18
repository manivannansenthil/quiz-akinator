import { Router } from "express";
import { Quiz } from "../models/Quiz";
import { validateGradeRequest } from "../middleware/validation";

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

router.post("/", validateGradeRequest, async (req, res) => {
  const { quizId } = req.query;
  const { answers } = req.body;

  console.log("Received grade request:", { quizId, answers });

  try {
    // Fetch the quiz from MongoDB
    const quiz = await Quiz.findOne({ quizId });
    console.log("Found quiz:", quiz ? "Yes" : "No");

    if (!quiz) {
      return res.status(404).json({
        error: "Quiz not found",
        details: `No quiz found with ID: ${quizId}`,
      });
    }

    // Validate that all questions are answered
    const unansweredQuestions = quiz.questions.filter(
      (question) => !answers[question.id.toString()]
    );
    console.log("Unanswered questions:", unansweredQuestions);

    if (unansweredQuestions.length > 0) {
      return res.status(400).json({
        error: "Incomplete answers",
        details: `Questions ${unansweredQuestions
          .map((q) => q.id)
          .join(", ")} are not answered`,
      });
    }

    let correct = 0;
    const feedback: Feedback[] = [];

    quiz.questions.forEach((question) => {
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
  } catch (error) {
    console.error("Error grading quiz:", error);
    res.status(500).json({
      error: "Failed to grade quiz",
      details: "An unexpected error occurred while grading the quiz",
    });
  }
});

export default router;

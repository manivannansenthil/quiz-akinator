import { Router } from "express";
import { Quiz } from "../models/Quiz";
import { validateGenerateRequest } from "../middleware/validation";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5001";

// Type for the AI service response
interface AIQuizResponse {
  quizId: string;
  questions: {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
}

// Helper function to generate a mock quiz (you can replace this with real AI-generated questions later)
function generateMockQuiz(topic: string) {
  return {
    quizId: Math.random().toString(36).substring(2, 8), // Generate a random quizId
    questions: [
      {
        id: 1,
        text: `What is a key fact about ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option B",
      },
      {
        id: 2,
        text: `Which of the following is related to ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option D",
      },
      {
        id: 3,
        text: `What is a common misconception about ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
      },
      {
        id: 4,
        text: `Which historical event is associated with ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option C",
      },
      {
        id: 5,
        text: `What is the significance of ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option B",
      },
    ],
  };
}

router.get("/", validateGenerateRequest, async (req, res) => {
  const { topic } = req.query;

  try {
    // Call the Python AI service
    const aiResponse = await axios.get<AIQuizResponse>(
      `${AI_SERVICE_URL}/generate`,
      {
        params: { topic },
      }
    );

    const quizData = aiResponse.data;
    console.log("Received quiz from AI service:", quizData);

    // Generate a unique quizId
    const uniqueQuizId = uuidv4();

    // Save the quiz to MongoDB with the unique quizId
    const quiz = new Quiz({
      quizId: uniqueQuizId,
      topic: topic as string,
      questions: quizData.questions,
    });

    const savedQuiz = await quiz.save();
    console.log("Saved quiz to MongoDB:", savedQuiz);

    // Return the quiz data with the unique quizId
    res.json({ ...quizData, quizId: uniqueQuizId });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({
      error: "Failed to generate quiz",
      details: "An unexpected error occurred while generating the quiz",
    });
  }
});

export default router;

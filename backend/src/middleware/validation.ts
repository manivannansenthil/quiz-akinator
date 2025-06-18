import { Request, Response, NextFunction } from "express";

// Validation for /generate endpoint
export const validateGenerateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { topic } = req.query;

  // Check if topic exists
  if (!topic) {
    return res.status(400).json({
      error: "Topic is required",
      details: "Please provide a topic query parameter",
    });
  }

  // Check if topic is a string
  if (typeof topic !== "string") {
    return res.status(400).json({
      error: "Invalid topic format",
      details: "Topic must be a string",
    });
  }

  // Check if topic is not empty
  if (topic.trim().length === 0) {
    return res.status(400).json({
      error: "Invalid topic",
      details: "Topic cannot be empty",
    });
  }

  // Check if topic is not too long
  if (topic.length > 100) {
    return res.status(400).json({
      error: "Invalid topic",
      details: "Topic must be less than 100 characters",
    });
  }

  next();
};

// Validation for /grade endpoint
export const validateGradeRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quizId } = req.query;
  const { answers } = req.body;

  // Check if quizId exists
  if (!quizId) {
    return res.status(400).json({
      error: "Quiz ID is required",
      details: "Please provide a quizId query parameter",
    });
  }

  // Check if quizId is a string
  if (typeof quizId !== "string") {
    return res.status(400).json({
      error: "Invalid quiz ID format",
      details: "Quiz ID must be a string",
    });
  }

  // Check if answers exist
  if (!answers) {
    return res.status(400).json({
      error: "Answers are required",
      details: "Please provide answers in the request body",
    });
  }

  // Check if answers is an object
  if (typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).json({
      error: "Invalid answers format",
      details: "Answers must be an object",
    });
  }

  // Check if all answers are strings
  for (const [questionId, answer] of Object.entries(answers)) {
    if (typeof answer !== "string") {
      return res.status(400).json({
        error: "Invalid answer format",
        details: `Answer for question ${questionId} must be a string`,
      });
    }
  }

  next();
};

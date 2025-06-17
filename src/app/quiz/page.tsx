"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type QuizQuestion = {
  id: number;
  text: string;
  options: string[];
};

type QuizResponse = {
  quizId: string;
  questions: QuizQuestion[];
};

type GradeResponse = {
  correct: number;
  total: number;
  feedback: {
    id: number;
    yourAnswer: string;
    correctAnswer: string;
  }[];
};

export default function QuizPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "general knowledge";

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string>("");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topic) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:4000/generate?topic=${encodeURIComponent(topic)}`)
      .then((res) => res.json())
      .then((data: QuizResponse) => {
        setQuiz(data.questions);
        setQuizId(data.quizId);
        setAnswers({});
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        setError("Failed to load quiz. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [topic]);

  const handleSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4000/grade?quizId=${quizId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to grade quiz");
      }

      const result = await response.json();
      setGradeResult(result);
      setSubmitted(true);
    } catch (error) {
      console.error("Error grading quiz:", error);
      setError("Failed to grade quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !quiz.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !quiz.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Quiz on: {topic}</h1>

      {quiz.map((question) => (
        <div
          key={question.id}
          className="mb-8 bg-white rounded-lg shadow-md p-6"
        >
          <p className="font-semibold mb-4 text-lg text-black">
            {question.id}. {question.text}
          </p>
          <div className="space-y-3">
            {question.options.map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors text-black ${
                  submitted
                    ? option ===
                      gradeResult?.feedback.find((f) => f.id === question.id)
                        ?.correctAnswer
                      ? "bg-green-100"
                      : answers[question.id] === option
                      ? "bg-red-100"
                      : "bg-gray-50"
                    : answers[question.id] === option
                    ? "bg-blue-50"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleSelect(question.id, option)}
                  disabled={submitted}
                  className="mr-3"
                />
                <span>{option}</span>
                {submitted && (
                  <span className="ml-auto">
                    {option ===
                    gradeResult?.feedback.find((f) => f.id === question.id)
                      ?.correctAnswer
                      ? "✓"
                      : answers[question.id] === option
                      ? "✗"
                      : ""}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {!submitted ? (
        <button
          className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleSubmit}
          disabled={loading || Object.keys(answers).length !== quiz.length}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Submitting...
            </span>
          ) : (
            "Submit Quiz"
          )}
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Your Score: {gradeResult?.correct} out of {gradeResult?.total}
          </h2>
          <p className="text-gray-600">
            {gradeResult?.correct === gradeResult?.total
              ? "Perfect score! 🎉"
              : gradeResult && gradeResult.correct / gradeResult.total >= 0.8
              ? "Great job! 🌟"
              : "Keep practicing! 💪"}
          </p>
        </div>
      )}
    </div>
  );
}

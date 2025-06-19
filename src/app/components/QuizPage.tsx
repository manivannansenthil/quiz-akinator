"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QuestionBlock from "../components/QuestionBlock";
import QuizFeedback from "../components/QuizFeedback";
import PixelWaveBackground from "../components/PixelWaveBackground";

type QuizQuestion = {
  id: number;
  question: string;
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

const API_BASE = "https://quiz-akinator-1.onrender.com"; // <-- your Render backend URL

const QuizPage = () => {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "general knowledge";
  const quizIdParam = searchParams.get("quizId");

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string>("");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (quizIdParam) {
      // Fetch quiz by quizId
      fetch(`${API_BASE}/quiz?quizId=${encodeURIComponent(quizIdParam)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Quiz not found");
          return res.json();
        })
        .then((data: QuizResponse) => {
          setQuiz(data.questions);
          setQuizId(data.quizId);
          setAnswers({});
        })
        .catch((error) => {
          console.error("Error fetching quiz by ID:", error);
          setError("Failed to load quiz. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (topic) {
      // Generate new quiz
      fetch(`${API_BASE}/generate?topic=${encodeURIComponent(topic)}`)
        .then((res) => res.json())
        .then((data: QuizResponse) => {
          setQuiz(data.questions);
          setQuizId(data.quizId);
          setAnswers({});
          // Update URL with quizId for sharing/retrieval
          if (window && window.history && data.quizId) {
            const url = new URL(window.location.href);
            url.searchParams.set("quizId", data.quizId);
            window.history.replaceState({}, "", url.toString());
          }
        })
        .catch((error) => {
          console.error("Error fetching quiz:", error);
          setError("Failed to load quiz. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [topic, quizIdParam]);

  const handleSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (!quiz[currentIdx]) return;
    if (!answers[quiz[currentIdx].id]) return;
    setDirection("right");
    setAnimating(true);
    setTimeout(() => {
      setCurrentIdx((idx) => Math.min(idx + 1, quiz.length - 1));
      setAnimating(false);
    }, 400);
  };

  const handlePrev = () => {
    setDirection("left");
    setAnimating(true);
    setTimeout(() => {
      setCurrentIdx((idx) => Math.max(idx - 1, 0));
      setAnimating(false);
    }, 400);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    // Debug log
    console.log("Submitting answers:", answers, "for quizId:", quizId);

    try {
      const response = await fetch(`${API_BASE}/grade?quizId=${quizId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

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
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-center absolute inset-0 z-10">
          <div className="wheel-and-hamster">
            <div className="wheel"></div>
            <div className="hamster">
              <div className="hamster__body">
                <div className="hamster__head">
                  <div className="hamster__ear"></div>
                  <div className="hamster__eye"></div>
                  <div className="hamster__nose"></div>
                </div>
                <div className="hamster__limb hamster__limb--fr"></div>
                <div className="hamster__limb hamster__limb--fl"></div>
                <div className="hamster__limb hamster__limb--br"></div>
                <div className="hamster__limb hamster__limb--bl"></div>
                <div className="hamster__tail"></div>
              </div>
            </div>
            <div className="spoke"></div>
          </div>
          <div className="loader mt-8">
            <span className="loading-text">
              Loading
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </span>
            <div className="loading-bar-background">
              <div className="loading-bar">
                <div className="white-bars-container">
                  <div className="white-bar"></div>
                  <div className="white-bar"></div>
                  <div className="white-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    <div className="min-h-screen w-full relative flex items-center justify-center">
      <PixelWaveBackground />
      <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center w-full z-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Quiz on: {topic}
        </h1>
        {!submitted ? (
          <>
            <div
              className="relative w-full flex flex-col items-center justify-center"
              style={{ minHeight: 320 }}
            >
              {quiz[currentIdx] && (
                <div
                  className={`transition-all duration-400 ease-in-out absolute w-full ${
                    animating
                      ? direction === "right"
                        ? "animate-slide-left-fade"
                        : "animate-slide-right-fade"
                      : "opacity-100 translate-x-0 z-10"
                  }`}
                  key={quiz[currentIdx].id}
                  style={{ zIndex: 10 }}
                >
                  <QuestionBlock
                    question={quiz[currentIdx]}
                    selectedAnswer={answers[quiz[currentIdx].id]}
                    submitted={submitted}
                    feedback={gradeResult?.feedback.find(
                      (f) => f.id === quiz[currentIdx].id
                    )}
                    onSelect={handleSelect}
                  />
                </div>
              )}
            </div>
            {/* Navigation Arrows */}
            <div className="flex gap-4 justify-end w-full mt-4">
              {currentIdx > 0 && (
                <button
                  className="rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 p-3 shadow transition"
                  onClick={handlePrev}
                  disabled={animating}
                  aria-label="Previous Question"
                >
                  <span style={{ fontSize: 22, fontWeight: 700 }}>&larr;</span>
                </button>
              )}
              {currentIdx < quiz.length - 1 && (
                <button
                  className={`rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 p-3 shadow transition ${
                    !answers[quiz[currentIdx]?.id]
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleNext}
                  disabled={animating || !answers[quiz[currentIdx]?.id]}
                  aria-label="Next Question"
                >
                  <span style={{ fontSize: 22, fontWeight: 700 }}>&rarr;</span>
                </button>
              )}
            </div>
            {/* Submit Button */}
            {currentIdx === quiz.length - 1 && (
              <button
                className={`w-full py-3 rounded-lg text-white font-semibold transition-colors mt-8 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleSubmit}
                disabled={
                  loading || Object.keys(answers).length !== quiz.length
                }
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
            )}
          </>
        ) : (
          <>
            {quiz.map((question) => (
              <QuestionBlock
                key={question.id}
                question={question}
                selectedAnswer={answers[question.id]}
                submitted={submitted}
                feedback={gradeResult?.feedback.find(
                  (f) => f.id === question.id
                )}
                onSelect={handleSelect}
              />
            ))}
            <QuizFeedback
              correct={gradeResult?.correct || 0}
              total={gradeResult?.total || 0}
              feedback={gradeResult?.feedback || []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

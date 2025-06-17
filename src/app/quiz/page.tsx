"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type QuizQuestion = {
  question: string;
  choices: string[];
  correctIndex: number;
};

export default function QuizPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "general knowledge";

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // TODO: Replace with real API call
    const mockData: QuizQuestion[] = [
      {
        question: "What is the capital of France?",
        choices: ["Berlin", "Madrid", "Paris", "Rome"],
        correctIndex: 2,
      },
      {
        question: "Which planet is known as the Red Planet?",
        choices: ["Earth", "Mars", "Venus", "Jupiter"],
        correctIndex: 1,
      },
    ];
    setQuiz(mockData);
    setAnswers(new Array(mockData.length).fill(-1));
  }, [topic]);

  const handleSelect = (questionIndex: number, choiceIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = choiceIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log(answers);
  };

  const score = quiz.reduce((acc, q, i) => {
    return acc + (q.correctIndex === answers[i] ? 1 : 0);
  }, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quiz on: {topic}</h1>

      {quiz.map((q, i) => (
        <div key={i} className="mb-6">
          <p className="font-semibold mb-2">
            {i + 1}. {q.question}
          </p>
          {q.choices.map((choice, j) => (
            <label key={j} className="block mb-1">
              <input
                type="radio"
                name={`question-${i}`}
                checked={answers[i] === j}
                onChange={() => handleSelect(i, j)}
                disabled={submitted}
              />
              <span className="ml-2">{choice}</span>
              {submitted && j === q.correctIndex && (
                <span className="ml-2 text-green-600">✔</span>
              )}
              {submitted && answers[i] === j && j !== q.correctIndex && (
                <span className="ml-2 text-red-500">✘</span>
              )}
            </label>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
          disabled={answers.includes(-1)}
        >
          Submit
        </button>
      ) : (
        <p className="text-xl font-bold mt-4">
          You scored {score} out of {quiz.length}
        </p>
      )}
    </div>
  );
}

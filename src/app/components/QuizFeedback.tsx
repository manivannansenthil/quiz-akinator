import React from "react";

type Feedback = {
  id: number;
  yourAnswer: string;
  correctAnswer: string;
};

type QuizFeedbackProps = {
  correct: number;
  total: number;
  feedback: Feedback[];
};

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  correct,
  total,
  feedback,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center">
    <h2 className="text-2xl font-bold mb-4 text-black">
      Your Score: {correct} out of {total}
    </h2>
    <p className="text-gray-600">
      {correct === total
        ? "Perfect score! 🎉"
        : correct / total >= 0.8
        ? "Great job! 🌟"
        : "Keep practicing! 💪"}
    </p>
  </div>
);

export default QuizFeedback;

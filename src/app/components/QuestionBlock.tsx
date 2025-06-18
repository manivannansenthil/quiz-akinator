import React from "react";

export type QuestionBlockProps = {
  question: {
    id: number;
    question: string;
    options: string[];
  };
  selectedAnswer: string | undefined;
  submitted: boolean;
  feedback?: {
    correctAnswer: string;
  };
  onSelect: (questionId: number, answer: string) => void;
};

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  selectedAnswer,
  submitted,
  feedback,
  onSelect,
}) => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      <p className="font-semibold mb-4 text-lg text-black">
        {question.id}. {question.question}
      </p>
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const optionLetter = String.fromCharCode(65 + idx); // 'A', 'B', ...
          return (
            <label
              key={option}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors text-black ${
                submitted
                  ? optionLetter === feedback?.correctAnswer
                    ? "bg-green-100"
                    : selectedAnswer === optionLetter
                    ? "bg-red-100"
                    : "bg-gray-50"
                  : selectedAnswer === optionLetter
                  ? "bg-blue-50"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={optionLetter}
                checked={selectedAnswer === optionLetter}
                onChange={() => onSelect(question.id, optionLetter)}
                disabled={submitted}
                className="mr-3"
              />
              <span>
                {optionLetter}. {option}
              </span>
              {submitted && (
                <span className="ml-auto">
                  {optionLetter === feedback?.correctAnswer
                    ? "✓"
                    : selectedAnswer === optionLetter
                    ? "✗"
                    : ""}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionBlock;

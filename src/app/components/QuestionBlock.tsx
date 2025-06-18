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
          let highlight = "";
          let icon = null;
          let overlay = null;
          if (submitted) {
            if (optionLetter === feedback?.correctAnswer) {
              highlight = "bg-green-100";
              icon = <span className="ml-2 text-green-600 font-bold">✓</span>;
              overlay = (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(34,197,94,0.18)",
                    borderRadius: "8px",
                    pointerEvents: "none",
                  }}
                ></span>
              );
            } else if (selectedAnswer === optionLetter) {
              highlight = "bg-red-100";
              icon = <span className="ml-2 text-red-500 font-bold">✗</span>;
              overlay = (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(239,68,68,0.18)",
                    borderRadius: "8px",
                    pointerEvents: "none",
                  }}
                ></span>
              );
            } else {
              highlight = "bg-gray-50";
            }
          }
          return (
            <label
              key={option}
              className={`label option-label p-0 cursor-pointer transition-colors text-black flex items-center gap-2 relative ${highlight}`}
              style={{ borderRadius: 8 }}
            >
              {overlay}
              <input
                type="radio"
                name={`question-${question.id}`}
                value={optionLetter}
                checked={selectedAnswer === optionLetter}
                onChange={() => onSelect(question.id, optionLetter)}
                disabled={submitted}
                className="mr-3"
              />
              <span>{option}</span>
              {submitted && <span className="ml-auto">{icon}</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionBlock;

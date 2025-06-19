import React from "react";
import styles from "./QuizCard.module.css";

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
  onNext: () => void;
  showNext: boolean;
  topic: string;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitLoading?: boolean;
};

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  selectedAnswer,
  submitted,
  feedback,
  onSelect,
  onNext,
  showNext,
  topic,
  onSubmit,
  submitDisabled,
  submitLoading,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.tools}>
        <div className={styles.circle}>
          <span className={`${styles.box} ${styles.red}`}></span>
        </div>
        <div className={styles.circle}>
          <span className={`${styles.box} ${styles.yellow}`}></span>
        </div>
        <div className={styles.circle}>
          <span className={`${styles.box} ${styles.green}`}></span>
        </div>
        <div className={styles.title}>{topic}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.question}>{question.question}</div>
        <div className={styles["radio-container"]}>
          {question.options.map((option, idx) => {
            const optionLetter = String.fromCharCode(65 + idx); // 'A', 'B', ...
            let optionClass = styles["radio-wrapper"];
            if (submitted && feedback) {
              if (optionLetter === feedback.correctAnswer) {
                optionClass += " " + styles["radio-correct"];
              } else if (
                selectedAnswer === optionLetter &&
                selectedAnswer !== feedback.correctAnswer
              ) {
                optionClass += " " + styles["radio-incorrect"];
              }
            }
            return (
              <div className={optionClass} key={option}>
                <label className={styles["radio-button"]}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionLetter}
                    checked={selectedAnswer === optionLetter}
                    onChange={() => onSelect(question.id, optionLetter)}
                    disabled={submitted}
                  />
                  <span className={styles["radio-checkmark"]}></span>
                  <span className={styles["radio-label"]}>{option}</span>
                </label>
              </div>
            );
          })}
        </div>
        {submitted && feedback && (
          <div className={styles.feedback}>
            <span
              style={{
                color:
                  selectedAnswer === feedback.correctAnswer
                    ? "#00c850"
                    : "#ff3b3b",
              }}
            >
              {selectedAnswer === feedback.correctAnswer
                ? "✅ Correct!"
                : `❌ Correct answer: ${feedback.correctAnswer}`}
            </span>
          </div>
        )}
        {showNext && (
          <button
            className={styles.nextButton}
            onClick={onNext}
            aria-label="Next Question"
          >
            <span
              className={
                styles.arrowIcon +
                (question.id === 1 && !submitted
                  ? " " + styles["animate-arrow"]
                  : "")
              }
            >
              &rarr;
            </span>
          </button>
        )}
        {!showNext && !submitted && (
          <button
            className={styles.submitButton}
            onClick={onSubmit}
            disabled={submitDisabled}
          >
            {submitLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Submitting...
              </span>
            ) : (
              "Submit Quiz"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionBlock;

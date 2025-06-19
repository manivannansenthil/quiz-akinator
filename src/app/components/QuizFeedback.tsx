import React, { useEffect, useRef } from "react";
import styles from "./QuizCard.module.css";

type FeedbackCardProps = {
  topic: string;
  questions: {
    id: number;
    question: string;
    options: string[];
  }[];
  feedback: {
    id: number;
    yourAnswer: string;
    correctAnswer: string;
  }[];
  correct: number;
  total: number;
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  topic,
  questions,
  feedback,
  correct,
  total,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Use a timeout to ensure DOM is ready
    const timeout = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timeout);
  }, [questions, feedback]);
  return (
    <div className={styles.card} style={{ minHeight: 600 }}>
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
      <div
        ref={contentRef}
        className={styles.content}
        style={{ flex: 1, height: "100%" }}
      >
        <div
          style={{
            marginBottom: 32,
            marginTop: 12,
            textAlign: "center",
            width: "100%",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.3rem",
              marginBottom: 4,
            }}
          >
            Your Score: {correct} / {total}
          </h2>
          <p style={{ color: "#bbb", fontWeight: 500 }}>
            {correct === total
              ? "Perfect score! 🎉"
              : correct / total >= 0.8
              ? "Great job! 🌟"
              : "Keep practicing! 💪"}
          </p>
        </div>
        {questions.map((q) => {
          const fb = feedback.find((f) => f.id === q.id);
          return (
            <div key={q.id} style={{ marginBottom: 24 }}>
              <div className={styles.question}>{q.question}</div>
              <div className={styles["radio-container"]}>
                {q.options.map((option, oidx) => {
                  const optionLetter = String.fromCharCode(65 + oidx);
                  let optionClass = styles["radio-wrapper"];
                  if (fb) {
                    if (optionLetter === fb.correctAnswer) {
                      optionClass += " " + styles["radio-correct"];
                    } else if (
                      fb.yourAnswer === optionLetter &&
                      fb.yourAnswer !== fb.correctAnswer
                    ) {
                      optionClass += " " + styles["radio-incorrect"];
                    }
                  }
                  return (
                    <div className={optionClass} key={option}>
                      <label className={styles["radio-button"]}>
                        <input
                          type="radio"
                          name={`feedback-question-${q.id}`}
                          value={optionLetter}
                          checked={fb?.yourAnswer === optionLetter}
                          readOnly
                          disabled
                        />
                        <span className={styles["radio-checkmark"]}></span>
                        <span className={styles["radio-label"]}>{option}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
              {fb && (
                <div className={styles.feedback}>
                  <span
                    style={{
                      color:
                        fb.yourAnswer === fb.correctAnswer
                          ? "#00c850"
                          : "#ff3b3b",
                    }}
                  >
                    {fb.yourAnswer === fb.correctAnswer
                      ? "✅ Correct!"
                      : `❌ Correct answer: ${fb.correctAnswer}`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackCard;

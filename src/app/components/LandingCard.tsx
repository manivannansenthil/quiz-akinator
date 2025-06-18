import React, { useState, useEffect } from "react";

const LandingCard: React.FC = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    setShowTitle(true);
    const timer = setTimeout(() => setShowSubtitle(true), 900);
    let formTimer: NodeJS.Timeout;
    if (showSubtitle) {
      formTimer = setTimeout(() => setShowForm(true), 2000);
    }
    return () => {
      clearTimeout(timer);
      if (formTimer) clearTimeout(formTimer);
    };
  }, [showSubtitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      window.location.href = `/quiz?topic=${encodeURIComponent(topic.trim())}`;
    }
  };

  return (
    <div
      className="relative z-10 max-w-md w-full space-y-8 p-0 rounded-3xl backdrop-blur-xl border-[0.5px]"
      style={{
        background: "rgba(24, 24, 24, 0.6)",
        border: "1px solid #333",
        boxShadow:
          "0 8px 32px 0 rgba(0,0,0,0.22), 0 1.5px 8px 0 rgba(0,0,0,0.04), inset 0 0 0.5px rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        overflow: "hidden",
        borderRadius: "3%",
        minHeight: "420px",
        minWidth: "370px",
      }}
    >
      {/* Mac window title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 36,
          padding: "0 1rem",
          background: "rgba(32,32,32,0.92)",
          borderBottom: "1px solid #222",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FF5F56",
              display: "inline-block",
              border: "1px solid #e0443e",
            }}
          />
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FFBD2E",
              display: "inline-block",
              border: "1px solid #dea123",
            }}
          />
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#27C93F",
              display: "inline-block",
              border: "1px solid #13a10e",
            }}
          />
        </div>
      </div>
      {/* Card content */}
      <div className="p-8 space-y-8">
        <div>
          <h1
            className="text-6xl font-semibold tracking-tight mb-2 text-center fade-in-title"
            style={{
              color: "var(--foreground)",
              animation: showTitle
                ? "fadeIn 0.8s cubic-bezier(.4,0,.2,1) forwards, floatY 3s ease-in-out infinite"
                : "none",
              opacity: showTitle ? 1 : 0,
            }}
          >
            Quiz Akinator
          </h1>
          {showSubtitle && (
            <p
              className="text-center shiny-gold-text drop-bounce"
              style={{
                animation: showSubtitle
                  ? "dropBounce 0.7s cubic-bezier(.4,1.6,.4,1)"
                  : "none",
                opacity: showSubtitle ? 1 : 0,
              }}
            >
              Enter a topic to start your quiz!
            </p>
          )}
        </div>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 fade-in-form"
            style={{
              animation: showForm ? "fadeIn 2.5s" : "none",
              opacity: showForm ? 1 : 0,
            }}
          >
            <div>
              <label htmlFor="topic" className="sr-only">
                Quiz Topic
              </label>
              <input
                id="topic"
                name="topic"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 shiny-gold-border placeholder-gray-400 text-gold-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 bg-black"
                placeholder="e.g., History, Science, Movies..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  color: "#FFD700",
                  background: "#181818cc",
                }}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 text-sm font-semibold rounded-md start-quiz-btn"
                style={{
                  background: "#fff",
                  color: "#181818",
                  border: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                }}
              >
                Start Quiz
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Add keyframes to the document (if not already present)
if (
  typeof window !== "undefined" &&
  !document.getElementById("floatY-keyframes")
) {
  const style = document.createElement("style");
  style.id = "floatY-keyframes";
  style.innerHTML = `
    @keyframes floatY {
      0% { transform: translateY(0); }
      50% { transform: translateY(-18px) scale(1.04); }
      100% { transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes dropBounce {
      0% {
        opacity: 0;
        transform: translateY(-32px) rotate(-12deg) scale(1.08);
      }
      60% {
        opacity: 1;
        transform: translateY(12px) rotate(-6deg) scale(0.98);
      }
      75% {
        transform: translateY(-8px) rotate(-3deg) scale(1.01);
      }
      85% {
        transform: translateY(4px) rotate(-1deg) scale(0.99);
      }
      92% {
        transform: translateY(-2px) rotate(-0.5deg) scale(1.01);
      }
      100% {
        opacity: 1;
        transform: translateY(0) rotate(0deg) scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

export default LandingCard;

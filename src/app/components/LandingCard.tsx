import React, { useState } from "react";

// Add animation styles
const floatingTitleStyle: React.CSSProperties = {
  animation: "floatY 3.5s ease-in-out infinite",
  display: "inline-block",
};

const LandingCard: React.FC = () => {
  const [topic, setTopic] = useState("");

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
          "0 2px 12px 0 rgba(0,0,0,0.10), inset 0 0 0.5px rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        overflow: "hidden",
        borderRadius: "3%",
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
            className="text-6xl font-semibold tracking-tight mb-2 text-center"
            style={{
              color: "var(--foreground)",
              animation: "floatY 3.5s ease-in-out infinite",
            }}
          >
            Quiz Akinator
          </h1>
          <p className="text-center" style={{ color: "#FFD700cc" }}>
            Enter a topic to start your quiz!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="topic" className="sr-only">
              Quiz Topic
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border-[0.5px] border-yellow-400/40 placeholder-gray-400 text-gold-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 bg-black"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md"
              style={{
                background: "var(--foreground)",
                color: "#181818",
                border: "1.5px solid var(--card-border)",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              Start Quiz
            </button>
          </div>
        </form>
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
  `;
  document.head.appendChild(style);
}

export default LandingCard;

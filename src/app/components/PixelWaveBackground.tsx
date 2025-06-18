import React, { useRef, useEffect } from "react";

const PIXEL_SIZE = 18;
const GAP = 2;
const ANIMATION_SPEED = 0.002; // Even slower subtle animation

const PixelWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const cols = Math.ceil(width / (PIXEL_SIZE + GAP));
    const rows = Math.ceil(height / (PIXEL_SIZE + GAP));

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Subtle, slow shimmer effect
          const shimmer = Math.sin((x + y) * 0.15 + time * ANIMATION_SPEED);
          const lightness = 12 + shimmer * 8;
          ctx.fillStyle = `hsl(0, 0%, ${lightness}%)`;
          ctx.fillRect(
            x * (PIXEL_SIZE + GAP),
            y * (PIXEL_SIZE + GAP),
            PIXEL_SIZE,
            PIXEL_SIZE
          );
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    }

    animationFrameId = requestAnimationFrame(draw);

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Optional: Gradient overlay for premium look */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </>
  );
};

export default PixelWaveBackground;

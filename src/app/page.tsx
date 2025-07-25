"use client";

import PixelWaveBackground from "./components/PixelWaveBackground";
import LandingCard from "./components/LandingCard";

export default function Home() {
  return (
    <>
      <PixelWaveBackground />
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <LandingCard />
      </main>
    </>
  );
}

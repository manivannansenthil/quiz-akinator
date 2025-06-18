"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PixelWaveBackground from "./components/PixelWaveBackground";
import LandingCard from "./components/LandingCard";

export default function Home() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      router.push(`/quiz?topic=${encodeURIComponent(topic.trim())}`);
    }
  };

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

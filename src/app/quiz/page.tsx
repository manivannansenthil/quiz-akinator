"use client";

import { Suspense } from "react";
import QuizPage from "../components/QuizPage";

export default function QuizPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizPage />
    </Suspense>
  );
}

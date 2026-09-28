"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { QUESTIONS, resolvePersonality, type Answers } from "./questions";
import { getPersonality } from "./personalities";
import { matchPackagesFor } from "./matcher";
import QuizStep from "./QuizStep";
import QuizResult from "./QuizResult";

const MONTH_LABELS: Record<string, string> = {
  jan: "January", feb: "February", mar: "March", apr: "April",
  may: "May", jun: "June", jul: "July", aug: "August",
  sep: "September", oct: "October", nov: "November", dec: "December",
};

type Phase = "intro" | "quiz" | "result";

export default function TripTwinQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const question = QUESTIONS[step];

  const start = () => {
    trackEvent("trip_twin_started");
    setPhase("quiz");
  };

  const select = (value: string) => {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      // Small beat so the selection is visible before advancing.
      setTimeout(() => setStep((s) => s + 1), 240);
    } else {
      const pid = resolvePersonality(next);
      trackEvent("trip_twin_completed", { personality: pid });
      setPhase("result");
    }
  };

  const back = () => {
    if (step === 0) setPhase("intro");
    else setStep((s) => s - 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setPhase("intro");
  };

  const result = useMemo(() => {
    if (phase !== "result") return null;
    const pid = resolvePersonality(answers);
    const personality = getPersonality(pid);
    const matches = matchPackagesFor(personality, answers);
    return { personality, matches };
  }, [phase, answers]);

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-16 pt-8 sm:pt-12">
      {phase === "intro" && (
        <div className="text-center">
          <div
            aria-hidden="true"
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-secondary/15 text-brand-secondary"
          >
            <Sparkles className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Find your Trip Twin
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink-muted">
            Answer 8 quick questions and we&apos;ll reveal your traveler
            personality — plus three real trips from our catalogue that match
            it perfectly.
          </p>
          <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2 text-sm font-semibold text-ink-muted">
            {["8 questions", "30 seconds", "Real trips", "Shareable card"].map((t) => (
              <li
                key={t}
                className="rounded-full border border-line bg-surface-card px-4 py-1.5"
              >
                {t}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={start}
            className="mt-8 w-full rounded-2xl bg-brand-cta px-8 py-4 text-lg font-extrabold text-brand-primary-deep shadow-[0_10px_30px_-8px_rgba(242,157,56,0.6)] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta sm:w-auto sm:px-14"
          >
            Start the quiz
          </button>
        </div>
      )}

      {phase === "quiz" && (
        <QuizStep
          key={question.id}
          question={question}
          index={step}
          total={QUESTIONS.length}
          selected={answers[question.id]}
          onSelect={select}
          onBack={back}
        />
      )}

      {phase === "result" && result && (
        <QuizResult
          personality={result.personality}
          matches={result.matches}
          monthLabel={MONTH_LABELS[answers["month"]]}
          onRestart={restart}
        />
      )}
    </div>
  );
}

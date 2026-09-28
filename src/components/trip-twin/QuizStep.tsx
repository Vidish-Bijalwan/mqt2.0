"use client";

import {
  ArrowLeft, BedDouble, Calendar, CalendarDays, Coffee, Compass, Crown,
  Flame, Footprints, Heart, Landmark, Mountain, PartyPopper, Rocket, Scale,
  Sun, TreePine, User, Users, Wallet, Waves, Zap, type LucideIcon,
} from "lucide-react";
import type { QuizQuestion } from "./questions";

const ICONS: Record<string, LucideIcon> = {
  Mountain, Waves, Landmark, TreePine, Flame, Zap, Compass, Coffee,
  Footprints, Sun, Scale, Rocket, Wallet, BedDouble, Crown, User,
  Heart, Users, PartyPopper, CalendarDays, Calendar,
};

interface QuizStepProps {
  question: QuizQuestion;
  index: number;
  total: number;
  selected: string | undefined;
  onSelect: (value: string) => void;
  onBack: () => void;
}

export default function QuizStep({
  question, index, total, selected, onSelect, onBack,
}: QuizStepProps) {
  const pct = Math.round(((index + 1) / total) * 100);

  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar: back + progress */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to previous question"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-card text-ink transition hover:bg-brand-secondary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <div
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={index + 1}
            aria-label={`Question ${index + 1} of ${total}`}
            className="h-2 overflow-hidden rounded-full bg-brand-primary/15"
          >
            <div
              className="h-full rounded-full bg-brand-secondary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-muted">
          {index + 1}/{total}
        </span>
      </div>

      {/* Question */}
      <fieldset className="mt-8">
        <legend className="text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
          {question.headline}
        </legend>
        <p className="mt-2 text-base text-ink-muted">{question.subhead}</p>

        <div
          className={
            question.compact
              ? "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
              : "mt-6 grid grid-cols-1 gap-3"
          }
          role="group"
          aria-label={question.headline}
        >
          {question.options.map((opt) => {
            const Icon = ICONS[opt.icon] ?? Compass;
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelect(opt.value)}
                aria-pressed={isSelected}
                className={[
                  "group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                  question.compact ? "flex-col items-start gap-2 p-3" : "",
                  isSelected
                    ? "border-brand-secondary bg-brand-secondary/10 shadow-[0_8px_24px_-8px_rgba(18,124,130,0.5)]"
                    : "border-line bg-surface-card hover:border-brand-secondary/60 hover:bg-brand-secondary/5",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                    isSelected
                      ? "bg-brand-secondary text-white"
                      : "bg-brand-primary/8 text-brand-secondary group-hover:bg-brand-secondary/15",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-ink">
                    {opt.label}
                  </span>
                  {opt.sub && (
                    <span className="block truncate text-sm text-ink-muted">
                      {opt.sub}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-6 text-center text-xs text-ink-muted">
        Tap an option to continue — you can always go back.
      </p>
    </div>
  );
}

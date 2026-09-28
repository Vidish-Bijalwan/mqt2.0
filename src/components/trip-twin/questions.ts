/** Trip Twin quiz — 8 questions, one per screen. Each option carries
 * deterministic weights toward the 6 traveler personalities. */

import type { PersonalityId } from "./personalities";
import { PERSONALITY_ORDER } from "./personalities";

export interface QuizOption {
  value: string;
  label: string;
  sub?: string;
  /** Lucide icon key (mapped in QuizStep). */
  icon: string;
  weights: Partial<Record<PersonalityId, number>>;
}

export interface QuizQuestion {
  id: string;
  headline: string;
  subhead: string;
  options: QuizOption[];
  /** Render in a compact grid (for month / duration picks). */
  compact?: boolean;
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "mood",
    headline: "What's calling you right now?",
    subhead: "Pick the feeling you're chasing on this trip.",
    options: [
      {
        value: "unwind", label: "Total unwinding", sub: "Rest, recharge, repeat",
        icon: "Waves",
        weights: { "beach-drifter": 3, "pilgrim-soul": 1 },
      },
      {
        value: "discover", label: "Discovery", sub: "Culture, stories, food",
        icon: "Compass",
        weights: { "heritage-wanderer": 3, "himalayan-nomad": 1 },
      },
      {
        value: "spiritual", label: "Something spiritual", sub: "Faith, rituals, peace",
        icon: "Flame",
        weights: { "pilgrim-soul": 3, "heritage-wanderer": 1 },
      },
      {
        value: "thrill", label: "Pure thrill", sub: "Heart-pounding action",
        icon: "Zap",
        weights: { "adrenaline-chaser": 3, "himalayan-nomad": 1 },
      },
    ],
  },
  {
    id: "terrain",
    headline: "Pick your landscape",
    subhead: "Where does your mind wander when you daydream about travel?",
    options: [
      {
        value: "mountains", label: "Mountains", sub: "Peaks, valleys, snow",
        icon: "Mountain",
        weights: { "himalayan-nomad": 4, "adrenaline-chaser": 1 },
      },
      {
        value: "beaches", label: "Beaches", sub: "Sand, surf, sunsets",
        icon: "Waves",
        weights: { "beach-drifter": 4 },
      },
      {
        value: "heritage", label: "Heritage cities", sub: "Forts, old towns, bazaars",
        icon: "Landmark",
        weights: { "heritage-wanderer": 4 },
      },
      {
        value: "wildlife", label: "Wildlife", sub: "Jungles, safaris, rivers",
        icon: "TreePine",
        weights: { "jungle-seeker": 4, "adrenaline-chaser": 1 },
      },
    ],
  },
  {
    id: "adventure",
    headline: "How wild should it get?",
    subhead: "Be honest — your comfort zone is safe with us.",
    options: [
      {
        value: "chill", label: "Keep it chill", sub: "Easy days, no rush",
        icon: "Coffee",
        weights: { "beach-drifter": 3, "heritage-wanderer": 1 },
      },
      {
        value: "moderate", label: "A bit of both", sub: "Some hikes, some hammocks",
        icon: "Footprints",
        weights: { "jungle-seeker": 2, "himalayan-nomad": 2, "heritage-wanderer": 1 },
      },
      {
        value: "extreme", label: "Full send", sub: "The wilder, the better",
        icon: "Zap",
        weights: { "adrenaline-chaser": 3, "himalayan-nomad": 2 },
      },
    ],
  },
  {
    id: "pace",
    headline: "What's your trip pace?",
    subhead: "How do you like your days to unfold?",
    options: [
      {
        value: "slow", label: "Slow & deep", sub: "Few places, fully felt",
        icon: "Sun",
        weights: { "beach-drifter": 2, "pilgrim-soul": 2 },
      },
      {
        value: "balanced", label: "Balanced", sub: "See a lot, still breathe",
        icon: "Scale",
        weights: { "heritage-wanderer": 2, "jungle-seeker": 2 },
      },
      {
        value: "packed", label: "Pack it all in", sub: "Maximum stops, zero FOMO",
        icon: "Rocket",
        weights: { "adrenaline-chaser": 2, "himalayan-nomad": 2 },
      },
    ],
  },
  {
    id: "budget",
    headline: "What's the budget vibe?",
    subhead: "Per person, roughly — we'll match real trips to it.",
    options: [
      {
        value: "value", label: "Smart & simple", sub: "Under ~₹25k",
        icon: "Wallet",
        weights: { "pilgrim-soul": 2, "himalayan-nomad": 2 },
      },
      {
        value: "comfort", label: "Comfortable", sub: "~₹25k – ₹75k",
        icon: "BedDouble",
        weights: { "heritage-wanderer": 2, "beach-drifter": 1, "jungle-seeker": 1 },
      },
      {
        value: "premium", label: "Premium", sub: "₹75k+, the works",
        icon: "Crown",
        weights: { "beach-drifter": 2, "heritage-wanderer": 2 },
      },
    ],
  },
  {
    id: "group",
    headline: "Who's coming along?",
    subhead: "The crew shapes the trip as much as the place.",
    options: [
      {
        value: "solo", label: "Just me", sub: "Solo adventure",
        icon: "User",
        weights: { "himalayan-nomad": 2, "pilgrim-soul": 1 },
      },
      {
        value: "couple", label: "Partner", sub: "A trip for two",
        icon: "Heart",
        weights: { "beach-drifter": 2, "heritage-wanderer": 1 },
      },
      {
        value: "family", label: "Family", sub: "All generations",
        icon: "Users",
        weights: { "pilgrim-soul": 2, "heritage-wanderer": 1 },
      },
      {
        value: "friends", label: "Friends", sub: "The whole gang",
        icon: "PartyPopper",
        weights: { "adrenaline-chaser": 2, "beach-drifter": 1 },
      },
    ],
  },
  {
    id: "duration",
    headline: "How long can you escape?",
    subhead: "We'll only suggest trips that actually fit your window.",
    compact: true,
    options: [
      {
        value: "weekend", label: "Weekend", sub: "2–4 days",
        icon: "CalendarDays",
        weights: { "beach-drifter": 2, "pilgrim-soul": 1 },
      },
      {
        value: "week", label: "A week", sub: "5–8 days",
        icon: "CalendarDays",
        weights: { "heritage-wanderer": 2, "jungle-seeker": 2 },
      },
      {
        value: "long", label: "Long break", sub: "9–14 days",
        icon: "CalendarDays",
        weights: { "himalayan-nomad": 2, "pilgrim-soul": 1 },
      },
      {
        value: "epic", label: "Epic", sub: "15+ days",
        icon: "CalendarDays",
        weights: { "pilgrim-soul": 2, "himalayan-nomad": 2 },
      },
    ],
  },
  {
    id: "month",
    headline: "When are you travelling?",
    subhead: "Timing is everything — pick your month.",
    compact: true,
    options: [
      { value: "jan", label: "Jan", icon: "Calendar", weights: {} },
      { value: "feb", label: "Feb", icon: "Calendar", weights: {} },
      { value: "mar", label: "Mar", icon: "Calendar", weights: {} },
      { value: "apr", label: "Apr", icon: "Calendar", weights: {} },
      { value: "may", label: "May", icon: "Calendar", weights: {} },
      { value: "jun", label: "Jun", icon: "Calendar", weights: {} },
      { value: "jul", label: "Jul", icon: "Calendar", weights: {} },
      { value: "aug", label: "Aug", icon: "Calendar", weights: {} },
      { value: "sep", label: "Sep", icon: "Calendar", weights: {} },
      { value: "oct", label: "Oct", icon: "Calendar", weights: {} },
      { value: "nov", label: "Nov", icon: "Calendar", weights: {} },
      { value: "dec", label: "Dec", icon: "Calendar", weights: {} },
    ],
  },
];

export type Answers = Record<string, string>;

/** Deterministic: sum option weights across answers; tie-break by PERSONALITY_ORDER. */
export function resolvePersonality(answers: Answers): PersonalityId {
  const totals: Partial<Record<PersonalityId, number>> = {};
  for (const q of QUESTIONS) {
    const value = answers[q.id];
    if (!value) continue;
    const opt = q.options.find((o) => o.value === value);
    if (!opt) continue;
    for (const [pid, w] of Object.entries(opt.weights)) {
      totals[pid as PersonalityId] =
        (totals[pid as PersonalityId] ?? 0) + (w ?? 0);
    }
  }
  let best: PersonalityId = PERSONALITY_ORDER[0];
  let bestScore = -1;
  // Fixed iteration order = deterministic tie-break.
  for (const pid of PERSONALITY_ORDER) {
    const s = totals[pid] ?? 0;
    if (s > bestScore) {
      bestScore = s;
      best = pid;
    }
  }
  return best;
}

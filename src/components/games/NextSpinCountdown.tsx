"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Timer } from "lucide-react";
import { hasSpunToday } from "@/lib/games/gameEngine";

/** Local YYYY-MM-DD. */
function todayLocal(): string {
  return new Date().toLocaleDateString("en-CA");
}

/** ms until next local midnight (when the free spin resets). */
function msUntilReset(from: number): number {
  const midnight = new Date(from);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, midnight.getTime() - from);
}

function formatCountdown(ms: number): string {
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

function subscribeSpinChange(onChange: () => void): () => void {
  // Another tab spinning updates this tab's countdown.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getSpunSnapshot(): boolean {
  return hasSpunToday(window.localStorage, todayLocal());
}

function getSpunServerSnapshot(): boolean {
  return false;
}

/**
 * Genuine countdown to the next free spin (local midnight, when the
 * per-device daily limit resets). Only rendered after today's spin is used.
 */
export default function NextSpinCountdown() {
  const spun = useSyncExternalStore(
    subscribeSpinChange,
    getSpunSnapshot,
    getSpunServerSnapshot,
  );
  // Ticks the displayed countdown; the interval callback (not the effect
  // body) performs the state update.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!spun) return;
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, [spun]);

  if (!spun) return null;

  return (
    <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-ink-muted">
      <Timer className="h-4 w-4 text-brand-secondary" aria-hidden="true" />
      Next free spin in {formatCountdown(msUntilReset(now))}
    </p>
  );
}

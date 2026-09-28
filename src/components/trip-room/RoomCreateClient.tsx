"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { encodeRoomState, newRoomId } from "@/lib/trip-room/codec";
import {
  ACTIVITY_OPTIONS,
  BUDGET_OPTIONS,
  DESTINATION_OPTIONS,
  DURATION_OPTIONS,
  HOTEL_OPTIONS,
  OPTION_LIMITS,
  dateWindowOptions,
} from "@/lib/trip-room/options";
import {
  CATEGORY_LABELS,
  POLL_CATEGORIES,
  ROOM_CODEC_VERSION,
  type PollCategory,
  type RoomState,
} from "@/lib/trip-room/types";

type Selection = Record<PollCategory, string[]>;

const emptySelection = (): Selection => ({
  destination: [],
  dates: [],
  budget: [],
  hotel: [],
  activities: [],
  duration: [],
});

const CATEGORY_SOURCES: Record<PollCategory, readonly string[]> = {
  destination: DESTINATION_OPTIONS,
  dates: [],
  budget: BUDGET_OPTIONS,
  hotel: HOTEL_OPTIONS,
  activities: ACTIVITY_OPTIONS,
  duration: DURATION_OPTIONS,
};

/**
 * Create-a-room form. The creator picks poll options per category; on submit
 * the room state is encoded into the room URL (?r=base64url, capped at 2KB)
 * and the user is sent to /trip-room/[id] to cast the first votes.
 */
export default function RoomCreateClient() {
  const router = useRouter();
  const dateOptions = useMemo(() => dateWindowOptions(6), []);
  const sources = useMemo<Record<PollCategory, readonly string[]>>(
    () => ({ ...CATEGORY_SOURCES, dates: dateOptions }),
    [dateOptions],
  );

  const [roomName, setRoomName] = useState("");
  const [selection, setSelection] = useState<Selection>(emptySelection);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const toggleOption = (category: PollCategory, option: string) => {
    setError(null);
    setSelection((prev) => {
      const current = prev[category];
      const { max } = OPTION_LIMITS[category];
      if (current.includes(option)) {
        return { ...prev, [category]: current.filter((o) => o !== option) };
      }
      if (current.length >= max) return prev;
      return { ...prev, [category]: [...current, option] };
    });
  };

  const problems = useMemo(() => {
    const list: string[] = [];
    if (!roomName.trim()) list.push("Give your trip room a name.");
    if (roomName.trim().length > 80) list.push("Keep the room name under 80 characters.");
    for (const cat of POLL_CATEGORIES) {
      const { min, max } = OPTION_LIMITS[cat];
      const n = selection[cat].length;
      if (n < min) list.push(`Pick at least ${min} ${CATEGORY_LABELS[cat].toLowerCase()} options.`);
      else if (n > max) list.push(`Pick at most ${max} ${CATEGORY_LABELS[cat].toLowerCase()} options.`);
    }
    return list;
  }, [roomName, selection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (problems.length > 0) {
      setError(problems[0]);
      return;
    }
    const state: RoomState = {
      v: ROOM_CODEC_VERSION,
      name: roomName.trim(),
      options: selection,
    };
    const encoded = encodeRoomState(state);
    if (!encoded) {
      setError("This room is too large to fit in a shareable link. Please pick fewer options.");
      return;
    }
    const roomId = newRoomId();
    trackEvent("trip_room_created", { room_id: roomId, name: state.name });
    router.push(`/trip-room/${roomId}?r=${encoded}`);
  };

  return (
    <div className="bg-surface-canvas">
      {/* CSS-only hero graphic: layered gradients, no images */}
      <div className="bg-brand-primary-deep" aria-hidden="true">
        <div
          className="mx-auto max-w-3xl px-4 pb-10 pt-10 sm:px-6 sm:pt-14"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(18,124,130,0.55) 0, transparent 42%), radial-gradient(circle at 84% 78%, rgba(242,157,56,0.35) 0, transparent 38%)",
          }}
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-secondary-pale">
            Group trip planner
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Plan a group trip, <span className="text-brand-cta">together</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Set up a poll for your group — destination, dates, budget and more. Share one link,
            everyone votes, and you&apos;ll see group consensus plus real package matches for the winners.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-line bg-surface-card p-4 sm:p-6">
          <label htmlFor="room-name" className="block text-sm font-extrabold uppercase tracking-[0.14em] text-ink">
            Name your trip room
          </label>
          <input
            id="room-name"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            maxLength={80}
            placeholder="e.g. College friends Goa trip"
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-line bg-surface-canvas px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
          />
        </div>

        {POLL_CATEGORIES.map((cat) => {
          const { min, max } = OPTION_LIMITS[cat];
          const picked = selection[cat];
          return (
            <fieldset key={cat} className="mt-6 rounded-2xl border border-line bg-surface-card p-4 sm:p-6">
              <legend className="px-1 text-sm font-extrabold uppercase tracking-[0.14em] text-ink">
                {CATEGORY_LABELS[cat]}
              </legend>
              <p className="mb-3 text-xs text-ink-muted">
                Choose {min}–{max} options for your group to vote on.
                <span className="ml-1 font-semibold text-brand-secondary">{picked.length} selected</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sources[cat].map((option) => {
                  const active = picked.includes(option);
                  const disabled = !active && picked.length >= max;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={active}
                      disabled={disabled}
                      onClick={() => toggleOption(cat, option)}
                      className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary disabled:cursor-not-allowed disabled:opacity-40 ${
                        active
                          ? "border-brand-secondary bg-brand-secondary text-white"
                          : "border-line bg-surface-canvas text-ink hover:border-brand-secondary/60"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        {touched && problems.length > 0 && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-800">
            <p className="font-extrabold">Almost there:</p>
            <ul className="mt-1 list-disc pl-5">
              {problems.slice(0, 4).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-cta px-6 py-4 text-base font-extrabold text-brand-primary-deep transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary active:scale-[0.99] sm:w-auto sm:px-10"
        >
          <Users className="h-5 w-5" aria-hidden="true" />
          Create trip room <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          No account needed. The room lives in its link — votes are stored on each voter&apos;s device and
          merge when someone opens a shared vote link. There is no live sync.
        </p>
      </form>
    </div>
  );
}

"use client";

import type { CategoryConsensus } from "@/lib/trip-room/voteStore";

interface ConsensusBarsProps {
  /** Category label, e.g. "Destination". */
  label: string;
  rows: CategoryConsensus[];
  /** Real merged voter count. */
  voterCount: number;
  /** True when this device has cast a vote in this category. */
  myChoice: string | null;
}

/**
 * Animated percentage bars for one poll category. Bars animate via CSS
 * width transition (disabled under prefers-reduced-motion). With zero votes
 * every option sits at 0% and the group is prompted to invite friends.
 */
export default function ConsensusBars({ label, rows, voterCount, myChoice }: ConsensusBarsProps) {
  const hasVotes = voterCount > 0;
  return (
    <section aria-label={`${label} consensus`} className="rounded-2xl border border-line bg-surface-card p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-ink">{label}</h3>
        <p className="text-xs text-ink-muted">
          {hasVotes ? `${voterCount} ${voterCount === 1 ? "vote" : "votes"} merged` : "No votes yet"}
        </p>
      </div>
      <ul className="space-y-3">
        {rows.map((row) => {
          const isMine = myChoice === row.option;
          return (
            <li key={row.option}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className={`font-semibold ${isMine ? "text-brand-secondary" : "text-ink"}`}>
                  {row.option}
                  {isMine && (
                    <span className="ml-2 rounded-full bg-brand-secondary/10 px-2 py-0.5 text-[11px] font-bold text-brand-secondary">
                      Your pick
                    </span>
                  )}
                </span>
                <span className="tabular-nums text-ink-muted" aria-label={`${row.pct} percent, ${row.votes} votes`}>
                  {row.pct}%
                </span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-surface-canvas"
                role="img"
                aria-label={`${row.option}: ${row.pct}% of votes`}
              >
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none ${
                    isMine ? "bg-brand-secondary" : "bg-brand-primary"
                  }`}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {!hasVotes && (
        <p className="mt-3 text-sm text-ink-muted">
          Nobody has voted here yet. Share the invite link with your group to start collecting votes.
        </p>
      )}
    </section>
  );
}

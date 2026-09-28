import { BellRing, Dices, Sparkles } from "lucide-react";

/**
 * Honest roadmap teasers: upcoming voucher games, clearly labelled
 * "Coming soon". No fake play buttons, no invented launch dates.
 */
const UPCOMING = [
  {
    icon: Sparkles,
    name: "Scratch the Peaks",
    copy: "A daily scratch card with the same real vouchers and published odds as the wheel. Reveal three matching peaks to win.",
  },
  {
    icon: Dices,
    name: "Lucky Dip",
    copy: "Pick a gift box a day — every box hides a real voucher or a try-again, drawn from the same prize pool.",
  },
];

export default function ComingSoonGames() {
  return (
    <section aria-label="More games coming soon" className="mx-auto w-full max-w-6xl px-4">
      <div className="flex items-center gap-2">
        <BellRing className="h-5 w-5 text-brand-secondary" aria-hidden="true" />
        <h2 className="font-display text-2xl font-extrabold text-ink">
          More games on the way
        </h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        We&apos;re building more ways to win real travel vouchers. Same honest
        odds, same real prizes — new ways to play.
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {UPCOMING.map((game) => (
          <div
            key={game.name}
            className="relative overflow-hidden rounded-3xl border border-line bg-surface-card p-6 shadow-[var(--shadow-card)]"
          >
            <span className="absolute right-4 top-4 rounded-full bg-brand-primary/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-primary">
              Coming soon
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white">
              <game.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-xl font-extrabold text-ink">
              {game.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{game.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

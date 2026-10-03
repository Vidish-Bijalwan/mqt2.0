"use client";

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Copy,
  Check,
  Dices,
  Flame,
  Gift,
  ListOrdered,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Volume2,
  VolumeX,
} from "lucide-react";
import WheelSvg, { buildWheelSegments } from "./WheelSvg";
import {
  drawTierIndex,
  effectiveProbabilities,
  expiryIso,
  formatRupees,
  generateVoucherCode,
  hasSpunToday,
  recordSpin,
  spinDates,
  streakDays,
  type DrawnPrize,
} from "@/lib/games/gameEngine";
import { saveVoucher } from "@/lib/games/voucherWallet";
import { spinTheHimalayas } from "@/data/commercial/games";
import { siteConfig } from "@/data/siteConfig";
import { trackEvent } from "@/lib/analytics";

const SPIN_TURNS = 6;
const SPIN_MS = 5400;

/** Existing repo photography (location-library). Attribution follows the
 *  repo's "Name — Author, License" caption convention. */
const WHEEL_BAND_IMAGE = {
  src: "/images/location-library/kedarnath-uttarakhand-india/kedarnath-uttarakhand-india-01-lg.webp",
  caption: "Kedarnath — Rohit Sharma, CC BY-SA 4.0",
};

/** Local YYYY-MM-DD. */
function todayLocal(): string {
  return new Date().toLocaleDateString("en-CA");
}

/** Crypto-strong rng in [0, 1). Falls back to Math.random off-secure-context. */
function secureRng(): () => number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    return () => {
      const b = new Uint32Array(1);
      crypto.getRandomValues(b);
      return b[0] / 4294967296;
    };
  }
  return Math.random;
}

/** Random bytes for voucher codes: crypto.getRandomValues on secure
 * contexts, Math.random otherwise. A failed code-gen must degrade to the
 * fallback, never throw mid-spin (that would leave phase stuck at
 * "spinning" forever and skip recordSpin). */
function voucherRandomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n);
  try {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      crypto.getRandomValues(bytes);
      return bytes;
    }
  } catch {
    /* fall through to the insecure fallback */
  }
  for (let i = 0; i < n; i++) bytes[i] = Math.floor(Math.random() * 256);
  return bytes;
}

function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const getSnapshot = useCallback(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function SpinGame() {
  const cfg = spinTheHimalayas;
  const prizes = cfg.prizes;
  const wheelRef = useRef<SVGGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [result, setResult] = useState<DrawnPrize | null>(null);
  // Daily-limit + streak hydrate from this device at first render
  // (lazy initializer, SSR-safe) — no sync setState-in-effect needed.
  const [spunToday, setSpunToday] = useState(
    () => typeof window !== "undefined" && hasSpunToday(window.localStorage, todayLocal()),
  );
  const [streak, setStreak] = useState(
    () =>
      typeof window === "undefined"
        ? 0
        : streakDays(spinDates(window.localStorage), todayLocal()),
  );
  const [soundOn, setSoundOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const odds = useMemo(() => effectiveProbabilities(prizes), [prizes]);
  const anyExhausted = prizes.some((p) => p.claimedExhausted);
  const oddsFor = (id: string) => odds.find((o) => o.id === id)?.percent ?? 0;
  const maxVoucher = useMemo(
    () => Math.max(...prizes.filter((p) => p.value > 0).map((p) => p.value)),
    [prizes],
  );
  const stepIcons = [Copy, MessageCircle, BadgeCheck];

  /* ── tick sound (created on the user's spin gesture — never autoplayed) ── */
  const playTick = useCallback(() => {
    if (!soundOn) return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      audioRef.current ??= new Ctx();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 1900;
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      /* audio is decorative — never break the spin */
    }
  }, [soundOn]);

  const currentPointerSegment = useCallback(() => {
    const el = wheelRef.current;
    if (!el) return -1;
    const style = window.getComputedStyle(el);
    const m = style.transform.match(/matrix\(([^)]+)\)/);
    if (!m) return -1;
    const [a, b] = m[1].split(",").map(Number);
    const rotation = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
    const pointerInWheel = ((-rotation % 360) + 360) % 360;
    const segs = buildWheelSegments(prizes);
    return segs.findIndex((s) => pointerInWheel >= s.start && pointerInWheel < s.end);
  }, [prizes]);

  const finishSpin = useCallback(
    (tierIndex: number) => {
      const tier = prizes[tierIndex];
      const issuedAt = new Date().toISOString();
      const code =
        tier.value > 0
          ? generateVoucherCode(voucherRandomBytes)
          : null;
      const drawn: DrawnPrize = {
        tier,
        code,
        issuedAtIso: issuedAt,
        expiresAtIso: tier.value > 0 ? expiryIso(issuedAt, cfg.expiryDays) : issuedAt,
      };
      // Persist won vouchers to this device's wallet. Storage only — the
      // engine already decided the prize above; nothing here re-rolls or
      // alters it.
      if (drawn.code) {
        saveVoucher(window.localStorage, {
          code: drawn.code,
          tierId: tier.id,
          label: tier.label,
          value: tier.value,
          minSpend: tier.minSpend,
          issuedAtIso: drawn.issuedAtIso,
          expiresAtIso: drawn.expiresAtIso,
        });
      }
      const today = todayLocal();
      recordSpin(window.localStorage, today, tier.id);
      setSpunToday(true);
      setStreak(streakDays(spinDates(window.localStorage), today));
      setResult(drawn);
      setPhase("done");
      trackEvent("voucher_game_spin", { prize: tier.id, value: tier.value });
      if (tier.value > 0) {
        trackEvent("voucher_game_won", { prize: tier.id, value: tier.value });
        if (!reducedMotion) {
          setCelebrating(true);
          window.setTimeout(() => setCelebrating(false), 2800);
        }
      }
    },
    [prizes, cfg.expiryDays, reducedMotion],
  );

  const spin = useCallback(() => {
    if (phase === "spinning" || spunToday) return;

    // 1. The ENGINE decides the prize — the UI only animates it.
    const tierIndex = drawTierIndex(prizes, secureRng());

    // 2. Find the winning slice on the wheel and land the pointer inside it.
    const segs = buildWheelSegments(prizes);
    const winner = segs.find((s) => s.tier.id === prizes[tierIndex].id && !s.exhausted)
      ?? segs.find((s) => s.tier.id === prizes[tierIndex].id);
    if (!winner || !wheelRef.current) {
      // Last-resort honesty: never fake an animation — reveal directly.
      finishSpin(tierIndex);
      return;
    }
    const jitterMax = Math.max(0, (winner.arc - 4) / 2);
    const jitter = (Math.random() * 2 - 1) * jitterMax;
    const target = 360 * SPIN_TURNS + (360 - winner.center) + jitter;

    const el = wheelRef.current;
    setPhase("spinning");
    setResult(null);
    setCopied(false);

    if (reducedMotion) {
      el.style.transition = "none";
      el.style.transform = `rotate(${target}deg)`;
      finishSpin(tierIndex);
      return;
    }

    el.style.transition = `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.06, 1)`;
    // Force reflow so the transition restarts from 0.
    void el.getBoundingClientRect();
    el.style.transform = `rotate(${target}deg)`;

    // Tick each time the pointer crosses a slice boundary.
    let lastSeg = currentPointerSegment();
    let raf = 0;
    const tickLoop = () => {
      const seg = currentPointerSegment();
      if (seg !== -1 && seg !== lastSeg) {
        lastSeg = seg;
        playTick();
      }
      raf = requestAnimationFrame(tickLoop);
    };
    raf = requestAnimationFrame(tickLoop);

    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      finishSpin(tierIndex);
    };
    el.addEventListener("transitionend", done, { once: true });
    window.setTimeout(done, SPIN_MS + 800); // fallback if transitionend misfires
  }, [phase, spunToday, prizes, reducedMotion, playTick, finishSpin, currentPointerSegment]);

  const copyCode = useCallback(async () => {
    if (!result?.code) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the code stays visible to copy manually */
    }
  }, [result]);

  const whatsappHref = result?.code
    ? `${siteConfig.whatsapp}?text=${encodeURIComponent(
        `Hi MyQuickTrippers! I won a ${result.tier.label} on Spin the Himalayas. My voucher code is ${result.code}. I'd like to use it on a booking.`,
      )}`
    : siteConfig.whatsapp;

  const expiryLabel = result && result.tier.value > 0
    ? new Date(result.expiresAtIso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:pt-10">
      {streak >= 2 && (
        <p className="mx-auto mb-6 flex w-fit items-center gap-1.5 rounded-full bg-brand-cta/15 px-4 py-1.5 text-sm font-bold text-ink">
          <Flame className="h-4 w-4 text-brand-cta-deep" aria-hidden="true" />
          {streak}-day spin streak
        </p>
      )}

      {/* ── Wheel + odds: two-column on desktop, stacked on mobile ── */}
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        {/* Left: wheel, spin CTA, result */}
        <div className="lg:col-span-3">
          <section
            aria-label="Prize wheel"
            className="relative overflow-hidden rounded-3xl border border-line bg-surface-card shadow-[var(--shadow-card)]"
          >
            {celebrating && <Confetti />}

            {/* Himalayan photo band */}
            <div className="relative h-36 sm:h-44">
              <Image
                src={WHEEL_BAND_IMAGE.src}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                loading="lazy"
                decoding="async"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#071525]/90 via-[#071525]/15 to-transparent"
              />
              <p className="absolute bottom-2 left-4 text-[11px] text-white/70">
                {WHEEL_BAND_IMAGE.caption}
              </p>
            </div>

            <div className="p-5 sm:p-6">
              {/* Dark wheel stage */}
              <div className="relative overflow-hidden rounded-3xl bg-brand-primary-deep px-4 py-6">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(18,124,130,0.38),transparent_68%)]"
                />
                <div className="relative mx-auto max-w-[340px]" ref={containerRef}>
                  {/* pointer */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-1 left-1/2 z-10 -translate-x-1/2"
                    style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))" }}
                  >
                    <div
                      className="h-0 w-0 border-x-[13px] border-t-[22px] border-x-transparent border-t-[#F29D38]"
                    />
                  </div>
                  <div aria-hidden="true">
                    <WheelSvg prizes={prizes} wheelRef={wheelRef} />
                  </div>
                </div>
                <p className="relative mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary-pale/80">
                  {cfg.spinsPerDay} free spin per day · no sign-up needed
                </p>
              </div>

              <button
                type="button"
                onClick={spin}
                disabled={phase === "spinning" || spunToday}
                className="btn-shine mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-cta px-6 py-4 font-display text-xl font-extrabold text-[#0B1F33] shadow-[var(--shadow-cta-orange)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {phase === "spinning" ? (
                  <>
                    <RotateCcw className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Spinning…
                  </>
                ) : spunToday ? (
                  "Today's spin used — come back tomorrow"
                ) : (
                  <>
                    <Dices className="h-6 w-6" aria-hidden="true" />
                    SPIN NOW
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-between text-sm">
                <p className="font-semibold text-ink-muted">
                  {spunToday
                    ? "You've used today's spin on this device."
                    : `1 free spin per day · no sign-up needed`}
                </p>
                <button
                  type="button"
                  onClick={() => setSoundOn((s) => !s)}
                  aria-pressed={soundOn}
                  aria-label={soundOn ? "Mute tick sounds" : "Unmute tick sounds"}
                  className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-canvas hover:text-ink"
                >
                  {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </section>

          {/* ── Result (announced to screen readers) ── */}
          <div aria-live="polite" className="mt-6">
            {phase === "done" && result && result.tier.value > 0 && (
              <section
                aria-label="You won a voucher"
                className="rounded-3xl border-2 border-brand-cta bg-surface-card p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-2 text-brand-cta-deep">
                  <Gift className="h-5 w-5" aria-hidden="true" />
                  <p className="font-display text-lg font-extrabold">You won {result.tier.label}!</p>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  A real discount, applied to a qualifying booking by our team.
                </p>

                <button
                  type="button"
                  onClick={copyCode}
                  className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-brand-secondary bg-brand-secondary/5 px-4 py-3"
                  aria-label={`Copy voucher code ${result.code}`}
                >
                  <code className="font-mono text-2xl font-bold tracking-widest text-brand-primary">
                    {result.code}
                  </code>
                  {copied ? (
                    <span className="flex items-center gap-1 text-sm font-bold text-state-success">
                      <Check className="h-4 w-4" aria-hidden="true" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-bold text-brand-secondary">
                      <Copy className="h-4 w-4" aria-hidden="true" /> Copy
                    </span>
                  )}
                </button>

                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Minimum booking value</dt>
                    <dd className="font-bold text-ink">{formatRupees(result.tier.minSpend)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Valid until</dt>
                    <dd className="font-bold text-ink">{expiryLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Odds of this prize</dt>
                    <dd className="font-bold text-ink">
                      {formatOdds(oddsFor(result.tier.id))}
                    </dd>
                  </div>
                </dl>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-3.5 font-display text-lg font-bold text-white transition-transform active:scale-[0.98]"
                >
                  <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                  Redeem on WhatsApp
                </a>
                <p className="mt-2 text-center text-xs text-ink-muted">
                  Mention your code in the chat — our team verifies and applies it to your quote before you pay.
                </p>
              </section>
            )}

            {phase === "done" && result && result.tier.value === 0 && (
              <section
                aria-label="No prize this time"
                className="rounded-3xl border border-line bg-surface-card p-5 text-center shadow-[var(--shadow-card)]"
              >
                <p className="font-display text-xl font-extrabold text-ink">No voucher this time</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  That was a fair spin — 40 of every 100 spins land here. Your free spin
                  for tomorrow is waiting.
                </p>
              </section>
            )}
          </div>
        </div>

        {/* Right: published odds panel */}
        <aside
          aria-label="Published odds"
          className="self-start rounded-3xl border border-line bg-surface-card shadow-[var(--shadow-card)] lg:sticky lg:top-6 lg:col-span-2"
        >
          <div className="border-b border-line p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
              <ListOrdered className="h-5 w-5 text-brand-secondary" aria-hidden="true" />
              Published odds
            </h2>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-surface-canvas px-2 py-2.5">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                  Top prize
                </dt>
                <dd className="mt-0.5 font-display text-sm font-extrabold text-ink">
                  {formatRupees(maxVoucher)}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-canvas px-2 py-2.5">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                  Monthly budget
                </dt>
                <dd className="mt-0.5 font-display text-sm font-extrabold text-ink">
                  {formatRupees(cfg.monthlyPrizeBudget)}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-canvas px-2 py-2.5">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                  Spins
                </dt>
                <dd className="mt-0.5 font-display text-sm font-extrabold text-ink">
                  {cfg.spinsPerDay}/day
                </dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-canvas text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th scope="col" className="px-4 py-2.5 font-bold">Prize</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-bold">Odds</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-bold">Max winners / month</th>
                </tr>
              </thead>
              <tbody>
                {prizes.map((p) => {
                  const eff = oddsFor(p.id);
                  return (
                    <tr key={p.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-2.5 font-semibold text-ink">
                        {p.label}
                        {p.claimedExhausted && (
                          <span className="ml-2 rounded-full bg-ink-muted/15 px-2 py-0.5 text-xs font-bold text-ink-muted">
                            Fully claimed
                          </span>
                        )}
                        {p.value > 0 && (
                          <span className="block text-xs font-normal text-ink-muted">
                            min. booking {formatRupees(p.minSpend)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-ink">
                        {p.claimedExhausted ? "—" : formatOdds(eff)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-ink-muted">
                        {p.value === 0 ? "—" : p.maxWinners.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="border-t border-line p-5 text-xs leading-relaxed text-ink-muted sm:p-6">
            {anyExhausted
              ? "A prize tier is fully claimed this month, so the odds above are recalculated across the remaining tiers."
              : "Odds are fixed. They don't change based on who's spinning, how many people spun, or what time it is."}{" "}
            Total monthly prize budget: {formatRupees(cfg.monthlyPrizeBudget)}.
          </p>

          <p className="mx-5 mb-5 rounded-2xl bg-brand-primary/5 p-4 text-xs leading-relaxed text-ink-muted sm:mx-6 sm:mb-6">
            {cfg.fairnessNote}
          </p>
        </aside>
      </div>

      {/* ── How redemption works: horizontal step cards ── */}
      <section aria-label="How to redeem your voucher" className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink sm:text-2xl">
          <ShieldCheck className="h-6 w-6 text-brand-secondary" aria-hidden="true" />
          How redemption works
        </h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {cfg.redemptionSteps.map((step, i) => {
            const StepIcon = stepIcons[i] ?? BadgeCheck;
            return (
              <li
                key={i}
                className="relative rounded-3xl border border-line bg-surface-card p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white"
                  >
                    <StepIcon className="h-5 w-5" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-ink-muted"
                  >
                    Step {i + 1}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">{step}</p>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

/** "1 in 100 spins" style odds label from a percent value. */
function formatOdds(percent: number): string {
  if (percent <= 0) return "—";
  if (percent >= 100) return "Always";
  const oneIn = Math.round(100 / percent);
  return `${percent < 10 ? percent.toFixed(1).replace(/\.0$/, "") : Math.round(percent)}% · 1 in ${oneIn.toLocaleString("en-IN")}`;
}

/** Restrained confetti burst: ~36 pieces, one fall, no loops. Skipped for reduced motion (not rendered). */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        // Deterministic pseudo-random from index — stable across renders.
        const seed = (i * 2654435761) % 1000 / 1000;
        const seed2 = (i * 40503) % 1000 / 1000;
        return {
          left: seed * 100,
          delay: seed2 * 0.35,
          duration: 1.6 + seed * 1.1,
          size: 6 + seed2 * 7,
          color: ["#F29D38", "#127C82", "#0B1F33", "#9FD8DC"][i % 4],
          round: i % 3 === 0,
        };
      }),
    [],
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-[-14px] animate-[confetti-fall_var(--dur)_cubic-bezier(0.2,0.6,0.4,1)_var(--delay)_forwards]"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.round ? p.size : p.size * 0.5,
              backgroundColor: p.color,
              borderRadius: p.round ? "50%" : "1px",
              "--dur": `${p.duration}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
      <style>{`@keyframes confetti-fall { to { transform: translateY(420px) rotate(540deg); opacity: 0; } }`}</style>
    </div>
  );
}

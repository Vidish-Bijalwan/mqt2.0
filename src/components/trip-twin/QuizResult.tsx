"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check, Clock, Copy, Download, IndianRupee, MapPin, RotateCcw, Share2,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { Package } from "@/data/allPackages";
import type { Personality } from "./personalities";
import {
  renderTripTwinCard, downloadCardPng, shareCard,
} from "./cardRenderer";
import { displayPrice } from "./matcher";

interface QuizResultProps {
  personality: Personality;
  matches: Package[];
  monthLabel?: string;
  onRestart: () => void;
}

export default function QuizResult({
  personality, matches, monthLabel, onRestart,
}: QuizResultProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shareText =
    `I'm a ${personality.name}! ${personality.hook} Find your Trip Twin at myquicktrippers.com/trip-twin`;

  // Render the 1080×1920 card lazily on the client; reuse for preview,
  // download and share. Cached per result so repeated shares don't redraw.
  const getCanvas = useCallback(() => {
    if (!canvasRef.current) {
      canvasRef.current = renderTripTwinCard({ personality, matches, monthLabel });
    }
    return canvasRef.current;
  }, [personality, matches, monthLabel]);

  useEffect(() => {
    canvasRef.current = null; // inputs changed → invalidate cache
    const id = requestAnimationFrame(() => {
      setPreviewUrl(getCanvas().toDataURL("image/png"));
    });
    return () => cancelAnimationFrame(id);
  }, [getCanvas]);

  const flash = (msg: string) => {
    setStatus(msg);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatus(null), 2600);
  };

  const handleDownload = () => {
    const canvas = getCanvas();
    setBusy(true);
    downloadCardPng(canvas, `my-trip-twin-${personality.id}.png`);
    trackEvent("trip_twin_shared", { personality: personality.id, method: "download" });
    flash("Card downloaded — ready for WhatsApp or your Story.");
    setBusy(false);
  };

  const handleShare = async () => {
    const canvas = getCanvas();
    setBusy(true);
    const result = await shareCard(canvas, shareText);
    trackEvent("trip_twin_shared", { personality: personality.id, method: "share" });
    if (result === "shared") flash("Shared! Your Trip Twin is on its way.");
    else if (result === "copied") flash("Link copied — paste it anywhere.");
    else flash("Couldn't share automatically — try Download instead.");
    setBusy(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${shareText}\nhttps://myquicktrippers.com/trip-twin`,
      );
      trackEvent("trip_twin_shared", { personality: personality.id, method: "copy" });
      flash("Link copied to clipboard.");
    } catch {
      flash("Copy didn't work on this browser — try Download.");
    }
  };

  return (
    <div>
      {/* Personality reveal */}
      <div className="overflow-hidden rounded-3xl bg-brand-primary-deep p-6 text-center text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-secondary-pale">
          Your Trip Twin is
        </p>
        <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">
          {personality.name}
        </h2>
        <div
          aria-hidden="true"
          className="mx-auto mt-4 h-1.5 w-24 rounded-full"
          style={{ backgroundColor: personality.accent }}
        />
        <p className="mx-auto mt-4 max-w-md text-lg italic text-white/80">
          “{personality.hook}”
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
          {personality.description}
        </p>
      </div>

      {/* Matched trips — real packages */}
      <h3 className="mt-8 text-xl font-extrabold text-ink">
        Trips picked for your twin
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        Matched from our real catalogue — tap any trip for full details.
      </p>
      <ul className="mt-4 space-y-3">
        {matches.map((pkg, i) => (
          <li key={pkg.slug}>
            <Link
              href={`/packages/${pkg.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface-card p-4 transition hover:border-brand-secondary/60 hover:shadow-[0_12px_30px_-12px_rgba(18,124,130,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-brand-primary-deep"
                style={{ backgroundColor: `${personality.accent}33` }}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-bold text-ink">
                  {pkg.title}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {pkg.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {pkg.category}
                  </span>
                  {displayPrice(pkg) && (
                    <span className="inline-flex items-center gap-1 font-bold text-state-success">
                      <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
                      {displayPrice(pkg)}
                    </span>
                  )}
                </span>
              </span>
              <span aria-hidden="true" className="shrink-0 text-xl text-brand-secondary">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Share card */}
      <h3 className="mt-10 text-xl font-extrabold text-ink">Share your twin</h3>
      <p className="mt-1 text-sm text-ink-muted">
        A story-sized card (1080×1920) — perfect for WhatsApp, Instagram Stories or X.
      </p>
      {previewUrl && (
        <div className="mx-auto mt-4 w-44 overflow-hidden rounded-2xl border border-line shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={`Shareable result card: ${personality.name}`}
            width={216}
            height={384}
            className="h-auto w-full"
          />
        </div>
      )}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-cta px-5 py-3.5 text-base font-bold text-brand-primary-deep transition hover:brightness-105 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Download PNG
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-secondary px-5 py-3.5 text-base font-bold text-white transition hover:brightness-110 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
          Share
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-line bg-surface-card px-5 py-3.5 text-base font-bold text-ink transition hover:border-brand-secondary/60 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
        >
          {status === "Link copied to clipboard." ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Copy className="h-5 w-5" aria-hidden="true" />
          )}
          Copy link
        </button>
      </div>
      <div aria-live="polite" className="mt-3 min-h-6 text-center text-sm font-medium text-state-success">
        {status}
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-ink-muted transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Retake the quiz
      </button>
    </div>
  );
}

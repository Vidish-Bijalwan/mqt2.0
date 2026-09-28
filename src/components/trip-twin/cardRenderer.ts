"use client";

/** Shareable result card rendered to an HTML canvas at 1080×1920
 * (fits WhatsApp / Instagram Story / X). Pure canvas drawing —
 * Alpine Noir background, no image assets required. */

import type { Package } from "@/data/allPackages";
import type { Personality } from "./personalities";
import { displayPrice } from "./matcher";

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

const BG_TOP = "#0B1F33";
const BG_BOTTOM = "#071626";
const INK = "#FFFFFF";
const INK_MUTED = "rgba(255,255,255,0.62)";
const CTA = "#F29D38";

interface CardInput {
  personality: Personality;
  matches: Package[];
  monthLabel?: string;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function renderTripTwinCard(input: CardInput): HTMLCanvasElement {
  const { personality, matches, monthLabel } = input;
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // ── Alpine Noir background ──────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  bg.addColorStop(0, BG_TOP);
  bg.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Decorative glow ring in the personality accent color.
  const glow = ctx.createRadialGradient(540, 560, 60, 540, 560, 620);
  glow.addColorStop(0, `${personality.accent}55`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_WIDTH, 1100);

  // Scattered stars.
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  const starSeeds = [0.13, 0.27, 0.41, 0.58, 0.72, 0.86, 0.93, 0.2, 0.47, 0.66, 0.8, 0.33];
  starSeeds.forEach((s, i) => {
    const x = (s * CARD_WIDTH) % CARD_WIDTH;
    const y = ((s * 977) % 900) + 60;
    ctx.beginPath();
    ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  });

  // Thin accent rule at the very top.
  ctx.fillStyle = personality.accent;
  ctx.fillRect(0, 0, CARD_WIDTH, 10);

  let y = 120;

  // ── Kicker ──────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.fillStyle = INK_MUTED;
  ctx.font = "600 34px Manrope, system-ui, sans-serif";
  ctx.letterSpacing = "10px";
  ctx.fillText("MY TRIP TWIN", CARD_WIDTH / 2, y);
  ctx.letterSpacing = "0px";
  y += 130;

  // ── Personality name ────────────────────────────────────
  ctx.fillStyle = INK;
  ctx.font = "800 118px 'Bricolage Grotesque', Manrope, system-ui, sans-serif";
  const nameLines = wrapText(ctx, personality.name, 940);
  for (const line of nameLines) {
    ctx.fillText(line, CARD_WIDTH / 2, y);
    y += 130;
  }

  // Accent underline.
  roundRect(ctx, CARD_WIDTH / 2 - 110, y - 70, 220, 8, 4);
  ctx.fillStyle = personality.accent;
  ctx.fill();
  y += 70;

  // ── Hook ────────────────────────────────────────────────
  ctx.fillStyle = INK_MUTED;
  ctx.font = "italic 400 44px Manrope, system-ui, sans-serif";
  const hookLines = wrapText(ctx, `“${personality.hook}”`, 880);
  for (const line of hookLines) {
    ctx.fillText(line, CARD_WIDTH / 2, y);
    y += 62;
  }
  y += 90;

  // ── Matched trips ───────────────────────────────────────
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = "700 40px Manrope, system-ui, sans-serif";
  ctx.fillText("Trips picked for you", 90, y);
  y += 44;

  const shown = matches.slice(0, 3);
  for (let i = 0; i < shown.length; i++) {
    const m = shown[i];
    const cardY = y + 8;
    const cardH = 200;

    ctx.fillStyle = "rgba(255,255,255,0.07)";
    roundRect(ctx, 90, cardY, 900, cardH, 28);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 2;
    roundRect(ctx, 90, cardY, 900, cardH, 28);
    ctx.stroke();

    // Rank number in accent color.
    ctx.fillStyle = personality.accent;
    ctx.font = "800 60px 'Bricolage Grotesque', Manrope, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(i + 1), 160, cardY + 112);

    // Title (wrapped, max 2 lines), duration + real deal price.
    ctx.textAlign = "left";
    ctx.fillStyle = INK;
    ctx.font = "700 38px Manrope, system-ui, sans-serif";
    const titleLines = wrapText(ctx, m.title, 660).slice(0, 2);
    titleLines.forEach((line, li) => {
      ctx.fillText(line, 230, cardY + 72 + li * 48);
    });
    ctx.fillStyle = INK_MUTED;
    ctx.font = "500 32px Manrope, system-ui, sans-serif";
    const price = displayPrice(m);
    const meta = price ? `${m.duration}  ·  ${price}` : m.duration;
    ctx.fillText(meta, 230, cardY + 72 + titleLines.length * 48 + 14);

    y = cardY + cardH + 24;
  }
  y += 60;

  // ── Fixed bottom block: footer line + CTA band ──────────
  // Anchored to the canvas bottom so long names/hooks can never
  // collide with the branding (worst-case content ends ~y=1560).
  const footerY = CARD_HEIGHT - 64;
  const bandH = 150;
  const bandY = footerY - 36 - bandH;

  roundRect(ctx, 90, bandY, 900, bandH, 28);
  ctx.fillStyle = CTA;
  ctx.fill();
  ctx.fillStyle = "#0B1F33";
  ctx.textAlign = "center";
  ctx.font = "800 42px Manrope, system-ui, sans-serif";
  ctx.fillText("Find your own Trip Twin", CARD_WIDTH / 2, bandY + 62);
  ctx.font = "600 34px Manrope, system-ui, sans-serif";
  ctx.fillText("myquicktrippers.com/trip-twin", CARD_WIDTH / 2, bandY + 112);

  // ── Footer branding ─────────────────────────────────────
  ctx.fillStyle = INK_MUTED;
  ctx.font = "600 30px Manrope, system-ui, sans-serif";
  const footerText = monthLabel
    ? `myquicktrippers.com  ·  Travelling in ${monthLabel}`
    : "myquicktrippers.com";
  ctx.fillText(footerText, CARD_WIDTH / 2, footerY);

  return canvas;
}

/** Download the card as a PNG file. */
export function downloadCardPng(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }, "image/png");
}

/** Share via Web Share API (file) → fallback to clipboard text. */
export async function shareCard(
  canvas: HTMLCanvasElement,
  shareText: string,
): Promise<"shared" | "copied" | "failed"> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (blob) {
      const file = new File([blob], "my-trip-twin.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "My Trip Twin", text: shareText });
        return "shared";
      }
    }
  } catch {
    // Fall through to text share / clipboard.
  }
  try {
    if (navigator.share) {
      await navigator.share({ title: "My Trip Twin", text: shareText, url: "https://myquicktrippers.com/trip-twin" });
      return "shared";
    }
  } catch {
    // User cancelled or share unavailable.
  }
  try {
    await navigator.clipboard.writeText(`${shareText}\nhttps://myquicktrippers.com/trip-twin`);
    return "copied";
  } catch {
    return "failed";
  }
}

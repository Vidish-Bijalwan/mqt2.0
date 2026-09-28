"use client";

import { useMemo } from "react";
import type { PrizeTier } from "@/lib/games/gameEngine";

/** One drawable wheel slice. Angles in degrees, clockwise from 12 o'clock. */
export interface WheelSegment {
  tier: PrizeTier;
  /** For the split no-prize slice: "a" | "b" | undefined. */
  part?: "a" | "b";
  start: number;
  end: number;
  center: number;
  arc: number;
  exhausted: boolean;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)] as const;
}

function slicePath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

/**
 * Build the visual segments from the configured tiers. The 40% no-prize
 * tier is drawn as TWO 20% slices (interleaved with prize slices, like a
 * real wheel) — same total probability, purely cosmetic.
 */
export function buildWheelSegments(prizes: PrizeTier[]): WheelSegment[] {
  const ordered: { tier: PrizeTier; weight: number; part?: "a" | "b" }[] = [];
  for (const tier of prizes) {
    if (tier.id === "no-prize") {
      ordered.push({ tier, weight: tier.probability / 2, part: "a" });
    } else {
      ordered.push({ tier, weight: tier.probability });
    }
  }
  // Interleave: insert the second no-prize half after the 3rd prize slice.
  const secondHalf = ordered.find((s) => s.part === "a");
  if (secondHalf) {
    ordered.splice(4, 0, { tier: secondHalf.tier, weight: secondHalf.weight, part: "b" });
  }

  const segments: WheelSegment[] = [];
  let cursor = 0;
  for (const { tier, weight, part } of ordered) {
    const arc = (weight / 100) * 360;
    const start = cursor;
    const end = cursor + arc;
    segments.push({
      tier,
      part,
      start,
      end,
      center: (start + end) / 2,
      arc,
      exhausted: tier.claimedExhausted,
    });
    cursor = end;
  }
  return segments;
}

interface WheelSvgProps {
  prizes: PrizeTier[];
  /** Ref to the rotating <g> — the parent drives rotation imperatively. */
  wheelRef: React.RefObject<SVGGElement | null>;
}

const SIZE = 340;
const R = 158;
const CX = SIZE / 2;
const CY = SIZE / 2;

export default function WheelSvg({ prizes, wheelRef }: WheelSvgProps) {
  const segments = useMemo(() => buildWheelSegments(prizes), [prizes]);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-auto w-full"
      role="img"
      aria-label="Prize wheel. Segments: ₹5,000 voucher, ₹2,500 voucher, ₹1,000 voucher, ₹500 voucher, ₹250 voucher, and no-prize segments."
    >
      <defs>
        <clipPath id="wheelClip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      {/* outer rim */}
      <circle cx={CX} cy={CY} r={R + 6} fill="#0B1F33" />
      <circle cx={CX} cy={CY} r={R + 6} fill="none" stroke="#F29D38" strokeWidth="3" />

      <g ref={wheelRef} style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <g clipPath="url(#wheelClip)">
          {segments.map((seg, i) => {
            const fill = seg.exhausted ? "#E9EDEB" : seg.tier.color;
            const mid = seg.center;
            const [lx, ly] = polar(CX, CY, R * 0.64, mid);
            const showLabel = seg.arc >= 13 && !seg.exhausted;
            const showExhaustedLabel = seg.exhausted && seg.arc >= 40;
            return (
              <g key={`${seg.tier.id}-${seg.part ?? "full"}-${i}`}>
                <path d={slicePath(CX, CY, R, seg.start, seg.end)} fill={fill} stroke="#FFFFFF" strokeWidth="1.5" />
                {showLabel && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={seg.tier.textColor}
                    fontSize={seg.arc < 30 ? 11 : 15}
                    fontWeight={800}
                    fontFamily="var(--font-display), sans-serif"
                    transform={`rotate(${mid} ${lx} ${ly})`}
                  >
                    {seg.tier.segmentLabel}
                  </text>
                )}
                {showExhaustedLabel && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#5B6B76"
                    fontSize={11}
                    fontWeight={700}
                    transform={`rotate(${mid} ${lx} ${ly})`}
                  >
                    Fully claimed
                  </text>
                )}
              </g>
            );
          })}
        </g>
        {/* hub */}
        <circle cx={CX} cy={CY} r={30} fill="#0B1F33" stroke="#F29D38" strokeWidth="3" />
        <text
          x={CX}
          y={CY + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#F29D38"
          fontSize={13}
          fontWeight={800}
          fontFamily="var(--font-display), sans-serif"
        >
          MQT
        </text>
      </g>

      {/* tick marks ring */}
      {segments.map((seg, i) => {
        const [tx, ty] = polar(CX, CY, R + 1, seg.start);
        return <circle key={`tick-${i}`} cx={tx} cy={ty} r={2.4} fill="#F29D38" />;
      })}
    </svg>
  );
}

import type { CSSProperties, ReactNode } from "react";
import type { StateMotifKey } from "@/data/stateArtwork";

/**
 * Data-driven per-state SVG texture. Each motif key maps to a small tileable
 * pattern drawn in currentColor — callers tint it with --state-accent at low
 * opacity. No per-state components; add a key + tile art to extend.
 */
const MOTIFS: Record<StateMotifKey, { tile: number; art: ReactNode }> = {
  peaks: {
    tile: 64,
    art: (
      <>
        <path d="M0 44 L16 20 L26 34 L36 12 L48 30 L64 10" />
        <path d="M0 58 L20 34 L32 48 L48 26 L64 42" opacity=".45" />
      </>
    ),
  },
  pines: {
    tile: 56,
    art: (
      <>
        <path d="M28 6 L42 32 H14 Z" />
        <path d="M28 32 v12" />
        <path d="M46 30 L54 44 H38 Z" opacity=".5" />
      </>
    ),
  },
  jaali: {
    tile: 48,
    art: (
      <>
        <path d="M24 4 L44 24 L24 44 L4 24 Z" />
        <path d="M0 0 L10 10 M48 0 L38 10 M0 48 L10 38 M48 48 L38 38" opacity=".6" />
        <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
      </>
    ),
  },
  "fort-arches": {
    tile: 64,
    art: (
      <>
        <path d="M0 50 Q16 14 32 50 Q48 14 64 50" />
        <path d="M0 58 H64" opacity=".5" />
      </>
    ),
  },
  "backwater-waves": {
    tile: 72,
    art: (
      <>
        <path d="M0 22 Q18 10 36 22 T72 22" />
        <path d="M0 44 Q18 32 36 44 T72 44" opacity=".5" />
      </>
    ),
  },
  "coast-arcs": {
    tile: 64,
    art: (
      <>
        <path d="M6 58 A52 52 0 0 1 58 6" />
        <path d="M18 58 A40 40 0 0 1 58 18" opacity=".6" />
        <path d="M30 58 A28 28 0 0 1 58 30" opacity=".35" />
      </>
    ),
  },
  bandhani: {
    tile: 48,
    art: (
      <>
        <circle cx="24" cy="8" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="40" cy="24" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="24" cy="40" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="8" cy="24" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" opacity=".6" />
      </>
    ),
  },
  mandala: {
    tile: 64,
    art: (
      <>
        <circle cx="32" cy="32" r="24" />
        <circle cx="32" cy="32" r="15" opacity=".6" />
        <circle cx="32" cy="32" r="6" opacity=".35" />
        <circle cx="32" cy="32" r="1.8" fill="currentColor" stroke="none" />
      </>
    ),
  },
  gopuram: {
    tile: 64,
    art: (
      <>
        <path d="M6 56 H58 V46 H6 Z" />
        <path d="M14 46 H50 V36 H14 Z" opacity=".7" />
        <path d="M22 36 H42 V26 H22 Z" opacity=".5" />
        <path d="M29 26 H35 V18 H29 Z" opacity=".35" />
      </>
    ),
  },
  boulders: {
    tile: 72,
    art: (
      <>
        <ellipse cx="18" cy="22" rx="10" ry="7" />
        <ellipse cx="48" cy="46" rx="13" ry="9" opacity=".6" />
        <ellipse cx="54" cy="14" rx="6" ry="5" opacity=".4" />
      </>
    ),
  },
  stripes: {
    tile: 48,
    art: (
      <path
        d="M8 12 l12 -5 M30 24 l12 -5 M6 40 l12 -5"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    ),
  },
  "tea-leaves": {
    tile: 56,
    art: (
      <>
        <path d="M28 4 C41 17 41 35 28 48 C15 35 15 17 28 4 Z" />
        <path d="M28 4 V48" opacity=".6" />
      </>
    ),
  },
  petals: {
    tile: 56,
    art: (
      <>
        <circle cx="28" cy="13" r="7" />
        <circle cx="43" cy="28" r="7" opacity=".7" />
        <circle cx="28" cy="43" r="7" opacity=".7" />
        <circle cx="13" cy="28" r="7" opacity=".7" />
        <circle cx="28" cy="28" r="2.2" fill="currentColor" stroke="none" />
      </>
    ),
  },
  pennants: {
    tile: 64,
    art: (
      <>
        <path d="M0 10 Q32 26 64 10" />
        <path d="M12 15 l9 3 -5 11 Z" fill="currentColor" stroke="none" />
        <path d="M30 19 l9 1 -4 12 Z" fill="currentColor" stroke="none" opacity=".7" />
        <path d="M47 15 l9 -3 -6 11 Z" fill="currentColor" stroke="none" opacity=".5" />
      </>
    ),
  },
  paisley: {
    tile: 64,
    art: (
      <path d="M36 6 C52 16 54 40 40 50 C30 57 18 52 19 41 C20 33 29 30 33 36 C36 41 31 46 27 43" />
    ),
  },
  dunes: {
    tile: 80,
    art: (
      <>
        <path d="M0 54 C26 28 54 28 80 54" />
        <path d="M0 70 C26 48 54 48 80 70" opacity=".5" />
      </>
    ),
  },
  fronds: {
    tile: 64,
    art: (
      <>
        <path d="M32 62 V12" />
        <path d="M32 20 L14 10 M32 20 L50 10" />
        <path d="M32 32 L12 24 M32 32 L52 24" />
        <path d="M32 44 L16 38 M32 44 L48 38" />
      </>
    ),
  },
  lanterns: {
    tile: 56,
    art: (
      <>
        <circle cx="16" cy="24" r="9" />
        <path d="M11 13 h10" />
        <circle cx="40" cy="38" r="9" opacity=".6" />
        <path d="M35 27 h10" opacity=".6" />
      </>
    ),
  },
};

export default function StateMotif({
  motif,
  className = "",
  style,
}: {
  motif?: StateMotifKey;
  className?: string;
  style?: CSSProperties;
}) {
  if (!motif) return null;
  const def = MOTIFS[motif];
  const id = `state-motif-${motif}`;
  return (
    <svg aria-hidden="true" className={`pointer-events-none ${className}`} style={style}>
      <defs>
        <pattern id={id} width={def.tile} height={def.tile} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            {def.art}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

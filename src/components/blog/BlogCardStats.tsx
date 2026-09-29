"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Eye, Heart, MessageCircle } from "lucide-react";

export interface BlogStatCounts {
  views: number;
  likes: number;
  comments: number;
}

const ZERO: BlogStatCounts = { views: 0, likes: 0, comments: 0 };

const BlogStatsContext = createContext<Record<string, BlogStatCounts>>({});

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
}

/**
 * Presentational per-slug stat row: 👁 views · ♥ likes · 💬 comments.
 * When `stats` is omitted it reads from the nearest BlogCardStats provider.
 */
export function BlogCardStat({ slug, stats }: { slug: string; stats?: BlogStatCounts }) {
  const ctx = useContext(BlogStatsContext);
  const s = stats ?? ctx[slug] ?? ZERO;
  return (
    <span
      className="inline-flex items-center gap-2.5"
      aria-label={`${s.views} views, ${s.likes} likes, ${s.comments} comments`}
    >
      <span className="inline-flex items-center gap-1">
        <Eye className="w-3 h-3" aria-hidden="true" />
        <span>{formatCount(s.views)}</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <Heart className="w-3 h-3" aria-hidden="true" />
        <span>{formatCount(s.likes)}</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <MessageCircle className="w-3 h-3" aria-hidden="true" />
        <span>{formatCount(s.comments)}</span>
      </span>
    </span>
  );
}

interface BlogCardStatsProps {
  /** All slugs visible on screen — fetched with ONE batched /api/blog/stats call. */
  slugs: string[];
  children: ReactNode;
}

/**
 * Fetches engagement stats for a set of slugs in a single batched request and
 * provides them to BlogCardStat children via context. Silent on failure —
 * cards simply render zeros.
 */
export default function BlogCardStats({ slugs, children }: BlogCardStatsProps) {
  const [stats, setStats] = useState<Record<string, BlogStatCounts>>({});
  // StrictMode-safe: identical slug sets never trigger a second fetch.
  const lastKey = useRef<string>("");

  const unique = useMemo(() => Array.from(new Set(slugs.filter(Boolean))), [slugs]);
  const key = useMemo(() => [...unique].sort().join(","), [unique]);
  const isEmpty = unique.length === 0;

  // React-endorsed "adjust state during render": when the visible slug set
  // empties out, clear stale stats here rather than calling setState inside
  // the effect below (and rather than mutating a ref during render).
  const [wasEmpty, setWasEmpty] = useState(isEmpty);
  if (wasEmpty !== isEmpty) {
    setWasEmpty(isEmpty);
    if (isEmpty) setStats({});
  }

  useEffect(() => {
    if (isEmpty || lastKey.current === key) return;
    lastKey.current = key;

    const ctrl = new AbortController();
    fetch(`/api/blog/stats?slugs=${encodeURIComponent(unique.join(","))}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || typeof data !== "object") return;
        const record = data as Record<string, unknown>;
        const next: Record<string, BlogStatCounts> = {};
        for (const s of unique) {
          const v = record[s];
          const counts = typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};
          next[s] = {
            views: toNumber(counts.views),
            likes: toNumber(counts.likes),
            comments: toNumber(counts.comments),
          };
        }
        setStats(next);
      })
      .catch(() => {
        /* silent — zeros stay */
      });
    return () => ctrl.abort();
  }, [key, unique, isEmpty]);

  return <BlogStatsContext.Provider value={stats}>{children}</BlogStatsContext.Provider>;
}

"use client";

import { useEffect, useState } from "react";

type Range = "today" | "24h" | "7d" | "30d";

interface Bucket {
  bucket: string;
  label: string;
  pageviews: number;
  visitors: number;
}

interface TopItem {
  key: string;
  views: number;
}

interface Summary {
  range: Range;
  since: string;
  totalPageviews: number;
  uniqueVisitors: number;
  buckets: Bucket[];
  topPages: TopItem[];
  topReferrers: TopItem[];
  topUtmSources: TopItem[];
  devices: TopItem[];
}

const RANGES: { id: Range; label: string }[] = [
  { id: "today", label: "Today · hourly" },
  { id: "24h", label: "Last 24 hours" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

function BarChart({ buckets }: { buckets: Bucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.pageviews));
  const W = 720;
  const H = 180;
  const pad = 24;
  const n = Math.max(1, buckets.length);
  const slot = (W - pad * 2) / n;
  const barW = Math.max(2, Math.min(28, slot * 0.7));
  // Show a subset of x labels so they don't collide.
  const labelEvery = Math.max(1, Math.ceil(n / 12));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Pageviews over time">
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#e5e7eb" />
      {buckets.map((b, i) => {
        const h = Math.max(2, ((H - pad * 2) * b.pageviews) / max);
        const x = pad + i * slot + (slot - barW) / 2;
        const y = H - pad - h;
        return (
          <g key={b.bucket}>
            <title>{`${b.label}: ${b.pageviews} views, ${b.visitors} visitors`}</title>
            <rect x={x} y={y} width={barW} height={h} rx={2} fill="#f97316" opacity={0.85} />
            {i % labelEvery === 0 && (
              <text
                x={pad + i * slot + slot / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize={9}
                fill="#9ca3af"
              >
                {b.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TopTable({ title, rows, empty }: { title: string; rows: TopItem[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-bold text-gray-900">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm text-gray-700" title={r.key}>
                  {r.key}
                </span>
                <span className="shrink-0 text-sm font-semibold text-gray-900">{r.views}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{ width: `${(100 * r.views) / max}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<Range>("today");
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/analytics/summary?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Summary;
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load analytics. Check that DATABASE_URL is set in Vercel.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const selectRange = (r: Range) => {
    setLoading(true);
    setError(null);
    setRange(r);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r.id}
            onClick={() => selectRange(r.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              range === r.id
                ? "bg-orange-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pageviews</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalPageviews.toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Unique visitors</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{data.uniqueVisitors.toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Range</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {RANGES.find((r) => r.id === data.range)?.label}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Since</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {new Date(data.since).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-gray-900">Pageviews over time (IST)</h3>
            {data.buckets.length === 0 ? (
              <p className="text-sm text-gray-400">No data in this range yet.</p>
            ) : (
              <BarChart buckets={data.buckets} />
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TopTable title="Top pages" rows={data.topPages} empty="No pageviews in this range yet." />
            <TopTable title="Top referrers" rows={data.topReferrers} empty="No referrer data — most traffic is direct." />
            <TopTable title="Top UTM sources" rows={data.topUtmSources} empty="No tagged campaigns in this range." />
            <TopTable title="Devices" rows={data.devices} empty="No device data in this range yet." />
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Cookieless first-party analytics: no cookies, no fingerprinting. Visitors are counted
            per day via an anonymous hash that rotates daily; raw IP addresses are never stored.
            Do-Not-Track requests are ignored.
          </p>
        </>
      )}
    </div>
  );
}

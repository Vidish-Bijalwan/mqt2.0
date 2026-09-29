"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Heart, MessageCircle } from "lucide-react";

interface BlogStats {
  views: number;
  likes: number;
  comments: number;
}

interface BlogComment {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
}

const ZERO_STATS: BlogStats = { views: 0, likes: 0, comments: 0 };

function toNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * View counter, like button and comments for a blog post.
 * All numbers come from the DB (no fake counts). Comment bodies are rendered
 * as text nodes — never via dangerouslySetInnerHTML.
 */
function readStoredLike(slug: string): boolean {
  try {
    return localStorage.getItem(`mqt_like_${slug}`) === "1";
  } catch {
    /* storage unavailable — like state just won't persist */
    return false;
  }
}

export default function BlogEngagement({ slug }: { slug: string }) {
  const [stats, setStats] = useState<BlogStats>(ZERO_STATS);
  // Lazy initializer reads the persisted like from localStorage (external
  // system sync during render is fine here; effects only run the network
  // calls). The component is keyed by slug at its call site, so a slug
  // change remounts and re-reads the stored value.
  const [liked, setLiked] = useState(() => readStoredLike(slug));
  const [likePending, setLikePending] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // StrictMode-safe: view POST + initial fetches fire exactly once per mount.
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    // 1. Record the view (deduped server-side; failure is silent).
    fetch("/api/blog/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d === "object") {
          setStats((prev) => ({ ...prev, views: toNumber((d as { views?: unknown }).views, prev.views) }));
        }
      })
      .catch(() => {});

    // 2. Likes + comment counts (views come from the POST above to avoid a race).
    fetch(`/api/blog/stats?slugs=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const s = d && typeof d === "object" ? (d as Record<string, unknown>)[slug] : null;
        if (s && typeof s === "object") {
          const c = s as { likes?: unknown; comments?: unknown };
          setStats((prev) => ({
            ...prev,
            likes: toNumber(c.likes, prev.likes),
            comments: toNumber(c.comments, prev.comments),
          }));
        }
      })
      .catch(() => {});

    // 3. Approved comments, newest first.
    fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const list = d && typeof d === "object" ? (d as { comments?: unknown }).comments : null;
        if (Array.isArray(list)) {
          setComments(
            list
              .filter((c): c is Record<string, unknown> => typeof c === "object" && c !== null)
              .map((c) => ({
                id: String(c.id ?? ""),
                author_name: String(c.author_name ?? "Traveller"),
                body: String(c.body ?? ""),
                created_at: String(c.created_at ?? ""),
              }))
              .filter((c) => c.id && c.body)
          );
        }
        setCommentsLoaded(true);
      })
      .catch(() => setCommentsLoaded(true));
  }, [slug]);

  const toggleLike = async () => {
    if (likePending) return;
    const next = !liked;
    setLiked(next);
    setLikePending(true);
    setStats((s) => ({ ...s, likes: Math.max(0, s.likes + (next ? 1 : -1)) }));
    try {
      localStorage.setItem(`mqt_like_${slug}`, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error("like failed");
      const data = await res.json();
      if (data && typeof data === "object") {
        const d = data as { likes?: unknown; liked?: unknown };
        setStats((s) => ({ ...s, likes: toNumber(d.likes, s.likes) }));
        if (typeof d.liked === "boolean") {
          setLiked(d.liked);
          try {
            localStorage.setItem(`mqt_like_${slug}`, d.liked ? "1" : "0");
          } catch {
            /* ignore */
          }
        }
      }
    } catch {
      // Revert the optimistic update so the count never lies.
      setLiked(!next);
      setStats((s) => ({ ...s, likes: Math.max(0, s.likes + (next ? -1 : 1)) }));
    } finally {
      setLikePending(false);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: bots fill it, humans never see it — silently drop.
    if (honeypot) return;
    const name = nameInput.trim();
    const body = bodyInput.trim();
    if (name.length < 2 || name.length > 40) {
      setFormError("Please enter your name (2–40 characters).");
      return;
    }
    if (body.length < 2 || body.length > 2000) {
      setFormError("Please write a comment between 2 and 2000 characters.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, author_name: name, body, website: honeypot }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const serverMsg =
          data && typeof data === "object" && typeof (data as { error?: unknown }).error === "string"
            ? String((data as { error: unknown }).error)
            : null;
        setFormError(
          serverMsg ??
            (res.status === 429
              ? "You're commenting too fast — please wait a minute and try again."
              : "Could not post your comment. Please try again.")
        );
        return;
      }
      const c = data && typeof data === "object" ? (data as { comment?: unknown }).comment : null;
      if (c && typeof c === "object") {
        const cc = c as Record<string, unknown>;
        setComments((prev) => [
          {
            id: String(cc.id ?? `local-${Date.now()}`),
            author_name: String(cc.author_name ?? name),
            body: String(cc.body ?? body),
            created_at: String(cc.created_at ?? new Date().toISOString()),
          },
          ...prev,
        ]);
        setStats((s) => ({ ...s, comments: s.comments + 1 }));
      }
      setNameInput("");
      setBodyInput("");
    } catch {
      setFormError("Could not post your comment. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-gray-200" aria-label="Post engagement">
      {/* Stats + like row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Eye className="w-4 h-4" aria-hidden="true" />
          <span>
            <strong className="text-gray-900 font-semibold">{formatCount(stats.views)}</strong> views
          </span>
        </span>
        <button
          type="button"
          onClick={toggleLike}
          disabled={likePending}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this article" : "Like this article"}
          className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
            liked
              ? "bg-orange-50 border-legacy-orange text-legacy-orange"
              : "bg-white border-gray-200 text-gray-600 hover:border-legacy-orange hover:text-legacy-orange"
          } ${likePending ? "opacity-60 cursor-wait" : ""}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} aria-hidden="true" />
          <span>
            <strong className="font-semibold">{formatCount(stats.likes)}</strong> {liked ? "Liked" : "Like"}
          </span>
        </button>
        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          <span>
            <strong className="text-gray-900 font-semibold">{formatCount(stats.comments)}</strong> comments
          </span>
        </span>
      </div>

      {/* Comments */}
      <h2 className="text-xl font-bold text-legacy-nav-blue mb-5">
        Comments{stats.comments > 0 ? ` (${formatCount(stats.comments)})` : ""}
      </h2>

      {!commentsLoaded ? (
        <div className="space-y-4 mb-8" aria-hidden="true">
          {[0, 1].map((i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4 mb-8">
          {comments.map((c) => (
            <li key={c.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="text-sm font-semibold text-gray-800">{c.author_name}</span>
                {c.created_at && (
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(c.created_at)}</span>
                )}
              </div>
              {/* Text node render — user content is never injected as HTML. */}
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{c.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mb-8">No comments yet — be the first to share your thoughts.</p>
      )}

      {/* Comment form */}
      <form onSubmit={submitComment} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-800 mb-4">Leave a comment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor={`comment-name-${slug}`} className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              id={`comment-name-${slug}`}
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={40}
              placeholder="Your name"
              autoComplete="name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 focus:border-legacy-orange focus:outline-none placeholder-gray-400"
            />
          </div>
        </div>
        {/* Honeypot — hidden from humans, catches bots */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <div className="mb-4">
          <label htmlFor={`comment-body-${slug}`} className="block text-sm font-medium text-gray-700 mb-1.5">
            Comment
          </label>
          <textarea
            id={`comment-body-${slug}`}
            value={bodyInput}
            onChange={(e) => setBodyInput(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Share your experience or ask a question…"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 focus:border-legacy-orange focus:outline-none placeholder-gray-400 resize-y"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{bodyInput.length}/2000</p>
        </div>
        {formError && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
            {formError}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center gap-2 bg-legacy-orange hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors ${
            submitting ? "opacity-60 cursor-wait" : ""
          }`}
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>
    </section>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { addComment, countRecentCommentsByIp, listComments } from "@/lib/blogDb";
import {
  SLUG_RE,
  asRecord,
  getClientIp,
  toIsoDate,
} from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

/* In-memory rate limit: 3 comment posts per minute per IP. */
const RATE_LIMIT = 3;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/**
 * GET /api/blog/comments?slug=
 * -> {comments:[{id,author_name,body,created_at}]} newest-first, limit 50, approved only.
 */
export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const comments = (await listComments(slug)).map((c) => ({
    id: c.id,
    author_name: c.author_name,
    body: c.body,
    created_at: toIsoDate(c.created_at),
  }));
  return NextResponse.json({ comments });
}

/**
 * POST /api/blog/comments {slug, author_name, body, website?}
 * Honeypot `website` must be empty; name 2–40 chars; body 2–2000 chars;
 * 3/min/IP rate limit, 10 comments/day/IP DB cap, >3 links rejected.
 * -> {comment} / 400 / 429.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const rec = asRecord(body);
  const slug = rec?.slug;
  const authorName = rec?.author_name;
  const commentBody = rec?.body;
  const website = rec?.website;

  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  // Honeypot: bots fill this hidden field; real users never see it.
  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ error: "Spam detected" }, { status: 400 });
  }
  const name = typeof authorName === "string" ? authorName.trim() : "";
  const text = typeof commentBody === "string" ? commentBody.trim() : "";
  if (name.length < 2 || name.length > 40) {
    return NextResponse.json(
      { error: "Name must be between 2 and 40 characters" },
      { status: 400 },
    );
  }
  if (text.length < 2 || text.length > 2000) {
    return NextResponse.json(
      { error: "Comment must be between 2 and 2000 characters" },
      { status: 400 },
    );
  }
  // Link-count heuristic: real travellers rarely drop >3 URLs in a comment.
  const linkCount = (text.match(/https?:\/\/|www\./gi) ?? []).length;
  if (linkCount > 3) {
    return NextResponse.json({ error: "Spam detected" }, { status: 400 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many comments — please wait a minute and try again" },
      { status: 429 },
    );
  }
  // Per-IP daily cap backed by the DB (the in-memory limiter above is
  // per-instance on serverless). Keeps approved-by-default comments safe.
  const commentsToday = await countRecentCommentsByIp(ip, 24);
  if (commentsToday >= 10) {
    return NextResponse.json(
      { error: "Daily comment limit reached — please try again tomorrow" },
      { status: 429 },
    );
  }

  const comment = await addComment(slug, name, null, text, ip || null);
  if (!comment) {
    return NextResponse.json(
      { error: "Comments are temporarily unavailable" },
      { status: 503 },
    );
  }
  return NextResponse.json(
    {
      comment: {
        id: comment.id,
        author_name: comment.author_name,
        body: comment.body,
        created_at: toIsoDate(comment.created_at),
      },
    },
    { status: 201 },
  );
}

import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/blogDb";
import { SLUG_RE, asRecord, newViewerId, viewerHashFor } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

const VID_COOKIE = "mqt_vid";
const VID_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * POST /api/blog/like {slug} -> {likes, liked}
 * Toggles by liker_hash (same hashing as views).
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const slug = asRecord(body)?.slug;
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  let vid = req.cookies.get(VID_COOKIE)?.value;
  let setCookie: string | null = null;
  if (!vid) {
    vid = newViewerId();
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    setCookie =
      `${VID_COOKIE}=${vid}; Path=/; HttpOnly${secure}; SameSite=Lax; ` +
      `Max-Age=${VID_MAX_AGE}`;
  }

  const { likes, liked } = await toggleLike(slug, viewerHashFor(req, vid));

  const res = NextResponse.json({ likes, liked });
  if (setCookie) res.headers.set("Set-Cookie", setCookie);
  return res;
}

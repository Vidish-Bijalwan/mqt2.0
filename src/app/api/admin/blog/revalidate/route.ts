import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/adminAuth";
import { ADMIN_SLUG_RE, asRecord } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/blog/revalidate {slug}
 * On-demand ISR refresh for a blog article + the /blog listing.
 * Admin-gated (mqt_admin cookie, same as the other /api/admin/blog routes).
 *
 * Purpose: time-gated drip posts (future publishedAt) 404 until their slot.
 * If a 404 was ever rendered+cached for a slug (ISR), it stays cached for the
 * route's revalidate window even after the slot opens. Hitting this endpoint
 * right after a slot purges the stale entry so the post goes live on time.
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const slug = asRecord(body)?.slug;
  if (typeof slug !== "string" || !ADMIN_SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "Invalid slug: use 3–80 lowercase letters, numbers, or hyphens" },
      { status: 400 }
    );
  }
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");
  return NextResponse.json({ ok: true, slug });
}

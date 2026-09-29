import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import {
  getDb,
  slugExists,
  upsertPost,
  type UpsertPostInput,
} from "@/lib/blogDb";
import { ADMIN_SLUG_RE, asRecord } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<NextResponse | null> {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * GET /api/admin/blog?check=slug -> {available: true|false} (admin-gated).
 */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const check = new URL(req.url).searchParams.get("check") ?? "";
  if (!ADMIN_SLUG_RE.test(check)) {
    return NextResponse.json(
      { error: "Invalid slug: use 3–80 lowercase letters, numbers, or hyphens" },
      { status: 400 },
    );
  }
  return NextResponse.json({ available: !(await slugExists(check)) });
}

type ValidationResult =
  | { ok: true; value: UpsertPostInput }
  | { ok: false; error: string };

function validatePost(body: unknown): ValidationResult {
  const rec = asRecord(body);
  if (!rec) return { ok: false, error: "Request body must be a JSON object" };

  const slug = rec.slug;
  if (typeof slug !== "string" || !ADMIN_SLUG_RE.test(slug)) {
    return {
      ok: false,
      error: "Invalid slug: use 3–80 lowercase letters, numbers, or hyphens",
    };
  }

  const title = typeof rec.title === "string" ? rec.title.trim() : "";
  if (title.length < 10 || title.length > 120) {
    return { ok: false, error: "Title must be between 10 and 120 characters" };
  }

  const meta = typeof rec.meta_description === "string" ? rec.meta_description.trim() : "";
  if (meta.length < 120 || meta.length > 170) {
    return {
      ok: false,
      error: `meta_description must be between 120 and 170 characters (currently ${meta.length})`,
    };
  }

  const coverImage = typeof rec.cover_image === "string" ? rec.cover_image.trim() : "";
  if (coverImage.length === 0) {
    return { ok: false, error: "cover_image is required" };
  }

  const category = typeof rec.category === "string" ? rec.category.trim() : "";
  if (category.length === 0) {
    return { ok: false, error: "category is required" };
  }

  const rawTags = rec.tags;
  if (!Array.isArray(rawTags)) {
    return { ok: false, error: "tags must be an array of strings" };
  }
  const tags: string[] = [];
  for (const t of rawTags) {
    if (typeof t !== "string") {
      return { ok: false, error: "tags must be an array of strings" };
    }
    const trimmed = t.trim();
    if (trimmed.length > 0) tags.push(trimmed);
  }

  const targetKeyword =
    typeof rec.target_keyword === "string" ? rec.target_keyword.trim() : "";
  const bodyMd = typeof rec.body_md === "string" ? rec.body_md : "";
  if (bodyMd.length === 0) {
    return { ok: false, error: "body_md is required" };
  }

  const status = rec.status;
  if (status !== "draft" && status !== "published") {
    return { ok: false, error: 'status must be "draft" or "published"' };
  }

  return {
    ok: true,
    value: {
      slug,
      title,
      meta_description: meta,
      cover_image: coverImage,
      category,
      tags,
      target_keyword: targetKeyword,
      body_md: bodyMd,
      status,
    },
  };
}

/**
 * POST /api/admin/blog {title,slug,category,tags[],target_keyword,
 * meta_description,cover_image,body_md,status} -> {slug} (admin-gated).
 * Upserts by slug; publishing an unpublished post sets published_at.
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const result = validatePost(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (!getDb()) {
    return NextResponse.json(
      { error: "DATABASE_URL not configured — cannot save posts yet" },
      { status: 503 },
    );
  }

  const slug = await upsertPost(result.value);
  if (!slug) {
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
  return NextResponse.json({ slug });
}

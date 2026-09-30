// src/components/admin/BlogCreatorForm.tsx
// Client blog-creation form for /admin/blog/new. Posts to the admin backend
// contract (POST /api/admin/blog) and checks slug uniqueness live via
// GET /api/admin/blog?check=<slug>.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentBlock } from "@/types/content";
import { markdownToBlocks, readingTime, wordCount } from "@/lib/blogMarkdown";

// The 8 editorial categories from src/data/blogEditorial.ts.
const BLOG_CATEGORIES = [
  "Destination Guides",
  "Food & Cuisine",
  "Culture & Heritage",
  "Mountains & Adventure",
  "Pilgrimage",
  "Travel Planning",
  "Wildlife",
  "Beaches & Backwaters",
] as const;

// Cover-image picker source: ~40 of the most useful /images/blog assets,
// derived from the keys of src/data/blogImageMap.ts (India-travel imagery).
const COVER_IMAGES = [
  "/images/packages/kashmir-hq.webp",
  "/images/packages/jammu-kashmir.webp",
  "/images/blog/spas-in-india.webp",
  "/images/blog/ladakh-tourist-places.webp",
  "/images/blog/tourist-destinations-in-ladakh.webp",
  "/images/blog/buddhist-monasteries-in-ladakh.webp",
  "/images/blog/golden-temple-amritsar.webp",
  "/images/packages/orissa.webp",
  "/images/blog/ajanta-ellora-caves.webp",
  "/images/blog/kedarnath.webp",
  "/images/blog/12-jyotirlingas-in-india.webp",
  "/images/blog/51-shakti-peethas-in-india.webp",
  "/images/blog/kailash-mansarovar-yatra.webp",
  "/images/blog/kamakhya-temple-assam.webp",
  "/images/blog/kedarnath.webp",
  "/images/blog/char-dham-yatra-route-map.webp",
  "/images/blog/jim-corbett-national-park.webp",
  "/images/blog/keoladeo-national-park.webp",
  "/images/blog/wildlife-sanctuaries-in-india.webp",
  "/images/blog/adventure-places-in-india.webp",
  "/images/blog/adventure-sports-in-manali-shimla.webp",
  "/images/blog/best-snowfall-destinations-of-india.webp",
  "/images/blog/famous-indian-hill-stations.webp",
  "/images/blog/valley-of-flowers.webp",
  "/images/blog/glaciers-in-uttarakhand.webp",
  "/images/blog/best-beaches-in-india.webp",
  "/images/blog/beach-destinations-not-goa.webp",
  "/images/blog/kerala-tourist-attractions.webp",
  "/images/packages/best-trips-in-india.webp",
  "/images/blog/waterfalls-in-kerala.webp",
  "/images/blog/royal-palaces-in-india.webp",
  "/images/blog/things-to-do-in-jaipur.webp",
  "/images/blog/udaipur-tourist-places.webp",
  "/images/blog/places-to-visit-in-agra.webp",
  "/images/blog/best-places-to-visit-in-golden-triangle-india.webp",
  "/images/packages/darjeeling.webp",
  "/images/packages/tawang-monastery.webp",
  "/images/blog/delhi-tourist-places-to-visit.webp",
  "/images/blog/best-places-to-travel-alone.webp",
  "/images/packages/darjeeling.webp",
] as const;

const SLUG_RE = /^[a-z0-9-]{3,80}$/;
const META_MIN = 120;
const META_MAX = 170;
const META_SWEET_LO = 150;
const META_SWEET_HI = 160;

type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";
type SaveStatus = "draft" | "published";

interface SaveSuccess {
  status: SaveStatus;
  slug: string;
}

function suggestSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function imageLabel(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.(webp|jpg|jpeg|png)$/i, "").replace(/-/g, " ");
}

function parseTags(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(",")) {
    const tag = raw.trim();
    if (tag && !seen.has(tag.toLowerCase())) {
      seen.add(tag.toLowerCase());
      out.push(tag);
    }
  }
  return out;
}

// Local preview renderer mirroring the post page's prose classes
// (src/app/blog/[slug]/page.tsx), so the admin sees what readers will see.
function BlockPreview({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="text-gray-800">
      {blocks.map((block, idx) => {
        if (block.type === "p")
          return (
            <p key={idx} className="mb-4">
              {block.text}
            </p>
          );
        if (block.type === "h2")
          return (
            <h2 key={idx} className="mt-8 mb-4 text-2xl font-bold text-gray-900">
              {block.text}
            </h2>
          );
        if (block.type === "h3")
          return (
            <h3 key={idx} className="mt-6 mb-3 text-xl font-bold text-gray-900">
              {block.text}
            </h3>
          );
        if (block.type === "ul")
          return (
            <ul key={idx} className="mb-6 list-disc pl-6">
              {(block.items ?? []).map((item, i) => (
                <li key={i} className="mb-2">
                  {item}
                </li>
              ))}
            </ul>
          );
        if (block.type === "ol")
          return (
            <ol key={idx} className="mb-6 list-decimal space-y-2 pl-6">
              {(block.items ?? []).map((item, i) => (
                <li key={i} className="mb-1 pl-1">
                  {item}
                </li>
              ))}
            </ol>
          );
        return null;
      })}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export default function BlogCreatorForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false); // user edited slug by hand
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [category, setCategory] = useState<string>("");
  const [tagsInput, setTagsInput] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [meta, setMeta] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bodyMd, setBodyMd] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState<SaveStatus | null>(null);
  const [success, setSuccess] = useState<SaveSuccess | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const slugCheckId = useRef(0);

  // Auto-suggest the slug from the title until the user edits it by hand.
  function handleTitleChange(next: string) {
    setTitle(next);
    if (!slugLocked) setSlug(suggestSlug(next));
  }

  function handleSlugChange(next: string) {
    setSlugLocked(true);
    setSlug(next.toLowerCase());
  }

  // Live uniqueness check, debounced.
  //
  // The slug<->status sync itself happens during render (React-endorsed
  // "adjust state during render"); the effect below only fires the debounced
  // network check for valid slugs, so no setState runs synchronously in it.
  const [prevSlug, setPrevSlug] = useState(slug);
  if (prevSlug !== slug) {
    setPrevSlug(slug);
    if (!SLUG_RE.test(slug)) {
      setSlugStatus(slug.length === 0 ? "idle" : "invalid");
    } else {
      setSlugStatus("checking");
    }
  }

  useEffect(() => {
    if (!SLUG_RE.test(slug)) return;
    const id = ++slugCheckId.current;
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/blog?check=${encodeURIComponent(slug)}`, {
          signal: ctrl.signal,
        });
        if (id !== slugCheckId.current) return;
        if (!res.ok) {
          setSlugStatus("idle"); // auth errors surface on submit
          return;
        }
        const data = (await res.json()) as { available?: boolean };
        setSlugStatus(data.available ? "available" : "taken");
      } catch (err) {
        if ((err as Error).name !== "AbortError" && id === slugCheckId.current) {
          setSlugStatus("idle");
        }
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [slug]);

  const metaLen = meta.trim().length;
  const metaInRange = metaLen >= META_MIN && metaLen <= META_MAX;
  const metaInSweetSpot = metaLen >= META_SWEET_LO && metaLen <= META_SWEET_HI;
  const metaColor = metaInSweetSpot
    ? "text-green-700"
    : metaInRange
      ? "text-amber-600"
      : "text-red-600";

  const blocks = useMemo(() => markdownToBlocks(bodyMd), [bodyMd]);
  const words = useMemo(() => wordCount(bodyMd), [bodyMd]);
  const minutes = useMemo(() => readingTime(bodyMd), [bodyMd]);
  const tags = useMemo(() => parseTags(tagsInput), [tagsInput]);

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    const t = title.trim();
    if (t.length < 10) errors.title = "Title needs at least 10 characters.";
    else if (t.length > 120) errors.title = "Title must be 120 characters or fewer.";
    if (!SLUG_RE.test(slug)) errors.slug = "Slug must be 3–80 chars: lowercase letters, numbers, hyphens.";
    else if (slugStatus === "taken") errors.slug = "This slug is already used — pick another.";
    else if (slugStatus === "checking")
      errors.slug = "Slug availability is still being checked — wait a moment.";
    // "idle" means the availability check could not run (e.g. offline);
    // the server re-validates on submit, so submission is still allowed.
    if (!category) errors.category = "Choose a category.";
    if (!metaInRange)
      errors.meta_description = `Meta description must be ${META_MIN}–${META_MAX} characters (currently ${metaLen}).`;
    if (!coverImage.trim()) errors.cover_image = "Pick a cover image or paste an image URL.";
    if (words === 0) errors.body_md = "Write some content first.";
    return errors;
  }

  const canSubmit = saving === null;

  async function handleSubmit(status: SaveStatus) {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitError("Please fix the highlighted fields before saving.");
      return;
    }
    setSubmitError(null);
    setSaving(status);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug,
          category,
          tags,
          target_keyword: targetKeyword.trim(),
          meta_description: meta.trim(),
          cover_image: coverImage.trim(),
          body_md: bodyMd,
          status,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        slug?: string;
        error?: string;
      } | null;
      if (!res.ok) {
        setSubmitError(data?.error ?? `Save failed (HTTP ${res.status}).`);
        return;
      }
      setSuccess({ status, slug: data?.slug ?? slug });
      window.scrollTo({ top: 0 });
    } catch {
      setSubmitError("Network error — check your connection and try again.");
    } finally {
      setSaving(null);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.reload();
    }
  }

  function resetForm() {
    setTitle("");
    setSlug("");
    setSlugLocked(false);
    setSlugStatus("idle");
    setCategory("");
    setTagsInput("");
    setTargetKeyword("");
    setMeta("");
    setCoverImage("");
    setBodyMd("");
    setFieldErrors({});
    setSubmitError(null);
    setSuccess(null);
  }

  if (success) {
    const postUrl = `/blog/${success.slug}`;
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">{success.status === "published" ? "🎉" : "📝"}</p>
        <h2 className="mt-3 text-xl font-bold text-gray-900">
          {success.status === "published" ? "Post published" : "Draft saved"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {success.status === "published"
            ? "Your post is live on the site."
            : "Your draft is saved. Drafts are not public — the link below will 404 until you publish."}
        </p>
        <a
          href={postUrl}
          className="mt-4 inline-block rounded-md bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          View {postUrl}
        </a>
        <div className="mt-4">
          <button
            type="button"
            onClick={resetForm}
            className="text-sm font-medium text-orange-700 hover:text-orange-800"
          >
            Write another post →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">New blog post</h2>
          <p className="text-sm text-gray-500">
            Fill in the details, write in Markdown, preview on the right, then save as a
            draft or publish.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          {loggingOut ? "Signing out…" : "Log out"}
        </button>
      </div>

      {submitError && (
        <p
          role="alert"
          className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {submitError}
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-2">
        {/* ---- Editor column ---- */}
        <section className="space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-gray-400">(10–120 characters)</span>
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. 10 Hidden Treks in Uttarakhand You Have Never Heard Of"
              className={inputCls + " mt-1"}
            />
            <FieldError message={fieldErrors.title} />
          </div>

          <div>
            <label htmlFor="post-slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="post-slug"
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-from-title"
                className={inputCls + " font-mono"}
              />
              <button
                type="button"
                onClick={() => {
                  setSlugLocked(false);
                  setSlug(suggestSlug(title));
                }}
                title="Re-generate slug from title"
                className="shrink-0 rounded-md border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-100"
              >
                ↻
              </button>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="text-gray-400">/blog/{slug || "…"}</span>
              {slugStatus === "checking" && (
                <span className="text-gray-500">Checking…</span>
              )}
              {slugStatus === "available" && (
                <span className="font-semibold text-green-700">✓ Available</span>
              )}
              {slugStatus === "taken" && (
                <span className="font-semibold text-red-600">✗ Already used</span>
              )}
              {slugStatus === "invalid" && slug.length > 0 && (
                <span className="text-red-600">Use 3–80 lowercase letters, numbers, hyphens.</span>
              )}
            </div>
            <FieldError message={fieldErrors.slug} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="post-category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls + " mt-1"}
              >
                <option value="">Select a category…</option>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.category} />
            </div>
            <div>
              <label htmlFor="post-keyword" className="block text-sm font-medium text-gray-700">
                Target keyword <span className="text-gray-400">(SEO)</span>
              </label>
              <input
                id="post-keyword"
                type="text"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="e.g. hidden treks uttarakhand"
                className={inputCls + " mt-1"}
              />
            </div>
          </div>

          <div>
            <label htmlFor="post-tags" className="block text-sm font-medium text-gray-700">
              Tags <span className="text-gray-400">(comma-separated)</span>
            </label>
            <input
              id="post-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="trekking, uttarakhand, offbeat"
              className={inputCls + " mt-1"}
            />
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="post-meta" className="block text-sm font-medium text-gray-700">
                Meta description <span className="text-gray-400">(SEO)</span>
              </label>
              <span className={`text-xs font-semibold ${metaColor}`}>
                {metaLen} / {META_MIN}–{META_MAX}
              </span>
            </div>
            <textarea
              id="post-meta"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              rows={3}
              placeholder="A compelling 150–160 character summary of the post for search results…"
              className={inputCls + " mt-1"}
            />
            <p className="mt-1 text-xs text-gray-400">
              Aim for 150–160 characters (green). Saving is blocked below {META_MIN} or
              above {META_MAX}.
            </p>
            <FieldError message={fieldErrors.meta_description} />
          </div>

          <div>
            <label htmlFor="post-cover" className="block text-sm font-medium text-gray-700">
              Cover image
            </label>
            <input
              id="post-cover"
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/images/blog/… or https://…"
              className={inputCls + " mt-1 font-mono"}
            />
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              className="mt-2 text-sm font-medium text-orange-700 hover:text-orange-800"
            >
              {pickerOpen ? "Hide image picker ▲" : "Pick from existing images ▼"}
            </button>
            {pickerOpen && (
              <div className="mt-2 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto rounded-md border border-gray-200 p-2 sm:grid-cols-4">
                {COVER_IMAGES.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setCoverImage(img)}
                    title={imageLabel(img)}
                    className={`overflow-hidden rounded-md border-2 ${
                      coverImage === img
                        ? "border-orange-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={imageLabel(img)}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            {coverImage && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="aspect-video w-full rounded-md border border-gray-200 object-cover"
                />
              </div>
            )}
            <FieldError message={fieldErrors.cover_image} />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="post-body" className="block text-sm font-medium text-gray-700">
                Body <span className="text-gray-400">(Markdown)</span>
              </label>
              <span className="text-xs text-gray-400">
                {words} words · ~{minutes} min read
              </span>
            </div>
            <textarea
              id="post-body"
              value={bodyMd}
              onChange={(e) => setBodyMd(e.target.value)}
              rows={16}
              spellCheck={false}
              placeholder={"## Getting there\n\nWrite in Markdown — #/##/### for headings, - or 1. for lists, blank lines between paragraphs."}
              className={inputCls + " mt-1 font-mono leading-relaxed"}
            />
            <FieldError message={fieldErrors.body_md} />
          </div>

          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={!canSubmit}
              className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving === "draft" ? "Saving…" : "Save as draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              disabled={!canSubmit}
              className="rounded-md bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving === "published" ? "Publishing…" : "Publish"}
            </button>
          </div>
        </section>

        {/* ---- Live preview column ---- */}
        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:sticky xl:top-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Live preview
          </p>
          {coverImage ? (
            <div className="mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt=""
                className="aspect-video w-full rounded-md object-cover"
              />
            </div>
          ) : (
            <div className="mb-5 flex aspect-video w-full items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
              No cover image selected
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {title.trim() || "Your post title"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {category || "Category"} · ~{minutes} min read
          </p>
          <div className="mt-5 border-t border-gray-100 pt-5">
            {blocks.length > 0 ? (
              <BlockPreview blocks={blocks} />
            ) : (
              <p className="text-sm text-gray-400">
                Nothing to preview yet — start writing on the left.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

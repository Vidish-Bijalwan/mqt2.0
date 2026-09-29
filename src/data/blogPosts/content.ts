// SERVER-ONLY. Article bodies for the 200-post factory run.
// Never import this module (or the bodies/* files) from a client component:
// blogIndex.ts is bundled for the browser via BlogSidebar and the blog
// listing page, and bodies must stay out of that bundle.
import type { ContentBlock } from "@/types/content";
import { BLOG_POST_BODIES_BATCH_1A } from "./bodies/batch-1a";
import { BLOG_POST_BODIES_BATCH_1B } from "./bodies/batch-1b";
import { BLOG_POST_BODIES_BATCH_2A } from "./bodies/batch-2a";
import { BLOG_POST_BODIES_BATCH_2B } from "./bodies/batch-2b";
import { BLOG_POST_BODIES_BATCH_3A } from "./bodies/batch-3a";
import { BLOG_POST_BODIES_BATCH_3B } from "./bodies/batch-3b";
import { BLOG_POST_BODIES_BATCH_4A } from "./bodies/batch-4a";
import { BLOG_POST_BODIES_BATCH_4B } from "./bodies/batch-4b";
import { BLOG_POST_BODIES_BATCH_5A } from "./bodies/batch-5a";
import { BLOG_POST_BODIES_BATCH_5B } from "./bodies/batch-5b";
import { BLOG_POST_BODIES_BATCH_6 } from "./bodies/batch-6";
import { BLOG_POST_BODIES_BATCH_7 } from "./bodies/batch-7";
import { BLOG_POST_BODIES_BATCH_8 } from "./bodies/batch-8";
import { BLOG_POST_BODIES_BATCH_9 } from "./bodies/batch-9";
import { BLOG_POST_BODIES_BATCH_10 } from "./bodies/batch-10";
import { BLOG_POST_BODIES_BATCH_11 } from "./bodies/batch-11";
import { BLOG_POST_BODIES_BATCH_12 } from "./bodies/batch-12";
import { BLOG_POST_BODIES_BATCH_13 } from "./bodies/batch-13";

const BODIES: Record<string, ContentBlock[]> = {
  ...BLOG_POST_BODIES_BATCH_1A,
  ...BLOG_POST_BODIES_BATCH_1B,
  ...BLOG_POST_BODIES_BATCH_2A,
  ...BLOG_POST_BODIES_BATCH_2B,
  ...BLOG_POST_BODIES_BATCH_3A,
  ...BLOG_POST_BODIES_BATCH_3B,
  ...BLOG_POST_BODIES_BATCH_4A,
  ...BLOG_POST_BODIES_BATCH_4B,
  ...BLOG_POST_BODIES_BATCH_5A,
  ...BLOG_POST_BODIES_BATCH_5B,
  ...BLOG_POST_BODIES_BATCH_6,
  ...BLOG_POST_BODIES_BATCH_7,
  ...BLOG_POST_BODIES_BATCH_8,
  ...BLOG_POST_BODIES_BATCH_9,
  ...BLOG_POST_BODIES_BATCH_10,
  ...BLOG_POST_BODIES_BATCH_11,
  ...BLOG_POST_BODIES_BATCH_12,
  ...BLOG_POST_BODIES_BATCH_13,
};

/** Full article body for a factory post, or null for legacy/template posts. */
export function getBlogPostContent(slug: string): ContentBlock[] | null {
  return BODIES[slug.toLowerCase()] ?? null;
}

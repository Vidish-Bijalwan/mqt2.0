// src/lib/blogMarkdown.ts
// Pure markdown -> ContentBlock helpers shared by the admin editor (client)
// and the blog renderer (server). Client+server safe: no dependencies,
// no env access, no DOM. The only block types produced are the ones the
// post-page renderer supports: p, h2, h3, ul, ol.

import type { ContentBlock } from "@/types/content";

const HEADING_RE = /^(#{1,3})\s+(.+?)\s*$/;
const UL_RE = /^[-*]\s+(.+?)\s*$/;
const OL_RE = /^(\d+)[.)]\s+(.+?)\s*$/;
const HR_RE = /^([-*_]\s*){3,}$/;
const BLOCKQUOTE_RE = /^>\s?/;
const HTML_TAG_RE = /<[^>]+>/g;

/**
 * Remove inline markdown noise, keeping the human-readable text:
 * images -> alt text, links -> link text, `code` -> code,
 * **bold** / *italic* -> plain text.
 */
export function stripInlineMarkdown(text: string): string {
  if (!text) return "";
  let out = text;
  out = out.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1"); // images -> alt text
  out = out.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1"); // links -> link text
  out = out.replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1"); // reference links -> text
  out = out.replace(/`{1,3}([^`]+?)`{1,3}/g, "$1"); // code spans -> inner text
  out = out.replace(/(\*\*|__)(.+?)\1/g, "$2"); // bold -> plain
  out = out.replace(/(^|[^\w*])\*([^*\n]+)\*(?=$|[^\w*])/g, "$1$2"); // *italic*
  out = out.replace(/(^|[^\w_])_([^_\n]+)_(?=$|[^\w_])/g, "$1$2"); // _italic_
  out = out.replace(/~~(.+?)~~/g, "$1"); // strikethrough -> plain
  out = out.replace(HTML_TAG_RE, ""); // stray html tags
  return out.trim();
}

/**
 * Convert a markdown document into ContentBlocks.
 * - `#` / `##` -> h2, `###` -> h3
 * - blank-line-separated text runs -> p
 * - `-` / `*` items -> ul, `1.` / `1)` items -> ol
 * Consecutive list items of the same kind merge into one block.
 * Empty input -> [].
 */
export function markdownToBlocks(md: string): ContentBlock[] {
  if (!md || !md.trim()) return [];

  const blocks: ContentBlock[] = [];
  const lines = md.split(/\r?\n/);

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = (): void => {
    if (paragraph.length > 0) {
      const text = stripInlineMarkdown(paragraph.join(" ").replace(/\s+/g, " ").trim());
      if (text) blocks.push({ type: "p", text });
      paragraph = [];
    }
  };

  const flushList = (): void => {
    if (list && list.items.length > 0) {
      blocks.push({ type: list.ordered ? "ol" : "ul", items: list.items });
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line === "" || HR_RE.test(line)) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(HEADING_RE);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: heading[1].length === 3 ? "h3" : "h2",
        text: stripInlineMarkdown(heading[2]),
      });
      continue;
    }

    const ul = line.match(UL_RE);
    if (ul) {
      flushParagraph();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(stripInlineMarkdown(ul[1]));
      continue;
    }

    const ol = line.match(OL_RE);
    if (ol) {
      flushParagraph();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(stripInlineMarkdown(ol[2]));
      continue;
    }

    // Anything else ends an open list and becomes paragraph text.
    flushList();
    paragraph.push(line.replace(BLOCKQUOTE_RE, ""));
  }

  flushParagraph();
  flushList();
  return blocks;
}

/** Count words in markdown after stripping inline formatting noise. */
export function wordCount(md: string): number {
  if (!md || !md.trim()) return 0;
  return stripInlineMarkdown(md).split(/\s+/).filter(Boolean).length;
}

/**
 * Estimated reading time in minutes, ceil(words / 200).
 * Floored at 1 minute, matching the fallback the blog post page uses.
 */
export function readingTime(md: string): number {
  return Math.max(1, Math.ceil(wordCount(md) / 200));
}

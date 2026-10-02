"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import destinationsDataRaw from '@/data/destinationsData.json';
import packageDetailsRaw from '@/data/packageDetails.json';
import { getPublicPackages } from '@/utils/packageCatalog';

const destinationsData = destinationsDataRaw as Record<string, unknown>;
const packageDetails = packageDetailsRaw as Record<string, unknown>;
const publicPackageSlugs = new Set(getPublicPackages().map((pkg) => pkg.slug));

// Cache the keyword map so we don't build it on every render
let keywordMap: { keyword: string; url: string; regex: RegExp; priority: number }[] | null = null;

// Keywords come from data (slugs, titles) and may contain regex
// metacharacters (parentheses, "+", "?", ".", ...). Escape them so the
// generated RegExp matches the literal text and can never throw.
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildKeywordMap() {
  if (keywordMap) return keywordMap;

  const map: { keyword: string; url: string; priority: number }[] = [];

  // Add destinations (high priority for pure names)
  Object.keys(destinationsData).forEach((slug) => {
    // Replace hyphens with spaces
    const name = slug.replace(/-/g, ' ');
    if (name.length > 3) {
      map.push({ keyword: name.toLowerCase(), url: `/destinations/${slug}`, priority: 2 });
    }
  });

  // Add packages (higher priority for full package names to avoid partial matching)
  Object.keys(packageDetails).filter((slug) => publicPackageSlugs.has(slug)).forEach((slug) => {
    const name = slug.replace(/-/g, ' ').replace(/ tour packages?/gi, '').replace(/ package/gi, '').trim();
    if (name.length > 4) {
      // If it contains "tour", link to package
      map.push({ keyword: `${name.toLowerCase()} tour`, url: `/packages/${slug}`, priority: 3 });
      map.push({ keyword: `${name.toLowerCase()} package`, url: `/packages/${slug}`, priority: 3 });
      // If we don't have a destination for this name, add it as a package link with lower priority
      if (!map.some(m => m.keyword === name.toLowerCase() && m.priority === 2)) {
        map.push({ keyword: name.toLowerCase(), url: `/packages/${slug}`, priority: 1 });
      }
    }
  });

  // Sort by length descending (longest keywords match first)
  map.sort((a, b) => b.keyword.length - a.keyword.length);

  keywordMap = map.map(item => ({
    ...item,
    // Word boundary regex, case insensitive
    regex: new RegExp(`\\b(${escapeRegExp(item.keyword)})\\b`, 'i'),
  }));

  return keywordMap;
}

interface AutoLinkerProps {
  text: string;
  className?: string;
  maxLinks?: number; // Limit number of links per paragraph to avoid spammy look
}

// Matches inline markdown links: [link text](https://example.com) or
// [link text](/relative-path). The URL may not contain whitespace or ")".
// Image syntax ![alt](url) is deliberately left as literal text (see below).
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

const linkClasses = (className: string) =>
  `text-brand-blue font-medium hover:underline ${className}`;

/** Render one writer-supplied markdown link: absolute URLs open in a new
 * tab, site-relative URLs use Next.js client-side navigation. */
function renderMarkdownLink(linkText: string, url: string, key: string, className: string) {
  const cls = linkClasses(className);
  if (/^https?:\/\//i.test(url)) {
    return (
      <a
        key={key}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        title={linkText}
      >
        {linkText}
      </a>
    );
  }
  if (url.startsWith('/')) {
    return (
      <Link key={key} href={url} className={cls} title={linkText}>
        {linkText}
      </Link>
    );
  }
  // Safe non-web schemes still get a real link (mailto:/tel: for contact
  // CTAs, # for in-page anchors).
  if (/^(mailto:|tel:|#)/i.test(url)) {
    return (
      <a key={key} href={url} className={cls} title={linkText}>
        {linkText}
      </a>
    );
  }
  // Anything else (javascript:, data:, vbscript:, …) is a stored-XSS vector
  // through CMS-authored content — render the label as plain text so no
  // clickable href is emitted.
  return (
    <span key={key} title={linkText}>
      {linkText}
    </span>
  );
}

export default function AutoLinker({ text, className = '', maxLinks = 4 }: AutoLinkerProps) {
  const map = useMemo(() => buildKeywordMap(), []);

  const elements = useMemo(() => {
    // Pass 1 — markdown links first: split the raw text on [text](url) and
    // render those segments as real links immediately. The remaining
    // plain-text segments are the only ones eligible for keyword
    // auto-linking below, so a writer's explicit link is never linked over.
    let result: (string | React.ReactNode)[] = [];
    let linksAdded = 0;

    // Local regex instance (not the module-level one) — the /g pattern keeps
    // mutable lastIndex state, and mutating module-level values from a
    // component is disallowed (react-hooks/immutability).
    const mdLinkPattern = new RegExp(
      MARKDOWN_LINK_PATTERN.source,
      MARKDOWN_LINK_PATTERN.flags,
    );
    let cursor = 0;
    let mdIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = mdLinkPattern.exec(text)) !== null) {
      const isImageSyntax = match.index > 0 && text[match.index - 1] === '!';
      if (isImageSyntax) {
        // Leave ![alt](url) as literal text — images are not this component's job.
        continue;
      }
      if (match.index > cursor) {
        result.push(text.substring(cursor, match.index));
      }
      result.push(renderMarkdownLink(match[1], match[2], `md-${mdIndex++}`, className));
      linksAdded++;
      cursor = match.index + match[0].length;
    }
    if (cursor < text.length) {
      result.push(text.substring(cursor));
    }

    // Pass 2 — keyword auto-linking, plain-text segments only. React nodes
    // (the markdown links above, plus links added in earlier passes) are
    // skipped, so nothing ever gets double-linked.
    for (const { url, regex } of map) {
      if (linksAdded >= maxLinks) break;

      const newResult: (string | React.ReactNode)[] = [];
      let replacedInThisPass = false;

      for (const item of result) {
        if (typeof item === 'string' && !replacedInThisPass) {
          const match = item.match(regex);
          if (match && match.index !== undefined) {
            const matchedText = match[0];
            const before = item.substring(0, match.index);
            const after = item.substring(match.index + matchedText.length);
            
            if (before) newResult.push(before);
            newResult.push(
              <Link 
                key={`${url}-${linksAdded}`} 
                href={url} 
                className={linkClasses(className)}
                title={`Explore ${matchedText}`}
              >
                {matchedText}
              </Link>
            );
            if (after) newResult.push(after);
            
            linksAdded++;
            replacedInThisPass = true;
          } else {
            newResult.push(item);
          }
        } else {
          newResult.push(item);
        }
      }
      result = newResult;
    }

    return result;
  }, [text, map, maxLinks, className]);

  return <>{elements.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>)}</>;
}

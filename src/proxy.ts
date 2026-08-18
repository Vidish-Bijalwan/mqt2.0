import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsCompact from './data/redirectsCompact.json';

// Compact redirects: {source: destination} — all permanent (308).
// .html/.htm suffix and /blog/category/* prefix redirects are handled
// by pattern rules below, so they don't need individual entries.
// Total data: 93KB (under Vercel Edge's 256KB limit).
const redirectMap = new Map(
  Object.entries(redirectsCompact).map(([src, dest]) => [src.toLowerCase(), dest as string])
);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lower = pathname.toLowerCase();

  // 0. Legacy blog category URLs → blog listing (no category pages exist).
  //    Checked first so /blog/category/*.html is a single hop.
  if (lower.startsWith('/blog/category/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/blog';
    return NextResponse.redirect(url, 308);
  }

  // 1. Look up the path in our redirect map
  const match = redirectMap.get(lower);

  if (match) {
    const url = request.nextUrl.clone();

    // Check if the destination is a full URL or a relative path
    if (match.startsWith('http')) {
      return NextResponse.redirect(match, 308);
    }

    // For relative paths, handle query parameters in the destination if they exist
    const [destPath, destQuery] = match.split('?');
    url.pathname = destPath;

    if (destQuery) {
      const searchParams = new URLSearchParams(destQuery);
      searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
    }

    return NextResponse.redirect(url, 308);
  }

  // 2. Legacy static-site URLs (foo.html / foo.htm / foo.html/ / foo.htm/)
  //    → same path without the extension (and trailing slash if present).
  //    Handles ~2,000 redirects without any data.
  if (lower.endsWith('.html') || lower.endsWith('.htm') ||
      lower.endsWith('.html/') || lower.endsWith('.htm/')) {
    const stripped = lower.replace(/\.html?\/?$/, '');
    if (stripped && stripped !== lower) {
      const url = request.nextUrl.clone();
      url.pathname = stripped;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // Only run the proxy on non-internal routes to save execution time
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|logo|public).*)',
  ],
};

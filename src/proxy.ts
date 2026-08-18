import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsData from './data/redirects.json';

// Create a Map for O(1) lookups
const redirectMap = new Map(
  redirectsData.map((r: any) => [r.source.toLowerCase(), r])
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
    if (match.destination.startsWith('http')) {
      return NextResponse.redirect(match.destination, match.permanent ? 308 : 307);
    }

    // For relative paths, handle query parameters in the destination if they exist
    const [destPath, destQuery] = match.destination.split('?');
    url.pathname = destPath;

    if (destQuery) {
      const searchParams = new URLSearchParams(destQuery);
      searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
    }

    return NextResponse.redirect(url, match.permanent ? 308 : 307);
  }

  // 2. Legacy static-site URLs (foo.html / foo.htm) → same path without the
  //    extension. The map above still wins for explicitly-listed .html sources.
  if (lower.endsWith('.html') || lower.endsWith('.htm')) {
    const stripped = lower.replace(/\.html?$/, '');
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

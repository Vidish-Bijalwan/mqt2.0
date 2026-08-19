import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Individual redirects (1,588 rules) are in vercel.json — they run at CDN
// level with no function-size limit. This proxy handles only pattern-based
// rules that can't be expressed as static redirect entries.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lower = pathname.toLowerCase();

  // 1. Legacy static-site URLs (foo.html / foo.htm / foo.html/ / foo.htm/)
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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Individual redirects (1,588 rules) are in vercel.json — they run at CDN
// level with no function-size limit. This proxy handles only pattern-based
// rules that can't be expressed as static redirect entries.

export function proxy(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country');
  const hasBeenRedirected = request.cookies.has('auto_translated');

  if (country === 'JP' && !hasBeenRedirected) {
    const url = request.nextUrl.clone();
    const translateUrl = new URL('https://translate.google.com/translate');
    translateUrl.searchParams.set('sl', 'en');
    translateUrl.searchParams.set('tl', 'ja');
    translateUrl.searchParams.set('u', url.toString());

    const response = NextResponse.redirect(translateUrl);
    response.cookies.set('auto_translated', 'true', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

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

  const url = request.nextUrl.clone();
  let hasChanges = false;
  
  // 2. Host canonicalization (force www)
  // siteConfig.domain is "https://www.myquicktrippers.com"
  const expectedHost = "www.myquicktrippers.com";
  
  if (
    process.env.NODE_ENV === 'production' && 
    request.nextUrl.hostname !== 'localhost' && 
    !request.nextUrl.hostname.endsWith('.vercel.app')
  ) {
    if (request.nextUrl.host !== expectedHost) {
      url.host = expectedHost;
      url.port = ''; 
      hasChanges = true;
    }
  }

  // 3. Strip /undefined/ and /null/ from routes
  if (url.pathname.includes('/undefined/') || url.pathname.includes('/null/')) {
    url.pathname = url.pathname.replace(/\/(?:undefined|null)\//g, '/');
    hasChanges = true;
  }

  // 4. Category fragmentation fix
  const categoryMap: Record<string, string> = {
    'pilgrimage': 'Pilgrimage',
    'adventure': 'Adventure',
    'honeymoon': 'Honeymoon',
    'wildlife': 'Wildlife',
    'helicopter': 'Helicopter',
    'international': 'International',
  };

  const packageMatch = url.pathname.match(/^\/packages\/([^\/]+)$/i);
  if (packageMatch) {
    const slug = packageMatch[1].toLowerCase();
    if (categoryMap[slug]) {
      url.pathname = '/packages';
      url.searchParams.set('category', categoryMap[slug]);
      hasChanges = true;
    }
  }
  
  // 5. High-Value 404 Reclamation (Search Console)
  const exactRedirects: Record<string, string> = {
    '/blog/ladakh-travel-guide-beginners': '/blog/tourist-destinations-in-ladakh',
    '/blog/valley-of-flowers-trek-complete-guide': '/blog/valley-of-flowers',
    '/packages/exclusive/nelang-valley-day-trip': '/packages/uttarakhand-tour' // Fallback to nearest state cluster
  };
  
  if (exactRedirects[lower]) {
    url.pathname = exactRedirects[lower];
    hasChanges = true;
  }

  if (hasChanges) {
    return NextResponse.redirect(url, 301);
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

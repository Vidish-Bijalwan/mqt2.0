import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import legacyRedirectsRaw from '@/data/redirects.json';
import { GONE_BLOG_SLUGS } from '@/data/blogIndex';

// Individual redirects (~891 rules) are in vercel.json — they run at CDN
// level with no function-size limit. This proxy handles:
//  - the 3,594-entry legacy redirect table (src/data/redirects.json),
//    including .html/.htm variants, matched BEFORE the extension stripper;
//  - HTTP 410 for confirmed-dead legacy path patterns;
//  - pattern-based rules that can't be expressed as static redirect entries.

interface LegacyRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

// Parsed once at cold start. O(1) lookup keyed on the lowercased source path,
// so .html variants and case variants resolve without scanning 3,594 entries.
const LEGACY_REDIRECT_MAP: Record<string, string> = {};
for (const entry of legacyRedirectsRaw as LegacyRedirect[]) {
  LEGACY_REDIRECT_MAP[entry.source.toLowerCase()] = entry.destination;
}

// vercel.json redirect targets that 404'd (dead legacy guide pages), mapped
// to the nearest live page. Mirrors the vercel.json fixes so that requests
// handled here (e.g. .html variants) land in one hop instead of 308 -> 404.
const DEAD_TARGET_FIXES: Record<string, string> = {
// dead legacy destination path -> nearest live page
  '/destinations/andhra-pradesh': '/packages',
  '/destinations/food-in-ahmedabad': '/destinations/gujarat',
  '/destinations/food-in-almora': '/destinations/uttarakhand',
  '/destinations/food-in-bhutan': '/destinations/bhutan',
  '/destinations/food-in-darjeeling': '/destinations/darjeeling',
  '/destinations/food-in-mussoorie': '/destinations/uttarakhand',
  '/destinations/food-in-rajasthan': '/destinations/rajasthan',
  '/destinations/food-in-sikkim': '/destinations/sikkim',
  '/destinations/food-in-varanasi': '/destinations/uttar-pradesh',
  '/destinations/history-of-agra': '/destinations/uttar-pradesh',
  '/destinations/history-of-ahmedabad': '/destinations/gujarat',
  '/destinations/history-of-almora': '/destinations/uttarakhand',
  '/destinations/history-of-amarnath': '/destinations/kashmir',
  '/destinations/history-of-assam': '/destinations/assam',
  '/destinations/history-of-bhutan': '/destinations/bhutan',
  '/destinations/history-of-chardham': '/destinations/uttarakhand',
  '/destinations/history-of-darjeeling': '/destinations/darjeeling',
  '/destinations/history-of-dehradun': '/destinations/uttarakhand',
  '/destinations/history-of-gaya': '/destinations/gaya',
  '/destinations/history-of-goa': '/destinations/goa',
  '/destinations/history-of-gujarat': '/destinations/gujarat',
  '/destinations/history-of-haridwar': '/destinations/uttarakhand',
  '/destinations/history-of-kashmir': '/destinations/kashmir',
  '/destinations/history-of-manali': '/destinations/himachal-pradesh',
  '/destinations/history-of-muktinath': '/destinations/nepal',
  '/destinations/history-of-mussoorie': '/destinations/uttarakhand',
  '/destinations/history-of-nainital': '/destinations/uttarakhand',
  '/destinations/history-of-nepal': '/destinations/nepal',
  '/destinations/history-of-rajasthan': '/destinations/rajasthan',
  '/destinations/history-of-rishikesh': '/destinations/uttarakhand',
  '/destinations/history-of-shimla': '/destinations/himachal-pradesh',
  '/destinations/history-of-sikkim': '/destinations/sikkim',
  '/destinations/history-of-somnath': '/destinations/gujarat',
  '/destinations/history-of-sri-lanka': '/destinations/sri-lanka',
  '/destinations/history-of-uttar-pradesh': '/destinations/uttar-pradesh',
  '/destinations/history-of-uttarakhand': '/destinations/uttarakhand',
  '/destinations/history-of-varanasi': '/destinations/uttar-pradesh',
  '/destinations/history-of-yamunotri': '/destinations/uttarakhand',
  '/destinations/hue': '/destinations/vietnam',
  '/destinations/in-ahmedabad': '/destinations/gujarat#best-time',
  '/destinations/india-tour-package': '/packages',
  '/destinations/india-tour-packages': '/packages',
  '/destinations/india-tours': '/packages',
  '/destinations/international-tours': '/packages',
  '/destinations/kailash-mansarovar': '/packages',
  '/destinations/nightlife-in-agra': '/destinations/uttar-pradesh',
  '/destinations/nightlife-in-ahmedabad': '/destinations/gujarat',
  '/destinations/nightlife-in-almora': '/destinations/uttarakhand',
  '/destinations/nightlife-in-assam': '/destinations/assam',
  '/destinations/nightlife-in-bhutan': '/destinations/bhutan',
  '/destinations/nightlife-in-darjeeling': '/destinations/darjeeling',
  '/destinations/nightlife-in-dehradun': '/destinations/uttarakhand',
  '/destinations/nightlife-in-gaya': '/destinations/gaya',
  '/destinations/nightlife-in-goa': '/destinations/goa',
  '/destinations/nightlife-in-haridwar': '/destinations/uttarakhand',
  '/destinations/nightlife-in-mussoorie': '/destinations/uttarakhand',
  '/destinations/nightlife-in-nainital': '/destinations/uttarakhand',
  '/destinations/nightlife-in-rishikesh': '/destinations/uttarakhand',
  '/destinations/nightlife-in-varanasi': '/destinations/uttar-pradesh',
  '/destinations/russia-tour-packages': '/packages',
  '/destinations/shopping-in-agra': '/destinations/uttar-pradesh',
  '/destinations/shopping-in-ahmedabad': '/destinations/gujarat',
  '/destinations/shopping-in-almora': '/destinations/uttarakhand',
  '/destinations/shopping-in-assam': '/destinations/assam',
  '/destinations/shopping-in-darjeeling': '/destinations/darjeeling',
  '/destinations/shopping-in-dehradun': '/destinations/uttarakhand',
  '/destinations/shopping-in-gaya': '/destinations/gaya',
  '/destinations/shopping-in-goa': '/destinations/goa',
  '/destinations/shopping-in-gujarat': '/destinations/gujarat',
  '/destinations/shopping-in-haridwar': '/destinations/uttarakhand',
  '/destinations/shopping-in-kashmir': '/destinations/kashmir',
  '/destinations/shopping-in-manali': '/destinations/himachal-pradesh',
  '/destinations/shopping-in-mussoorie': '/destinations/uttarakhand',
  '/destinations/shopping-in-nainital': '/destinations/uttarakhand',
  '/destinations/shopping-in-rajasthan': '/destinations/rajasthan',
  '/destinations/shopping-in-rishikesh': '/destinations/uttarakhand',
  '/destinations/shopping-in-shimla': '/destinations/himachal-pradesh',
  '/destinations/shopping-in-sikkim': '/destinations/sikkim',
  '/destinations/shopping-in-somnath': '/destinations/gujarat',
  '/destinations/shopping-in-sri-lanka': '/destinations/sri-lanka',
  '/destinations/shopping-in-uttarakhand': '/destinations/uttarakhand',
  '/destinations/shopping-in-varanasi': '/destinations/uttar-pradesh',
  '/destinations/shopping-in-vietnam': '/destinations/vietnam',
  '/destinations/travel-guide__page__14': '/packages',
  '/destinations/travel-guide__page__15': '/packages',
  '/destinations/travel-guide__page__16': '/packages',
  '/destinations/travel-guide__page__17': '/packages',
  '/destinations/travel-guide__page__18': '/packages',
  '/destinations/travel-guide__page__19': '/packages',
  '/destinations/travel-guide__page__20': '/packages',
  '/destinations/travel-tips-for-auli': '/packages',
  '/destinations/travel-tips-for-dehradun': '/destinations/uttarakhand#travel-tips',
  '/destinations/travel-tips-for-goa': '/destinations/goa#travel-tips',
  '/destinations/travel-tips-for-haridwar': '/destinations/uttarakhand#travel-tips',
  '/destinations/travel-tips-for-kailash-mansarovar': '/packages',
  '/destinations/travel-tips-for-nainital': '/destinations/uttarakhand#travel-tips',
  '/destinations/travel-tips-for-sri-lanka': '/destinations/sri-lanka#travel-tips',
  '/packages/2-days-ayodhya-tour-package': '/packages',
  '/packages/2-days-delhi-agra-mathura-vrindavan-tour': '/packages',
  '/packages/2-days-khajuraho-tour': '/packages',
  '/packages/3-days-srisailam-mallikarjuna-jyotirlinga-tour': '/packages',
  '/packages/agra-sightseeing-tour-from-delhi': '/packages',
  '/packages/baidyanath-dham-tour-2-days': '/packages',
  '/packages/char-dham-yatra-by-helicopter': '/packages',
  '/packages/do-dham-yatra-by-helicopter': '/packages',
  '/packages/guruvayur-thrissur-athirapally-package': '/packages',
  '/packages/haridwar-rishikesh-sightseeing-tour': '/packages',
  '/packages/indore-to-ujjain-omkareshwar-tour': '/packages',
  '/packages/kailash-mansarovar-aerial-darshan-by-flight': '/packages',
  '/packages/kamakhya-temple-tour-package': '/packages',
  '/packages/khatu-shyam-ji-salasar-balaji-yatra-by-helicopter': '/packages',
  '/packages/mathura-gokul-vrindavan-weekend-tour-from-delhi': '/packages',
  '/packages/rishikesh-haridwar-trip-from-delhi': '/packages',
  '/packages/srisailam-mallikarjuna-jyotirlinga-darshan': '/packages',
  '/packages/srisailam-weekend-trip': '/packages',
  '/packages/varanasi-sarnath-tour': '/packages',
};

// Confirmed-dead legacy path patterns from the robots-blocked bucket.
// Verified 2026-09-29: the live api/ route handlers in src/ are the two
// currency routes allowlisted below PLUS the blog engagement + CMS routes
// (/api/blog/*: stats, view, like, comments, posts; /api/admin/*: login,
// logout, blog). 410 drains the dead ones from Google's memory faster
// than a 404.
// Live API routes — never 410 these; they are real route handlers under
// src/app/api/. /api/enquiries added for lead capture (PR #37).
const LIVE_API_ROUTES = new Set(["/api/fx-rates", "/api/display-currency", "/api/enquiries"]);
const LIVE_API_PREFIXES = ["/api/blog/", "/api/admin/"];
// Live admin pages (the blog creator at /admin/blog/new). The bare /admin
// index and any other /admin/* path stay 410'd legacy residue.
const LIVE_ADMIN_PREFIXES = ["/admin/blog/"];

function isGonePath(lowerPathname: string): boolean {
  if (LIVE_API_ROUTES.has(lowerPathname)) return false;
  if (LIVE_API_PREFIXES.some((p) => lowerPathname.startsWith(p))) return false;
  if (LIVE_ADMIN_PREFIXES.some((p) => lowerPathname.startsWith(p))) return false;
  return (
    lowerPathname === '/api' ||
    lowerPathname.startsWith('/api/') ||
    lowerPathname === '/admin' ||
    lowerPathname.startsWith('/admin/') ||
    lowerPathname.startsWith('/thank-you')
  );
}

function applyDestination(url: URL, destination: string): void {
  const hashIdx = destination.indexOf('#');
  const noHash = hashIdx === -1 ? destination : destination.slice(0, hashIdx);
  const hash = hashIdx === -1 ? '' : destination.slice(hashIdx);
  const queryIdx = noHash.indexOf('?');
  url.pathname = queryIdx === -1 ? noHash : noHash.slice(0, queryIdx);
  // Only overwrite the query string when the mapping defines one, so
  // inbound tracking params (utm_*, gclid, ...) survive the redirect —
  // same behaviour as vercel.json permanent redirects.
  if (queryIdx !== -1) url.search = noHash.slice(queryIdx);
  url.hash = hash;
}

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
      // No client-side JS reads this cookie (only the proxy reads it back),
      // so it can be hardened to Secure + HttpOnly.
      secure: true,
      httpOnly: true,
    });
    return response;
  }

  const { pathname } = request.nextUrl;
  const lower = pathname.toLowerCase();

  // 1. Confirmed-dead legacy patterns -> 410 Gone (never coming back).
  if (isGonePath(lower)) {
    return new NextResponse('Gone', { status: 410 });
  }

  // 1b. De-listed blog posts -> 410 Gone. These slugs exist in the legacy
  //     scrape but failed the editorial gate (confirmed dead, not missing):
  //     a 410 tells search engines to de-list fast, where a 404 reads as
  //     "maybe temporary". Decision set: GONE_BLOG_SLUGS in @/data/blogIndex;
  //     the page-level twin is getBlogSlugStatus() in
  //     src/app/blog/[slug]/page.tsx (which 404s anything not "live").
  //     Verified 2026-09-27: no overlap with the legacy redirect table below.
  const goneBlogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (goneBlogMatch && GONE_BLOG_SLUGS.has(goneBlogMatch[1].toLowerCase())) {
    return new NextResponse('Gone', { status: 410 });
  }

  // 2. Legacy redirect table (src/data/redirects.json), matched BEFORE the
  //    extension stripper so .html/.htm variants hit their mapped target
  //    (e.g. /gujrat-somnath-tour.html) instead of 404ing on the bare path.
  const mapped = LEGACY_REDIRECT_MAP[lower];
  if (mapped) {
    const url = request.nextUrl.clone();
    const bareTarget = mapped.split('?')[0].split('#')[0].toLowerCase();
    applyDestination(url, DEAD_TARGET_FIXES[bareTarget] ?? mapped);
    // Never redirect to the exact same URL (guard against redirect loops).
    const samePath = url.pathname.toLowerCase() === lower;
    const sameQuery = url.search === request.nextUrl.search;
    if (!(samePath && sameQuery)) {
      return NextResponse.redirect(url, 308);
    }
    // Falls through to the rules below when the mapping is a no-op.
  }

  // 3. Legacy static-site URLs (foo.html / foo.htm / foo.html/ / foo.htm/)
  //    -> same path without the extension (and trailing slash if present).
  //    Only reached when the redirect table has no mapping for the URL.
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

  // 4. Host canonicalization (force www)
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

  // 5. Strip /undefined/ and /null/ from routes
  if (url.pathname.includes('/undefined/') || url.pathname.includes('/null/')) {
    url.pathname = url.pathname.replace(/\/(?:undefined|null)\//g, '/');
    hasChanges = true;
  }

  // 6. Category fragmentation fix
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

  // 7. High-Value 404 Reclamation (Search Console)
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
  // Only run the proxy on non-internal routes to save execution time.
  // Note: /api/:path* is intentionally NOT excluded — the live API routes
  // (the two currency routes + the blog engagement/CMS routes under
  // /api/blog/* and /api/admin/*) are allowlisted in isGonePath above;
  // every other /api/* hit is legacy residue and gets a 410.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|logo|public).*)',
  ],
};

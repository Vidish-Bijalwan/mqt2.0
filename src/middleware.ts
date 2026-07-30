import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsData from './data/redirects.json';

// Create a Map for O(1) lookups
const redirectMap = new Map(
  redirectsData.map((r: any) => [r.source.toLowerCase(), r])
);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Look up the path in our redirect map
  const match = redirectMap.get(pathname.toLowerCase());
  
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

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // Only run middleware on non-internal routes to save execution time
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|logo|public).*)',
  ],
};

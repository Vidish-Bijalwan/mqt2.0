import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the user's country from Vercel's edge network headers
  const country = request.headers.get('x-vercel-ip-country');
  
  // Check if we've already redirected this user to avoid redirect loops
  const hasBeenRedirected = request.cookies.has('auto_translated');

  // If the user is from Japan and hasn't been redirected yet
  if (country === 'JP' && !hasBeenRedirected) {
    // Determine the source URL to translate
    const url = request.nextUrl.clone();
    
    // Set up the Google Translate URL
    const translateUrl = new URL('https://translate.google.com/translate');
    translateUrl.searchParams.set('sl', 'en');
    translateUrl.searchParams.set('tl', 'ja');
    translateUrl.searchParams.set('u', url.toString());

    // Create a response that redirects to Google Translate
    const response = NextResponse.redirect(translateUrl);
    
    // Set a cookie so we don't redirect them again if they return
    response.cookies.set('auto_translated', 'true', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all paths except static files, api routes, Next.js internals, and images
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

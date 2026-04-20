import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const response = NextResponse.next();

  // Production domain — allow indexing
  const isProduction = hostname === 'apscore5.com' || hostname === 'www.apscore5.com';

  if (!isProduction) {
    // Block all crawlers on any non-production host (vercel.app, preview URLs, dev, etc.)
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
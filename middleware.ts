import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Next.js
 *
 * NOTE: Authentication is handled CLIENT-SIDE via localStorage
 * Middleware cannot access localStorage (server-side only)
 *
 * Auth checks are done in:
 * - login/page.tsx (redirects if already logged in)
 * - Protected route layouts (useEffect checks)
 */
export function middleware(request: NextRequest) {
  // Allow all routes - auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

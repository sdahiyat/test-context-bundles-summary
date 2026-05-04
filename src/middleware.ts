import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = [
  '/dashboard',
  '/log',
  '/profile',
  '/progress',
  '/settings',
  '/insights',
];

const AUTH_PATHS = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
];

function hasAuthCookie(request: NextRequest): boolean {
  const cookies = request.cookies.getAll();
  // Supabase stores the session token in a cookie matching: sb-<project-ref>-auth-token
  return cookies.some((cookie) => /^sb-.+-auth-token/.test(cookie.name));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  const isAuthenticated = hasAuthCookie(request);

  // Redirect unauthenticated users away from protected pages
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPath && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/log/:path*',
    '/profile/:path*',
    '/progress/:path*',
    '/settings/:path*',
    '/insights/:path*',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
  ],
};

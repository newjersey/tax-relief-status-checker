import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

/** Set of valid application paths that should not be redirected. */
const VALID_PATHS = new Set([
  "/",
  "/application-received",
  "/payment-info",
  "/more-information-needed",
]);

/**
 * Checks whether the requested path is a known route. If not, redirects the user to the landing
 * page.
 */
export const middleware = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;

  if (VALID_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const landingUrl = request.nextUrl.clone();
  landingUrl.pathname = "/";

  return NextResponse.redirect(landingUrl);
};

export const config = {
  /**
   * Match all paths except Next.js internals and static assets. This ensures API routes, _next
   * assets, and public files are not intercepted.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

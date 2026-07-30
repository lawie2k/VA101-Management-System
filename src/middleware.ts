import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "va101_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "va101-fallback-secret-change-me"
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // 1. Redirect authenticated users trying to access login/register back to their dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const user = (payload as any).user;
        const roles = user?.roles || [];

        let destination = "/va/dashboard";
        if (roles.includes("client")) destination = "/client/dashboard";
        else if (roles.includes("admin")) destination = "/admin/dashboard";
        else if (roles.includes("employee")) destination = "/admin/dashboard";
        else if (roles.includes("trainer")) destination = "/trainer/dashboard";
        else if (roles.includes("finance")) destination = "/admin/dashboard";

        const url = request.nextUrl.clone();
        url.pathname = destination;
        return NextResponse.redirect(url);
      } catch {
        // Invalid/expired token, let them access public auth pages
      }
    }
  }

  const isProtected = pathname.startsWith("/va") || 
                      pathname.startsWith("/client") || 
                      pathname.startsWith("/admin") || 
                      pathname.startsWith("/trainer") || 
                      pathname.startsWith("/finance");

  if (isProtected) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Verify JWT in Next.js Edge Runtime without Node-only modules
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const user = (payload as any).user;
      const roles = user?.roles || [];

      // Enforce role-based path authorization
      if (pathname.startsWith("/va") && !roles.includes("va")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      if (pathname.startsWith("/client") && !roles.includes("client")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      if (pathname.startsWith("/admin") && !roles.includes("admin") && !roles.includes("finance") && !roles.includes("employee")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      if (pathname.startsWith("/trainer") && !roles.includes("trainer")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      if (pathname.startsWith("/finance") && !roles.includes("finance")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    } catch {
      // Token expired or signature mismatch
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/va/:path*",
    "/client/:path*",
    "/admin/:path*",
    "/trainer/:path*",
    "/finance/:path*",
    "/login",
    "/register"
  ]
};

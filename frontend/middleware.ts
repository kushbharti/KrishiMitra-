import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Decode a JWT payload without verifying signature (safe for Edge runtime).
// Actual verification happens on the backend for every API call.
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    
    // Replace base64url characters with standard base64 characters
    let base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const decoded = atob(base64);
    
    return JSON.parse(decoded);
  } catch (error) {
    console.error("[Middleware] Failed to decode JWT payload:", error);
    return null;
  }
}

// Next.js requires this function to be named `middleware`
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, internal Next.js paths, and API proxy calls
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/internal-auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Read the HttpOnly JWT session cookie
  const token = request.cookies.get("access_token")?.value;

  // 3. Decode payload if token exists
  let role: string | undefined;
  if (token) {
    const payload = decodeJwtPayload(token);
    role = payload?.role as string | undefined;
  }
  
  console.log(`[Middleware] Path: ${pathname}, Token: ${!!token}, Role: ${role}`);

  // 4. RULE: Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!token) {
      console.log(`[Middleware] Redirecting to /login because no token`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "ADMIN") {
      console.log(`[Middleware] Redirecting to /dashboard because role is ${role}`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    console.log(`[Middleware] Allowing Admin access to ${pathname}`);
    return NextResponse.next();
  }

  // 5. Unauthorized page — always accessible
  if (pathname === "/unauthorized") {
    return NextResponse.next();
  }

  // 6. Landing page handling
  if (pathname === "/" || pathname === "/login") {
    if (!token) {
      return NextResponse.next();
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 7. Secure routes (Farmer routes)
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists but role is ADMIN, prevent access to Farmer routes.
  if (role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // RULE: Authenticated user (FARMER) accessing protected routes -> Let them through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

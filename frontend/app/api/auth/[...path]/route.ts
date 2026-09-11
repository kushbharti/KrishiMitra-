/**
 * Next.js Route Handler: /api/auth/[...path]
 *
 * WHY THIS FILE EXISTS:
 * Next.js `rewrites` in next.config.ts act as a transparent server-side proxy
 * but do NOT reliably forward Set-Cookie response headers from the upstream
 * FastAPI backend to the browser in Next.js 15 App Router. This causes the
 * `access_token` HttpOnly cookie to never be stored in the browser, resulting
 * in every subsequent call to /api/auth/me returning 401.
 *
 * This Route Handler explicitly proxies auth requests and manually copies all
 * response headers (including Set-Cookie) into the Next.js response so the
 * browser correctly receives and stores the authentication cookie.
 *
 * Routes handled:
 *   POST /api/auth/sync    → exchanges Firebase ID token for JWT cookie
 *   GET  /api/auth/me      → returns authenticated user from cookie
 *   POST /api/auth/logout  → clears the cookie
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function proxyToBackend(
  request: NextRequest,
  pathSegments: string[],
): Promise<NextResponse> {
  const backendPath = pathSegments.join("/");
  const targetUrl = `${BACKEND_URL}/api/auth/${backendPath}`;

  // Forward the request body and all relevant headers to FastAPI
  const headers = new Headers();
  headers.set("Content-Type", request.headers.get("Content-Type") || "application/json");

  // Forward the cookie from the browser to FastAPI (needed for /me and /logout)
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });

  // Copy the backend response body
  const responseBody = await backendResponse.text();

  // Build a Next.js response, preserving status and content-type
  const nextResponse = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("Content-Type") || "application/json",
    },
  });

  // ── CRITICAL: Forward all Set-Cookie headers from FastAPI to the browser ──
  // This is the core fix. Without this, the HttpOnly access_token cookie
  // is never stored and /api/auth/me will always return 401.
  backendResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      nextResponse.headers.append("Set-Cookie", value);
    }
  });

  return nextResponse;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToBackend(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToBackend(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToBackend(request, path);
}

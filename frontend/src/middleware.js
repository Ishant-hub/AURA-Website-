import { NextResponse } from "next/server";

// Simple client-side JWT decoder for Next.js Middleware (Edge Runtime)
function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    // Decode base64url payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Define protected matchers
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/checkout") || pathname.startsWith("/track-order");

  if (isAdminRoute || isUserRoute) {
    const sessionCookie = request.cookies.get("aura_session");
    
    if (!sessionCookie || !sessionCookie.value) {
      // Redirect to login page
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const payload = decodeJwt(sessionCookie.value);
    
    if (!payload) {
      // Token is malformed or corrupted, clear it and redirect
      const response = NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
      response.cookies.delete("aura_session");
      return response;
    }
    
    // Check expiration if present
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
      response.cookies.delete("aura_session");
      return response;
    }
    
    // Role protection for Admin Dashboard
    if (isAdminRoute && payload.role !== "ADMIN") {
      // Redirect to access-denied page for non-admin accounts
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }
  
  return NextResponse.next();
}

// Config to optimize middleware execution matching only protected paths
export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/track-order/:path*"],
};

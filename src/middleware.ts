import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isVerified = !!token?.emailVerified;
    const pathname = req.nextUrl.pathname;

    console.log("Middleware Check:", { path: pathname, role: token?.role, isVerified });

    // 1. Protect Admin Routes: Must be logged in as ADMIN
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        console.log("Middleware: Unauthorized admin access. Redirecting to /generate");
        return NextResponse.redirect(new URL("/generate", req.url));
      }
      return NextResponse.next();
    }

    // 2. Handle /generate route: 
    // - Guests: Allowed
    // - Logged in + Verified: Allowed
    // - Logged in + UNVERIFIED: Redirect to /verify
    if (pathname.startsWith("/generate")) {
      if (token && !isVerified) {
        console.log("Middleware: Logged-in user is unverified. Redirecting to /verify");
        return NextResponse.redirect(new URL("/verify", req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true to always let the middleware function handle the logic,
      // or false to automatically redirect to the login page.
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Allow public access to /generate for guests
        if (pathname.startsWith("/generate")) {
          return true;
        }

        // Require a token for everything else matched (like /admin)
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/generate/:path*", "/admin/:path*"],
};

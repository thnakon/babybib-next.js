import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isVerified = !!token?.emailVerified;
    const isVerifyPage = req.nextUrl.pathname.startsWith("/signup"); // Signup form actually has the verification step

    // If you are going to /generate but not verified, go to signup step 2 (Verification)
    // Actually, according to the user request, we should probably have a dedicated verify page or force them back to signup
    // But since the signup form already has the logic, let's see.
    // User said: "บังคับให้ไปหน้า ยืนยันเมลก่อน" (Force to go to verification page first)
    
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/generate", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/generate") && !isVerified) {
        return NextResponse.redirect(new URL("/verify", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/generate/:path*", "/admin/:path*"],
};

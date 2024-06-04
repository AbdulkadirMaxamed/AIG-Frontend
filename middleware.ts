import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const url = request.nextUrl.clone();
    const token = request.nextauth.token;

    console.log("Pathname:", request.nextUrl.pathname);
    console.log("Token:", token);

    // Check if user is authorized
    if (token?.role === "admin") {
      // User is authorized, continue to the requested page
      return NextResponse.next();
    } else {
      // User is not authorized, redirect to the sign-in page
      
      url.pathname = "/api/auth/signin";
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*"] };
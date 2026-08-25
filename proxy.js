import { NextResponse } from "next/server";

export default function middleware(req) {
  // Frictionless Hackathon Mode: No authentication redirects!
  // Everyone can access /health-hub directly.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};

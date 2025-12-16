import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("an_token");

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

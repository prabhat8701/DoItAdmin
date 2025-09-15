import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session_data")?.value;
  const url = new URL(request.url);

  // Redirect root to login
  if (url.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect /home
  if (url.pathname.startsWith("/home")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};


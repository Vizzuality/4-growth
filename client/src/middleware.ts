import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

export const config = { matcher: ["/auth/signin", "/profile"] };

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (token && request.nextUrl.pathname.startsWith("/auth/signin")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
}

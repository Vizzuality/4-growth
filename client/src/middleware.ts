import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

import { isPrivatePath } from "@/lib/utils";

import { env } from "./env";

const [AUTH_USER, AUTH_PASS] = (env.AUTH_CREDENTIALS || ":").split(":");

const isBasicAuthEnabled = !!AUTH_USER && !!AUTH_PASS;

const isAuthenticated = (req: NextRequest) => {
  const authheader = req.headers.get("Authorization");

  if (!authheader) {
    return false;
  }

  const auth = Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");

  return auth[0] === AUTH_USER && auth[1] === AUTH_PASS;
};

export default function middleware(req: NextRequestWithAuth) {
  if (isBasicAuthEnabled && !isAuthenticated(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  if (isPrivatePath(req.nextUrl.pathname)) {
    return withAuth(req, {
      pages: {
        signIn: "/auth/signin",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - health (health check endpoint)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|health).*)",
  ],
};

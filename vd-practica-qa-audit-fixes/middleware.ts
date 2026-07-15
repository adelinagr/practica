import { NextResponse } from "next/server";
import { auth } from "@/auth";

export function middleware(req: Request) {
  const requestHeaders = new Headers(req.headers);
  const correlationId = requestHeaders.get("x-correlation-id") || crypto.randomUUID();
  requestHeaders.set("x-correlation-id", correlationId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
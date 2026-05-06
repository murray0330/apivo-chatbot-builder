import { NextRequest, NextResponse } from "next/server";

const SUBDOMAIN_MAP: Record<string, string> = {
  "contourology": "contourology-la",
};

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  const widgetId = SUBDOMAIN_MAP[subdomain];
  if (widgetId && req.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL(`/chat/${widgetId}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};

import { NextRequest, NextResponse } from "next/server";
import { getPublicConfig } from "@/lib/clients";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  const widgetId = request.nextUrl.searchParams.get("widgetId");

  if (!widgetId) {
    return NextResponse.json(
      { error: "widgetId query param is required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const config = getPublicConfig(widgetId);
  if (!config) {
    return NextResponse.json(
      { error: "Unknown widgetId" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(config, { status: 200, headers: CORS_HEADERS });
}

import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/clients";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { message, widgetId, previousChatId } = body as {
    message?: unknown;
    widgetId?: unknown;
    previousChatId?: unknown;
  };

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (typeof widgetId !== "string" || !widgetId.trim()) {
    return NextResponse.json(
      { error: "widgetId is required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const client = getClient(widgetId);
  if (!client) {
    return NextResponse.json(
      { error: "Unknown widgetId" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const apiKey = process.env.VAPI_PRIVATE_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  let vapiResponse: Response;
  try {
    vapiResponse = await fetch("https://api.vapi.ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        assistantId: client.assistantId,
        input: message,
        previousChatId: typeof previousChatId === "string" && previousChatId ? previousChatId : undefined,
      }),
    });
  } catch (err) {
    console.error("Vapi fetch error:", err);
    return NextResponse.json(
      { error: "Failed to reach Vapi API" },
      { status: 502, headers: CORS_HEADERS }
    );
  }

  if (!vapiResponse.ok) {
    const text = await vapiResponse.text().catch(() => "");
    console.error("Vapi error response:", vapiResponse.status, text);
    return NextResponse.json(
      { error: "Vapi API error", detail: text },
      { status: 502, headers: CORS_HEADERS }
    );
  }

  let vapiData: unknown;
  try {
    vapiData = await vapiResponse.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid response from Vapi" },
      { status: 502, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(vapiData, { status: 200, headers: CORS_HEADERS });
}

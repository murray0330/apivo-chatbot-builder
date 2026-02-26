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

  const { message, userMessage, widgetId, previousChatId } = body as {
    message?: unknown;
    userMessage?: unknown;
    widgetId?: unknown;
    previousChatId?: unknown;
  };

  // Accept either `userMessage` (new widget) or `message` (legacy)
  const msg = typeof userMessage === "string" ? userMessage : typeof message === "string" ? message : "";
  if (!msg.trim()) {
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
        input: msg,
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

  // Normalize Vapi response → { chatId, reply }
  const vd = vapiData as Record<string, unknown>;
  const chatId = typeof vd.id === "string" ? vd.id : null;
  let reply = "Sorry, I could not process your message.";
  if (Array.isArray(vd.output) && vd.output.length > 0) {
    const last = vd.output[vd.output.length - 1] as Record<string, unknown>;
    const text = last.content ?? last.text ?? last.message;
    if (typeof text === "string" && text) reply = text;
  } else if (typeof vd.message === "string" && vd.message) {
    reply = vd.message;
  } else if (typeof vd.response === "string" && vd.response) {
    reply = vd.response;
  }
  return NextResponse.json({ chatId, reply }, { status: 200, headers: CORS_HEADERS });
}

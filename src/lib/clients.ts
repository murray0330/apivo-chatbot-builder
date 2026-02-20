export interface ClientConfig {
  /** Vapi assistant ID — server-side only, never exposed to clients */
  assistantId: f5381cfd-af11-44d5-9bf3-5d1d87c7b121;
  businessName: XYZ;
  greeting: Hello! Welcome to XYZ. How can I help you today?;
  quickReplies: string[];
  primaryColor: #7bafd4;
}

export interface PublicClientConfig {
  businessName: XYZ;
  greeting: Hello! Welcome to XYZ. How can I help you today?;
  quickReplies: string[];
  primaryColor: #7bafd4;
}

/**
 * Server-side registry of all embedded chat clients.
 * Each key is a widgetId that clients use in their <script> tag.
 *
 * To add a new client:
 *   1. Add an entry here with their Vapi assistantId and branding.
 *   2. Redeploy to Vercel.
 *   3. Give the client their one-line embed snippet.
 */
const clients: Record<string, ClientConfig> = {
  "xyz": {
    assistantId: "f5381cfd-af11-44d5-9bf3-5d1d87c7b121",
    businessName: "XYZ",
    greeting: "Hello! Welcome to XYZ. How can I help you today?",
    quickReplies: [
      "Book an appointment",
      "Office hours",
      "Insurance accepted",
      "Contact us",
    ],
    primaryColor: "#dc582a",
  },
};

export function getClient(widgetId: string): ClientConfig | null {
  return clients[widgetId] ?? null;
}

export function getPublicConfig(widgetId: string): PublicClientConfig | null {
  const client = getClient(widgetId);
  if (!client) return null;
  const { businessName, greeting, quickReplies, primaryColor } = client;
  return { businessName, greeting, quickReplies, primaryColor };
}

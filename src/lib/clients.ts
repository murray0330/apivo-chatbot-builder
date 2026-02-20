export interface ClientConfig {
  /** Vapi assistant ID — server-side only, never exposed to clients */
  assistantId: string;
  businessName: string;
  greeting: string;
  quickReplies: string[];
  primaryColor: string;
}

export interface PublicClientConfig {
  businessName: string;
  greeting: string;
  quickReplies: string[];
  primaryColor: string;
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
      "test",
      "testt",
      "testttt",
      "testtttt",
    ],
    primaryColor: "#dc582a",
  },
};

const clients: Record<string, ClientConfig> = {
"xyz-2": {
    assistantId: "f5381cfd-af11-44d5-9bf3-5d1d87c7b121",
    businessName: "XYZ-2",
    greeting: "HI TESTING",
    quickReplies: [
      "TEST 1",
      "TEST 2",
    ],
    primaryColor: "#9a532d",
  },

export function getClient(widgetId: string): ClientConfig | null {
  return clients[widgetId] ?? null;
}

export function getPublicConfig(widgetId: string): PublicClientConfig | null {
  const client = getClient(widgetId);
  if (!client) return null;
  const { businessName, greeting, quickReplies, primaryColor } = client;
  return { businessName, greeting, quickReplies, primaryColor };
}

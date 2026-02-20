export interface ClientConfig {
  /** Vapi assistant ID — server-side only, never exposed to clients */
  assistantId: string;

  // ── Core identity ──────────────────────────────────────────────────────────
  businessName: string;
  greeting: string;
  quickReplies: string[];
  primaryColor: string;

  // ── Extended identity ──────────────────────────────────────────────────────
  avatarUrl?: string;
  description?: string;
  messagePlaceholder?: string;
  footer?: string;

  // ── Appearance ─────────────────────────────────────────────────────────────
  fontFamily?: string;
  themeMode?: "light" | "dark";
  headerStyle?: string;
  cornerRadius?: "sharp" | "round";
  customCss?: string;

  // ── Deploy ─────────────────────────────────────────────────────────────────
  chatInterface?: string;
  chatLauncher?: string;
  useAvatarForButton?: boolean;
  buttonImageUrl?: string;
  proactiveMessage?: string;

  // ── Features ───────────────────────────────────────────────────────────────
  messageFeedback?: boolean;
  allowFileUpload?: boolean;
  notificationSound?: boolean;
  conversationHistory?: boolean;
  historyReset?: string;
}

/** Everything except the private assistantId — safe to return to the browser */
export type PublicClientConfig = Omit<ClientConfig, "assistantId">;

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
  "test-3": {
    assistantId: "f5381cfd-af11-44d5-9bf3-5d1d87c7b121",
    businessName: "testing 3",
    greeting: "Hello! this is a test",
    quickReplies: [
      "test1",
      "test2",
      "test3",
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { assistantId: _private, ...rest } = client;
  return rest;
}

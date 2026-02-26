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

  // ── Icons ─────────────────────────────────────────────────────────────────
  launcherIcon?: string;
  headerIcon?: string;
  botBubbleIcon?: string;
  userBubbleIcon?: string;

  // ── Deploy ─────────────────────────────────────────────────────────────────
  chatInterface?: string;
  chatLauncher?: string;
  useAvatarForButton?: boolean;
  buttonImageUrl?: string;
  proactiveMessage?: string;

  // ── Features ───────────────────────────────────────────────────────────────
  glassEffect?: boolean;
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

  // ─────────────────────────────────────────────────────────────────────────
  // ADD NEW BOT ENTRIES BELOW: const clients: Record<string, ClientConfig> = {
  // ─────────────────────────────────────────────────────────────────────────

const clients: Record<string, ClientConfig> = {
"apivo": {
  assistantId: "a1471688-687e-407e-a8ce-456bce6bdc0e",
  businessName: "Agent Apivo",
  greeting: "Hi! Welcome to Apivo. To get started, are you a new or existing patient?",
  quickReplies: [
      "New Patient",
      "Existing Patient",
    ],
  primaryColor: "red",
  description: "AI Booking Assistant",
  footer: "Powered by Apivo",
  launcherIcon: "message",
  headerIcon: "bot",
  proactiveMessage: "Let's chat!",
  notificationSound: true,
  historyReset: "24h",
},
  
  // ─────────────────────────────────────────────────────────────────────────
  // ADD NEW BOT ENTRIES ABOVE THIS LINE (inside the object, before the `};`)
  // ─────────────────────────────────────────────────────────────────────────
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

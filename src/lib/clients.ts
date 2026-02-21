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
  "final-test": {
    assistantId: "f5381cfd-af11-44d5-9bf3-5d1d87c7b121",
    businessName: "testing",
    greeting: "Hello! testing!",
    quickReplies: [
      "1",
      "2",
      "3",
    ],
    primaryColor: "#00f03c",
    avatarUrl: "https://articulateusercontent.com/rise/courses/XH4LENOq67vCvnb0VlAsEGqrP52TvcKA/YiQRpk6GcMpPozDc.png",
    description: "test ya",
    messagePlaceholder: "hola",
    footer: "and rew",
    fontFamily: "Poppins",
    themeMode: "dark",
    headerStyle: "gradient",
    buttonImageUrl: "https://articulateusercontent.com/rise/courses/XH4LENOq67vCvnb0VlAsEGqrP52TvcKA/YiQRpk6GcMpPozDc.png",
    proactiveMessage: "hola",
    historyReset: "24h",
  },
  "abc-dental": {
    assistantId: "f5381cfd-af11-44d5-9bf3-5d1d87c7b121",
    businessName: "maria ai",
    greeting: "hi maria",
    quickReplies: [],
    primaryColor: "#93a276",
    avatarUrl: "https://articulateusercontent.com/rise/courses/XH4LENOq67vCvnb0VlAsEGqrP52TvcKA/YiQRpk6GcMpPozDc.png",
    footer: "andrew made this",
    themeMode: "dark",
  },

"feb-21": {
  assistantId: "f5381cfd-af11-44d5-9bf3-5d1d87c7b121",
  businessName: "dd",
  greeting: "Hello! How can I help you today?",
  quickReplies: [
      "1",
      "2",
      "3",
    ],
  primaryColor: "#c91818",
  description: "ai asistatn",
  footer: "andrew murray",
  fontFamily: "Roboto",
  launcherIcon: "message",
  headerIcon: "smile",
  botBubbleIcon: "bot",
  userBubbleIcon: "user",
  proactiveMessage: "hi need help",
    glassEffect: true,
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

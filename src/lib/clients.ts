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
  customJs?: string;

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
  assistantId: "f5381cfd-af11-44d5-9bf3-5d1d87c7b121",
  businessName: "Apivo | AI Agent",
  greeting: "Hi! Welcome to Apivo. Are you looking to see how we can help automate your bookings 24/7?",
  quickReplies: [
      "Tell me more",
      "Book Demo",
    ],
  primaryColor: "#6366f1",
  avatarUrl: "https://www.apivo.ai/apivo-favicon_white.png",
  fontFamily: "Poppins",
  launcherIcon: "message",
  notificationSound: true,
  historyReset: "24h",
  proactiveMessage: "👋 Hi! Ready to book a demo or have questions? I'm here to help.",
},
"abc-medspa": {
  assistantId: "5d2be46c-6621-442d-b4d2-f7aa7ca01d85",
  businessName: "ABC Med Spa",
  greeting: "Hi! Welcome to ABC Med Spa. To get started, are you a new or returning client?",
  quickReplies: [
      "I'm a new client",
      "I've visted before",
      "I have a question",
    ],
  primaryColor: "#7B8C7D",
  fontFamily: "Manrope",
  launcherIcon: "message",
  headerIcon: "spark",
  proactiveMessage: "👋 Hi! Not sure which treatment is right for you? Ask me anything.",
},
  "contourology-la": {
  assistantId: "36ecc4d5-ef99-4f10-b271-89373bce8b78",
  businessName: "Contourology",
  greeting: "Hi! Welcome to Contourology. To get started, are you a new or returning client?",
  quickReplies: [
      "I'm a new client",
      "I've visted before",
      "I have a question",
    ],
  primaryColor: "#857B73",
  description: "Booking Assistant",
  fontFamily: "Poppins",
  launcherIcon: "message",
  headerIcon: "spark",
  proactiveMessage: "👋 Hi! Not sure which treatment is right for you? Ask me anything.",
  notificationSound: true,
  historyReset: "24h",
  customCss: [
    "@media(max-width:768px){",
      "#aw-launcher{display:none!important}",
      "#aw-proactive{display:none!important}",
      "#aw-panel{bottom:70px!important;border-radius:16px 16px 0 0!important;right:0!important;left:0!important;width:100%!important;}",
    "}",
  ].join(""),
  customJs: [
    "window.awOpenChat=function(){var l=document.getElementById('aw-launcher');if(l)l.click();};",
    "document.addEventListener('click',function(e){",
      "var el=e.target.closest('a,button,[role=button]');",
      "if(!el)return;",
      "var label=(el.getAttribute('aria-label')||'').trim();",
      "var text=(el.textContent||'').trim();",
      "if(label==='AI Chat'||text==='AI Chat'){",
        "e.preventDefault();e.stopPropagation();",
        "if(window.awOpenChat)window.awOpenChat();",
      "}",
    "},true);",
  ].join(""),
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

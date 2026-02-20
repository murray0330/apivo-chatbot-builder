"use client";

import { useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Tab = "identity" | "appearance" | "deploy" | "features";
type ThemeMode = "light" | "dark";
type CornerRadius = "sharp" | "round";
type ChatInterface = "floating-widget" | "embedded-iframe";
type ChatLauncher = "bubble" | "text-bar";
type HistoryReset = "never" | "on-close" | "24h";
type FontFamily = "system" | "Inter" | "Poppins" | "Roboto";
type HeaderStyle = "solid" | "gradient" | "minimal";

interface BotConfig {
  // Tab 1: Identity
  widgetId: string;
  assistantId: string;
  avatarUrl: string;
  displayName: string;
  greeting: string;
  quickReplies: string; // comma-separated
  description: string;
  messagePlaceholder: string;
  footer: string;
  // Tab 2: Appearance
  primaryColor: string;
  fontFamily: FontFamily;
  themeMode: ThemeMode;
  headerStyle: HeaderStyle;
  cornerRadius: CornerRadius;
  customCss: string;
  // Tab 3: Deploy
  deployedUrl: string;
  chatInterface: ChatInterface;
  chatLauncher: ChatLauncher;
  useAvatarForButton: boolean;
  buttonImageUrl: string;
  proactiveMessage: string;
  // Tab 4: Features
  messageFeedback: boolean;
  allowFileUpload: boolean;
  notificationSound: boolean;
  conversationHistory: boolean;
  historyReset: HistoryReset;
}

const DEFAULT_CONFIG: BotConfig = {
  widgetId: "",
  assistantId: "",
  avatarUrl: "",
  displayName: "",
  greeting: "Hello! How can I help you today?",
  quickReplies: "",
  description: "",
  messagePlaceholder: "Type your message...",
  footer: "",
  primaryColor: "#2563eb",
  fontFamily: "Inter",
  themeMode: "light",
  headerStyle: "solid",
  cornerRadius: "round",
  customCss: "",
  deployedUrl: "https://vapi-chatbot.vercel.app",
  chatInterface: "floating-widget",
  chatLauncher: "bubble",
  useAvatarForButton: false,
  buttonImageUrl: "",
  proactiveMessage: "",
  messageFeedback: false,
  allowFileUpload: false,
  notificationSound: false,
  conversationHistory: true,
  historyReset: "never",
};

// ─── Primitive UI pieces ───────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {children}
      </label>
      {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
    />
  );
}

function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
    >
      {children}
    </select>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400">
      {children}
    </h2>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 last:mb-0">{children}</div>;
}

// Image URL input with live circular preview
function AvatarInput({
  label,
  hint,
  value,
  onChange,
  placeholder = "https://example.com/image.png",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const isUrl = value.startsWith("http");
  return (
    <FieldRow>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          {isUrl ? (
            <img
              src={value}
              alt="preview"
              className="h-10 w-10 rounded-full border border-gray-200 object-cover shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.visibility = "hidden";
              }}
              onLoad={(e) => {
                (e.target as HTMLImageElement).style.visibility = "visible";
              }}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50">
              <span className="text-base text-gray-300">?</span>
            </div>
          )}
        </div>
        <Input
          type="url"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </FieldRow>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-4 last:border-0 last:pb-0">
      <div className="flex-1 pr-6">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-gray-400">{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all duration-150 ${
            value === opt.value
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Tab 1: Bot Identity ───────────────────────────────────────────────────────

function TabIdentity({
  config,
  set,
}: {
  config: BotConfig;
  set: <K extends keyof BotConfig>(k: K, v: BotConfig[K]) => void;
}) {
  return (
    <div className="grid gap-5">
      {/* Core config (feeds into clients.ts) */}
      <Card>
        <CardTitle>Bot Configuration</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow>
            <FieldLabel hint='Lowercase slug, e.g. "miami-dental". Used as the widget ID.'>
              Widget ID
            </FieldLabel>
            <Input
              placeholder="miami-dental"
              value={config.widgetId}
              onChange={(e) =>
                set(
                  "widgetId",
                  e.target.value.toLowerCase().replace(/\s+/g, "-")
                )
              }
            />
          </FieldRow>
          <FieldRow>
            <FieldLabel hint="From your Vapi dashboard.">
              Vapi Assistant ID
            </FieldLabel>
            <Input
              placeholder="f5381cfd-af11-44d5-9bf3-5d1d87c7b121"
              value={config.assistantId}
              onChange={(e) => set("assistantId", e.target.value)}
              className="font-mono"
            />
          </FieldRow>
        </div>
        <FieldRow>
          <FieldLabel hint="The opening message the bot sends when the chat is opened.">
            Greeting Message
          </FieldLabel>
          <Input
            placeholder="Hello! Welcome to Miami Dental. How can I help you today?"
            value={config.greeting}
            onChange={(e) => set("greeting", e.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel hint="Comma-separated. Leave blank for none. e.g. Book appointment, Office hours">
            Quick Reply Buttons
          </FieldLabel>
          <Input
            placeholder="Book appointment, Office hours, Insurance"
            value={config.quickReplies}
            onChange={(e) => set("quickReplies", e.target.value)}
          />
        </FieldRow>
      </Card>

      {/* Display / branding */}
      <Card>
        <CardTitle>Display &amp; Branding</CardTitle>
        <AvatarInput
          label="Bot Avatar"
          hint="Paste an image URL — the circular preview updates as you type."
          value={config.avatarUrl}
          onChange={(v) => set("avatarUrl", v)}
        />
        <FieldRow>
          <FieldLabel>Display Name</FieldLabel>
          <Input
            placeholder="Las Vegas Dental Assistant"
            value={config.displayName}
            onChange={(e) => set("displayName", e.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel hint="A brief purpose statement shown to users in the chat header.">
            Bot Description
          </FieldLabel>
          <Textarea
            rows={3}
            placeholder="I'm here to help answer questions about your dental care and appointments."
            value={config.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel hint="Placeholder text inside the chat input field.">
            Message Placeholder
          </FieldLabel>
          <Input
            placeholder="Type your message..."
            value={config.messagePlaceholder}
            onChange={(e) => set("messagePlaceholder", e.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel hint="Branding text or link shown at the bottom of the chat window.">
            Footer
          </FieldLabel>
          <Input
            placeholder="Powered by Acme Corp"
            value={config.footer}
            onChange={(e) => set("footer", e.target.value)}
          />
        </FieldRow>
      </Card>
    </div>
  );
}

// ─── Tab 2: Bot Appearance ─────────────────────────────────────────────────────

function TabAppearance({
  config,
  set,
}: {
  config: BotConfig;
  set: <K extends keyof BotConfig>(k: K, v: BotConfig[K]) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Branding */}
      <Card>
        <CardTitle>Branding</CardTitle>
        <FieldRow>
          <FieldLabel>Primary Color</FieldLabel>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.primaryColor}
              onChange={(e) => set("primaryColor", e.target.value)}
              className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-gray-200 p-0.5 shadow-sm"
            />
            <Input
              value={config.primaryColor}
              maxLength={7}
              placeholder="#2563eb"
              className="font-mono"
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) set("primaryColor", v);
              }}
            />
          </div>
          <div
            className="mt-2 h-8 w-full rounded-lg transition-all duration-300"
            style={{ backgroundColor: config.primaryColor }}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel>Font Family</FieldLabel>
          <Select
            value={config.fontFamily}
            onChange={(e) => set("fontFamily", e.target.value as FontFamily)}
          >
            <option value="system">System Default</option>
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
          </Select>
        </FieldRow>
      </Card>

      {/* Layout */}
      <Card>
        <CardTitle>Layout &amp; Style</CardTitle>
        <FieldRow>
          <FieldLabel>Theme Mode</FieldLabel>
          <SegmentControl<ThemeMode>
            value={config.themeMode}
            onChange={(v) => set("themeMode", v)}
            options={[
              { value: "light", label: "☀️  Light" },
              { value: "dark", label: "🌙  Dark" },
            ]}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel>Header Style</FieldLabel>
          <Select
            value={config.headerStyle}
            onChange={(e) => set("headerStyle", e.target.value as HeaderStyle)}
          >
            <option value="solid">Solid Color</option>
            <option value="gradient">Gradient</option>
            <option value="minimal">Minimal / Borderless</option>
          </Select>
        </FieldRow>
        <FieldRow>
          <FieldLabel>Corner Radius</FieldLabel>
          <SegmentControl<CornerRadius>
            value={config.cornerRadius}
            onChange={(v) => set("cornerRadius", v)}
            options={[
              { value: "sharp", label: "⬛  Sharp" },
              { value: "round", label: "⬜  Rounded" },
            ]}
          />
        </FieldRow>
      </Card>

      {/* Custom CSS */}
      <Card className="lg:col-span-2">
        <CardTitle>Custom CSS</CardTitle>
        <FieldRow>
          <FieldLabel hint="Advanced style overrides injected directly into the widget.">
            CSS Overrides
          </FieldLabel>
          <textarea
            rows={10}
            spellCheck={false}
            placeholder={
              "/* Override widget styles */\n.vm-b {\n  background: #f0f4ff;\n  border-radius: 16px;\n}"
            }
            value={config.customCss}
            onChange={(e) => set("customCss", e.target.value)}
            className="w-full resize-y rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 font-mono text-sm leading-relaxed text-green-400 placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </FieldRow>
      </Card>
    </div>
  );
}

// ─── Tab 3: Deploy Settings ────────────────────────────────────────────────────

function EmbedPreview({
  snippet,
}: {
  snippet: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative rounded-xl bg-gray-950 px-5 py-4">
      <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-green-400">
        {snippet}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
          copied
            ? "bg-green-500 text-white"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {copied ? "✓ Copied!" : "Copy"}
      </button>
    </div>
  );
}

function TabDeploy({
  config,
  set,
}: {
  config: BotConfig;
  set: <K extends keyof BotConfig>(k: K, v: BotConfig[K]) => void;
}) {
  const embedSnippet = `<script\n  src="${config.deployedUrl}/api/widget.js"\n  data-widget-id="${config.widgetId || "YOUR_CLIENT_ID"}"\n  defer\n></script>`;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Embed Code */}
      <Card className="lg:col-span-2">
        <CardTitle>Embed Code</CardTitle>
        <FieldRow>
          <FieldLabel hint="The base URL where this platform is deployed.">
            Deployed URL
          </FieldLabel>
          <Input
            placeholder="https://vapi-chatbot.vercel.app"
            value={config.deployedUrl}
            onChange={(e) =>
              set("deployedUrl", e.target.value.replace(/\/$/, ""))
            }
            className="font-mono"
          />
        </FieldRow>
        <p className="mb-3 text-sm text-gray-500">
          Paste this snippet before the closing{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700">
            &lt;/body&gt;
          </code>{" "}
          tag on your website. Fill in your Widget ID on the{" "}
          <strong>Bot Identity</strong> tab to populate it automatically.
        </p>
        <EmbedPreview snippet={embedSnippet} />
      </Card>

      {/* Interface */}
      <Card>
        <CardTitle>Chat Interface</CardTitle>
        <FieldRow>
          <FieldLabel hint="How the chat widget is presented on the page.">
            Interface Type
          </FieldLabel>
          <Select
            value={config.chatInterface}
            onChange={(e) =>
              set("chatInterface", e.target.value as ChatInterface)
            }
          >
            <option value="floating-widget">Floating Widget</option>
            <option value="embedded-iframe">Embedded iFrame</option>
          </Select>
        </FieldRow>
        <FieldRow>
          <FieldLabel hint="How the chat window is triggered.">
            Chat Launcher
          </FieldLabel>
          <Select
            value={config.chatLauncher}
            onChange={(e) =>
              set("chatLauncher", e.target.value as ChatLauncher)
            }
          >
            <option value="bubble">Bubble Button</option>
            <option value="text-bar">Text Bar</option>
          </Select>
        </FieldRow>
      </Card>

      {/* Launcher Button */}
      <Card>
        <CardTitle>Launcher Button</CardTitle>
        <FieldRow>
          <FieldLabel>Button Image</FieldLabel>
          <div className="mb-4 flex items-center gap-3">
            <Toggle
              checked={config.useAvatarForButton}
              onChange={(v) => set("useAvatarForButton", v)}
            />
            <span className="text-sm text-gray-600">Use bot avatar</span>
          </div>
          {!config.useAvatarForButton && (
            <AvatarInput
              label="Custom Button Image URL"
              value={config.buttonImageUrl}
              onChange={(v) => set("buttonImageUrl", v)}
            />
          )}
        </FieldRow>
      </Card>

      {/* Proactive Message */}
      <Card className="lg:col-span-2">
        <CardTitle>Proactive Message</CardTitle>
        <p className="mb-4 text-sm text-gray-500">
          A pop-up message shown above the launcher bubble to catch the
          visitor&apos;s attention before they open the chat.
        </p>
        <div className="flex items-end gap-8">
          <div className="flex-1">
            <FieldLabel>Message Text</FieldLabel>
            <Input
              placeholder="Hi! 👋 Need help?"
              value={config.proactiveMessage}
              onChange={(e) => set("proactiveMessage", e.target.value)}
            />
          </div>
          {/* Live preview */}
          <div className="shrink-0 pb-1">
            <p className="mb-2 text-center text-xs text-gray-400">Preview</p>
            <div className="flex flex-col items-center gap-2">
              {config.proactiveMessage ? (
                <div className="max-w-[180px] rounded-2xl rounded-br-sm border border-gray-200 bg-white px-3 py-2 text-center text-sm shadow-md">
                  {config.proactiveMessage}
                </div>
              ) : (
                <div className="max-w-[180px] rounded-2xl border border-dashed border-gray-200 px-3 py-2 text-center text-xs text-gray-400">
                  No message yet
                </div>
              )}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-xl text-white shadow-lg"
                style={{ backgroundColor: config.primaryColor }}
              >
                💬
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Tab 4: Features ───────────────────────────────────────────────────────────

function TabFeatures({
  config,
  set,
}: {
  config: BotConfig;
  set: <K extends keyof BotConfig>(k: K, v: BotConfig[K]) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardTitle>Engagement</CardTitle>
        <ToggleRow
          label="Message Feedback"
          description="Show thumbs up / thumbs down reactions on bot messages."
          checked={config.messageFeedback}
          onChange={(v) => set("messageFeedback", v)}
        />
        <ToggleRow
          label="Message Notification Sound"
          description="Play a subtle chime when a new message arrives."
          checked={config.notificationSound}
          onChange={(v) => set("notificationSound", v)}
        />
        <ToggleRow
          label="Allow File Upload"
          description="Let users attach and send files within the chat."
          checked={config.allowFileUpload}
          onChange={(v) => set("allowFileUpload", v)}
        />
      </Card>

      <Card>
        <CardTitle>History &amp; Sessions</CardTitle>
        <ToggleRow
          label="Conversation History"
          description="Allow users to resume their previous conversation session."
          checked={config.conversationHistory}
          onChange={(v) => set("conversationHistory", v)}
        />
        <FieldRow>
          <FieldLabel hint="Determines when locally-stored conversation history is cleared.">
            Chat History Reset
          </FieldLabel>
          <Select
            value={config.historyReset}
            onChange={(e) =>
              set("historyReset", e.target.value as HistoryReset)
            }
          >
            <option value="never">Never</option>
            <option value="on-close">On Window Close</option>
            <option value="24h">After 24 Hours</option>
          </Select>
        </FieldRow>
      </Card>
    </div>
  );
}

// ─── Publish modal ─────────────────────────────────────────────────────────────

function CodeBlock({
  label,
  subLabel,
  code,
}: {
  label: string;
  subLabel: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div>
      <p className="mb-0.5 text-sm font-semibold text-gray-900">{label}</p>
      <p className="mb-2 text-xs text-gray-500">{subLabel}</p>
      <div className="relative rounded-xl bg-gray-950 px-5 py-4">
        <pre className="overflow-x-auto pr-16 font-mono text-sm leading-relaxed text-green-400 whitespace-pre">
          {code}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
            copied
              ? "bg-green-500 text-white"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function PublishModal({
  config,
  onClose,
}: {
  config: BotConfig;
  onClose: () => void;
}) {
  const quickRepliesArr = config.quickReplies
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  // Serialize a value as a TypeScript literal
  function tsVal(v: string | boolean | string[]): string {
    if (Array.isArray(v)) {
      if (v.length === 0) return "[]";
      return `[\n      ${v.map((r) => `"${r}"`).join(",\n      ")},\n    ]`;
    }
    if (typeof v === "boolean") return String(v);
    return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }

  // Ordered list of [key, value] — required fields always present,
  // optional fields only included when they differ from defaults.
  type Field = [string, string | boolean | string[]];
  const fields: Field[] = [
    ["assistantId",  config.assistantId],
    ["businessName", config.displayName],
    ["greeting",     config.greeting],
    ["quickReplies", quickRepliesArr],
    ["primaryColor", config.primaryColor],
  ];

  // Extended identity
  if (config.avatarUrl)        fields.push(["avatarUrl",          config.avatarUrl]);
  if (config.description)      fields.push(["description",        config.description]);
  if (config.messagePlaceholder && config.messagePlaceholder !== "Type your message...")
                               fields.push(["messagePlaceholder", config.messagePlaceholder]);
  if (config.footer)           fields.push(["footer",             config.footer]);

  // Appearance — only non-defaults
  if (config.fontFamily !== "Inter")       fields.push(["fontFamily",   config.fontFamily]);
  if (config.themeMode  !== "light")       fields.push(["themeMode",    config.themeMode]);
  if (config.headerStyle !== "solid")      fields.push(["headerStyle",  config.headerStyle]);
  if (config.cornerRadius !== "round")     fields.push(["cornerRadius", config.cornerRadius]);
  if (config.customCss)                    fields.push(["customCss",    config.customCss]);

  // Deploy — only non-defaults
  if (config.chatInterface !== "floating-widget") fields.push(["chatInterface",      config.chatInterface]);
  if (config.chatLauncher  !== "bubble")          fields.push(["chatLauncher",       config.chatLauncher]);
  if (config.useAvatarForButton)                  fields.push(["useAvatarForButton", config.useAvatarForButton]);
  if (config.buttonImageUrl)                      fields.push(["buttonImageUrl",     config.buttonImageUrl]);
  if (config.proactiveMessage)                    fields.push(["proactiveMessage",   config.proactiveMessage]);

  // Features — only non-defaults (defaults are all false / "never")
  if (config.messageFeedback)               fields.push(["messageFeedback",    config.messageFeedback]);
  if (config.allowFileUpload)               fields.push(["allowFileUpload",    config.allowFileUpload]);
  if (config.notificationSound)             fields.push(["notificationSound",  config.notificationSound]);
  if (!config.conversationHistory)          fields.push(["conversationHistory",config.conversationHistory]);
  if (config.historyReset !== "never")      fields.push(["historyReset",       config.historyReset]);

  const embedSnippet =
    `<script\n  src="${config.deployedUrl}/api/widget.js"\n` +
    `  data-widget-id="${config.widgetId}"\n  defer\n></script>`;

  const clientsEntry =
    `"${config.widgetId}": {\n` +
    fields.map(([k, v]) => `  ${k}: ${tsVal(v)},`).join("\n") +
    "\n},";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Ready to deploy 🚀
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Complete these two steps to go live with{" "}
              <span className="font-medium text-gray-700">
                {config.widgetId}
              </span>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-6">
          <CodeBlock
            label="1. Embed snippet — give this to the client"
            subLabel="Paste before </body> in their HTML (WordPress, Squarespace, Webflow, etc.)"
            code={embedSnippet}
          />
          <CodeBlock
            label="2. clients.ts entry — paste into GitHub"
            subLabel="Add this block inside const clients = { … } in src/lib/clients.ts, then redeploy"
            code={clientsEntry}
          />
        </div>

        {/* Modal footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab navigation ────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "identity", label: "Bot Identity", icon: "🤖" },
  { id: "appearance", label: "Bot Appearance", icon: "🎨" },
  { id: "deploy", label: "Deploy Settings", icon: "🚀" },
  { id: "features", label: "Features", icon: "⚡" },
];

// ─── Root component ────────────────────────────────────────────────────────────

export default function BotBuilder() {
  const [activeTab, setActiveTab] = useState<Tab>("identity");
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [showModal, setShowModal] = useState(false);

  const set = useCallback(<K extends keyof BotConfig>(k: K, v: BotConfig[K]) => {
    setConfig((prev) => ({ ...prev, [k]: v }));
  }, []);

  const canPublish = config.widgetId.trim() && config.assistantId.trim();

  const handlePublish = () => {
    if (!canPublish) {
      setActiveTab("identity");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/80">
      {showModal && (
        <PublishModal config={config} onClose={() => setShowModal(false)} />
      )}
      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-lg shadow-sm">
              🤖
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900">
                Bot Builder
              </h1>
              <p className="text-xs text-gray-400">
                Configure and deploy your AI chatbot
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePublish}
            title={
              !canPublish
                ? "Fill in Widget ID and Assistant ID on the Bot Identity tab first"
                : undefined
            }
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-95 ${
              canPublish
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-md"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Publish Changes
          </button>
        </div>
      </header>

      {/* ── Sticky tab bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-[65px] z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-5xl px-6">
          <nav className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors duration-150 ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <span className="hidden sm:inline">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-blue-600" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        {activeTab === "identity" && (
          <TabIdentity config={config} set={set} />
        )}
        {activeTab === "appearance" && (
          <TabAppearance config={config} set={set} />
        )}
        {activeTab === "deploy" && <TabDeploy config={config} set={set} />}
        {activeTab === "features" && (
          <TabFeatures config={config} set={set} />
        )}
      </main>
    </div>
  );
}

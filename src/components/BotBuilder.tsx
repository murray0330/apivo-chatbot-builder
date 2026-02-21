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
type IconKey = "" | "chat" | "message" | "headset" | "bot" | "spark" | "zap" | "heart" | "star" | "globe" | "shield" | "smile" | "user";

interface BotConfig {
  widgetId: string;
  assistantId: string;
  avatarUrl: string;
  displayName: string;
  greeting: string;
  quickReplies: string;
  description: string;
  messagePlaceholder: string;
  footer: string;
  primaryColor: string;
  fontFamily: FontFamily;
  themeMode: ThemeMode;
  headerStyle: HeaderStyle;
  cornerRadius: CornerRadius;
  launcherIcon: IconKey;
  headerIcon: IconKey;
  botBubbleIcon: IconKey;
  userBubbleIcon: IconKey;
  customCss: string;
  deployedUrl: string;
  chatInterface: ChatInterface;
  chatLauncher: ChatLauncher;
  useAvatarForButton: boolean;
  buttonImageUrl: string;
  proactiveMessage: string;
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
  launcherIcon: "",
  headerIcon: "",
  botBubbleIcon: "",
  userBubbleIcon: "",
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

type Setter = <K extends keyof BotConfig>(k: K, v: BotConfig[K]) => void;

// ─── Primitives ────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[26px] w-[48px] shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        checked ? "bg-blue-600 focus-visible:ring-blue-600" : "bg-gray-200 focus-visible:ring-gray-400"
      }`}
    >
      <span className={`pointer-events-none inline-block h-[22px] w-[22px] rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${checked ? "translate-x-[24px]" : "translate-x-[2px]"}`} />
    </button>
  );
}

function Label({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-2">
      <p className="text-[13px] font-semibold text-gray-800">{children}</p>
      {sub && <p className="mt-0.5 text-[11px] leading-snug text-gray-400">{sub}</p>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`h-10 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 text-[13px] text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${className}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-[13px] text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${className}`}
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 text-[13px] text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
    >
      {children}
    </select>
  );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200/60 bg-white p-5 ${className}`}>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">{title}</p>
      {children}
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 last:mb-0">{children}</div>;
}

function Segment<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-xl border border-gray-200 bg-gray-50/50 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-all duration-150 ${
            value === o.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function AvatarField({ label, sub, value, onChange }: { label: string; sub?: string; value: string; onChange: (v: string) => void }) {
  const isUrl = value.startsWith("http");
  return (
    <Field>
      <Label sub={sub}>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          {isUrl ? (
            <img
              src={value}
              alt=""
              className="h-9 w-9 rounded-full border border-gray-200 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }}
              onLoad={(e) => { (e.target as HTMLImageElement).style.visibility = "visible"; }}
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-300">?</div>
          )}
        </div>
        <Input type="url" placeholder="https://example.com/avatar.png" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

// ─── Icon library ───────────────────────────────────────────────────────────

const ICON_OPTIONS: { key: IconKey; label: string; paths: string }[] = [
  { key: "", label: "None", paths: "" },
  { key: "chat", label: "Chat Bubble", paths: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { key: "message", label: "Message", paths: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>' },
  { key: "headset", label: "Headset", paths: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>' },
  { key: "bot", label: "Robot", paths: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>' },
  { key: "spark", label: "Sparkle", paths: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>' },
  { key: "zap", label: "Lightning", paths: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>' },
  { key: "heart", label: "Heart", paths: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>' },
  { key: "star", label: "Star", paths: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>' },
  { key: "globe", label: "Globe", paths: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>' },
  { key: "shield", label: "Shield", paths: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>' },
  { key: "smile", label: "Smiley", paths: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>' },
  { key: "user", label: "Person", paths: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
];

function getIconPaths(key: IconKey): string {
  return ICON_OPTIONS.find((i) => i.key === key)?.paths || "";
}

function SvgIcon({ paths, size = 20, className = "" }: { paths: string; size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

function IconPicker({ value, onChange, label, sub }: { value: IconKey; onChange: (v: IconKey) => void; label: string; sub?: string }) {
  return (
    <Field>
      <Label sub={sub}>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {ICON_OPTIONS.map((icon) => (
          <button
            key={icon.key}
            type="button"
            onClick={() => onChange(icon.key)}
            title={icon.label}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all duration-150 ${
              value === icon.key
                ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm scale-110"
                : "border-gray-200 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {icon.paths ? (
              <SvgIcon paths={icon.paths} size={16} />
            ) : (
              <span className="text-[11px] font-medium text-gray-400">&#x2015;</span>
            )}
          </button>
        ))}
      </div>
    </Field>
  );
}

function ToggleRow({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0 last:pb-0 first:pt-0">
      <div className="pr-4">
        <p className="text-[13px] font-semibold text-gray-800">{label}</p>
        {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Live preview ──────────────────────────────────────────────────────────────

function LivePreview({ config }: { config: BotConfig }) {
  const c = config;
  const isDark = c.themeMode === "dark";
  const rad = c.cornerRadius === "round" ? "16px" : "6px";
  const bubbleRad = c.cornerRadius === "round" ? "16px" : "6px";
  const quickReplies = c.quickReplies.split(",").map((s) => s.trim()).filter(Boolean);

  const headerBg = c.headerStyle === "gradient"
    ? `linear-gradient(135deg, ${c.primaryColor}, ${c.primaryColor}dd)`
    : c.headerStyle === "minimal"
    ? isDark ? "#1e1e1e" : "#ffffff"
    : c.primaryColor;
  const headerColor = c.headerStyle === "minimal" ? (isDark ? "#fff" : "#111") : "#fff";
  const headerBorder = c.headerStyle === "minimal" ? (isDark ? "1px solid #333" : "1px solid #e5e5e5") : "none";

  const panelBg = isDark ? "#1a1a1a" : "#ffffff";
  const panelText = isDark ? "#e5e5e5" : "#1e293b";
  const botBubbleBg = isDark ? "#2a2a2a" : "#f1f5f9";
  const inputBg = isDark ? "#2a2a2a" : "#f8fafc";
  const inputBorder = isDark ? "#333" : "#e2e8f0";
  const footerColor = isDark ? "#666" : "#94a3b8";

  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">Live Preview</p>
      {/* Simulated page background */}
      <div className="relative w-[320px] rounded-2xl border border-gray-200 bg-gray-100 p-4 shadow-inner" style={{ minHeight: 480 }}>
        {/* Fake page content lines */}
        <div className="mb-2 h-3 w-24 rounded bg-gray-300/50" />
        <div className="mb-1.5 h-2 w-full rounded bg-gray-200/70" />
        <div className="mb-1.5 h-2 w-3/4 rounded bg-gray-200/70" />
        <div className="mb-1.5 h-2 w-5/6 rounded bg-gray-200/70" />
        <div className="mb-4 h-2 w-2/3 rounded bg-gray-200/70" />
        <div className="mb-1.5 h-2 w-full rounded bg-gray-200/70" />
        <div className="mb-1.5 h-2 w-4/5 rounded bg-gray-200/70" />

        {/* Widget mockup */}
        <div
          className="absolute bottom-14 right-4 left-4 flex flex-col overflow-hidden shadow-2xl transition-all duration-300"
          style={{ borderRadius: rad, background: panelBg, color: panelText }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2.5 px-4 py-3"
            style={{ background: headerBg, color: headerColor, borderBottom: headerBorder }}
          >
            {c.avatarUrl.startsWith("http") ? (
              <img src={c.avatarUrl} alt="" className="h-7 w-7 rounded-full border border-white/20 object-cover" />
            ) : c.headerIcon ? (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
                <SvgIcon paths={getIconPaths(c.headerIcon)} size={15} />
              </div>
            ) : null}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold truncate">{c.displayName || "Chat"}</p>
              {c.description && <p className="text-[10px] opacity-70 truncate">{c.description}</p>}
            </div>
            <span className="text-base opacity-60 cursor-default">×</span>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-2.5 px-3 py-3" style={{ fontSize: 12, lineHeight: 1.5 }}>
            {/* Bot greeting */}
            <div className="flex items-end gap-2">
              {c.avatarUrl.startsWith("http") ? (
                <img src={c.avatarUrl} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
              ) : c.botBubbleIcon ? (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: c.primaryColor + "25" }}>
                  <SvgIcon paths={getIconPaths(c.botBubbleIcon)} size={11} className={isDark ? "text-gray-300" : "text-gray-500"} />
                </div>
              ) : (
                <div className="h-5 w-5 shrink-0 rounded-full" style={{ background: c.primaryColor, opacity: 0.2 }} />
              )}
              <div
                className="max-w-[80%] px-3 py-2 transition-all duration-200"
                style={{ background: botBubbleBg, borderRadius: `${bubbleRad} ${bubbleRad} ${bubbleRad} 4px` }}
              >
                {c.greeting || "Hello!"}
              </div>
            </div>
            {/* User message */}
            <div className="flex items-end justify-end gap-2">
              <div
                className="max-w-[80%] px-3 py-2 text-white transition-all duration-200"
                style={{ background: c.primaryColor, borderRadius: `${bubbleRad} ${bubbleRad} 4px ${bubbleRad}` }}
              >
                Tell me more
              </div>
              {c.userBubbleIcon && (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: c.primaryColor + "25" }}>
                  <SvgIcon paths={getIconPaths(c.userBubbleIcon)} size={11} className={isDark ? "text-gray-300" : "text-gray-500"} />
                </div>
              )}
            </div>
            {/* Bot response */}
            <div className="flex items-end gap-2">
              {c.avatarUrl.startsWith("http") ? (
                <img src={c.avatarUrl} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
              ) : c.botBubbleIcon ? (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: c.primaryColor + "25" }}>
                  <SvgIcon paths={getIconPaths(c.botBubbleIcon)} size={11} className={isDark ? "text-gray-300" : "text-gray-500"} />
                </div>
              ) : (
                <div className="h-5 w-5 shrink-0 rounded-full" style={{ background: c.primaryColor, opacity: 0.2 }} />
              )}
              <div
                className="max-w-[80%] px-3 py-2 transition-all duration-200"
                style={{ background: botBubbleBg, borderRadius: `${bubbleRad} ${bubbleRad} ${bubbleRad} 4px` }}
              >
                I&apos;d be happy to help! What would you like to know?
                {c.messageFeedback && (
                  <div className="mt-1.5 flex gap-2 text-[10px] opacity-50">
                    <span className="cursor-default">👍</span>
                    <span className="cursor-default">👎</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick replies */}
          {quickReplies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {quickReplies.map((r) => (
                <span
                  key={r}
                  className="inline-block cursor-default rounded-full px-2.5 py-1 text-[10px] font-medium transition-all"
                  style={{ background: isDark ? "#333" : "#f1f5f9", color: isDark ? "#ccc" : "#475569" }}
                >
                  {r}
                </span>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t px-3 py-2.5" style={{ borderColor: inputBorder }}>
            <div
              className="h-8 flex-1 rounded-lg px-2.5 flex items-center text-[11px]"
              style={{ background: inputBg, color: footerColor }}
            >
              {c.messagePlaceholder || "Type a message..."}
            </div>
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] text-white font-bold"
              style={{ background: c.primaryColor }}
            >
              ▶
            </div>
          </div>

          {/* Footer */}
          {c.footer && (
            <div className="border-t px-3 py-1.5 text-center text-[9px]" style={{ borderColor: inputBorder, color: footerColor }}>
              {c.footer}
            </div>
          )}
        </div>

        {/* Floating bubble */}
        <div
          className="absolute bottom-3 right-4 flex h-11 w-11 items-center justify-center rounded-full text-lg text-white shadow-lg transition-all duration-300"
          style={{ background: c.primaryColor }}
        >
          {c.launcherIcon ? (
            <SvgIcon paths={getIconPaths(c.launcherIcon)} size={22} />
          ) : (
            <span>💬</span>
          )}
        </div>

        {/* Proactive message */}
        {c.proactiveMessage && (
          <div
            className="absolute bottom-16 right-4 max-w-[180px] rounded-2xl rounded-br-sm border border-gray-200 bg-white px-3 py-2 text-center text-[11px] shadow-lg"
          >
            {c.proactiveMessage}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────

function TabIdentity({ config: c, set }: { config: BotConfig; set: Setter }) {
  return (
    <div className="space-y-4">
      <Section title="Configuration">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <Label sub='Lowercase slug, e.g. "miami-dental"'>Widget ID</Label>
            <Input placeholder="miami-dental" value={c.widgetId} onChange={(e) => set("widgetId", e.target.value.toLowerCase().replace(/\s+/g, "-"))} />
          </Field>
          <Field>
            <Label sub="From your Vapi dashboard">Vapi Assistant ID</Label>
            <Input placeholder="f5381cfd-af11-44d5-..." value={c.assistantId} onChange={(e) => set("assistantId", e.target.value)} className="font-mono" />
          </Field>
        </div>
        <Field>
          <Label sub="Opening message when the chat is opened">Greeting</Label>
          <Input placeholder="Hello! Welcome to..." value={c.greeting} onChange={(e) => set("greeting", e.target.value)} />
        </Field>
        <Field>
          <Label sub="Comma-separated. e.g. Book appointment, Office hours">Quick Replies</Label>
          <Input placeholder="Book appointment, Office hours, Insurance" value={c.quickReplies} onChange={(e) => set("quickReplies", e.target.value)} />
        </Field>
      </Section>
      <Section title="Branding">
        <AvatarField label="Bot Avatar" sub="Circular preview updates live" value={c.avatarUrl} onChange={(v) => set("avatarUrl", v)} />
        <Field>
          <Label>Display Name</Label>
          <Input placeholder="Las Vegas Dental Assistant" value={c.displayName} onChange={(e) => set("displayName", e.target.value)} />
        </Field>
        <Field>
          <Label sub="Brief purpose statement for the header">Description</Label>
          <Textarea rows={2} placeholder="I help with dental care questions..." value={c.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field>
          <Label>Message Placeholder</Label>
          <Input placeholder="Type your message..." value={c.messagePlaceholder} onChange={(e) => set("messagePlaceholder", e.target.value)} />
        </Field>
        <Field>
          <Label sub="Bottom branding text">Footer</Label>
          <Input placeholder="Powered by Acme Corp" value={c.footer} onChange={(e) => set("footer", e.target.value)} />
        </Field>
      </Section>
    </div>
  );
}

function TabAppearance({ config: c, set }: { config: BotConfig; set: Setter }) {
  return (
    <div className="space-y-4">
      <Section title="Color & Typography">
        <Field>
          <Label>Primary Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={c.primaryColor}
              onChange={(e) => set("primaryColor", e.target.value)}
              className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-gray-200 p-0.5"
            />
            <Input
              value={c.primaryColor}
              maxLength={7}
              placeholder="#2563eb"
              className="font-mono"
              onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) set("primaryColor", e.target.value); }}
            />
          </div>
        </Field>
        <Field>
          <Label>Font Family</Label>
          <Select value={c.fontFamily} onChange={(e) => set("fontFamily", e.target.value as FontFamily)}>
            <option value="system">System Default</option>
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
          </Select>
        </Field>
      </Section>
      <Section title="Layout">
        <Field>
          <Label>Theme</Label>
          <Segment<ThemeMode>
            value={c.themeMode}
            onChange={(v) => set("themeMode", v)}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          />
        </Field>
        <Field>
          <Label>Header Style</Label>
          <Select value={c.headerStyle} onChange={(e) => set("headerStyle", e.target.value as HeaderStyle)}>
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
            <option value="minimal">Minimal</option>
          </Select>
        </Field>
        <Field>
          <Label>Corner Radius</Label>
          <Segment<CornerRadius>
            value={c.cornerRadius}
            onChange={(v) => set("cornerRadius", v)}
            options={[{ value: "sharp", label: "Sharp" }, { value: "round", label: "Rounded" }]}
          />
        </Field>
      </Section>
      <Section title="Icons">
        <IconPicker label="Launcher Button" sub="Icon for the floating chat button" value={c.launcherIcon} onChange={(v) => set("launcherIcon", v)} />
        <IconPicker label="Header / Banner" sub="Icon in the chat header (when no avatar URL)" value={c.headerIcon} onChange={(v) => set("headerIcon", v)} />
        <IconPicker label="Bot Messages" sub="Small icon beside bot replies" value={c.botBubbleIcon} onChange={(v) => set("botBubbleIcon", v)} />
        <IconPicker label="User Messages" sub="Small icon beside your messages" value={c.userBubbleIcon} onChange={(v) => set("userBubbleIcon", v)} />
      </Section>
      <Section title="Custom CSS">
        <Field>
          <Label sub="Advanced overrides injected into the widget">CSS</Label>
          <textarea
            rows={8}
            spellCheck={false}
            placeholder={"/* widget overrides */\n.vm-b {\n  background: #f0f4ff;\n}"}
            value={c.customCss}
            onChange={(e) => set("customCss", e.target.value)}
            className="w-full resize-y rounded-xl border border-gray-700 bg-[#0d1117] px-4 py-3 font-mono text-[12px] leading-relaxed text-emerald-400 placeholder:text-gray-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </Field>
      </Section>
    </div>
  );
}

function TabDeploy({ config: c, set }: { config: BotConfig; set: Setter }) {
  const [copied, setCopied] = useState<"embed" | null>(null);
  const embedSnippet = `<script\n  src="${c.deployedUrl}/api/widget.js"\n  data-widget-id="${c.widgetId || "YOUR_CLIENT_ID"}"\n  defer\n></script>`;

  return (
    <div className="space-y-4">
      <Section title="Embed Code">
        <Field>
          <Label sub="Base URL of this platform">Deployed URL</Label>
          <Input placeholder="https://vapi-chatbot.vercel.app" value={c.deployedUrl} onChange={(e) => set("deployedUrl", e.target.value.replace(/\/$/, ""))} className="font-mono" />
        </Field>
        <div className="relative rounded-xl bg-[#0d1117] px-5 py-4">
          <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-emerald-400">{embedSnippet}</pre>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(embedSnippet);
              setCopied("embed");
              setTimeout(() => setCopied(null), 2000);
            }}
            className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${copied === "embed" ? "bg-emerald-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
          >
            {copied === "embed" ? "Copied!" : "Copy"}
          </button>
        </div>
      </Section>
      <Section title="Widget Settings">
        <Field>
          <Label sub="How the widget appears on the page">Interface</Label>
          <Select value={c.chatInterface} onChange={(e) => set("chatInterface", e.target.value as ChatInterface)}>
            <option value="floating-widget">Floating Widget</option>
            <option value="embedded-iframe">Embedded iFrame</option>
          </Select>
        </Field>
        <Field>
          <Label sub="How the chat is triggered">Launcher</Label>
          <Select value={c.chatLauncher} onChange={(e) => set("chatLauncher", e.target.value as ChatLauncher)}>
            <option value="bubble">Bubble</option>
            <option value="text-bar">Text Bar</option>
          </Select>
        </Field>
        <Field>
          <Label>Button Image</Label>
          <div className="flex items-center gap-3 mb-3">
            <Toggle checked={c.useAvatarForButton} onChange={(v) => set("useAvatarForButton", v)} />
            <span className="text-[12px] text-gray-500">Use bot avatar</span>
          </div>
          {!c.useAvatarForButton && (
            <AvatarField label="Custom Image" value={c.buttonImageUrl} onChange={(v) => set("buttonImageUrl", v)} />
          )}
        </Field>
        <Field>
          <Label sub="Pop-up above the launcher bubble">Proactive Message</Label>
          <Input placeholder="Hi! Need help?" value={c.proactiveMessage} onChange={(e) => set("proactiveMessage", e.target.value)} />
        </Field>
      </Section>
    </div>
  );
}

function TabFeatures({ config: c, set }: { config: BotConfig; set: Setter }) {
  return (
    <div className="space-y-4">
      <Section title="Engagement">
        <ToggleRow label="Message Feedback" sub="Thumbs up / down on bot messages" checked={c.messageFeedback} onChange={(v) => set("messageFeedback", v)} />
        <ToggleRow label="Notification Sound" sub="Chime on new messages" checked={c.notificationSound} onChange={(v) => set("notificationSound", v)} />
        <ToggleRow label="File Upload" sub="Allow file attachments" checked={c.allowFileUpload} onChange={(v) => set("allowFileUpload", v)} />
      </Section>
      <Section title="Sessions">
        <ToggleRow label="Conversation History" sub="Resume previous sessions" checked={c.conversationHistory} onChange={(v) => set("conversationHistory", v)} />
        <Field>
          <Label sub="When to clear stored history">History Reset</Label>
          <Select value={c.historyReset} onChange={(e) => set("historyReset", e.target.value as HistoryReset)}>
            <option value="never">Never</option>
            <option value="on-close">On Close</option>
            <option value="24h">After 24h</option>
          </Select>
        </Field>
      </Section>
    </div>
  );
}

// ─── Publish modal ─────────────────────────────────────────────────────────────

function CopyBlock({ label, sub, code }: { label: string; sub: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p className="mb-0.5 text-[13px] font-bold text-gray-900">{label}</p>
      <p className="mb-2 text-[11px] text-gray-500">{sub}</p>
      <div className="relative rounded-xl bg-[#0d1117] px-5 py-4">
        <pre className="overflow-x-auto pr-16 font-mono text-[12px] leading-relaxed text-emerald-400 whitespace-pre">{code}</pre>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${copied ? "bg-emerald-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function PublishModal({ config: c, onClose }: { config: BotConfig; onClose: () => void }) {
  const qr = c.quickReplies.split(",").map((s) => s.trim()).filter(Boolean);

  function tsVal(v: string | boolean | string[]): string {
    if (Array.isArray(v)) {
      if (v.length === 0) return "[]";
      return `[\n      ${v.map((r) => `"${r}"`).join(",\n      ")},\n    ]`;
    }
    if (typeof v === "boolean") return String(v);
    return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }

  type F = [string, string | boolean | string[]];
  const fields: F[] = [
    ["assistantId", c.assistantId], ["businessName", c.displayName], ["greeting", c.greeting],
    ["quickReplies", qr], ["primaryColor", c.primaryColor],
  ];
  if (c.avatarUrl) fields.push(["avatarUrl", c.avatarUrl]);
  if (c.description) fields.push(["description", c.description]);
  if (c.messagePlaceholder && c.messagePlaceholder !== "Type your message...") fields.push(["messagePlaceholder", c.messagePlaceholder]);
  if (c.footer) fields.push(["footer", c.footer]);
  if (c.fontFamily !== "Inter") fields.push(["fontFamily", c.fontFamily]);
  if (c.themeMode !== "light") fields.push(["themeMode", c.themeMode]);
  if (c.headerStyle !== "solid") fields.push(["headerStyle", c.headerStyle]);
  if (c.cornerRadius !== "round") fields.push(["cornerRadius", c.cornerRadius]);
  if (c.launcherIcon) fields.push(["launcherIcon", c.launcherIcon]);
  if (c.headerIcon) fields.push(["headerIcon", c.headerIcon]);
  if (c.botBubbleIcon) fields.push(["botBubbleIcon", c.botBubbleIcon]);
  if (c.userBubbleIcon) fields.push(["userBubbleIcon", c.userBubbleIcon]);
  if (c.customCss) fields.push(["customCss", c.customCss]);
  if (c.chatInterface !== "floating-widget") fields.push(["chatInterface", c.chatInterface]);
  if (c.chatLauncher !== "bubble") fields.push(["chatLauncher", c.chatLauncher]);
  if (c.useAvatarForButton) fields.push(["useAvatarForButton", c.useAvatarForButton]);
  if (c.buttonImageUrl) fields.push(["buttonImageUrl", c.buttonImageUrl]);
  if (c.proactiveMessage) fields.push(["proactiveMessage", c.proactiveMessage]);
  if (c.messageFeedback) fields.push(["messageFeedback", true]);
  if (c.allowFileUpload) fields.push(["allowFileUpload", true]);
  if (c.notificationSound) fields.push(["notificationSound", true]);
  if (!c.conversationHistory) fields.push(["conversationHistory", false]);
  if (c.historyReset !== "never") fields.push(["historyReset", c.historyReset]);

  const embed = `<script\n  src="${c.deployedUrl}/api/widget.js"\n  data-widget-id="${c.widgetId}"\n  defer\n></script>`;
  const entry = `"${c.widgetId}": {\n` + fields.map(([k, v]) => `  ${k}: ${tsVal(v)},`).join("\n") + "\n},";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Ready to deploy</h2>
            <p className="mt-0.5 text-[12px] text-gray-500">Two steps to go live with <span className="font-semibold text-gray-700">{c.widgetId}</span></p>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">✕</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-6">
          <CopyBlock label="1. Embed snippet" sub="Paste before </body> in their HTML" code={embed} />
          <CopyBlock label="2. clients.ts entry" sub="Add inside const clients = { … } in src/lib/clients.ts, then redeploy" code={entry} />
        </div>
        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl bg-gray-900 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-gray-800">Done</button>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "identity", label: "Identity" },
  { id: "appearance", label: "Appearance" },
  { id: "deploy", label: "Deploy" },
  { id: "features", label: "Features" },
];

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function BotBuilder() {
  const [tab, setTab] = useState<Tab>("identity");
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [showModal, setShowModal] = useState(false);

  const set: Setter = useCallback(<K extends keyof BotConfig>(k: K, v: BotConfig[K]) => {
    setConfig((prev) => ({ ...prev, [k]: v }));
  }, []);

  const canPublish = !!(config.widgetId.trim() && config.assistantId.trim());

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {showModal && <PublishModal config={config} onClose={() => setShowModal(false)} />}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M10 15h.01" /><path d="M14 15h.01" />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-gray-900">Bot Builder</span>
          </div>
          <button
            type="button"
            onClick={() => canPublish ? setShowModal(true) : setTab("identity")}
            className={`rounded-xl px-5 py-2 text-[13px] font-semibold transition-all duration-200 active:scale-[0.97] ${
              canPublish
                ? "bg-gray-900 text-white shadow-sm hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Publish Changes
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-6 px-6 py-6">
        {/* Left: config panel */}
        <div className="flex-1 min-w-0 max-w-[640px]">
          {/* Tab nav */}
          <div className="mb-6 flex rounded-2xl border border-gray-200/60 bg-white p-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-xl py-2.5 text-[12px] font-bold tracking-wide transition-all duration-150 ${
                  tab === t.id
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="pb-12">
            {tab === "identity" && <TabIdentity config={config} set={set} />}
            {tab === "appearance" && <TabAppearance config={config} set={set} />}
            {tab === "deploy" && <TabDeploy config={config} set={set} />}
            {tab === "features" && <TabFeatures config={config} set={set} />}
          </div>
        </div>

        {/* Right: live preview */}
        <div className="hidden lg:block sticky top-[72px] self-start pt-12">
          <LivePreview config={config} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

interface Config {
  businessName?: string;
  primaryColor?: string;
  fontFamily?: string;
  greeting?: string;
  quickReplies?: string[];
  messagePlaceholder?: string;
  avatarUrl?: string;
  headerIcon?: string;
  description?: string;
  footer?: string;
  themeMode?: string;
  headerStyle?: string;
  glassEffect?: boolean;
}

interface Message {
  role: "bot" | "user";
  text: string;
}

const ICONS: Record<string, string> = {
  chat:    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  message: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z',
  headset: 'M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z',
  bot:     'M12 8V4H8 M4 8h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z M2 14h2 M20 14h2 M15 13v2 M9 13v2',
  spark:   'm12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z M5 3v4 M19 17v4 M3 5h4 M17 19h4',
  smile:   'M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01',
  user:    'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
};

function IconSvg({ icon, size = 20, color = "currentColor" }: { icon: string; size?: number; color?: string }) {
  const d = ICONS[icon];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      {d.split(" M").map((part, i) => (
        <path key={i} d={i === 0 ? part : "M" + part} />
      ))}
    </svg>
  );
}

function getSuggestions(text: string, lastUserMsg: string): string[] | null {
  const t = text.toLowerCase();
  if ((t.includes("book") || t.includes("schedule")) && t.includes("reschedule") && t.includes("cancel"))
    return ["Book Appointment", "Reschedule", "Cancel"];
  if (t.includes("treatment") && (t.includes("interested") || t.includes("looking for")))
    return ["Cleaning", "Consultation", "Other"];
  if (t.includes("last") && (t.includes("cleaning") || t.includes("dental")))
    return ["Less than 6 months", "6-12 months ago", "Over a year ago", "Not sure"];
  if (t.includes("shall i book") || t.includes("want me to book") || t.includes("shall i go ahead"))
    return ["Yes, book it!", "Pick a different time"];
  if (t.includes("available") && (t.includes("book") || t.includes("shall")))
    return ["Yes, book it!", "Pick a different time"];
  if (t.includes("sure you want to cancel"))
    return ["Yes, cancel it", "No, keep it"];
  if ((t.includes("anything else") || t.includes("help you with")) &&
      lastUserMsg !== "I have a question" && lastUserMsg !== "No, that's all. Thanks!")
    return ["No, that's all. Thanks!", "I have a question"];
  return null;
}

export default function ChatPage() {
  const params = useParams();
  const widgetId = params.widgetId as string;

  const [cfg, setCfg] = useState<Config | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatIdRef = useRef<string | null>(null);
  const lastUserMsgRef = useRef("");
  const msgsRef = useRef<HTMLDivElement>(null);

  const primary = cfg?.primaryColor || "#6366f1";
  const font = cfg?.fontFamily && cfg.fontFamily !== "system"
    ? `"${cfg.fontFamily}", system-ui, sans-serif`
    : "system-ui, sans-serif";

  useEffect(() => {
    fetch(`/api/config?widgetId=${widgetId}`)
      .then(r => r.json())
      .then((data: Config) => {
        setCfg(data);
        if (data.fontFamily && data.fontFamily !== "system") {
          const id = `gf-${data.fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
          if (!document.getElementById(id)) {
            const link = document.createElement("link");
            link.id = id; link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(data.fontFamily).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap`;
            document.head.appendChild(link);
          }
        }
        const greeting = data.greeting || "Hello! How can I help you today?";
        setMessages([{ role: "bot", text: greeting }]);
        if (data.quickReplies?.length) setQuickReplies(data.quickReplies);
      })
      .catch(() => setMessages([{ role: "bot", text: "Hello! How can I help you today?" }]));
  }, [widgetId]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, typing]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    lastUserMsgRef.current = msg;
    setInput("");
    setQuickReplies([]);
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setBusy(true);
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgetId, userMessage: msg, previousChatId: chatIdRef.current }),
      });
      const data = await res.json();
      setTyping(false);
      if (data.chatId) chatIdRef.current = data.chatId;
      const reply = data.reply || "Sorry, I didn't get a response.";
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
      const suggestions = getSuggestions(reply, lastUserMsgRef.current);
      if (suggestions) setQuickReplies(suggestions);
    } catch {
      setTyping(false);
      setMessages(prev => [...prev, { role: "bot", text: "I'm having trouble connecting. Please try again." }]);
    }
    setBusy(false);
  }

  const headerBg = cfg?.headerStyle === "gradient" && primary
    ? `linear-gradient(135deg, ${primary}, ${primary}cc)`
    : cfg?.headerStyle === "minimal" ? "#fff" : primary;
  const headerText = cfg?.headerStyle === "minimal" ? "#111" : "#fff";

  if (!cfg) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#fafafa" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #e4e4e7", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", fontFamily: font, background: "#fafafa", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: headerBg, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
          {cfg.avatarUrl
            ? <img src={cfg.avatarUrl} alt="" style={{ width: 36, height: 36, objectFit: "cover" }} />
            : <IconSvg icon={cfg.headerIcon || "chat"} size={20} color={headerText} />
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: "0.93rem", fontWeight: 600, color: headerText, lineHeight: 1.3 }}>{cfg.businessName || "Chat"}</span>
          {cfg.description
            ? <span style={{ fontSize: "0.73rem", color: cfg.headerStyle === "minimal" ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.85)" }}>{cfg.description}</span>
            : <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.73rem", color: cfg.headerStyle === "minimal" ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.85)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px rgba(52,211,153,.5)", display: "inline-block" }} />
                Online
              </span>
          }
        </div>
      </div>

      {/* Messages */}
      <div ref={msgsRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, background: cfg.themeMode === "dark" ? "#09090b" : "#fafafa" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "msgIn .35s ease-out" }}>
            <div style={{
              maxWidth: "82%", padding: "12px 16px", borderRadius: 16, fontSize: "0.88rem", lineHeight: 1.55, wordBreak: "break-word",
              background: m.role === "user" ? primary : cfg.themeMode === "dark" ? "#27272a" : "#fff",
              color: m.role === "user" ? "#fff" : cfg.themeMode === "dark" ? "#f4f4f5" : "#27272a",
              borderBottomRightRadius: m.role === "user" ? 4 : 16,
              borderBottomLeftRadius: m.role === "bot" ? 4 : 16,
              boxShadow: m.role === "bot" ? "0 1px 4px rgba(0,0,0,.06)" : "none",
              border: m.role === "bot" ? "1px solid rgba(0,0,0,.06)" : "none",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,.06)", borderRadius: 16, borderBottomLeftRadius: 4, padding: "12px 16px", display: "flex", gap: 6, alignItems: "center" }}>
              {[0, 150, 300].map(d => (
                <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#d4d4d8", display: "inline-block", animation: `bounce .6s ${d}ms infinite alternate` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      {quickReplies.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 16px 8px", background: cfg.themeMode === "dark" ? "#09090b" : "#fafafa" }}>
          {quickReplies.map(qr => (
            <button key={qr} onClick={() => send(qr)} style={{ padding: "8px 16px", borderRadius: 9999, border: "1px solid rgba(0,0,0,.08)", background: "#fff", fontSize: "0.84rem", fontWeight: 500, color: "#3f3f46", cursor: "pointer", fontFamily: "inherit" }}>
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,.08)", background: cfg.themeMode === "dark" ? "#18181b" : "#fff", flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={cfg.messagePlaceholder || "Type a message..."}
          maxLength={500}
          style={{ flex: 1, padding: "10px 16px", borderRadius: 9999, border: "1px solid rgba(0,0,0,.08)", background: "#fafafa", fontSize: 16, color: "#18181b", outline: "none", fontFamily: "inherit" }}
        />
        <button
          onClick={() => send()}
          disabled={busy || !input.trim()}
          style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: primary, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: busy || !input.trim() ? 0.45 : 1 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {cfg.footer && (
        <div style={{ padding: "6px 16px", textAlign: "center", fontSize: "0.72rem", color: "#a1a1aa", background: "#fff", borderTop: "1px solid rgba(0,0,0,.06)", flexShrink: 0 }}>
          {cfg.footer}
        </div>
      )}

      <style>{`
        @keyframes msgIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes bounce { to { transform:translateY(-4px); opacity:.5 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
      `}</style>
    </div>
  );
}

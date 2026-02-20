"use client";

import { useState } from "react";

interface FormState {
  widgetId: string;
  assistantId: string;
  businessName: string;
  greeting: string;
  quickReplies: string;
  primaryColor: string;
  deployedUrl: string;
}

const EMPTY: FormState = {
  widgetId: "",
  assistantId: "",
  businessName: "",
  greeting: "",
  quickReplies: "",
  primaryColor: "#2563eb",
  deployedUrl: "https://vapi-chatbot.vercel.app",
};

export default function ClientGenerator() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [generated, setGenerated] = useState<{ embed: string; entry: string } | null>(null);
  const [copied, setCopied] = useState<"embed" | "entry" | null>(null);

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setGenerated(null);
  }

  function generate() {
    const id = form.widgetId.trim();
    const replies = form.quickReplies
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const repliesTs =
      replies.length === 0
        ? "[]"
        : `[\n      ${replies.map((r) => `"${r}"`).join(",\n      ")},\n    ]`;

    const embed =
      `<script\n  src="${form.deployedUrl.trim()}/api/widget.js"\n  data-widget-id="${id}">\n</script>`;

    const entry =
      `"${id}": {\n    assistantId: "${form.assistantId.trim()}",\n    businessName: "${form.businessName.trim()}",\n    greeting: "${form.greeting.trim()}",\n    quickReplies: ${repliesTs},\n    primaryColor: "${form.primaryColor}",\n  },`;

    setGenerated({ embed, entry });
  }

  async function copy(which: "embed" | "entry") {
    if (!generated) return;
    await navigator.clipboard.writeText(which === "embed" ? generated.embed : generated.entry);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  }

  const canGenerate =
    form.widgetId.trim() &&
    form.assistantId.trim() &&
    form.businessName.trim() &&
    form.greeting.trim();

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "28px 28px 24px",
      }}
    >
      <div style={{ display: "grid", gap: 16 }}>
        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field
            label="Widget ID"
            hint='Lowercase slug, e.g. "miami-dental"'
            value={form.widgetId}
            onChange={(v) => set("widgetId", v.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="miami-dental"
          />
          <Field
            label="Business Name"
            value={form.businessName}
            onChange={(v) => set("businessName", v)}
            placeholder="Miami Dental"
          />
        </div>

        {/* Row 2 */}
        <Field
          label="Vapi Assistant ID"
          hint="From your Vapi dashboard"
          value={form.assistantId}
          onChange={(v) => set("assistantId", v)}
          placeholder="f5381cfd-af11-44d5-9bf3-5d1d87c7b121"
          mono
        />

        {/* Row 3 */}
        <Field
          label="Greeting message"
          value={form.greeting}
          onChange={(v) => set("greeting", v)}
          placeholder="Hello! Welcome to Miami Dental. How can I help you today?"
        />

        {/* Row 4 */}
        <Field
          label="Quick reply buttons"
          hint="Comma-separated — leave blank for none"
          value={form.quickReplies}
          onChange={(v) => set("quickReplies", v)}
          placeholder="Book appointment, Office hours, Insurance"
        />

        {/* Row 5 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Primary color</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => set("primaryColor", e.target.value)}
                style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }}
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => set("primaryColor", e.target.value)}
                style={{ ...inputStyle, fontFamily: MONO_FONT, width: 110 }}
                maxLength={7}
              />
            </div>
          </div>
          <Field
            label="Your deployed URL"
            value={form.deployedUrl}
            onChange={(v) => set("deployedUrl", v.replace(/\/$/, ""))}
            placeholder="https://vapi-chatbot.vercel.app"
            mono
          />
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={!canGenerate}
          style={{
            marginTop: 4,
            padding: "11px 0",
            borderRadius: 8,
            border: "none",
            background: canGenerate ? "#2563eb" : "#cbd5e1",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: canGenerate ? "pointer" : "default",
            transition: "background .15s",
          }}
        >
          Generate
        </button>
      </div>

      {/* ── Output ── */}
      {generated && (
        <div style={{ marginTop: 28, display: "grid", gap: 20 }}>
          <OutputBlock
            label="1. Embed snippet — give this to the client"
            subLabel='Paste anywhere in their HTML (WordPress, Squarespace, etc.)'
            code={generated.embed}
            onCopy={() => copy("embed")}
            copied={copied === "embed"}
          />
          <OutputBlock
            label='2. clients.ts entry — paste inside the clients object in GitHub'
            subLabel='Add this block inside const clients = { ... } then redeploy'
            code={generated.entry}
            onCopy={() => copy("entry")}
            copied={copied === "entry"}
          />
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  mono = false,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 6 }}>{hint}</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, fontFamily: mono ? MONO_FONT : "inherit", marginTop: 6 }}
      />
    </div>
  );
}

function OutputBlock({
  label,
  subLabel,
  code,
  onCopy,
  copied,
}: {
  label: string;
  subLabel: string;
  code: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{label}</span>
        <br />
        <span style={{ fontSize: 12, color: "#64748b" }}>{subLabel}</span>
      </div>
      <div style={{ position: "relative" }}>
        <pre
          style={{
            background: "#0f172a",
            color: "#e2e8f0",
            borderRadius: 8,
            padding: "14px 18px",
            overflowX: "auto",
            fontFamily: MONO_FONT,
            fontSize: 13,
            lineHeight: 1.6,
            margin: 0,
            paddingRight: 90,
          }}
        >
          <code>{code}</code>
        </pre>
        <button
          onClick={onCopy}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: copied ? "#16a34a" : "#334155",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 12px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background .15s",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const MONO_FONT =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #e2e8f0",
  borderRadius: 7,
  fontSize: 14,
  outline: "none",
  color: "#1e293b",
  background: "#fff",
};

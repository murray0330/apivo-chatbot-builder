import type React from "react";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Vapi Embed Platform
      </h1>
      <p style={{ color: "#475569", marginBottom: 40, lineHeight: 1.6 }}>
        A centralized chat-widget platform powered by Vapi. Host one Vercel
        project; give each client a single{" "}
        <code style={inlineCode}>&lt;script&gt;</code> tag.
      </p>

      <Section title="How it works">
        <ol style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>
            Each client gets a unique <strong>widgetId</strong> (e.g.{" "}
            <code style={inlineCode}>abc-dental</code>).
          </li>
          <li>
            Their Vapi <strong>assistantId</strong> and branding are stored
            server-side in <code style={inlineCode}>src/lib/clients.ts</code>{" "}
            — never exposed to the browser.
          </li>
          <li>
            The client embeds one script tag. The widget fetches its config,
            renders a floating chat button, and proxies messages through{" "}
            <code style={inlineCode}>/api/chat</code>.
          </li>
        </ol>
      </Section>

      <Section title="Client embed snippet">
        <p style={{ marginBottom: 12, color: "#475569" }}>
          Add one line anywhere in the client&apos;s HTML — works on WordPress,
          Squarespace, Webflow, or any custom site:
        </p>
        <CodeBlock>{`<script
  src="https://your-domain.vercel.app/api/widget.js"
  data-widget-id="abc-dental">
</script>`}</CodeBlock>
        <p style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>
          Replace <code style={inlineCode}>your-domain.vercel.app</code> with
          your deployed URL and <code style={inlineCode}>abc-dental</code> with
          the client&apos;s widgetId.
        </p>
      </Section>

      <Section title="API routes">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <Th>Route</Th>
              <Th>Method</Th>
              <Th>Description</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code style={inlineCode}>/api/chat</code>
              </Td>
              <Td>POST</Td>
              <Td>
                Proxies messages to Vapi. Accepts{" "}
                <code style={inlineCode}>widgetId</code>,{" "}
                <code style={inlineCode}>message</code>, and{" "}
                <code style={inlineCode}>sessionId</code>.
              </Td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <Td>
                <code style={inlineCode}>/api/config</code>
              </Td>
              <Td>GET</Td>
              <Td>
                Returns public branding for a widgetId. Never exposes{" "}
                <code style={inlineCode}>assistantId</code>.
              </Td>
            </tr>
            <tr>
              <Td>
                <code style={inlineCode}>/api/widget.js</code>
              </Td>
              <Td>GET</Td>
              <Td>Serves the self-contained vanilla JS chat widget.</Td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="Adding a new client">
        <ol style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>
            Open <code style={inlineCode}>src/lib/clients.ts</code>.
          </li>
          <li>
            Add an entry to the <code style={inlineCode}>clients</code> object
            with the client&apos;s <code style={inlineCode}>assistantId</code>{" "}
            and branding fields.
          </li>
          <li>Commit and redeploy to Vercel (automatic via git push).</li>
          <li>
            Send the client their one-line embed snippet with their{" "}
            <code style={inlineCode}>data-widget-id</code>.
          </li>
        </ol>
      </Section>

      <Section title="Environment variables">
        <CodeBlock>VAPI_API_KEY=your_vapi_api_key_here</CodeBlock>
        <p style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
          Set this in Vercel → Project Settings → Environment Variables.
        </p>
      </Section>
    </main>
  );
}

// ── Style constants ───────────────────────────────────────────────────────────

const inlineCode: React.CSSProperties = {
  background: "#f1f5f9",
  borderRadius: 4,
  padding: "1px 5px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: "0.88em",
};

// ── Helper components ─────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 14,
          paddingBottom: 6,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        background: "#0f172a",
        color: "#e2e8f0",
        borderRadius: 8,
        padding: "14px 18px",
        overflowX: "auto",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 13,
        lineHeight: 1.6,
        margin: 0,
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "8px 12px",
        fontWeight: 600,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#475569",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        padding: "8px 12px",
        borderTop: "1px solid #e2e8f0",
        color: "#334155",
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}

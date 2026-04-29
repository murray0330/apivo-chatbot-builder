import { NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;
  const js = widgetCSS() + "\n" + widgetHTML() + "\n" + widgetJS(origin);
  return new NextResponse(js, {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

/* ────────────────────────────────────────────
   CSS — injected as a <style> tag
   ──────────────────────────────────────────── */
function widgetCSS(): string {
  return `
var AW_CSS = [
"#aw-root{--aw-primary:#6366f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
"#aw-launcher{position:fixed;bottom:20px;right:20px;z-index:10001;width:56px;height:56px;border-radius:50%;border:none;background:var(--aw-primary);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,0,0,.25),0 2px 8px rgba(0,0,0,.15);opacity:0;transition:opacity .3s,transform .2s,box-shadow .2s}",
"#aw-launcher:hover{transform:scale(1.1);box-shadow:0 6px 32px rgba(0,0,0,.35)}",
"#aw-launcher:active{transform:scale(.95)}",
"#aw-launcher svg{width:24px;height:24px}",
"#aw-launcher .aw-icon-x{display:none}",
"#aw-launcher[aria-expanded='true'] .aw-icon-chat{display:none}",
"#aw-launcher[aria-expanded='true'] .aw-icon-x{display:block}",
"#aw-launcher[aria-expanded='true'] .aw-ping{display:none}",
".aw-ping{position:absolute;inset:0;border-radius:50%;background:var(--aw-primary);opacity:.3;animation:aw-ping 1.5s cubic-bezier(0,0,.2,1) infinite}",
"@keyframes aw-ping{75%,100%{transform:scale(1.6);opacity:0}}",
"@media(min-width:640px){#aw-launcher{bottom:28px;right:28px;width:64px;height:64px}#aw-launcher svg{width:28px;height:28px}}",
"#aw-panel{position:fixed;z-index:10000;bottom:88px;right:12px;left:12px;height:min(560px,calc(100vh - 140px));display:flex;flex-direction:column;background:#fff;border-radius:16px;border:1px solid rgba(0,0,0,.08);box-shadow:0 12px 48px rgba(0,0,0,.12),0 4px 16px rgba(0,0,0,.08);overflow:hidden;transform:translateY(16px) scale(.97);opacity:0;pointer-events:none;transition:transform .3s,opacity .3s}",
"#aw-panel.aw-open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}",
"@media(min-width:640px){#aw-panel{bottom:104px;right:28px;left:auto;width:380px}}",
".aw-header{display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--aw-primary);flex-shrink:0}",
".aw-header-icon{width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0}",
".aw-header-icon svg{width:20px;height:20px;color:#fff}",
".aw-header-icon img{width:36px;height:36px;border-radius:8px;object-fit:cover;display:block}",
".aw-header-text{flex:1;min-width:0}",
"#aw-biz-name{display:block;font-size:.93rem;font-weight:600;color:#fff;line-height:1.3}",
".aw-online{display:flex;align-items:center;gap:6px;font-size:.73rem;color:rgba(255,255,255,.85)}",
".aw-dot{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 6px rgba(52,211,153,.5)}",
"#aw-close{width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}",
"#aw-close:hover{background:rgba(255,255,255,.3)}",
"#aw-close svg{width:18px;height:18px}",
"#aw-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#fafafa}",
".aw-msg-row{display:flex;animation:aw-msgIn .35s ease-out}",
".aw-msg-bot{justify-content:flex-start}",
".aw-msg-user{justify-content:flex-end}",
".aw-bubble{max-width:82%;padding:12px 16px;border-radius:16px;font-size:.88rem;line-height:1.55;word-break:break-word}",
".aw-bubble-bot{background:#fff;color:#27272a;border-bottom-left-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.06)}",
".aw-bubble-user{background:var(--aw-primary);color:#fff;border-bottom-right-radius:4px}",
"@keyframes aw-msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}",
"#aw-typing{justify-content:flex-start}",
"#aw-typing .aw-bubble{display:flex;align-items:center;gap:6px}",
".aw-dot-bounce{width:7px;height:7px;border-radius:50%;background:#d4d4d8;animation:aw-bounce .6s infinite alternate}",
".aw-d2{animation-delay:.15s}",
".aw-d3{animation-delay:.3s}",
"@keyframes aw-bounce{to{transform:translateY(-4px);opacity:.5}}",
"#aw-quick-replies{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 8px;background:#fafafa}",
".aw-qr{padding:8px 16px;border-radius:9999px;border:1px solid rgba(0,0,0,.08);background:#fff;font-size:.84rem;font-weight:500;color:#3f3f46;cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04);font-family:inherit}",
".aw-qr:hover{border-color:var(--aw-primary);background:#eef2ff;color:var(--aw-primary)}",
".aw-footer{display:flex;align-items:center;gap:8px;padding:12px 14px;border-top:1px solid rgba(0,0,0,.08);background:#fff;flex-shrink:0}",
"#aw-input{flex:1;padding:10px 16px;border-radius:9999px;border:1px solid rgba(0,0,0,.08);background:#fafafa;font-size:16px!important;color:#18181b;outline:none;font-family:inherit}",
"#aw-input::placeholder{color:#a1a1aa}",
"#aw-input:focus{border-color:var(--aw-primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}",
"#aw-send{width:38px;height:38px;border-radius:50%;border:none;background:var(--aw-primary);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .15s;flex-shrink:0}",
"#aw-send:hover{filter:brightness(1.1)}",
"#aw-send:active{transform:scale(.9)}",
"#aw-send:disabled{opacity:.45;cursor:not-allowed}",
"#aw-send svg{width:18px;height:18px}",
"#aw-footer-bar{padding:6px 16px;text-align:center;font-size:.72rem;color:#a1a1aa;background:#fff;border-top:1px solid rgba(0,0,0,.06);flex-shrink:0;display:none}",
"#aw-proactive{position:fixed;bottom:90px;right:14px;max-width:240px;background:#fff;border-radius:12px 12px 2px 12px;padding:10px 14px;font-size:.84rem;color:#27272a;box-shadow:0 4px 16px rgba(0,0,0,.12),0 2px 6px rgba(0,0,0,.08);border:1px solid rgba(0,0,0,.06);z-index:10000;animation:aw-msgIn .4s ease-out;display:none}",
"@media(min-width:640px){#aw-proactive{right:28px;bottom:110px}}",
"#aw-root.aw-sharp #aw-panel{border-radius:6px}",
"#aw-root.aw-sharp #aw-launcher{border-radius:8px}",
"#aw-root.aw-sharp .aw-bubble-bot{border-radius:6px 6px 6px 2px}",
"#aw-root.aw-sharp .aw-bubble-user{border-radius:6px 6px 2px 6px}",
"#aw-root.aw-sharp #aw-input{border-radius:6px}",
"#aw-root.aw-sharp .aw-qr{border-radius:6px}",
"#aw-root.aw-minimal .aw-header{background:transparent!important;border-bottom:1px solid rgba(0,0,0,.1)}",
"#aw-root.aw-minimal #aw-biz-name{color:#111}",
"#aw-root.aw-minimal .aw-online{color:rgba(0,0,0,.5)}",
"#aw-root.aw-minimal #aw-close{background:rgba(0,0,0,.08);color:#374151}",
"#aw-root.aw-minimal #aw-close:hover{background:rgba(0,0,0,.15)}",
"#aw-root.aw-minimal .aw-header-icon{background:rgba(0,0,0,.08)}",
"#aw-root.aw-minimal .aw-header-icon svg{color:#374151}",
"#aw-root.aw-dark #aw-panel{background:#18181b;border-color:rgba(255,255,255,.08)}",
"#aw-root.aw-dark #aw-messages{background:#09090b}",
"#aw-root.aw-dark .aw-bubble-bot{background:#27272a;color:#f4f4f5;border-color:rgba(255,255,255,.08)}",
"#aw-root.aw-dark .aw-footer{background:#18181b;border-color:rgba(255,255,255,.08)}",
"#aw-root.aw-dark #aw-footer-bar{background:#18181b;border-color:rgba(255,255,255,.08);color:#71717a}",
"#aw-root.aw-dark #aw-input{background:#27272a;color:#f4f4f5;border-color:rgba(255,255,255,.1)}",
"#aw-root.aw-dark #aw-quick-replies{background:#09090b}",
"#aw-root.aw-dark .aw-qr{background:#27272a;color:#d4d4d8;border-color:rgba(255,255,255,.08)}",
"#aw-root.aw-dark.aw-minimal .aw-header{border-color:rgba(255,255,255,.1)}",
"#aw-root.aw-dark.aw-minimal #aw-biz-name{color:#fff}",
"#aw-root.aw-dark.aw-minimal .aw-online{color:rgba(255,255,255,.5)}",
"#aw-root.aw-dark.aw-minimal #aw-close{background:rgba(255,255,255,.1);color:#d4d4d8}",
"#aw-root.aw-dark.aw-minimal .aw-header-icon{background:rgba(255,255,255,.1)}",
"#aw-root.aw-dark.aw-minimal .aw-header-icon svg{color:#d4d4d8}",
"#aw-root.aw-dark #aw-proactive{background:#27272a;color:#f4f4f5;border-color:rgba(255,255,255,.08)}",
"#aw-root.aw-glass #aw-panel{background:rgba(255,255,255,.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}",
"#aw-root.aw-glass #aw-messages{background:rgba(255,255,255,.08)}",
"#aw-root.aw-glass .aw-footer{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15)}",
"#aw-root.aw-glass #aw-input{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.2);color:#fff}",
"#aw-root.aw-glass #aw-input::placeholder{color:rgba(255,255,255,.6)}",
"#aw-root.aw-glass .aw-bubble-bot{background:rgba(255,255,255,.2);color:#fff;border-color:rgba(255,255,255,.15)}",
"#aw-root.aw-glass #aw-quick-replies{background:rgba(255,255,255,.08)}",
"#aw-root.aw-glass .aw-qr{background:rgba(255,255,255,.2);color:#fff;border-color:rgba(255,255,255,.2)}"
].join("\\n");
`;
}

/* ────────────────────────────────────────────
   HTML template for the widget DOM
   ──────────────────────────────────────────── */
function widgetHTML(): string {
  const chatSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const xSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const sendSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  const html = [
    `<div id="aw-proactive"></div>`,
    `<button id="aw-launcher" aria-label="Open chat" aria-expanded="false">`,
    `  <span class="aw-ping"></span>`,
    `  <span class="aw-icon-chat">${chatSvg}</span>`,
    `  <span class="aw-icon-x">${xSvg}</span>`,
    `</button>`,
    `<div id="aw-panel" role="dialog" aria-label="Chat">`,
    `  <div class="aw-header">`,
    `    <div class="aw-header-icon">${chatSvg}</div>`,
    `    <div class="aw-header-text">`,
    `      <span id="aw-biz-name">Chat</span>`,
    `      <span class="aw-online"><span class="aw-dot"></span>Online</span>`,
    `    </div>`,
    `    <button id="aw-close" aria-label="Close chat">${xSvg}</button>`,
    `  </div>`,
    `  <div id="aw-messages" aria-live="polite">`,
    `    <div id="aw-typing" class="aw-msg-row" style="display:none">`,
    `      <div class="aw-bubble aw-bubble-bot"><span class="aw-dot-bounce"></span><span class="aw-dot-bounce aw-d2"></span><span class="aw-dot-bounce aw-d3"></span></div>`,
    `    </div>`,
    `  </div>`,
    `  <div id="aw-quick-replies"></div>`,
    `  <div class="aw-footer">`,
    `    <input id="aw-input" type="text" placeholder="Type a message..." maxlength="500" aria-label="Chat message" />`,
    `    <button id="aw-send" aria-label="Send">${sendSvg}</button>`,
    `  </div>`,
    `  <div id="aw-footer-bar"></div>`,
    `</div>`,
  ].join("");
  const escaped = JSON.stringify(html);
  return `var AW_HTML = ${escaped};`;
}

/* ────────────────────────────────────────────
   Main widget logic (vanilla JS IIFE)
   ──────────────────────────────────────────── */
function widgetJS(apiOrigin: string): string {
  return `
(function() {
  "use strict";
  var scriptTag = document.currentScript || (function() {
    var s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();
  var WIDGET_ID = scriptTag.getAttribute("data-widget-id");
  if (!WIDGET_ID) {
    console.error("[Widget] Missing data-widget-id on script tag.");
    return;
  }
  var API = ${JSON.stringify(apiOrigin)};
  var chatId = null;
  var isBusy = false;
  var opened = false;
  var cachedCfg = null;

  /* Inject CSS */
  var styleEl = document.createElement("style");
  styleEl.textContent = AW_CSS;
  document.head.appendChild(styleEl);

  /* Inject DOM */
  var root = document.createElement("div");
  root.id = "aw-root";
  root.innerHTML = AW_HTML;
  document.body.appendChild(root);

  var launcher    = root.querySelector("#aw-launcher");
  var panel       = root.querySelector("#aw-panel");
  var closeBtn    = root.querySelector("#aw-close");
  var msgArea     = root.querySelector("#aw-messages");
  var typingEl    = root.querySelector("#aw-typing");
  var qrArea      = root.querySelector("#aw-quick-replies");
  var input       = root.querySelector("#aw-input");
  var sendBtn     = root.querySelector("#aw-send");
  var bizName     = root.querySelector("#aw-biz-name");
  var headerEl    = root.querySelector(".aw-header");
  var footerBar   = root.querySelector("#aw-footer-bar");
  var proactiveEl = root.querySelector("#aw-proactive");

  var isOpen = false;
  var lastUserMsg = "";

  /* Icon SVG paths — mirrors BotBuilder ICON_OPTIONS */
  var ICONS = {
    chat:    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    bot:     '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
    spark:   '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    zap:     '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    heart:   '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    star:    '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>',
    globe:   '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    shield:  '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    smile:   '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
    user:    '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  };

  function makeIconSvg(key, size) {
    if (!key || !ICONS[key]) return null;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:' + size + 'px;height:' + size + 'px">' + ICONS[key] + '</svg>';
  }

  launcher.addEventListener("click", toggle);
  closeBtn.addEventListener("click", toggle);
  sendBtn.addEventListener("click", function() { send(); });
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && isOpen) toggle();
  });

  /* Prevent iOS Safari auto-zoom on input focus */
  input.addEventListener("focus", function() {
    var vp = document.querySelector("meta[name='viewport']");
    if (vp) {
      vp._awPrev = vp.getAttribute("content");
      vp.setAttribute("content", (vp._awPrev || "") + ", maximum-scale=1");
    }
  });
  input.addEventListener("blur", function() {
    var vp = document.querySelector("meta[name='viewport']");
    if (vp && vp._awPrev != null) {
      vp.setAttribute("content", vp._awPrev);
      vp._awPrev = null;
    }
  });

  /* Apply all config fields to the widget */
  function applyConfig(cfg) {
    if (cfg.primaryColor) root.style.setProperty("--aw-primary", cfg.primaryColor);
    if (cfg.businessName) bizName.textContent = cfg.businessName;
    if (cfg.fontFamily && cfg.fontFamily !== "system") {
      root.style.fontFamily = '"' + cfg.fontFamily + '", system-ui, -apple-system, sans-serif';
      var gfId = "aw-gf-" + cfg.fontFamily.replace(/\s+/g, "-").toLowerCase();
      if (!document.getElementById(gfId)) {
        var gfLink = document.createElement("link");
        gfLink.id = gfId;
        gfLink.rel = "stylesheet";
        gfLink.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(cfg.fontFamily).replace(/%20/g, "+") + ":wght@400;500;600;700&display=swap";
        document.head.appendChild(gfLink);
      }
    }
    if (cfg.messagePlaceholder) input.placeholder = cfg.messagePlaceholder;

    /* Header style */
    if (cfg.headerStyle === "gradient" && cfg.primaryColor) {
      headerEl.style.background =
        "linear-gradient(135deg," + cfg.primaryColor + "," + darkenHex(cfg.primaryColor, 45) + ")";
    } else if (cfg.headerStyle === "minimal") {
      root.classList.add("aw-minimal");
    }

    /* Avatar takes precedence over headerIcon */
    if (cfg.avatarUrl) {
      applyAvatar(cfg.avatarUrl);
    } else if (cfg.headerIcon) {
      var hSvg = makeIconSvg(cfg.headerIcon, 20);
      if (hSvg) {
        var hIconEl = root.querySelector(".aw-header-icon");
        if (hIconEl) hIconEl.innerHTML = hSvg;
      }
    }

    /* Launcher icon */
    if (cfg.launcherIcon) {
      var lSvg = makeIconSvg(cfg.launcherIcon, 24);
      if (lSvg) {
        var chatSpan = launcher.querySelector(".aw-icon-chat");
        if (chatSpan) chatSpan.innerHTML = lSvg;
      }
    }

    /* Theme mode */
    if (cfg.themeMode === "dark") root.classList.add("aw-dark");

    /* Corner radius */
    if (cfg.cornerRadius === "sharp") root.classList.add("aw-sharp");

    /* Glass effect */
    if (cfg.glassEffect) root.classList.add("aw-glass");

    /* Footer text bar */
    if (cfg.footer) {
      footerBar.textContent = cfg.footer;
      footerBar.style.display = "block";
    }

    /* Proactive message — shown above launcher, dismissed on first open */
    if (cfg.proactiveMessage) {
      proactiveEl.textContent = cfg.proactiveMessage;
      proactiveEl.style.display = "block";
    }

    /* Custom CSS injection */
    if (cfg.customCss) {
      var customStyle = document.createElement("style");
      customStyle.textContent = cfg.customCss;
      document.head.appendChild(customStyle);
    }
  }

  function applyAvatar(url) {
    var iconEl = root.querySelector(".aw-header-icon");
    if (!iconEl) return;
    iconEl.style.background = "none";
    var img = document.createElement("img");
    img.src = url;
    img.alt = "";
    iconEl.innerHTML = "";
    iconEl.appendChild(img);
  }

  function darkenHex(hex, amt) {
    var n = parseInt(hex.replace("#", ""), 16);
    var r = Math.max(0, (n >> 16) - amt);
    var g = Math.max(0, ((n >> 8) & 0xff) - amt);
    var b = Math.max(0, (n & 0xff) - amt);
    return "#" + [r, g, b].map(function(v) { return v.toString(16).padStart(2, "0"); }).join("");
  }

  /* Eagerly fetch config on load so colour/branding is applied before first click */
  fetch(API + "/api/config?widgetId=" + encodeURIComponent(WIDGET_ID))
    .then(function(r) { return r.json(); })
    .then(function(cfg) {
      if (cfg.error) return;
      cachedCfg = cfg;
      applyConfig(cfg);
      launcher.style.opacity = "1";
    })
    .catch(function() { launcher.style.opacity = "1"; });

  function toggle() {
    isOpen = !isOpen;
    panel.classList.toggle("aw-open", isOpen);
    launcher.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) proactiveEl.style.display = "none";
    if (isOpen && !opened) {
      opened = true;
      if (cachedCfg) {
        addMsg("bot", cachedCfg.greeting || "Hello! How can I help you today?");
        if (cachedCfg.quickReplies && cachedCfg.quickReplies.length) showQR(cachedCfg.quickReplies);
      } else {
        /* Config still loading — wait for it then show greeting */
        fetch(API + "/api/config?widgetId=" + encodeURIComponent(WIDGET_ID))
          .then(function(r) { return r.json(); })
          .then(function(cfg) {
            if (cfg.error) { addMsg("bot", "Configuration error: " + cfg.error); return; }
            cachedCfg = cfg;
            applyConfig(cfg);
            addMsg("bot", cfg.greeting || "Hello! How can I help you today?");
            if (cfg.quickReplies && cfg.quickReplies.length) showQR(cfg.quickReplies);
          })
          .catch(function() { addMsg("bot", "Could not load chat. Please refresh the page."); });
      }
    }
    if (isOpen) setTimeout(function() { input.focus(); }, 320);
  }

  function send(text) {
    var msg = (text || input.value || "").trim();
    if (!msg || isBusy) return;
    lastUserMsg = msg;
    input.value = "";
    clearQR();
    addMsg("user", msg);
    isBusy = true;
    sendBtn.disabled = true;
    typingEl.style.display = "flex";
    scrollDown();
    fetch(API + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgetId: WIDGET_ID, userMessage: msg, previousChatId: chatId })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      typingEl.style.display = "none";
      if (data.error) {
        addMsg("bot", "Sorry, something went wrong. Please try again.");
      } else {
        if (data.chatId) chatId = data.chatId;
        addMsg("bot", data.reply || "Sorry, I didn't get a response.");
        var qr = getSuggestions(data.reply || "");
        if (qr) showQR(qr);
      }
    })
    .catch(function() {
      typingEl.style.display = "none";
      addMsg("bot", "I'm having trouble connecting. Please try again.");
    })
    .then(function() { isBusy = false; sendBtn.disabled = false; input.focus(); });
  }

  function addMsg(role, content) {
    var row = document.createElement("div");
    row.className = "aw-msg-row aw-msg-" + role;
    var bubble = document.createElement("div");
    bubble.className = "aw-bubble aw-bubble-" + role;
    bubble.textContent = content;
    row.appendChild(bubble);
    msgArea.insertBefore(row, typingEl);
    scrollDown();
  }

  function showQR(opts) {
    clearQR();
    opts.forEach(function(opt) {
      var btn = document.createElement("button");
      btn.className = "aw-qr";
      btn.textContent = opt;
      btn.addEventListener("click", function() { clearQR(); send(opt); });
      qrArea.appendChild(btn);
    });
    scrollDown();
  }

  function clearQR() { qrArea.innerHTML = ""; }

  function scrollDown() {
    setTimeout(function() { msgArea.scrollTop = msgArea.scrollHeight; }, 50);
  }

  function getSuggestions(text) {
    var t = text.toLowerCase();
    if ((t.includes("book") || t.includes("schedule")) && t.includes("reschedule") && t.includes("cancel"))
      return ["Book Appointment", "Reschedule", "Cancel"];
    if (t.includes("treatment") && (t.includes("interested") || t.includes("looking for")))
      return ["Cleaning", "Consultation", "Other"];
    if (t.includes("chart") && (t.includes("cleaning") || t.includes("checkup")))
      return ["Cleaning", "Checkup", "Something else"];
    if (t.includes("last") && (t.includes("cleaning") || t.includes("dental")))
      return ["Less than 6 months", "6-12 months ago", "Over a year ago", "Not sure"];
    if (t.includes("consultation") && (t.includes("open to") || t.includes("something you")))
      return ["Yes, sounds great!", "What does it include?"];
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
})();
`;
}

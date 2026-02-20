import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const widgetScript = buildWidgetScript();

  return new NextResponse(widgetScript, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

function buildWidgetScript(): string {
  /* The returned string is plain ES5-compatible JavaScript.
     Template literals are used here only in the TypeScript build context
     to construct the string — they never reach the browser. */
  return `(function () {
  'use strict';

  // Locate our own script tag to read data-widget-id and derive the API origin
  var scripts = document.querySelectorAll('script[data-widget-id]');
  var currentScript = scripts[scripts.length - 1];
  if (!currentScript) { return; }

  var widgetId = currentScript.getAttribute('data-widget-id');
  if (!widgetId) { return; }

  var scriptSrc = currentScript.getAttribute('src') || '';
  var origin = '';
  try {
    var parsed = new URL(scriptSrc);
    origin = parsed.origin;
  } catch (e) {
    origin = window.location.origin;
  }

  // ── State ────────────────────────────────────────────────────────────────────
  var previousChatId = null;
  var isOpen = false;
  var isLoading = false;
  var cfg = {
    businessName: 'Chat',
    greeting: 'Hello! How can I help you?',
    quickReplies: [],
    primaryColor: '#2563eb'
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.textContent =
    '#vapi-btn{position:fixed;bottom:24px;right:24px;z-index:2147483646;' +
      'width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;' +
      'box-shadow:0 4px 16px rgba(0,0,0,.25);transition:transform .15s;' +
      'font-size:26px;color:#fff;}' +
    '#vapi-btn:hover{transform:scale(1.08);}' +
    '#vapi-panel{position:fixed;bottom:92px;right:24px;z-index:2147483646;' +
      'width:340px;max-height:520px;background:#fff;border-radius:16px;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.18);' +
      'display:flex;flex-direction:column;overflow:hidden;' +
      'font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'font-size:14px;}' +
    '#vapi-panel.vapi-hidden{display:none;}' +
    '#vapi-header{padding:14px 16px;color:#fff;font-weight:600;font-size:15px;' +
      'display:flex;align-items:center;justify-content:space-between;}' +
    '#vapi-close{background:none;border:none;color:#fff;cursor:pointer;' +
      'font-size:22px;line-height:1;padding:0 2px;}' +
    '#vapi-msgs{flex:1;overflow-y:auto;padding:12px 14px;' +
      'display:flex;flex-direction:column;gap:8px;}' +
    '.vm{max-width:82%;padding:8px 12px;border-radius:12px;line-height:1.45;word-break:break-word;}' +
    '.vm-u{align-self:flex-end;color:#fff;border-bottom-right-radius:4px;}' +
    '.vm-b{align-self:flex-start;background:#f1f5f9;color:#1e293b;border-bottom-left-radius:4px;}' +
    '.vm-t{align-self:flex-start;background:#f1f5f9;color:#94a3b8;padding:8px 14px;' +
      'border-radius:12px;border-bottom-left-radius:4px;}' +
    '#vapi-quick{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px;' +
      'border-top:1px solid #f1f5f9;}' +
    '.vq{background:#f1f5f9;border:none;border-radius:16px;padding:5px 12px;' +
      'cursor:pointer;font-size:12px;color:#1e293b;white-space:nowrap;}' +
    '.vq:hover{background:#e2e8f0;}' +
    '#vapi-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #f1f5f9;}' +
    '#vapi-input{flex:1;border:1px solid #e2e8f0;border-radius:8px;' +
      'padding:7px 10px;font-size:14px;outline:none;font-family:inherit;' +
      'resize:none;line-height:1.4;max-height:80px;}' +
    '#vapi-input:focus{border-color:#94a3b8;}' +
    '#vapi-send{border:none;border-radius:8px;padding:7px 14px;cursor:pointer;' +
      'color:#fff;font-size:13px;font-weight:600;}' +
    '#vapi-send:disabled{opacity:.5;cursor:default;}';
  document.head.appendChild(styleEl);

  // ── DOM ──────────────────────────────────────────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'vapi-btn';
  btn.setAttribute('aria-label', 'Open chat');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '&#128172;';

  var panel = document.createElement('div');
  panel.id = 'vapi-panel';
  panel.className = 'vapi-hidden';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat');

  var header = document.createElement('div');
  header.id = 'vapi-header';

  var titleEl = document.createElement('span');
  titleEl.id = 'vapi-title';

  var closeEl = document.createElement('button');
  closeEl.id = 'vapi-close';
  closeEl.setAttribute('aria-label', 'Close chat');
  closeEl.textContent = '\\u00D7';

  header.appendChild(titleEl);
  header.appendChild(closeEl);

  var msgsEl = document.createElement('div');
  msgsEl.id = 'vapi-msgs';
  msgsEl.setAttribute('aria-live', 'polite');

  var quickEl = document.createElement('div');
  quickEl.id = 'vapi-quick';
  quickEl.style.display = 'none';

  var foot = document.createElement('div');
  foot.id = 'vapi-foot';

  var input = document.createElement('textarea');
  input.id = 'vapi-input';
  input.placeholder = 'Type a message\u2026';
  input.rows = 1;
  input.setAttribute('aria-label', 'Message');

  var sendBtn = document.createElement('button');
  sendBtn.id = 'vapi-send';
  sendBtn.textContent = 'Send';

  foot.appendChild(input);
  foot.appendChild(sendBtn);
  panel.appendChild(header);
  panel.appendChild(msgsEl);
  panel.appendChild(quickEl);
  panel.appendChild(foot);
  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function applyColor(color) {
    btn.style.backgroundColor = color;
    header.style.backgroundColor = color;
    sendBtn.style.backgroundColor = color;
  }

  function addMsg(text, role) {
    var el = document.createElement('div');
    el.className = 'vm ' + (role === 'user' ? 'vm-u' : 'vm-b');
    if (role === 'user') { el.style.backgroundColor = cfg.primaryColor; }
    el.textContent = text;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'vm-t';
    el.id = 'vapi-typing';
    el.textContent = '\u2022\u2022\u2022';
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('vapi-typing');
    if (t && t.parentNode) { t.parentNode.removeChild(t); }
  }

  function setLoading(val) {
    isLoading = val;
    sendBtn.disabled = val;
    input.disabled = val;
  }

  function buildQuickReplies(replies) {
    quickEl.innerHTML = '';
    if (!replies || replies.length === 0) { return; }
    quickEl.style.display = 'flex';
    for (var i = 0; i < replies.length; i++) {
      (function (r) {
        var b = document.createElement('button');
        b.className = 'vq';
        b.textContent = r;
        b.addEventListener('click', function () { sendMessage(r); });
        quickEl.appendChild(b);
      })(replies[i]);
    }
  }

  // ── Network ──────────────────────────────────────────────────────────────────
  function fetchConfig(cb) {
    fetch(origin + '/api/config?widgetId=' + encodeURIComponent(widgetId))
      .then(function (r) { return r.json(); })
      .then(function (data) { cb(null, data); })
      .catch(function (err) { cb(err, null); });
  }

  function sendMessage(text) {
    if (isLoading || !text.trim()) { return; }
    quickEl.style.display = 'none';
    addMsg(text, 'user');
    input.value = '';
    input.style.height = '';
    setLoading(true);
    showTyping();

    fetch(origin + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, widgetId: widgetId, previousChatId: previousChatId })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        hideTyping();
        setLoading(false);
        if (data && data.id) { previousChatId = data.id; }
        var reply = null;
        if (data && Array.isArray(data.output) && data.output.length > 0) {
          var last = data.output[data.output.length - 1];
          reply = last && (last.content || last.text || last.message);
        }
        if (!reply && data) { reply = data.message || data.response || data.text; }
        addMsg(reply || 'Sorry, I did not understand that. Please try again.', 'bot');
      })
      .catch(function () {
        hideTyping();
        setLoading(false);
        addMsg('Something went wrong. Please try again later.', 'bot');
      });
  }

  // ── Open / close ─────────────────────────────────────────────────────────────
  function openPanel() {
    isOpen = true;
    panel.classList.remove('vapi-hidden');
    btn.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closePanel() {
    isOpen = false;
    panel.classList.add('vapi-hidden');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function () {
    if (isOpen) { closePanel(); } else { openPanel(); }
  });

  closeEl.addEventListener('click', closePanel);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });

  sendBtn.addEventListener('click', function () { sendMessage(input.value); });

  // ── Init ─────────────────────────────────────────────────────────────────────
  fetchConfig(function (err, data) {
    if (!err && data) {
      if (data.businessName) { cfg.businessName = data.businessName; }
      if (data.greeting)     { cfg.greeting     = data.greeting;     }
      if (data.quickReplies) { cfg.quickReplies = data.quickReplies; }
      if (data.primaryColor) { cfg.primaryColor = data.primaryColor; }
    }
    titleEl.textContent = cfg.businessName;
    applyColor(cfg.primaryColor);
    addMsg(cfg.greeting, 'bot');
    buildQuickReplies(cfg.quickReplies);
  });

})();
`;
}

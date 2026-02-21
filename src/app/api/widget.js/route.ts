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
    primaryColor: '#2563eb',
    avatarUrl: '',
    description: '',
    messagePlaceholder: '',
    footer: '',
    fontFamily: '',
    themeMode: 'light',
    headerStyle: 'solid',
    cornerRadius: 'round',
    customCss: '',
    buttonImageUrl: '',
    proactiveMessage: ''
  };

  // ── Styles (base — updated dynamically after config loads) ─────────────────
  var styleEl = document.createElement('style');
  document.head.appendChild(styleEl);

  function buildStyles() {
    var isDark = cfg.themeMode === 'dark';
    var bgColor = isDark ? '#1e1e1e' : '#fff';
    var textColor = isDark ? '#e2e8f0' : '#1e293b';
    var borderColor = isDark ? '#333' : '#f1f5f9';
    var inputBg = isDark ? '#2a2a2a' : '#fff';
    var inputBorder = isDark ? '#444' : '#e2e8f0';
    var botMsgBg = isDark ? '#2a2a2a' : '#f1f5f9';
    var qrBg = isDark ? '#333' : '#f1f5f9';
    var qrHoverBg = isDark ? '#444' : '#e2e8f0';
    var bRadius = cfg.cornerRadius === 'sharp' ? '4px' : '12px';
    var panelRadius = cfg.cornerRadius === 'sharp' ? '8px' : '16px';
    var font = cfg.fontFamily
      ? cfg.fontFamily + ',system-ui,-apple-system,sans-serif'
      : 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif';

    styleEl.textContent =
      '#vapi-btn{position:fixed;bottom:24px;right:24px;z-index:2147483646;' +
        'width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.25);transition:transform .15s;' +
        'font-size:26px;color:#fff;overflow:hidden;}' +
      '#vapi-btn:hover{transform:scale(1.08);}' +
      '#vapi-btn img{width:100%;height:100%;object-fit:cover;}' +
      '#vapi-proactive{position:fixed;bottom:88px;right:24px;z-index:2147483645;' +
        'background:' + bgColor + ';color:' + textColor + ';padding:10px 14px;' +
        'border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.15);' +
        'font-family:' + font + ';font-size:13px;max-width:220px;' +
        'cursor:pointer;transition:opacity .2s;}' +
      '#vapi-proactive:hover{opacity:.85;}' +
      '#vapi-panel{position:fixed;bottom:92px;right:24px;z-index:2147483646;' +
        'width:370px;max-height:560px;background:' + bgColor + ';border-radius:' + panelRadius + ';' +
        'box-shadow:0 8px 32px rgba(0,0,0,.18);' +
        'display:flex;flex-direction:column;overflow:hidden;' +
        'font-family:' + font + ';font-size:14px;color:' + textColor + ';}' +
      '#vapi-panel.vapi-hidden{display:none;}' +
      '#vapi-header{padding:14px 16px;color:#fff;font-weight:600;font-size:15px;' +
        'display:flex;align-items:center;gap:10px;}' +
      '#vapi-header-right{margin-left:auto;display:flex;align-items:center;}' +
      '#vapi-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0;}' +
      '#vapi-header-text{display:flex;flex-direction:column;gap:1px;}' +
      '#vapi-title{font-size:15px;font-weight:600;line-height:1.3;}' +
      '#vapi-desc{font-size:11px;font-weight:400;opacity:.85;line-height:1.3;}' +
      '#vapi-close{background:none;border:none;color:#fff;cursor:pointer;' +
        'font-size:22px;line-height:1;padding:0 2px;}' +
      '#vapi-msgs{flex:1;overflow-y:auto;padding:12px 14px;' +
        'display:flex;flex-direction:column;gap:8px;}' +
      '.vm{max-width:82%;padding:8px 12px;border-radius:' + bRadius + ';line-height:1.45;word-break:break-word;}' +
      '.vm-u{align-self:flex-end;color:#fff;border-bottom-right-radius:4px;}' +
      '.vm-b{align-self:flex-start;background:' + botMsgBg + ';color:' + textColor + ';border-bottom-left-radius:4px;}' +
      '.vm-t{align-self:flex-start;background:' + botMsgBg + ';color:#94a3b8;padding:8px 14px;' +
        'border-radius:' + bRadius + ';border-bottom-left-radius:4px;}' +
      '#vapi-quick{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px;' +
        'border-top:1px solid ' + borderColor + ';}' +
      '.vq{background:' + qrBg + ';border:none;border-radius:16px;padding:5px 12px;' +
        'cursor:pointer;font-size:12px;color:' + textColor + ';white-space:nowrap;font-family:inherit;}' +
      '.vq:hover{background:' + qrHoverBg + ';}' +
      '#vapi-footer{padding:4px 14px 6px;text-align:center;font-size:11px;' +
        'color:' + (isDark ? '#888' : '#94a3b8') + ';border-top:1px solid ' + borderColor + ';}' +
      '#vapi-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid ' + borderColor + ';}' +
      '#vapi-input{flex:1;border:1px solid ' + inputBorder + ';border-radius:8px;' +
        'padding:7px 10px;font-size:14px;outline:none;font-family:inherit;' +
        'resize:none;line-height:1.4;max-height:80px;' +
        'background:' + inputBg + ';color:' + textColor + ';}' +
      '#vapi-input:focus{border-color:#94a3b8;}' +
      '#vapi-send{border:none;border-radius:8px;padding:7px 14px;cursor:pointer;' +
        'color:#fff;font-size:13px;font-weight:600;}' +
      '#vapi-send:disabled{opacity:.5;cursor:default;}';
  }

  // ── DOM ──────────────────────────────────────────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'vapi-btn';
  btn.setAttribute('aria-label', 'Open chat');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '&#128172;';

  var proactiveEl = null;

  var panel = document.createElement('div');
  panel.id = 'vapi-panel';
  panel.className = 'vapi-hidden';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat');

  var header = document.createElement('div');
  header.id = 'vapi-header';

  var avatarEl = document.createElement('img');
  avatarEl.id = 'vapi-avatar';
  avatarEl.style.display = 'none';

  var headerTextWrap = document.createElement('div');
  headerTextWrap.id = 'vapi-header-text';

  var titleEl = document.createElement('span');
  titleEl.id = 'vapi-title';

  var descEl = document.createElement('span');
  descEl.id = 'vapi-desc';
  descEl.style.display = 'none';

  headerTextWrap.appendChild(titleEl);
  headerTextWrap.appendChild(descEl);

  var headerRight = document.createElement('div');
  headerRight.id = 'vapi-header-right';

  var closeEl = document.createElement('button');
  closeEl.id = 'vapi-close';
  closeEl.setAttribute('aria-label', 'Close chat');
  closeEl.textContent = '\\u00D7';

  headerRight.appendChild(closeEl);

  header.appendChild(avatarEl);
  header.appendChild(headerTextWrap);
  header.appendChild(headerRight);

  var msgsEl = document.createElement('div');
  msgsEl.id = 'vapi-msgs';
  msgsEl.setAttribute('aria-live', 'polite');

  var quickEl = document.createElement('div');
  quickEl.id = 'vapi-quick';
  quickEl.style.display = 'none';

  var footerEl = document.createElement('div');
  footerEl.id = 'vapi-footer';
  footerEl.style.display = 'none';

  var foot = document.createElement('div');
  foot.id = 'vapi-foot';

  var input = document.createElement('textarea');
  input.id = 'vapi-input';
  input.placeholder = 'Type a message\\u2026';
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
  panel.appendChild(footerEl);
  panel.appendChild(foot);
  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function applyColor(color) {
    btn.style.backgroundColor = color;
    sendBtn.style.backgroundColor = color;

    // Header style
    var style = cfg.headerStyle || 'solid';
    if (style === 'gradient') {
      header.style.background = 'linear-gradient(135deg, ' + color + ', ' + shadeColor(color, -30) + ')';
    } else if (style === 'minimal') {
      header.style.background = 'transparent';
      header.style.color = color;
      closeEl.style.color = color;
    } else {
      header.style.backgroundColor = color;
    }
  }

  function shadeColor(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = Math.min(255, Math.max(0, (num >> 16) + percent));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    var b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
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
    el.textContent = '\\u2022\\u2022\\u2022';
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

  function showProactiveMessage(text) {
    if (!text || proactiveEl) { return; }
    proactiveEl = document.createElement('div');
    proactiveEl.id = 'vapi-proactive';
    proactiveEl.textContent = text;
    proactiveEl.addEventListener('click', function () {
      if (proactiveEl && proactiveEl.parentNode) {
        proactiveEl.parentNode.removeChild(proactiveEl);
      }
      proactiveEl = null;
      openPanel();
    });
    document.body.appendChild(proactiveEl);
  }

  function loadFont(fontName) {
    if (!fontName) { return; }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' +
      encodeURIComponent(fontName) + ':wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  function injectCustomCss(css) {
    if (!css) { return; }
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
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
    if (proactiveEl && proactiveEl.parentNode) {
      proactiveEl.parentNode.removeChild(proactiveEl);
      proactiveEl = null;
    }
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
      // Core fields
      if (data.businessName) { cfg.businessName = data.businessName; }
      if (data.greeting)     { cfg.greeting     = data.greeting;     }
      if (data.quickReplies) { cfg.quickReplies = data.quickReplies; }
      if (data.primaryColor) { cfg.primaryColor = data.primaryColor; }
      // Extended fields
      if (data.avatarUrl)          { cfg.avatarUrl = data.avatarUrl; }
      if (data.description)        { cfg.description = data.description; }
      if (data.messagePlaceholder) { cfg.messagePlaceholder = data.messagePlaceholder; }
      if (data.footer)             { cfg.footer = data.footer; }
      if (data.fontFamily)         { cfg.fontFamily = data.fontFamily; }
      if (data.themeMode)          { cfg.themeMode = data.themeMode; }
      if (data.headerStyle)        { cfg.headerStyle = data.headerStyle; }
      if (data.cornerRadius)       { cfg.cornerRadius = data.cornerRadius; }
      if (data.customCss)          { cfg.customCss = data.customCss; }
      if (data.buttonImageUrl)     { cfg.buttonImageUrl = data.buttonImageUrl; }
      if (data.proactiveMessage)   { cfg.proactiveMessage = data.proactiveMessage; }
    }

    // Load custom font if specified
    if (cfg.fontFamily) { loadFont(cfg.fontFamily); }

    // Rebuild styles with the loaded config (dark mode, font, corner radius, etc.)
    buildStyles();

    // Apply primary color + header style
    applyColor(cfg.primaryColor);

    // Title
    titleEl.textContent = cfg.businessName;

    // Description under title
    if (cfg.description) {
      descEl.textContent = cfg.description;
      descEl.style.display = 'block';
    }

    // Avatar in header
    if (cfg.avatarUrl) {
      avatarEl.src = cfg.avatarUrl;
      avatarEl.style.display = 'block';
    }

    // Placeholder text
    if (cfg.messagePlaceholder) {
      input.placeholder = cfg.messagePlaceholder;
    }

    // Footer
    if (cfg.footer) {
      footerEl.textContent = cfg.footer;
      footerEl.style.display = 'block';
    }

    // Launcher button image
    if (cfg.buttonImageUrl) {
      btn.innerHTML = '';
      var btnImg = document.createElement('img');
      btnImg.src = cfg.buttonImageUrl;
      btnImg.alt = 'Chat';
      btn.appendChild(btnImg);
    }

    // Inject custom CSS
    if (cfg.customCss) { injectCustomCss(cfg.customCss); }

    // Greeting message + quick replies
    addMsg(cfg.greeting, 'bot');
    buildQuickReplies(cfg.quickReplies);

    // Proactive message after a short delay
    if (cfg.proactiveMessage) {
      setTimeout(function () {
        if (!isOpen) { showProactiveMessage(cfg.proactiveMessage); }
      }, 3000);
    }
  });

})();
`;
}

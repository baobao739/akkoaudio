(() => {
  "use strict";

  const SESSION_URL = "/.netlify/functions/verify-session";
  const LOGIN_URL = "/.netlify/functions/login";
  const REGISTER_URL = "/.netlify/functions/register";

  function currentPath() {
    return (location.pathname || "/").replace(/\/+$/, "") || "/";
  }

  function preferSignupTab() {
    const p = currentPath();
    const q = new URLSearchParams(location.search);
    return p === "/register" || q.get("tab") === "signup" || q.get("tab") === "register";
  }

  function goHomeUrl() {
    const p = currentPath();
    if (p === "/login" || p === "/register" || p === "/app") {
      try { history.replaceState(null, "", "/home"); } catch (_) {}
    }
  }

  const REF_KEY = "akkomusic-referral-code";

  const THEMES = {
    warmblack: { bottom: "#050507" },
    charcoal: { bottom: "#1b1c24" },
    midnight: { bottom: "#141a31" },
    ocean: { bottom: "#102a39" },
    plum: { bottom: "#251a2d" },
    dawn: { bottom: "#352333" },
    forest: { bottom: "#172c25" },
    lavender: { bottom: "#2c2a45" },
    rosewood: { bottom: "#321f2a" },
    ember: { bottom: "#321e1a" },
    glacier: { bottom: "#20343d" },
    cocoa: { bottom: "#2d231f" },
    aurora: { bottom: "#133b37" }
  };

  const STYLE = `
    #akkomusic-verify-overlay,
    #akkomusic-access-overlay {
      position: fixed !important; inset: 0 !important; z-index: 2147483647 !important;
      isolation: isolate; margin: 0 !important; box-sizing: border-box;
    }
    #akkomusic-verify-overlay {
      display: flex; align-items: center; justify-content: center;
      background: #050507; color: #fafafa;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      transition: opacity .3s ease, visibility .3s ease;
    }
    #akkomusic-verify-overlay.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    #akkomusic-access-overlay {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: clamp(1.5rem, 5vw, 3.5rem) 1.25rem;
      background: #050507;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      transition: opacity .3s ease, visibility .3s ease; overflow: auto;
      min-height: 100vh; min-height: 100dvh;
      -webkit-font-smoothing: antialiased;
    }
    #akkomusic-access-overlay.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    #akkomusic-access-overlay::before {
      content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(ellipse 90% 55% at 50% -20%, rgba(255,255,255,0.06), transparent 55%),
        radial-gradient(ellipse 60% 40% at 80% 100%, rgba(255,255,255,0.03), transparent 50%),
        linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
      background-size: auto, auto, 64px 64px, 64px 64px;
    }
    .akkomusic-access-shell {
      position: relative; z-index: 1; width: min(420px, 100%);
      display: flex; flex-direction: column; align-items: stretch;
      animation: akkoIn .55s cubic-bezier(.16,1,.3,1) both;
    }
    @keyframes akkoIn {
      from { opacity: 0; transform: translateY(18px) scale(0.985); }
      to { opacity: 1; transform: none; }
    }
    .akkomusic-access-logo {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      font-size: 0.9rem; font-weight: 600; letter-spacing: -0.02em;
      color: rgba(250,250,250,0.9); margin-bottom: 2.5rem;
    }
    .akkomusic-access-logo span { font-weight: 700; }
    .akkomusic-access-eyebrow {
      text-align: center; font-size: 0.65rem; font-weight: 700;
      letter-spacing: 0.22em; text-transform: uppercase;
      color: rgba(161,161,170,0.9); margin-bottom: 0.75rem;
    }
    .akkomusic-access-title {
      margin: 0 0 0.55rem; color: #fafafa;
      font-size: clamp(2.5rem, 9vw, 3.4rem);
      font-weight: 550; letter-spacing: -0.05em; text-align: center; line-height: 1.02;
    }
    .akkomusic-access-subtitle {
      margin: 0 auto 2.75rem; color: #a1a1aa; font-size: 0.95rem;
      line-height: 1.6; font-weight: 400; text-align: center; max-width: 30ch;
    }
    .akkomusic-tabs { display: none !important; }
    .akkomusic-field-wrap { margin-bottom: 1rem; }
    .akkomusic-label {
      display: block; margin: 0 0 0.45rem; color: #71717a; font-size: 0.65rem;
      font-weight: 700; text-align: left; letter-spacing: 0.16em; text-transform: uppercase;
    }
    .akkomusic-field {
      width: 100%; box-sizing: border-box; padding: 1rem 1.1rem;
      border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; outline: none;
      background: rgba(255,255,255,0.035); color: #fafafa; font-size: 1rem;
      font-family: inherit; transition: border-color 0.2s, background 0.2s, box-shadow 0.25s;
    }
    .akkomusic-field::placeholder { color: #52525b; }
    .akkomusic-field:hover { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.045); }
    .akkomusic-field:focus {
      border-color: rgba(255,255,255,0.28);
      background: rgba(255,255,255,0.055);
      box-shadow: 0 0 0 4px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25);
    }
    .akkomusic-access-button {
      width: 100%; margin-top: 0.65rem; padding: 1.05rem 1.5rem; border: 0; border-radius: 999px;
      cursor: pointer; background: linear-gradient(180deg, #ffffff 0%, #e8e8ec 100%);
      color: #0a0a0b; font-size: 1.02rem; font-weight: 650; font-family: inherit;
      box-shadow: 0 1px 0 rgba(255,255,255,1) inset, 0 1px 2px rgba(0,0,0,0.08), 0 10px 28px rgba(0,0,0,0.35);
      transition: transform 0.15s ease, opacity 0.2s, box-shadow 0.2s, filter 0.2s;
    }
    .akkomusic-access-button:hover:not(:disabled) { filter: brightness(1.03); }
    .akkomusic-access-button:disabled { opacity: .4; cursor: not-allowed; filter: none; }
    .akkomusic-access-error { min-height: 20px; margin-top: 1.1rem; color: #fb7185; font-size: 0.85rem; font-weight: 600; text-align: center; }
    .akkomusic-access-ok { min-height: 20px; margin-top: 1.1rem; color: #4ade80; font-size: 0.85rem; font-weight: 600; text-align: center; }
    .akkomusic-panel { display: none; width: 100%; }
    .akkomusic-panel.active { display: block; }
    .akkomusic-access-switch { margin-top: 2.25rem; color: #71717a; font-size: 0.9rem; text-align: center; }
    .akkomusic-access-switch a {
      color: #fafafa; text-decoration: none; font-weight: 600;
      border-bottom: 1px solid rgba(250,250,250,0.25);
    }
    .akkomusic-access-back {
      margin-top: 2.5rem; color: #52525b; font-size: 0.8rem; text-decoration: none;
      text-align: center; display: block;
    }
    body.akkomusic-gate-locked .sidebar,
    body.akkomusic-gate-locked .main,
    body.akkomusic-gate-locked .bottom-player,
    body.akkomusic-gate-locked .full-player,
    body.akkomusic-gate-locked .queue-panel,
    body.akkomusic-awaiting-access .sidebar,
    body.akkomusic-awaiting-access .main,
    body.akkomusic-awaiting-access .bottom-player,
    body.akkomusic-awaiting-access .full-player,
    body.akkomusic-awaiting-access .queue-panel {
      pointer-events: none !important; user-select: none !important; visibility: hidden !important;
    }
    .onboarding { background: #050507 !important; backdrop-filter: none !important; }
    .onboard-card {
      background: transparent !important; border: none !important; box-shadow: none !important;
      backdrop-filter: none !important; border-radius: 0 !important;
      padding: 2rem 1.25rem !important; max-width: 420px !important; width: 100% !important;
    }
    .onboard-btn {
      border-radius: 999px !important; font-weight: 650 !important;
      background: linear-gradient(180deg, #fff 0%, #e8e8ec 100%) !important;
      color: #0a0a0b !important; border: 0 !important; padding: 0.95rem 1.5rem !important;
    }
  `;

  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.appendChild(style);

  function clearPreverify() {
    document.documentElement.classList.remove("akkomusic-preverify");
  }

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function lightenHex(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    return "#" + [r, g, b].map((v) => Math.min(255, Math.round(v + (255 - v) * amount)).toString(16).padStart(2, "0")).join("");
  }

  function applyBwGateColors() {
    const root = document.documentElement;
    root.style.setProperty("--accent", "#fafafa");
    root.style.setProperty("--accent-bright", "#ffffff");
    root.style.setProperty("--accent-soft", "rgba(255,255,255,0.12)");
    root.style.setProperty("--accent-glow", "rgba(255,255,255,0.18)");
    root.style.setProperty("--theme-bottom", "#050507");
    root.style.setProperty("--bg", "#050507");
    root.style.setProperty("--bg-deep", "#050507");
    root.style.setProperty("--text", "#fafafa");
    root.style.setProperty("--text-soft", "rgba(255,255,255,0.55)");
  }

  function applySavedColors() {
    if (localStorage.getItem("akkomusic-onboarded") !== "1") {
      applyBwGateColors();
      return;
    }
    const root = document.documentElement;
    const accent = localStorage.getItem("akkomusic-accent") || "#fafafa";
    const { r, g, b } = hexToRgb(accent);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-bright", lightenHex(accent, 0.18));
    root.style.setProperty("--accent-soft", `rgba(${r}, ${g}, ${b}, 0.15)`);
    root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.35)`);
    const themeName = localStorage.getItem("akkomusic-theme") || "warmblack";
    const theme = THEMES[themeName] || THEMES.warmblack;
    root.style.setProperty("--theme-bottom", theme.bottom);
    root.style.setProperty("--bg", theme.bottom);
    root.style.setProperty("--bg-deep", theme.bottom);
  }

  function lockUI() {
    document.body.classList.add("akkomusic-gate-locked", "akkomusic-awaiting-access");
  }

  function unlockUI() {
    document.body.classList.remove("akkomusic-gate-locked", "akkomusic-awaiting-access");
    clearPreverify();
    try { document.body.style.overflow = ""; } catch (_) {}
  }

  async function checkSession() {
    try {
      const res = await fetch(SESSION_URL, { method: "GET", credentials: "include", cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      return { valid: !!(res.ok && data.valid && data.unlocked), reason: data.reason || data.status || null };
    } catch {
      return { valid: false, reason: "network" };
    }
  }

  function showVerifying(msg) {
    let overlay = document.getElementById("akkomusic-verify-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "akkomusic-verify-overlay";
      document.body.appendChild(overlay);
    }
    overlay.classList.remove("hidden");
    overlay.innerHTML = `<div style="font-weight:500;letter-spacing:0.06em;opacity:0.7">${msg || "…"}</div>`;
    return overlay;
  }

  function unlockFast(opts) {
    opts = opts || {};
    try {
      document.documentElement.classList.remove("akkomusic-preverify");
      document.body.classList.remove("akkomusic-gate-locked", "akkomusic-awaiting-access");
      document.body.style.overflow = "";
      document.body.style.visibility = "";
    } catch (_) {}

    const v = document.getElementById("akkomusic-verify-overlay");
    if (v) v.remove();
    const a = document.getElementById("akkomusic-access-overlay");
    if (a) a.remove();

    try {
      document.querySelectorAll(".sidebar, .main, .main-content, .bottom-player, .full-player, .queue-panel").forEach(function (el) {
        el.style.visibility = "";
        el.style.opacity = "";
        el.style.pointerEvents = "";
      });
    } catch (_) {}

    try { applySavedColors(); } catch (_) {}
    try { if (typeof window.akkoRefreshPremium === "function") window.akkoRefreshPremium(); } catch (_) {}

    goHomeUrl();

    const p = currentPath();
    if (opts.navigate !== false && (p === "/login" || p === "/register" || p === "/app" || location.pathname.indexOf("login") >= 0)) {
      try {
        location.replace("/home");
        return;
      } catch (_) {
        location.href = "/home";
        return;
      }
    }
  }

  function createGate(statusHint) {
    document.getElementById("akkomusic-access-overlay")?.remove();
    document.getElementById("akkomusic-verify-overlay")?.remove();

    const pathForGate = currentPath();
    const isRegister = pathForGate === "/register" || preferSignupTab();
    const pageTitle = isRegister ? "Sign up" : "Log in";
    const pageSub =
      statusHint === "pending" ? "Your account is still pending approval."
      : statusHint === "denied" ? "This account was denied."
      : statusHint === "revoked" ? "Your access was revoked by the admin."
      : isRegister ? "Referral code required. Create your account to get in."
      : "Welcome back. Enter your username and password.";

    const savedCode = localStorage.getItem(REF_KEY) || "";

    const overlay = document.createElement("div");
    overlay.id = "akkomusic-access-overlay";
    overlay.innerHTML = `
      <div class="akkomusic-access-shell">
        <div class="akkomusic-access-logo">Akko<span>Music</span></div>
        <div class="akkomusic-access-eyebrow">${isRegister ? "Join" : "Welcome back"}</div>
        <h1 class="akkomusic-access-title">${pageTitle}</h1>
        <p class="akkomusic-access-subtitle">${pageSub}</p>
        <div class="akkomusic-panel ${isRegister ? "" : "active"}" id="panel-login">
          <div class="akkomusic-field-wrap">
            <label class="akkomusic-label" for="akko-login-user">Username</label>
            <input class="akkomusic-field" id="akko-login-user" maxlength="32" autocomplete="username" spellcheck="false" placeholder="your username">
          </div>
          <div class="akkomusic-field-wrap">
            <label class="akkomusic-label" for="akko-login-pass">Password</label>
            <input class="akkomusic-field" id="akko-login-pass" type="password" maxlength="128" autocomplete="current-password" placeholder="••••••••">
          </div>
          <button type="button" class="akkomusic-access-button" id="akko-login-submit">Log in</button>
          <div class="akkomusic-access-error" id="akko-login-error"></div>
          <p class="akkomusic-access-switch">New here? <a href="/register">Create an account</a></p>
        </div>
        <div class="akkomusic-panel ${isRegister ? "active" : ""}" id="panel-signup">
          <div class="akkomusic-field-wrap">
            <label class="akkomusic-label" for="akko-ref-code">Referral code</label>
            <input class="akkomusic-field" id="akko-ref-code" maxlength="16" spellcheck="false" value="${savedCode.replace(/\"/g, "")}" placeholder="Code from admin">
          </div>
          <div class="akkomusic-field-wrap">
            <label class="akkomusic-label" for="akko-reg-name">Your name</label>
            <input class="akkomusic-field" id="akko-reg-name" maxlength="64" autocomplete="name" placeholder="Display name">
          </div>
          <div class="akkomusic-field-wrap">
            <label class="akkomusic-label" for="akko-reg-user">Username</label>
            <input class="akkomusic-field" id="akko-reg-user" maxlength="32" autocomplete="username" spellcheck="false" placeholder="Pick a username">
          </div>
          <div class="akkomusic-field-wrap">
            <label class="akkomusic-label" for="akko-reg-pass">Password</label>
            <input class="akkomusic-field" id="akko-reg-pass" type="password" maxlength="128" autocomplete="new-password" placeholder="At least 6 characters">
          </div>
          <button type="button" class="akkomusic-access-button" id="akko-reg-submit">Create account</button>
          <div class="akkomusic-access-error" id="akko-reg-error"></div>
          <div class="akkomusic-access-ok" id="akko-reg-ok"></div>
          <p class="akkomusic-access-switch">Already have access? <a href="/login">Log in</a></p>
        </div>
        <a class="akkomusic-access-back" href="/landing">Back to home</a>
      </div>`;
    document.body.appendChild(overlay);

    const refInput = overlay.querySelector("#akko-ref-code");
    if (refInput) {
      refInput.addEventListener("change", () => {
        const v = refInput.value.trim().toUpperCase();
        if (v) localStorage.setItem(REF_KEY, v);
      });
      refInput.addEventListener("blur", () => {
        const v = refInput.value.trim().toUpperCase();
        refInput.value = v;
        if (v) localStorage.setItem(REF_KEY, v);
      });
    }

    const loginBtn = overlay.querySelector("#akko-login-submit");
    const loginErr = overlay.querySelector("#akko-login-error");
    const loginUser = overlay.querySelector("#akko-login-user");
    const loginPass = overlay.querySelector("#akko-login-pass");
    let loginBusy = false;

    async function doLogin() {
      if (loginBusy) return;
      loginErr.textContent = "";
      const username = loginUser.value.trim();
      const password = loginPass.value;
      if (!username || !password) {
        loginErr.textContent = "Enter username and password.";
        return;
      }
      loginBusy = true;
      loginBtn.disabled = true;
      loginBtn.textContent = "Signing in…";
      try {
        const res = await fetch(LOGIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ username, password })
        });
        const data = await res.json().catch(() => ({}));
        if (data.ok && (data.status === "approved" || data.unlocked === true)) {
          loginBtn.textContent = "Done";
          unlockFast({ navigate: true });
          return;
        }
        if (data.status === "pending") loginErr.textContent = data.message || "Pending approval.";
        else if (data.status === "denied") loginErr.textContent = data.message || "Denied.";
        else if (data.status === "revoked") loginErr.textContent = data.message || "Revoked.";
        else loginErr.textContent = data.error || "Login failed.";
      } catch {
        loginErr.textContent = "Network error. Try again.";
      }
      loginBusy = false;
      loginBtn.disabled = false;
      loginBtn.textContent = "Log in";
    }

    if (loginBtn) {
      loginBtn.addEventListener("click", doLogin);
      loginPass.addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
      loginUser.addEventListener("keydown", (e) => { if (e.key === "Enter") loginPass.focus(); });
    }

    const regBtn = overlay.querySelector("#akko-reg-submit");
    const regErr = overlay.querySelector("#akko-reg-error");
    const regOk = overlay.querySelector("#akko-reg-ok");
    let regBusy = false;

    async function doRegister() {
      if (regBusy) return;
      regErr.textContent = "";
      regOk.textContent = "";
      const referralCode = (refInput ? refInput.value.trim().toUpperCase() : "");
      const name = overlay.querySelector("#akko-reg-name").value.trim();
      const username = overlay.querySelector("#akko-reg-user").value.trim();
      const password = overlay.querySelector("#akko-reg-pass").value;
      if (referralCode) localStorage.setItem(REF_KEY, referralCode);
      if (!referralCode || !name || !username || !password) {
        regErr.textContent = "Fill in code, name, username, and password.";
        return;
      }
      regBusy = true;
      regBtn.disabled = true;
      regBtn.textContent = "Creating…";
      try {
        const res = await fetch(REGISTER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ referralCode, name, username, password })
        });
        const data = await res.json().catch(() => ({}));
        if (data.ok) {
          regOk.textContent = "Account created! Logging in…";
          const lr = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            cache: "no-store",
            body: JSON.stringify({ username, password })
          });
          const ld = await lr.json().catch(() => ({}));
          if (ld.ok && (ld.status === "approved" || ld.unlocked === true)) {
            unlockFast({ navigate: true });
            return;
          }
          regOk.textContent = "Account created. Go to Log in.";
          regBtn.disabled = false;
          regBtn.textContent = "Create account";
          regBusy = false;
          return;
        }
        regErr.textContent = data.error || "Sign up failed.";
      } catch {
        regErr.textContent = "Network error. Try again.";
      }
      regBusy = false;
      regBtn.disabled = false;
      regBtn.textContent = "Create account";
    }

    if (regBtn) regBtn.addEventListener("click", doRegister);
  }

  async function runGate() {
    lockUI();
    applyBwGateColors();
    document.getElementById("akkomusic-access-overlay")?.remove();
    document.getElementById("akkomusic-verify-overlay")?.remove();
    showVerifying("…");
    const session = await checkSession();
    if (session.valid) {
      unlockFast({ navigate: false });
      return;
    }
    document.getElementById("akkomusic-verify-overlay")?.remove();
    const hint =
      session.reason === "pending" || session.reason === "denied" || session.reason === "revoked"
        ? session.reason : null;
    createGate(hint);
  }

  function isOnboardingDone() {
    return localStorage.getItem("akkomusic-onboarded") === "1";
  }

  function start() {
    document.documentElement.classList.add("akkomusic-preverify");
    document.body.classList.add("akkomusic-awaiting-access", "akkomusic-gate-locked");
    if (isOnboardingDone()) {
      runGate();
      return;
    }
    const onboarding = document.getElementById("onboarding");
    const afterOnboarding = () => {
      if (!isOnboardingDone()) return;
      const hidden = !onboarding || onboarding.classList.contains("hidden");
      if (!hidden) return;
      observer.disconnect();
      runGate();
    };
    const observer = new MutationObserver(afterOnboarding);
    if (onboarding) observer.observe(onboarding, { attributes: true, attributeFilter: ["class", "style"] });
    window.addEventListener("storage", (e) => {
      if (e.key === "akkomusic-onboarded" && e.newValue === "1") afterOnboarding();
    });
    let pollId = setInterval(() => {
      if (document.hidden) return;
      afterOnboarding();
      if (isOnboardingDone()) {
        clearInterval(pollId);
        pollId = null;
      }
    }, 300);
    afterOnboarding();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();

  const _logoutScript = document.createElement("script");
  _logoutScript.src = "/logout-ui.js";
  _logoutScript.defer = true;
  document.head.appendChild(_logoutScript);
})();

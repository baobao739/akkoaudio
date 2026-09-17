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
      background: #050505; color: #f4f4f5;
      font-family: "SFMono-Regular", "Cascadia Code", "Roboto Mono", Consolas, monospace;
      transition: opacity .2s ease, visibility .2s ease;
    }
    #akkomusic-verify-overlay.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    #akkomusic-access-overlay {
      display: flex; align-items: center; justify-content: center;
      padding: 24px; background: #0a0a0b;
      transition: opacity .2s ease, visibility .2s ease; overflow: auto;
    }
    #akkomusic-access-overlay.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    .akkomusic-access-box {
      position: relative; z-index: 1; width: min(440px, 100%); padding: 28px 30px; text-align: center;
      border: 1px solid rgba(255,255,255,.14); border-radius: 28px;
      background: rgba(255,255,255,.055); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
      box-shadow: 0 25px 80px rgba(0,0,0,.45);
    }
    .akkomusic-access-title { margin: 0 0 6px; color: #f4f4f5; font-size: 26px; font-weight: 800; }
    .akkomusic-access-subtitle { margin: 0 0 14px; color: rgba(255,255,255,.62); font-size: 13px; line-height: 1.5; }
    .akkomusic-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
    .akkomusic-tab {
      flex: 1; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,.12);
      background: transparent; color: rgba(255,255,255,.6); font-weight: 700; cursor: pointer; font-size: 13px;
    }
    .akkomusic-tab.active { background: #f4f4f5; color: #0a0a0b; border-color: transparent; }
    .akkomusic-field {
      width: 100%; box-sizing: border-box; margin-bottom: 10px; padding: 13px 14px;
      border: 1px solid rgba(255,255,255,.1); border-radius: 14px; outline: none;
      background: rgba(255,255,255,.06); color: #f4f4f5; font-size: 15px;
    }
    .akkomusic-field:focus { border-color: #f4f4f5; box-shadow: 0 0 0 3px rgba(255,255,255,.12); }
    .akkomusic-access-button {
      width: 100%; margin-top: 4px; padding: 14px; border: 0; border-radius: 16px; cursor: pointer;
      background: #f4f4f5; color: #0a0a0b; font-size: 15px; font-weight: 800;
    }
    .akkomusic-access-button:disabled { opacity: .55; cursor: not-allowed; }
    .akkomusic-access-error { min-height: 18px; margin-top: 10px; color: #ff6b6b; font-size: 13px; font-weight: 700; }
    .akkomusic-access-ok { min-height: 18px; margin-top: 10px; color: #66e39a; font-size: 13px; font-weight: 700; }
    .akkomusic-label { display: block; margin: 0 0 5px 2px; color: rgba(255,255,255,.62); font-size: 12px; font-weight: 700; text-align: left; }
    .akkomusic-panel { display: none; text-align: left; }
    .akkomusic-panel.active { display: block; }
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
    return (
      "#" +
      [r, g, b]
        .map((v) => Math.min(255, Math.round(v + (255 - v) * amount)).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function applyBwGateColors() {
    const root = document.documentElement;
    root.style.setProperty("--accent", "#f4f4f5");
    root.style.setProperty("--accent-bright", "#ffffff");
    root.style.setProperty("--accent-soft", "rgba(255,255,255,0.12)");
    root.style.setProperty("--accent-glow", "rgba(255,255,255,0.18)");
    root.style.setProperty("--theme-bottom", "#0a0a0b");
    root.style.setProperty("--bg", "#0a0a0b");
    root.style.setProperty("--bg-deep", "#0a0a0b");
    root.style.setProperty("--text", "#f4f4f5");
    root.style.setProperty("--text-soft", "rgba(255,255,255,0.62)");
  }

  function applySavedColors() {
    if (localStorage.getItem("akkomusic-onboarded") !== "1") {
      applyBwGateColors();
      return;
    }
    const root = document.documentElement;
    const accent = localStorage.getItem("akkomusic-accent") || "#7b8cff";
    const { r, g, b } = hexToRgb(accent);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-bright", lightenHex(accent, 0.18));
    root.style.setProperty("--accent-soft", `rgba(${r}, ${g}, ${b}, 0.15)`);
    root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.35)`);
    const themeName = localStorage.getItem("akkomusic-theme") || "charcoal";
    const theme = THEMES[themeName] || THEMES.charcoal;
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
  }

  async function checkSession() {
    try {
      const res = await fetch(SESSION_URL, {
        method: "GET",
        credentials: "include",
        cache: "no-store"
      });
      const data = await res.json().catch(() => ({}));
      return {
        valid: !!(res.ok && data.valid && data.unlocked),
        reason: data.reason || data.status || null
      };
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
    overlay.innerHTML = `<div style="font-family:monospace;font-weight:700">${msg || "..."}</div>`;
    return overlay;
  }

  function unlockFast() {
    goHomeUrl();
    const overlay = document.getElementById("akkomusic-verify-overlay");
    if (overlay) {
      overlay.innerHTML = `<div style="color:#66e39a;font-family:monospace;font-weight:700">ACCESS GRANTED</div>`;
      overlay.classList.add("hidden");
      setTimeout(() => overlay.remove(), 200);
    }
    document.getElementById("akkomusic-access-overlay")?.remove();
    unlockUI();
  }

  function createGate(statusHint) {
    document.getElementById("akkomusic-access-overlay")?.remove();
    document.getElementById("akkomusic-verify-overlay")?.remove();

    let subtitle = "Sign up with a referral code, or log in if you already have an account.";
    if (statusHint === "pending") subtitle = "Your account is still pending approval.";
    else if (statusHint === "denied") subtitle = "This account was denied.";
    else if (statusHint === "revoked") subtitle = "Your access was revoked by the admin.";

    const savedCode = localStorage.getItem(REF_KEY) || "";

    const overlay = document.createElement("div");
    overlay.id = "akkomusic-access-overlay";
    overlay.innerHTML = `
      <div class="akkomusic-access-box">
        <h1 class="akkomusic-access-title">AkkoMusic</h1>
        <p class="akkomusic-access-subtitle">${subtitle}</p>
        <div class="akkomusic-tabs">
          <button type="button" class="akkomusic-tab active" data-tab="login">Log in</button>
          <button type="button" class="akkomusic-tab" data-tab="signup">Sign up</button>
        </div>

        <div class="akkomusic-panel active" id="panel-login">
          <label class="akkomusic-label" for="akko-login-user">Username</label>
          <input class="akkomusic-field" id="akko-login-user" maxlength="32" autocomplete="username" spellcheck="false">
          <label class="akkomusic-label" for="akko-login-pass">Password</label>
          <input class="akkomusic-field" id="akko-login-pass" type="password" maxlength="128" autocomplete="current-password">
          <button type="button" class="akkomusic-access-button" id="akko-login-submit">Log in</button>
          <div class="akkomusic-access-error" id="akko-login-error"></div>
        </div>

        <div class="akkomusic-panel" id="panel-signup">
          <label class="akkomusic-label" for="akko-ref-code">Referral code</label>
          <input class="akkomusic-field" id="akko-ref-code" maxlength="16" spellcheck="false" value="${savedCode.replace(/"/g, "")}" placeholder="Code from admin">
          <label class="akkomusic-label" for="akko-reg-name">Your name</label>
          <input class="akkomusic-field" id="akko-reg-name" maxlength="64" autocomplete="name">
          <label class="akkomusic-label" for="akko-reg-user">Username</label>
          <input class="akkomusic-field" id="akko-reg-user" maxlength="32" autocomplete="username" spellcheck="false">
          <label class="akkomusic-label" for="akko-reg-pass">Password</label>
          <input class="akkomusic-field" id="akko-reg-pass" type="password" maxlength="128" autocomplete="new-password">
          <button type="button" class="akkomusic-access-button" id="akko-reg-submit">Create account</button>
          <div class="akkomusic-access-error" id="akko-reg-error"></div>
          <div class="akkomusic-access-ok" id="akko-reg-ok"></div>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const tabs = overlay.querySelectorAll(".akkomusic-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        overlay.querySelectorAll(".akkomusic-panel").forEach((p) => p.classList.remove("active"));
        overlay.querySelector("#panel-" + tab.dataset.tab)?.classList.add("active");
      });
    });

    const path = currentPath();
    const tabsWrap = overlay.querySelector(".akkomusic-tabs");
    if (path === "/register" || preferSignupTab()) {
      if (tabsWrap) tabsWrap.style.display = "none";
      tabs.forEach((x) => x.classList.remove("active"));
      overlay.querySelectorAll(".akkomusic-panel").forEach((p) => p.classList.remove("active"));
      const su = overlay.querySelector('.akkomusic-tab[data-tab="signup"]');
      const panel = overlay.querySelector("#panel-signup");
      if (su) su.classList.add("active");
      if (panel) panel.classList.add("active");
      const title = overlay.querySelector(".akkomusic-access-title");
      if (title) title.textContent = "Sign up";
    } else if (path === "/login") {
      if (tabsWrap) tabsWrap.style.display = "none";
      const title = overlay.querySelector(".akkomusic-access-title");
      if (title) title.textContent = "Log in";
    }

    const refInput = overlay.querySelector("#akko-ref-code");
    refInput.addEventListener("change", () => {
      const v = refInput.value.trim().toUpperCase();
      if (v) localStorage.setItem(REF_KEY, v);
    });
    refInput.addEventListener("blur", () => {
      const v = refInput.value.trim().toUpperCase();
      refInput.value = v;
      if (v) localStorage.setItem(REF_KEY, v);
    });

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
        if (data.ok && data.status === "approved") {
          loginBtn.textContent = "Done";
          unlockFast();
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

    loginBtn.addEventListener("click", doLogin);
    loginPass.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doLogin();
    });
    loginUser.addEventListener("keydown", (e) => {
      if (e.key === "Enter") loginPass.focus();
    });

    const regBtn = overlay.querySelector("#akko-reg-submit");
    const regErr = overlay.querySelector("#akko-reg-error");
    const regOk = overlay.querySelector("#akko-reg-ok");
    let regBusy = false;

    async function doRegister() {
      if (regBusy) return;
      regErr.textContent = "";
      regOk.textContent = "";
      const referralCode = refInput.value.trim().toUpperCase();
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
          if (ld.ok && ld.status === "approved") {
            unlockFast();
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

    regBtn.addEventListener("click", doRegister);
  }

  async function runGate() {
    lockUI();
    applyBwGateColors();
    document.getElementById("akkomusic-access-overlay")?.remove();
    document.getElementById("akkomusic-verify-overlay")?.remove();
    showVerifying("checking…");
    const session = await checkSession();
    if (session.valid) {
      unlockFast();
      return;
    }
    document.getElementById("akkomusic-verify-overlay")?.remove();
    const hint =
      session.reason === "pending" || session.reason === "denied" || session.reason === "revoked"
        ? session.reason
        : null;
    createGate(hint);
  }

  function isOnboardingDone() {
    return localStorage.getItem("akkomusic-onboarded") === "1";
  }

  function start() {
    document.body.classList.add("akkomusic-awaiting-access");
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

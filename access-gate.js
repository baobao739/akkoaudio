(() => {
  "use strict";

  const VERIFY_MIN_MS = 1500;

  const THEMES = {
    charcoal:  { bottom: "#1b1c24" },
    midnight:  { bottom: "#141a31" },
    ocean:     { bottom: "#102a39" },
    plum:      { bottom: "#251a2d" },
    dawn:      { bottom: "#352333" },
    forest:    { bottom: "#172c25" },
    lavender:  { bottom: "#2c2a45" },
    rosewood:  { bottom: "#321f2a" },
    ember:     { bottom: "#321e1a" },
    glacier:   { bottom: "#20343d" },
    cocoa:     { bottom: "#2d231f" },
    aurora:    { bottom: "#133b37" }
  };

  const STYLE = `
    #akkoflac-verify-overlay,
    #akkoflac-access-overlay {
      position: fixed !important;
      inset: 0 !important;
      left: 0 !important;
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      z-index: 2147483000 !important;
      isolation: isolate;
      margin: 0 !important;
      box-sizing: border-box;
    }

    #akkoflac-verify-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 26px;
      padding: 24px;
      background: var(--theme-bottom, var(--bg, #12141e));
      transition: opacity .45s ease, visibility .45s ease;
    }
    #akkoflac-verify-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .akkoflac-verify-spinner {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 3px solid color-mix(in srgb, var(--accent, #7b8cff) 22%, transparent);
      border-top-color: var(--accent, #7b8cff);
      animation: akkoVerifySpin .85s linear infinite;
      box-shadow: 0 0 24px color-mix(in srgb, var(--accent, #7b8cff) 35%, transparent);
    }
    @keyframes akkoVerifySpin { to { transform: rotate(360deg); } }
    .akkoflac-verify-text {
      color: var(--accent, #7b8cff);
      font-size: clamp(22px, 4vw, 28px);
      font-weight: 720;
      letter-spacing: -0.4px;
      text-shadow: 0 0 28px var(--accent-glow, rgba(123,140,255,.55));
      animation: akkoVerifyPulse 1.6s ease-in-out infinite;
    }
    @keyframes akkoVerifyPulse {
      0%, 100% { opacity: 0.72; }
      50% { opacity: 1; }
    }
    .akkoflac-verify-dots::after {
      content: "";
      display: inline-block;
      width: 1.2em;
      text-align: left;
      animation: akkoVerifyDots 1.4s steps(4, end) infinite;
    }
    @keyframes akkoVerifyDots {
      0%   { content: ""; }
      25%  { content: "."; }
      50%  { content: ".."; }
      75%  { content: "..."; }
      100% { content: ""; }
    }

    #akkoflac-access-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--theme-bottom, var(--bg, #121212));
      transition: opacity .45s ease, visibility .45s ease;
      overflow: auto;
    }
    #akkoflac-access-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .akkoflac-access-box {
      position: relative;
      z-index: 1;
      width: min(430px, 100%);
      padding: 34px;
      text-align: center;
      border: 1px solid var(--glass-border-strong, rgba(255,255,255,.14));
      border-radius: 28px;
      background: rgba(255,255,255,.055);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      box-shadow: 0 25px 80px rgba(0,0,0,.45), 0 0 45px var(--accent-glow, rgba(255,255,255,.08));
    }
    .akkoflac-revoked-banner {
      margin: 0 0 18px;
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid rgba(255, 92, 108, 0.45);
      background: rgba(255, 92, 108, 0.12);
      color: #ff929f;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.45;
    }
    .akkoflac-access-title {
      margin: 0 0 9px;
      color: var(--text, #fff);
      font-size: 28px;
      font-weight: 800;
    }
    .akkoflac-access-subtitle {
      margin: 0 0 25px;
      color: var(--text-soft, rgba(255,255,255,.62));
      font-size: 14px;
      line-height: 1.5;
    }
    .akkoflac-access-input {
      width: 100%;
      box-sizing: border-box;
      padding: 16px;
      border: 1px solid var(--glass-border, rgba(255,255,255,.1));
      border-radius: 16px;
      outline: none;
      background: rgba(255,255,255,.06);
      color: var(--text, #fff);
      text-align: center;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 7px;
      text-transform: uppercase;
      transition: .2s ease;
    }
    .akkoflac-access-input:focus {
      border-color: var(--accent, #fff);
      box-shadow: 0 0 0 3px var(--accent-glow, rgba(255,255,255,.12));
    }
    .akkoflac-access-button {
      width: 100%;
      margin-top: 14px;
      padding: 15px;
      border: 0;
      border-radius: 16px;
      cursor: pointer;
      background: var(--accent, #fff);
      color: var(--bg, #121212);
      font-size: 15px;
      font-weight: 800;
      transition: transform .18s ease, filter .18s ease;
    }
    .akkoflac-access-button:hover {
      transform: translateY(-2px);
      filter: brightness(1.08);
    }
    .akkoflac-access-button:active { transform: translateY(0); }
    .akkoflac-access-error {
      min-height: 20px;
      margin-top: 12px;
      color: #ff6b6b;
      font-size: 13px;
      font-weight: 700;
    }
    .akkoflac-access-shake { animation: akkoAccessShake .35s ease; }
    @keyframes akkoAccessShake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }

    body.akkoflac-gate-locked .sidebar,
    body.akkoflac-gate-locked .main,
    body.akkoflac-gate-locked .bottom-player,
    body.akkoflac-gate-locked .full-player,
    body.akkoflac-gate-locked .queue-panel,
    body.akkoflac-awaiting-access .sidebar,
    body.akkoflac-awaiting-access .main,
    body.akkoflac-awaiting-access .bottom-player,
    body.akkoflac-awaiting-access .full-player,
    body.akkoflac-awaiting-access .queue-panel {
      pointer-events: none !important;
      user-select: none !important;
      visibility: hidden !important;
    }
  `;

  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.appendChild(style);

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function lightenHex(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const lr = Math.min(255, Math.round(r + (255 - r) * amount));
    const lg = Math.min(255, Math.round(g + (255 - g) * amount));
    const lb = Math.min(255, Math.round(b + (255 - b) * amount));
    return "#" + [lr, lg, lb].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  function applySavedColors() {
    const root = document.documentElement;
    const accent = localStorage.getItem("akkoflac-accent") || "#7b8cff";
    const { r, g, b } = hexToRgb(accent);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-bright", lightenHex(accent, 0.18));
    root.style.setProperty("--accent-soft", `rgba(${r}, ${g}, ${b}, 0.15)`);
    root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.35)`);

    const themeName = localStorage.getItem("akkoflac-theme") || "charcoal";
    const theme = THEMES[themeName] || THEMES.charcoal;
    root.style.setProperty("--theme-bottom", theme.bottom);
    root.style.setProperty("--bg", theme.bottom);
    root.style.setProperty("--bg-deep", theme.bottom);
  }

  function lockUI() {
    document.body.classList.add("akkoflac-gate-locked", "akkoflac-awaiting-access");
    document.body.style.overflow = "hidden";
  }

  function unlockUI() {
    document.body.classList.remove("akkoflac-gate-locked", "akkoflac-awaiting-access");
    document.body.style.overflow = "";
  }

  function showVerifying() {
    if (document.getElementById("akkoflac-verify-overlay")) return;
    applySavedColors();
    lockUI();

    const overlay = document.createElement("div");
    overlay.id = "akkoflac-verify-overlay";
    overlay.setAttribute("aria-live", "polite");
    overlay.setAttribute("aria-busy", "true");
    overlay.innerHTML = `
      <div class="akkoflac-verify-spinner" aria-hidden="true"></div>
      <div class="akkoflac-verify-text">
        Verifying<span class="akkoflac-verify-dots"></span>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function hideVerifying() {
    const el = document.getElementById("akkoflac-verify-overlay");
    if (!el) return;
    el.classList.add("hidden");
    setTimeout(() => el.remove(), 500);
  }

  function createGate(opts = {}) {
    const existing = document.getElementById("akkoflac-access-overlay");
    if (existing) existing.remove();

    applySavedColors();
    lockUI();

    const revoked = !!opts.revoked;

    const overlay = document.createElement("div");
    overlay.id = "akkoflac-access-overlay";
    overlay.innerHTML = `
      <div class="akkoflac-access-box" id="akkoflac-access-box">
        ${revoked ? `<div class="akkoflac-revoked-banner">Access denied! Your access has been revoked. Enter a new access code to continue.</div>` : ""}
        <h1 class="akkoflac-access-title">Enter Access Code</h1>
        <p class="akkoflac-access-subtitle">Enter your 5-character AkkoFlac access code to continue.</p>
        <input id="akkoflac-access-input" class="akkoflac-access-input" type="text" maxlength="5" minlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="•••••" />
        <button id="akkoflac-access-button" class="akkoflac-access-button" type="button">Continue</button>
        <div id="akkoflac-access-error" class="akkoflac-access-error"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById("akkoflac-access-input");
    const button = document.getElementById("akkoflac-access-button");
    const error = document.getElementById("akkoflac-access-error");
    const box = document.getElementById("akkoflac-access-box");

    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase();
      error.textContent = "";
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") redeem();
    });
    button.addEventListener("click", redeem);

    async function redeem() {
      const code = input.value.trim().toUpperCase();
      if (code.length !== 5) {
        showError("Enter a 5-character code.");
        return;
      }
      button.disabled = true;
      button.textContent = "Checking...";
      try {
        const response = await fetch("/.netlify/functions/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.valid) {
          showError(data.error || "Invalid or already-used code.");
          return;
        }
        overlay.classList.add("hidden");
        unlockUI();
        setTimeout(() => overlay.remove(), 500);
      } catch {
        showError("Couldn't connect. Try again.");
      } finally {
        button.disabled = false;
        button.textContent = "Continue";
      }
    }

    function showError(message) {
      error.textContent = message;
      box.classList.remove("akkoflac-access-shake");
      void box.offsetWidth;
      box.classList.add("akkoflac-access-shake");
      button.disabled = false;
      button.textContent = "Continue";
    }

    setTimeout(() => input.focus(), 150);
  }

  async function checkAccess() {
    try {
      const response = await fetch("/.netlify/functions/access-status", { credentials: "include" });
      const data = await response.json();
      return {
        valid: !!data.valid,
        reason: data.reason || (data.valid ? "ok" : "none")
      };
    } catch {
      return { valid: false, reason: "error" };
    }
  }

  async function runVerifyThenGate() {
    if (runVerifyThenGate._running) return;
    runVerifyThenGate._running = true;

    showVerifying();

    const startTime = Date.now();
    const status = await checkAccess();

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, VERIFY_MIN_MS - elapsed);
    if (remaining > 0) {
      await new Promise(r => setTimeout(r, remaining));
    }

    hideVerifying();

    if (status.valid) {
      unlockUI();
      return;
    }

    createGate({ revoked: status.reason === "revoked" });
  }

  function isOnboardingDone() {
    return localStorage.getItem("akkoflac-onboarded") === "1";
  }

  function start() {
    document.body.classList.add("akkoflac-awaiting-access");

    if (isOnboardingDone()) {
      runVerifyThenGate();
      return;
    }

    const onboarding = document.getElementById("onboarding");

    const afterOnboarding = () => {
      if (!isOnboardingDone()) return;
      const hidden = !onboarding || onboarding.classList.contains("hidden");
      if (!hidden) return;
      observer.disconnect();
      runVerifyThenGate();
    };

    const observer = new MutationObserver(afterOnboarding);
    if (onboarding) {
      observer.observe(onboarding, { attributes: true, attributeFilter: ["class", "style"] });
    }

    window.addEventListener("storage", (e) => {
      if (e.key === "akkoflac-onboarded" && e.newValue === "1") afterOnboarding();
    });

    let pollId = null;
    const startPoll = () => {
      if (pollId) return;
      pollId = setInterval(() => {
        if (document.hidden) return;
        afterOnboarding();
        if (isOnboardingDone()) {
          clearInterval(pollId);
          pollId = null;
        }
      }, 400);
    };
    const stopPoll = () => {
      if (pollId) {
        clearInterval(pollId);
        pollId = null;
      }
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopPoll();
      else startPoll();
    });
    if (!document.hidden) startPoll();

    afterOnboarding();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

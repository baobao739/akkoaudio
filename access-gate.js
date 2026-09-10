(() => {
  "use strict";

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
      z-index: 2147483647 !important;
      isolation: isolate;
      margin: 0 !important;
      box-sizing: border-box;
    }

    #akkoflac-verify-overlay {
      display: block;
      padding: 0 !important;
      margin: 0 !important;
      background: #050505;
      color: #d7dce3;
      font-family: "SFMono-Regular", "Cascadia Code", "Roboto Mono", Consolas, monospace;
      transition: opacity .45s ease, visibility .45s ease;
      overflow: hidden;
    }
    #akkoflac-verify-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .akkoflac-terminal {
      width: 100%;
      height: 100%;
      min-height: 100%;
      max-height: none;
      margin: 0;
      display: flex;
      flex-direction: column;
      border: 0;
      border-radius: 0;
      background: #050505;
      box-shadow: none;
      overflow: hidden;
    }
    .akkoflac-terminal-bar {
      height: 36px;
      flex: 0 0 36px;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 0 12px;
      background: #101010;
      border-bottom: 1px solid rgba(255,255,255,.08);
      user-select: none;
    }
    .akkoflac-terminal-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: rgba(255,255,255,.18);
    }
    .akkoflac-terminal-title {
      margin-left: 7px;
      color: rgba(255,255,255,.45);
      font-size: 11px;
      letter-spacing: .02em;
    }
    .akkoflac-terminal-output {
      flex: 1;
      min-height: 0;
      padding: 14px 18px 28px;
      overflow-y: auto !important;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      touch-action: pan-y;
      font-size: clamp(12px, 1.55vw, 14px);
      line-height: 1.7;
      text-align: left;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,.18) transparent;
    }
    .akkoflac-terminal-line {
      opacity: 0;
      transform: translateY(4px);
      animation: akkoTerminalLineIn .22s ease forwards;
      white-space: pre-wrap;
    }
    .akkoflac-terminal-line .muted { color: rgba(255,255,255,.38); }
    .akkoflac-terminal-line .accent { color: var(--accent, #7b8cff); }
    .akkoflac-terminal-line .success { color: #66e39a; }
    .akkoflac-terminal-line .warn { color: #f5c76a; }
    .akkoflac-terminal-line .cursor {
      display: inline-block;
      width: 7px;
      height: 1.05em;
      vertical-align: -0.16em;
      margin-left: 3px;
      background: var(--accent, #7b8cff);
      animation: akkoTerminalCursor .8s steps(1,end) infinite;
    }
    @keyframes akkoTerminalLineIn {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes akkoTerminalCursor {
      0%, 48% { opacity: 1; }
      49%, 100% { opacity: 0; }
    }
    .akkoflac-terminal-prompt-wrap {
      display: inline-flex;
      align-items: center;
      vertical-align: baseline;
    }
    .akkoflac-terminal-input {
      width: 5ch;
      min-width: 5ch;
      height: 1.7em;
      margin: 0;
      padding: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--accent, #7b8cff);
      font: inherit;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
      caret-color: var(--accent, #7b8cff);
    }
    .akkoflac-terminal-input:disabled {
      opacity: .6;
    }

    .akkoflac-terminal-status {
      margin-top: 16px;
      color: var(--accent, #7b8cff);
      font-weight: 700;
    }
    .akkoflac-terminal-success {
      color: #66e39a !important;
      text-shadow: 0 0 22px rgba(102,227,154,.22);
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

  function clearPreverify() {
    document.documentElement.classList.remove("akkoflac-preverify");
  }

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
    clearPreverify();

    const overlay = document.createElement("div");
    overlay.id = "akkoflac-verify-overlay";
    overlay.setAttribute("aria-live", "polite");
    overlay.setAttribute("aria-busy", "true");
    overlay.innerHTML = `
      <div class="akkoflac-terminal">
        <div class="akkoflac-terminal-bar">
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-title">AkkoAudio Terminal</span>
        </div>
        <div class="akkoflac-terminal-output" id="akkoflac-terminal-output"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const output = overlay.querySelector("#akkoflac-terminal-output");

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const typeLine = async (text, kind = "muted", speed = 12) => {
      const line = document.createElement("div");
      line.className = "akkoflac-terminal-line";

      const textSpan = document.createElement("span");
      textSpan.className = kind;
      line.appendChild(textSpan);

      const cursor = document.createElement("span");
      cursor.className = "cursor";
      line.appendChild(cursor);
      output.appendChild(line);

      for (const char of text) {
        textSpan.textContent += char;
        output.scrollTop = output.scrollHeight;
        await sleep(speed + Math.random() * 8);
      }

      cursor.remove();
      await sleep(120 + Math.random() * 180);
      return line;
    };

    (async () => {
      await typeLine("[system] initializing secure access check...", "muted");
      await typeLine("[network] connecting to AkkoAudio cloud...", "muted");
      await typeLine("[network] connection established", "muted");
      await typeLine("[auth] checking access session...", "muted");
      await typeLine("[auth] validating session credentials...", "muted");
      await typeLine("[database] checking access status...", "muted");
      await typeLine("[security] checking code state...", "muted");
      await typeLine("[verification] waiting for server response", "accent");
    })();
  }

  async function showVerificationSuccess() {
    const overlay = document.getElementById("akkoflac-verify-overlay");
    if (!overlay) return;

    const output = overlay.querySelector("#akkoflac-terminal-output");
    if (!output) return;

    const cursor = output.querySelector(".cursor");
    if (cursor) cursor.remove();

    const line = document.createElement("div");
    line.className = "akkoflac-terminal-line akkoflac-terminal-success";
    line.innerHTML = `<span class="success">[success]</span> verification successful`;
    output.appendChild(line);

    const sub = document.createElement("div");
    sub.className = "akkoflac-terminal-line";
    sub.innerHTML = `<span class="muted">[system]</span> access granted — launching music player...`;
    output.appendChild(sub);

    await new Promise(r => setTimeout(r, 1500));
  }


  function hideVerifying() {
    const el = document.getElementById("akkoflac-verify-overlay");
    clearPreverify();
    if (!el) return;
    el.classList.add("hidden");
    setTimeout(() => el.remove(), 500);
  }

  function createGate(opts = {}) {
    clearPreverify();

    const old = document.getElementById("akkoflac-verify-overlay");
    if (old) old.remove();

    applySavedColors();
    lockUI();

    const revoked = !!opts.revoked;
    const overlay = document.createElement("div");
    overlay.id = "akkoflac-verify-overlay";
    overlay.setAttribute("aria-live", "polite");
    overlay.innerHTML = `
      <div class="akkoflac-terminal">
        <div class="akkoflac-terminal-bar">
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-title">AkkoAudio Terminal</span>
        </div>
        <div class="akkoflac-terminal-output" id="akkoflac-terminal-output"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const output = overlay.querySelector("#akkoflac-terminal-output");
    let promptInput = null;
    let promptLine = null;
    let submitting = false;

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const addLine = (text, kind = "muted") => {
      const line = document.createElement("div");
      line.className = "akkoflac-terminal-line";
      const span = document.createElement("span");
      span.className = kind;
      span.textContent = text;
      line.appendChild(span);
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
      return line;
    };

    const typeLine = async (text, kind = "muted", speed = 11) => {
      const line = document.createElement("div");
      line.className = "akkoflac-terminal-line";
      const span = document.createElement("span");
      span.className = kind;
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      line.append(span, cursor);
      output.appendChild(line);

      for (const char of text) {
        span.textContent += char;
        output.scrollTop = output.scrollHeight;
        await sleep(speed + Math.random() * 7);
      }
      cursor.remove();
      await sleep(100 + Math.random() * 160);
      return line;
    };

    function finishPrompt() {
      if (!promptLine || !promptInput) return;

      const value = promptInput.value.trim().toUpperCase();
      const wrap = promptLine.querySelector(".akkoflac-terminal-prompt-wrap");
      if (wrap) {
        wrap.innerHTML = "";
        const typed = document.createElement("span");
        typed.className = "accent";
        typed.textContent = value || "";
        wrap.appendChild(typed);
      }

      promptInput = null;
      promptLine = null;
    }

    function showPrompt() {
      // Never remove the previous prompt. Completed attempts stay in the terminal
      // history so the user can scroll back through every code attempt/result.
      finishPrompt();

      promptLine = document.createElement("div");
      promptLine.className = "akkoflac-terminal-line";
      promptLine.innerHTML = `<span class="accent">${opts.entry ? "TYPE AKKO TO ENTER:" : "ACCESS CODE:"}</span> <span class="akkoflac-terminal-prompt-wrap"></span>`;
      output.appendChild(promptLine);

      const wrap = promptLine.querySelector(".akkoflac-terminal-prompt-wrap");
      promptInput = document.createElement("input");
      promptInput.type = "text";
      promptInput.maxLength = opts.entry ? 4 : 5;
      promptInput.autocomplete = "off";
      promptInput.autocapitalize = "characters";
      promptInput.spellcheck = false;
      promptInput.className = "akkoflac-terminal-input";
      promptInput.setAttribute("aria-label", "Access code");
      promptInput.setAttribute("inputmode", "text");
      wrap.appendChild(promptInput);

      promptInput.addEventListener("input", () => {
        promptInput.value = promptInput.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase();
      });
      promptInput.addEventListener("keydown", e => {
        if (e.key === "Enter" && !submitting) redeem(promptInput.value.trim().toUpperCase());
      });

      setTimeout(() => promptInput && promptInput.focus(), 40);
      output.scrollTop = output.scrollHeight;
    }

    (async () => {
      if (opts.entry) {
        await typeLine("[auth] access verified", "success");
        await typeLine("[security] re-entry confirmation required", "muted");
        await typeLine("[terminal] type AKKO to enter the music player", "accent");
      } else {
        await typeLine("[auth] no active access session...", "muted");
        await typeLine("[security] access code required", "muted");
        if (revoked) await typeLine("[security] previous access code has been revoked", "warn");
        await typeLine("[terminal] type your access code below", "accent");
      }
      showPrompt();
    })();

    async function redeem(code) {
      if (submitting) return;

      // After a valid access code, require AKKO immediately.
      if (opts.entry) {
        if (code !== "AKKO") {
          submitting = true;
          if (promptInput) promptInput.disabled = true;
          finishPrompt();
          await typeLine("[error] type AKKO to enter AkkoAudio", "warn");
          submitting = false;
          showPrompt();
          return;
        }

        submitting = true;
        if (promptInput) promptInput.disabled = true;
        finishPrompt();
        await typeLine("[success] AKKO accepted", "success");
        await typeLine("[system] entering music player...", "muted");
        overlay.classList.add("hidden");
        unlockUI();
        setTimeout(() => overlay.remove(), 500);
        return;
      }

      if (code.length !== 5) {
        addLine("[error] access code must be 5 characters", "warn");
        if (promptInput) promptInput.focus();
        return;
      }

      submitting = true;
      if (promptInput) promptInput.disabled = true;
      finishPrompt();

      await typeLine("[auth] validating code...", "muted");
      await typeLine("[database] checking code status...", "muted");

      try {
        const response = await fetch("/.netlify/functions/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code })
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.valid) {
          const isRevoked = String(data.reason || data.error || "").toLowerCase().includes("revok");
          await typeLine(isRevoked ? "[security] this access code has been revoked" : "[error] invalid access code", "warn");
          await typeLine("[terminal] try another code...", "muted");
          submitting = false;
          showPrompt();
          return;
        }

        await typeLine("[success] verification successful", "success");
        await typeLine("[security] type AKKO to enter the music player", "accent");
        overlay.remove();
        createGate({ entry: true });
      } catch {
        await typeLine("[network] connection failed — try again", "warn");
        submitting = false;
        showPrompt();
      }
    }
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

    // Put the terminal over the player BEFORE the network check so the
    // music UI is never briefly usable while access is being verified.
    showVerifying();

    const status = await checkAccess();
    createGate(status.valid ? { entry: true } : { revoked: status.reason === "revoked" });
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

(() => {
  "use strict";

  const VERIFY_MIN_MS = 3000; // minimum time the verifying screen stays visible

  const STYLE = `
    /* ===== VERIFYING OVERLAY ===== */
    #akkoflac-verify-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000000;
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

    @keyframes akkoVerifySpin {
      to { transform: rotate(360deg); }
    }

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

    /* ===== ACCESS CODE OVERLAY (existing) ===== */
    #akkoflac-access-overlay {
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--theme-bottom, var(--bg, #121212));
      transition: opacity .45s ease, visibility .45s ease;
    }

    #akkoflac-access-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .akkoflac-access-box {
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

    /* Lock everything under the gate */
    body.akkoflac-gate-locked .sidebar,
    body.akkoflac-gate-locked .main,
    body.akkoflac-gate-locked .bottom-player,
    body.akkoflac-gate-locked .full-player,
    body.akkoflac-gate-locked .queue-panel,
    body.akkoflac-gate-locked .onboarding {
      pointer-events: none !important;
      user-select: none;
    }
  `;

  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.appendChild(style);

  /* ---------- VERIFYING SCREEN ---------- */
  function showVerifying() {
    if (document.getElementById("akkoflac-verify-overlay")) return;

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
    document.body.classList.add("akkoflac-gate-locked");
    document.body.style.overflow = "hidden";
  }

  function hideVerifying() {
    const el = document.getElementById("akkoflac-verify-overlay");
    if (!el) return;
    el.classList.add("hidden");
    setTimeout(() => el.remove(), 500);
  }

  /* ---------- ACCESS CODE GATE (original) ---------- */
  function createGate() {
    if (document.getElementById("akkoflac-access-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "akkoflac-access-overlay";
    overlay.innerHTML = `
      <div class="akkoflac-access-box" id="akkoflac-access-box">
        <h1 class="akkoflac-access-title">Enter Access Code</h1>
        <p class="akkoflac-access-subtitle">Enter your 5-character AkkoFlac access code to continue.</p>
        <input id="akkoflac-access-input" class="akkoflac-access-input" type="text" maxlength="5" minlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="•••••" />
        <button id="akkoflac-access-button" class="akkoflac-access-button" type="button">Continue</button>
        <div id="akkoflac-access-error" class="akkoflac-access-error"></div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("akkoflac-gate-locked");
    document.body.style.overflow = "hidden";

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
        document.body.classList.remove("akkoflac-gate-locked");
        document.body.style.overflow = "";
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

  /* ---------- ACCESS CHECK ---------- */
  async function checkAccess() {
    try {
      const response = await fetch("/.netlify/functions/access-status", { credentials: "include" });
      const data = await response.json();
      if (data.valid) return true;
    } catch {}
    return false;
  }

  /* ---------- MAIN FLOW ---------- */
  async function start() {
    // 1. Always show verifying screen first on every visit
    showVerifying();

    const startTime = Date.now();

    // 2. Run the real access check in parallel
    const hasAccess = await checkAccess();

    // 3. Enforce minimum verifying time so it always feels intentional
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, VERIFY_MIN_MS - elapsed);
    if (remaining > 0) {
      await new Promise(r => setTimeout(r, remaining));
    }

    // 4. Hide verifying
    hideVerifying();

    // 5. If already has access → unlock UI and let the player run
    if (hasAccess) {
      document.body.classList.remove("akkoflac-gate-locked");
      document.body.style.overflow = "";
      return;
    }

    // 6. No access → wait for onboarding to finish, then show code gate
    const onboarding = document.getElementById("onboarding");

    const showAfterOnboarding = () => {
      const onboardingDone = localStorage.getItem("akkoflac-onboarded") === "1";
      const onboardingHidden = !onboarding || onboarding.classList.contains("hidden");
      if (onboardingDone && onboardingHidden) {
        observer.disconnect();
        createGate();
      }
    };

    const observer = new MutationObserver(showAfterOnboarding);

    if (onboarding) {
      observer.observe(onboarding, { attributes: true, attributeFilter: ["class", "style"] });
    }

    // Handles users who already completed onboarding
    showAfterOnboarding();

    // Safety fallback
    setTimeout(() => {
      observer.disconnect();
      showAfterOnboarding();
    }, 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

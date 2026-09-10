(function () {
  "use strict";

  const VERIFY_MIN_MS = 1500;

  const THEMES = {
    charcoal: "#ff7a00",
    midnight: "#8b5cf6",
    ocean: "#38bdf8",
    plum: "#c084fc",
    dawn: "#f59e0b",
    forest: "#22c55e",
    lavender: "#a78bfa",
    rosewood: "#fb7185",
    ember: "#f97316",
    glacier: "#67e8f9",
    cocoa: "#d6a77a",
    aurora: "#34d399"
  };

  function injectStyles() {
    if (document.getElementById("akkoflac-access-gate-styles")) return;

    const style = document.createElement("style");
    style.id = "akkoflac-access-gate-styles";

    style.textContent = `
      html.akkoflac-preverify,
      html.akkoflac-preverify body {
        background: var(--preverify-bg, #111214) !important;
      }

      html.akkoflac-preverify body {
        visibility: hidden !important;
      }

      html.akkoflac-preverify::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        background: var(--preverify-bg, #111214);
        visibility: visible;
      }

      html.akkoflac-preverify::after {
        content: "Verifying...";
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 2147483647;
        color: var(--preverify-accent, #ff7a00);
        font: 600 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: .02em;
        visibility: visible;
      }

      #akkoflac-verifying {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--akkoflac-bg, #111214);
        color: var(--akkoflac-accent, #ff7a00);
        font: 600 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: .02em;
        opacity: 1;
        transition: opacity .25s ease;
      }

      #akkoflac-verifying.hidden {
        opacity: 0;
        pointer-events: none;
      }

      #akkoflac-verifying .verify-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
      }

      #akkoflac-verifying .verify-spinner {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 3px solid rgba(255,255,255,.12);
        border-top-color: var(--akkoflac-accent, #ff7a00);
        animation: akkoflacVerifySpin .8s linear infinite;
      }

      @keyframes akkoflacVerifySpin {
        to {
          transform: rotate(360deg);
        }
      }

      body.akkoflac-verifying-lock {
        overflow: hidden !important;
      }

      #akkoflac-access-gate {
        position: fixed;
        inset: 0;
        z-index: 1000000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: var(--akkoflac-bg, #111214);
        color: var(--akkoflac-text, #fff);
      }

      #akkoflac-access-gate .gate-card {
        width: min(420px, 100%);
        padding: 28px;
        border-radius: 24px;
        background: rgba(255,255,255,.045);
        border: 1px solid rgba(255,255,255,.08);
        box-shadow:
          12px 12px 30px rgba(0,0,0,.3),
          -8px -8px 24px rgba(255,255,255,.025);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }

      #akkoflac-access-gate h2 {
        margin: 0 0 8px;
        color: var(--akkoflac-accent, #ff7a00);
      }

      #akkoflac-access-gate p {
        margin: 0 0 18px;
        opacity: .72;
      }

      #akkoflac-access-gate input {
        width: 100%;
        box-sizing: border-box;
        padding: 13px 14px;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 13px;
        outline: none;
        background: rgba(0,0,0,.22);
        color: #fff;
        font: inherit;
      }

      #akkoflac-access-gate input:focus {
        border-color: var(--akkoflac-accent, #ff7a00);
      }

      #akkoflac-access-gate button {
        width: 100%;
        margin-top: 12px;
        padding: 13px 16px;
        border: 0;
        border-radius: 13px;
        background: var(--akkoflac-accent, #ff7a00);
        color: #111;
        font-weight: 700;
        cursor: pointer;
      }

      #akkoflac-access-gate .gate-error {
        min-height: 20px;
        margin-top: 10px;
        color: #ff6b6b;
        font-size: 13px;
      }
    `;

    document.head.appendChild(style);
  }

  function clearPreverify() {
    document.documentElement.classList.remove("akkoflac-preverify");
  }

  function getSavedTheme() {
    return localStorage.getItem("akkoflac-theme") || "charcoal";
  }

  function getSavedAccent() {
    return localStorage.getItem("akkoflac-accent") || THEMES[getSavedTheme()] || "#ff7a00";
  }

  function applySavedColors() {
    const root = document.documentElement;
    const accent = getSavedAccent();

    root.style.setProperty("--akkoflac-accent", accent);
    root.style.setProperty("--preverify-accent", accent);

    const bg =
      getComputedStyle(document.body).getPropertyValue("--bg") ||
      getComputedStyle(root).getPropertyValue("--bg") ||
      "#111214";

    root.style.setProperty("--preverify-bg", bg.trim() || "#111214");
  }

  function showVerifying() {
    clearPreverify();
    injectStyles();
    applySavedColors();

    document.body.classList.add("akkoflac-verifying-lock");

    let overlay = document.getElementById("akkoflac-verifying");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "akkoflac-verifying";

      overlay.innerHTML = `
        <div class="verify-inner">
          <div class="verify-spinner"></div>
          <div>Verifying...</div>
        </div>
      `;

      document.body.appendChild(overlay);
    }

    overlay.classList.remove("hidden");
  }

  function hideVerifying() {
    const overlay = document.getElementById("akkoflac-verifying");

    if (overlay) {
      overlay.classList.add("hidden");

      setTimeout(() => {
        overlay.remove();
      }, 300);
    }

    document.body.classList.remove("akkoflac-verifying-lock");
    clearPreverify();
  }

  async function checkAccess() {
    try {
      const response = await fetch("/.netlify/functions/access-status", {
        method: "GET",
        credentials: "include",
        cache: "no-store"
      });

      if (!response.ok) return false;

      const data = await response.json();

      return data && (
        data.active === true ||
        data.valid === true ||
        data.access === true
      );
    } catch (error) {
      console.error("Access check failed:", error);
      return false;
    }
  }

  function createGate(options = {}) {
    clearPreverify();
    injectStyles();
    applySavedColors();

    if (document.getElementById("akkoflac-access-gate")) return;

    document.body.classList.add("akkoflac-verifying-lock");

    const gate = document.createElement("div");
    gate.id = "akkoflac-access-gate";

    gate.innerHTML = `
      <div class="gate-card">
        <h2>${options.title || "Access Required"}</h2>

        <p>
          ${options.message || "Enter your access code to continue."}
        </p>

        <input
          id="akkoflac-access-code"
          type="text"
          autocomplete="off"
          placeholder="Access code"
        />

        <button id="akkoflac-access-submit">
          Continue
        </button>

        <div class="gate-error" id="akkoflac-access-error"></div>
      </div>
    `;

    document.body.appendChild(gate);

    const input = gate.querySelector("#akkoflac-access-code");
    const button = gate.querySelector("#akkoflac-access-submit");
    const error = gate.querySelector("#akkoflac-access-error");

    async function submitCode() {
      const code = input.value.trim();

      if (!code) {
        error.textContent = "Enter an access code.";
        return;
      }

      button.disabled = true;
      button.textContent = "Checking...";
      error.textContent = "";

      try {
        const response = await fetch("/.netlify/functions/verify-code", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code
          })
        });

        let data = {};

        try {
          data = await response.json();
        } catch (_) {}

        if (!response.ok || data.valid === false || data.success === false) {
          throw new Error(data.message || "Invalid access code.");
        }

        gate.remove();
        document.body.classList.remove("akkoflac-verifying-lock");
        clearPreverify();

        if (typeof options.onSuccess === "function") {
          options.onSuccess(data);
        }
      } catch (err) {
        error.textContent = err.message || "Invalid access code.";
        button.disabled = false;
        button.textContent = "Continue";
      }
    }

    button.addEventListener("click", submitCode);

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        submitCode();
      }
    });

    setTimeout(() => input.focus(), 50);
  }

  function isOnboardingDone() {
    return localStorage.getItem("akkoflac-onboarded") === "1";
  }

  async function runVerifyThenGate() {
    showVerifying();

    const started = performance.now();

    const accessPromise = checkAccess();

    const minimumDelay = new Promise(resolve => {
      const remaining = Math.max(
        0,
        VERIFY_MIN_MS - (performance.now() - started)
      );

      setTimeout(resolve, remaining);
    });

    const [hasAccess] = await Promise.all([
      accessPromise,
      minimumDelay
    ]);

    if (hasAccess) {
      hideVerifying();
      return;
    }

    hideVerifying();

    createGate({
      title: "Access Required",
      message: "Enter your access code to continue."
    });
  }

  function start() {
    injectStyles();
    applySavedColors();

    if (!isOnboardingDone()) {
      clearPreverify();
      return;
    }

    showVerifying();

    runVerifyThenGate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }
})();

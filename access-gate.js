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
        font-family:
          ui-monospace,
          SFMono-Regular,
          Menlo,
          Monaco,
          Consolas,
          "Liberation Mono",
          monospace;
        opacity: 1;
        transition: opacity .3s ease;
        padding: 24px;
        box-sizing: border-box;
      }

      #akkoflac-verifying.hidden {
        opacity: 0;
        pointer-events: none;
      }

      .akkoflac-terminal {
        width: min(760px, 100%);
        max-height: 80vh;
        overflow: hidden;
        border: 1px solid color-mix(
          in srgb,
          var(--akkoflac-accent, #ff7a00) 28%,
          transparent
        );
        border-radius: 16px;
        padding: 22px;
        box-sizing: border-box;
        background: rgba(0,0,0,.30);
        box-shadow:
          0 20px 70px rgba(0,0,0,.35),
          inset 0 0 30px rgba(255,255,255,.015);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }

      .akkoflac-terminal-output {
        font-size: 13px;
        line-height: 1.75;
        color: rgba(255,255,255,.68);
        white-space: pre-wrap;
        word-break: break-word;
      }

      .akkoflac-terminal-line {
        min-height: 23px;
      }

      .akkoflac-terminal-line.success {
        color: var(--akkoflac-accent, #ff7a00);
      }

      .akkoflac-terminal-line.error {
        color: #ff6b6b;
      }

      .akkoflac-terminal-input-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 5px;
      }

      .akkoflac-terminal-prompt {
        color: var(--akkoflac-accent, #ff7a00);
        white-space: nowrap;
      }

      .akkoflac-terminal-input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: 0;
        padding: 0;
        margin: 0;
        background: transparent;
        color: #fff;
        font: inherit;
        caret-color: var(--akkoflac-accent, #ff7a00);
      }

      .akkoflac-terminal-input::selection {
        background: var(--akkoflac-accent, #ff7a00);
        color: #111;
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
        padding: 24px;
        box-sizing: border-box;
        background: var(--akkoflac-bg, #111214);
        color: #fff;
        font-family:
          ui-monospace,
          SFMono-Regular,
          Menlo,
          Monaco,
          Consolas,
          "Liberation Mono",
          monospace;
      }

      .akkoflac-access-terminal {
        width: min(760px, 100%);
        border: 1px solid color-mix(
          in srgb,
          var(--akkoflac-accent, #ff7a00) 28%,
          transparent
        );
        border-radius: 16px;
        padding: 22px;
        box-sizing: border-box;
        background: rgba(0,0,0,.30);
        box-shadow:
          0 20px 70px rgba(0,0,0,.35),
          inset 0 0 30px rgba(255,255,255,.015);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }

      .akkoflac-access-output {
        font-size: 13px;
        line-height: 1.75;
        color: rgba(255,255,255,.7);
        white-space: pre-wrap;
        word-break: break-word;
      }

      .akkoflac-access-input-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 5px;
      }

      .akkoflac-access-input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: #fff;
        padding: 0;
        margin: 0;
        font: inherit;
        caret-color: var(--akkoflac-accent, #ff7a00);
      }

      .akkoflac-access-prompt {
        color: var(--akkoflac-accent, #ff7a00);
        white-space: nowrap;
      }

      .akkoflac-terminal-cursor {
        display: inline-block;
        width: 7px;
        height: 15px;
        margin-left: 2px;
        vertical-align: -2px;
        background: var(--akkoflac-accent, #ff7a00);
        animation: akkoflacCursor .9s steps(1) infinite;
      }

      @keyframes akkoflacCursor {
        0%, 49% {
          opacity: 1;
        }

        50%, 100% {
          opacity: 0;
        }
      }

      @media (max-width: 600px) {
        #akkoflac-verifying,
        #akkoflac-access-gate {
          padding: 14px;
        }

        .akkoflac-terminal,
        .akkoflac-access-terminal {
          padding: 16px;
          border-radius: 13px;
        }

        .akkoflac-terminal-output,
        .akkoflac-access-output,
        .akkoflac-terminal-input,
        .akkoflac-access-input {
          font-size: 12px;
        }
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
    return (
      localStorage.getItem("akkoflac-accent") ||
      THEMES[getSavedTheme()] ||
      "#ff7a00"
    );
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

    root.style.setProperty(
      "--preverify-bg",
      bg.trim() || "#111214"
    );
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function createVerifyingOverlay() {
    let overlay = document.getElementById("akkoflac-verifying");

    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "akkoflac-verifying";

    overlay.innerHTML = `
      <div class="akkoflac-terminal">
        <div class="akkoflac-terminal-output"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    return overlay;
  }

  function addTerminalLine(output, text, className = "") {
    const line = document.createElement("div");

    line.className =
      "akkoflac-terminal-line" +
      (className ? " " + className : "");

    line.textContent = text;

    output.appendChild(line);

    return line;
  }

  async function runTerminalVerification() {
    const overlay = createVerifyingOverlay();
    const output = overlay.querySelector(".akkoflac-terminal-output");

    output.innerHTML = "";

    addTerminalLine(
      output,
      "[system] AkkoAudio secure access verification"
    );

    await sleep(280);

    addTerminalLine(
      output,
      "[network] connecting to AkkoAudio cloud..."
    );

    await sleep(330);

    addTerminalLine(
      output,
      "[network] connection established"
    );

    await sleep(260);

    addTerminalLine(
      output,
      "[auth] checking active session..."
    );

    await sleep(300);

    addTerminalLine(
      output,
      "[security] checking access status..."
    );

    await sleep(250);

    const accessPromise = checkAccess();

    const hasAccess = await accessPromise;

    await sleep(250);

    if (hasAccess) {
      addTerminalLine(
        output,
        "[success] verification successful",
        "success"
      );

      await sleep(1500);

      hideVerifying();
      return true;
    }

    addTerminalLine(
      output,
      "[auth] no active access session",
      "error"
    );

    await sleep(350);

    addTerminalLine(
      output,
      "[security] access code required"
    );

    await sleep(300);

    hideVerifying();

    createGate();

    return false;
  }

  function showVerifying() {
    clearPreverify();
    injectStyles();
    applySavedColors();

    document.body.classList.add(
      "akkoflac-verifying-lock"
    );

    const overlay = createVerifyingOverlay();

    overlay.classList.remove("hidden");
  }

  function hideVerifying() {
    const overlay =
      document.getElementById("akkoflac-verifying");

    if (overlay) {
      overlay.classList.add("hidden");

      setTimeout(() => {
        overlay.remove();
      }, 350);
    }

    document.body.classList.remove(
      "akkoflac-verifying-lock"
    );

    clearPreverify();
  }

  async function checkAccess() {
    try {
      const response = await fetch(
        "/.netlify/functions/access-status",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        }
      );

      if (!response.ok) return false;

      const data = await response.json();

      return (
        data &&
        (
          data.active === true ||
          data.valid === true ||
          data.access === true
        )
      );
    } catch (error) {
      console.error(
        "Access check failed:",
        error
      );

      return false;
    }
  }

  function createGate() {
    clearPreverify();
    injectStyles();
    applySavedColors();

    const oldGate =
      document.getElementById(
        "akkoflac-access-gate"
      );

    if (oldGate) oldGate.remove();

    document.body.classList.add(
      "akkoflac-verifying-lock"
    );

    const gate = document.createElement("div");

    gate.id = "akkoflac-access-gate";

    gate.innerHTML = `
      <div class="akkoflac-access-terminal">
        <div class="akkoflac-access-output">
          <div>[system] AkkoAudio secure access terminal</div>
          <div>[security] access code required</div>
          <div>[terminal] enter your access code below</div>

          <div class="akkoflac-access-input-row">
            <span class="akkoflac-access-prompt">
              ACCESS CODE:
            </span>

            <input
              id="akkoflac-access-code"
              class="akkoflac-access-input"
              type="text"
              autocomplete="off"
              autocapitalize="characters"
              spellcheck="false"
              aria-label="Access code"
            />

            <span class="akkoflac-terminal-cursor"></span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(gate);

    const input =
      gate.querySelector(
        "#akkoflac-access-code"
      );

    const output =
      gate.querySelector(
        ".akkoflac-access-output"
      );

    input.focus();

    async function submitCode() {
      const code = input.value.trim();

      if (!code) return;

      input.disabled = true;

      const row =
        gate.querySelector(
          ".akkoflac-access-input-row"
        );

      row.insertAdjacentHTML(
        "afterend",
        `<div>[auth] validating access code...</div>`
      );

      await sleep(300);

      row.insertAdjacentHTML(
        "afterend",
        `<div>[database] checking code status...</div>`
      );

      try {
        const response = await fetch(
          "/.netlify/functions/verify-code",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              code
            })
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch (_) {}

        if (
          response.ok &&
          data.valid !== false &&
          data.success !== false
        ) {
          row.remove();

          addTerminalLine(
            output,
            "[success] verification successful",
            "success"
          );

          addTerminalLine(
            output,
            "[system] access granted"
          );

          await sleep(1500);

          gate.remove();

          document.body.classList.remove(
            "akkoflac-verifying-lock"
          );

          clearPreverify();

          return;
        }

        const message =
          String(
            data.message ||
            data.error ||
            ""
          ).toLowerCase();

        row.remove();

        if (
          message.includes("revok") ||
          message.includes("disabled") ||
          message.includes("inactive") ||
          message.includes("expired")
        ) {
          addTerminalLine(
            output,
            "[security] this access code has been revoked",
            "error"
          );

          addTerminalLine(
            output,
            "[terminal] enter another access code"
          );
        } else {
          addTerminalLine(
            output,
            "[error] invalid access code",
            "error"
          );

          addTerminalLine(
            output,
            "[terminal] try another code"
          );
        }

        addAccessPrompt(output);

      } catch (error) {
        row.remove();

        addTerminalLine(
          output,
          "[error] unable to contact verification server",
          "error"
        );

        addTerminalLine(
          output,
          "[terminal] check your connection and try again"
        );

        addAccessPrompt(output);
      }
    }

    function addAccessPrompt(output) {
      const oldPrompt =
        output.querySelector(
          ".akkoflac-access-input-row"
        );

      if (oldPrompt) oldPrompt.remove();

      const row =
        document.createElement("div");

      row.className =
        "akkoflac-access-input-row";

      row.innerHTML = `
        <span class="akkoflac-access-prompt">
          ACCESS CODE:
        </span>

        <input
          class="akkoflac-access-input"
          type="text"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
        />

        <span class="akkoflac-terminal-cursor"></span>
      `;

      output.appendChild(row);

      const newInput =
        row.querySelector(
          ".akkoflac-access-input"
        );

      newInput.focus();

      newInput.addEventListener(
        "keydown",
        event => {
          if (event.key === "Enter") {
            input.value = newInput.value;
            submitCode();
          }
        }
      );
    }

    input.addEventListener(
      "keydown",
      event => {
        if (event.key === "Enter") {
          submitCode();
        }
      }
    );
  }

  function isOnboardingDone() {
    return (
      localStorage.getItem(
        "akkoflac-onboarded"
      ) === "1"
    );
  }

  async function start() {
    injectStyles();
    applySavedColors();

    if (!isOnboardingDone()) {
      clearPreverify();
      return;
    }

    showVerifying();

    await runTerminalVerification();
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }
})();

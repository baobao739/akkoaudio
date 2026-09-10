(() => {
  "use strict";

  const OVERLAY_ID = "akkoflac-verify-overlay";
  const GATE_LOCK_CLASS = "akkoflac-gate-locked";

  const THEMES = {
    charcoal: "#1b1c24",
    midnight: "#141a31",
    ocean: "#102a39",
    plum: "#251a2d",
    dawn: "#352333",
    forest: "#172c25",
    lavender: "#2c2a45",
    rosewood: "#321f2a",
    ember: "#321e1a",
    glacier: "#20343d",
    cocoa: "#2d231f",
    aurora: "#133b37"
  };

  let started = false;

  /* =========================================================
     SAFE HELPERS
     ========================================================= */

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function removeExistingOverlay() {
    const old = document.getElementById(OVERLAY_ID);
    if (old) old.remove();
  }

  function unlockPage() {
    document.body.classList.remove(GATE_LOCK_CLASS);
    document.body.style.overflow = "";

    const onboarding = document.getElementById("onboarding");

    /*
      Do NOT touch onboarding visibility here.
      The main app owns onboarding.
    */
  }

  function lockPage() {
    document.body.classList.add(GATE_LOCK_CLASS);
    document.body.style.overflow = "hidden";
  }

  function getAccent() {
    const saved = localStorage.getItem("akkoflac-accent");

    if (
      saved &&
      /^#[0-9a-fA-F]{3}$/.test(saved)
    ) {
      return saved;
    }

    if (
      saved &&
      /^#[0-9a-fA-F]{6}$/.test(saved)
    ) {
      return saved;
    }

    return "#7b8cff";
  }

  function getThemeBackground() {
    const theme = localStorage.getItem("akkoflac-theme") || "charcoal";
    return THEMES[theme] || THEMES.charcoal;
  }

  /* =========================================================
     STYLES
     ========================================================= */

  function installStyles() {
    if (document.getElementById("akkoflac-access-gate-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "akkoflac-access-gate-styles";

    style.textContent = `
      /* =====================================================
         AKKOAUDIO ACCESS GATE
         Everything is uniquely prefixed to avoid collisions.
         ===================================================== */

      #akkoflac-verify-overlay {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        height: 100dvh !important;
        min-width: 100vw !important;
        min-height: 100vh !important;
        z-index: 2147483647 !important;

        display: block !important;

        margin: 0 !important;
        padding: 0 !important;

        background: #050505 !important;
        color: #d7dce3 !important;

        font-family:
          SFMono-Regular,
          SFMono-Regular,
          Consolas,
          "Liberation Mono",
          Menlo,
          monospace !important;

        box-sizing: border-box !important;

        overflow: hidden !important;

        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }

      #akkoflac-verify-overlay *,
      #akkoflac-verify-overlay *::before,
      #akkoflac-verify-overlay *::after {
        box-sizing: border-box !important;
      }

      #akkoflac-terminal-root {
        position: absolute !important;
        inset: 0 !important;

        width: 100% !important;
        height: 100% !important;

        display: flex !important;
        flex-direction: column !important;

        background: #050505 !important;

        color: #d7dce3 !important;
        font-family:
          SFMono-Regular,
          Consolas,
          "Liberation Mono",
          Menlo,
          monospace !important;

        overflow: hidden !important;
      }

      #akkoflac-terminal-header {
        flex: 0 0 38px !important;

        width: 100% !important;
        height: 38px !important;

        display: flex !important;
        align-items: center !important;

        gap: 7px !important;

        padding: 0 13px !important;

        background: #101010 !important;

        border-bottom: 1px solid rgba(255,255,255,.08) !important;

        color: rgba(255,255,255,.48) !important;

        font-family:
          SFMono-Regular,
          Consolas,
          monospace !important;

        font-size: 11px !important;
        line-height: 1 !important;

        user-select: none !important;
      }

      .akkoflac-terminal-dot {
        display: block !important;

        width: 9px !important;
        height: 9px !important;

        min-width: 9px !important;
        min-height: 9px !important;

        border-radius: 50% !important;

        background: rgba(255,255,255,.2) !important;
      }

      #akkoflac-terminal-name {
        margin-left: 7px !important;

        color: rgba(255,255,255,.42) !important;

        font-family:
          SFMono-Regular,
          Consolas,
          monospace !important;

        font-size: 11px !important;
        font-weight: 500 !important;
        letter-spacing: .02em !important;
      }

      #akkoflac-terminal-output {
        flex: 1 1 auto !important;

        width: 100% !important;
        min-height: 0 !important;

        padding: 16px 18px 30px !important;

        overflow-x: hidden !important;
        overflow-y: auto !important;

        background: #050505 !important;

        color: #d7dce3 !important;

        font-family:
          SFMono-Regular,
          Consolas,
          "Liberation Mono",
          Menlo,
          monospace !important;

        font-size: 14px !important;
        line-height: 1.72 !important;

        text-align: left !important;

        white-space: normal !important;

        scrollbar-width: thin !important;
      }

      .akkoflac-terminal-line {
        display: block !important;

        width: 100% !important;

        min-height: 24px !important;

        margin: 0 !important;
        padding: 0 !important;

        opacity: 1 !important;
        visibility: visible !important;

        transform: none !important;

        animation: none !important;
        transition: none !important;

        color: rgba(255,255,255,.42) !important;

        font-family:
          SFMono-Regular,
          Consolas,
          "Liberation Mono",
          Menlo,
          monospace !important;

        font-size: 14px !important;
        line-height: 1.72 !important;

        white-space: pre-wrap !important;
        word-break: break-word !important;
      }

      .akkoflac-terminal-line.system {
        color: rgba(255,255,255,.42) !important;
      }

      .akkoflac-terminal-line.accent {
        color: var(--akkoflac-gate-accent) !important;
      }

      .akkoflac-terminal-line.success {
        color: #66e39a !important;
      }

      .akkoflac-terminal-line.warning {
        color: #f5c76a !important;
      }

      .akkoflac-terminal-line.error {
        color: #ff7272 !important;
      }

      .akkoflac-terminal-cursor {
        display: inline-block !important;

        width: 7px !important;
        height: 1em !important;

        margin-left: 3px !important;

        vertical-align: -0.12em !important;

        background: var(--akkoflac-gate-accent) !important;

        opacity: 1 !important;

        animation:
          akkoflacGateCursor .75s steps(1,end) infinite !important;
      }

      @keyframes akkoflacGateCursor {
        0%, 49% {
          opacity: 1;
        }

        50%, 100% {
          opacity: 0;
        }
      }

      .akkoflac-gate-prompt {
        display: inline-flex !important;

        align-items: center !important;

        vertical-align: baseline !important;

        min-height: 24px !important;
      }

      .akkoflac-gate-input {
        display: inline-block !important;

        width: 7ch !important;
        min-width: 7ch !important;
        max-width: 7ch !important;

        height: 24px !important;

        margin: 0 !important;
        padding: 0 !important;

        border: 0 !important;
        outline: 0 !important;

        background: transparent !important;

        color: var(--akkoflac-gate-accent) !important;

        caret-color: var(--akkoflac-gate-accent) !important;

        font-family:
          SFMono-Regular,
          Consolas,
          "Liberation Mono",
          Menlo,
          monospace !important;

        font-size: 14px !important;
        font-weight: 700 !important;

        letter-spacing: .05em !important;

        text-transform: uppercase !important;
      }

      .akkoflac-gate-input:disabled {
        opacity: .55 !important;
      }

      #akkoflac-gate-title {
        color: var(--akkoflac-gate-accent) !important;

        font-weight: 700 !important;
      }

      #akkoflac-gate-title::selection,
      #akkoflac-terminal-output::selection {
        background: var(--akkoflac-gate-accent) !important;
        color: #050505 !important;
      }

      /* Hide the actual app ONLY while the access gate is active. */
      body.akkoflac-gate-locked .sidebar,
      body.akkoflac-gate-locked .main,
      body.akkoflac-gate-locked .bottom-player,
      body.akkoflac-gate-locked .full-player,
      body.akkoflac-gate-locked .queue-panel {
        visibility: hidden !important;
        pointer-events: none !important;
        user-select: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================================
     TERMINAL CREATION
     ========================================================= */

  function createOverlay() {
    removeExistingOverlay();

    const overlay = document.createElement("div");

    overlay.id = OVERLAY_ID;

    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-live", "polite");

    const accent = getAccent();

    overlay.style.setProperty(
      "--akkoflac-gate-accent",
      accent
    );

    overlay.innerHTML = `
      <div id="akkoflac-terminal-root">

        <div id="akkoflac-terminal-header">
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>

          <span id="akkoflac-terminal-name">
            AkkoAudio Terminal
          </span>
        </div>

        <div
          id="akkoflac-terminal-output"
          aria-live="polite"
        ></div>

      </div>
    `;

    document.body.appendChild(overlay);

    return overlay;
  }

  function addLine(output, text, type = "system") {
    const line = document.createElement("div");

    line.className =
      "akkoflac-terminal-line " + type;

    line.textContent = text;

    output.appendChild(line);

    output.scrollTop = output.scrollHeight;

    return line;
  }

  /* =========================================================
     FAST TYPEWRITER
     ========================================================= */

  async function typeLine(
    output,
    text,
    type = "system",
    speed = 2
  ) {
    const line = document.createElement("div");

    line.className =
      "akkoflac-terminal-line " + type;

    output.appendChild(line);

    const cursor = document.createElement("span");

    cursor.className =
      "akkoflac-terminal-cursor";

    line.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      cursor.before(
        document.createTextNode(text[i])
      );

      output.scrollTop = output.scrollHeight;

      await sleep(speed);
    }

    cursor.remove();

    output.scrollTop = output.scrollHeight;

    return line;
  }

  /* =========================================================
     VERIFICATION SCREEN
     ========================================================= */

  async function showVerificationScreen() {
    lockPage();

    const overlay = createOverlay();

    const output =
      document.getElementById(
        "akkoflac-terminal-output"
      );

    /*
      IMPORTANT:
      Put the first line on screen immediately.
      This prevents a completely blank terminal if
      anything asynchronous fails.
    */

    addLine(
      output,
      "AkkoAudio Version 1.07",
      "accent"
    );

    addLine(
      output,
      "",
      "system"
    );

    await typeLine(
      output,
      "[system] initializing secure access check...",
      "system"
    );

    await typeLine(
      output,
      "[network] connecting to AkkoAudio cloud...",
      "system"
    );

    await typeLine(
      output,
      "[network] connection established",
      "system"
    );

    await typeLine(
      output,
      "[auth] checking access session...",
      "system"
    );

    await typeLine(
      output,
      "[auth] validating session credentials...",
      "system"
    );

    await typeLine(
      output,
      "[database] checking access status...",
      "system"
    );

    await typeLine(
      output,
      "[security] checking code state...",
      "system"
    );

    await typeLine(
      output,
      "[verification] waiting for server response...",
      "accent"
    );

    return overlay;
  }

  /* =========================================================
     ACCESS CODE GATE
     ========================================================= */

  async function showAccessGate(revoked = false) {
    lockPage();

    const overlay = createOverlay();

    const output =
      document.getElementById(
        "akkoflac-terminal-output"
      );

    addLine(
      output,
      "AkkoAudio Version 1.07",
      "accent"
    );

    addLine(
      output,
      "",
      "system"
    );

    await typeLine(
      output,
      "[auth] no active access session...",
      "system"
    );

    await typeLine(
      output,
      "[security] access code required",
      "system"
    );

    if (revoked) {
      await typeLine(
        output,
        "[security] previous access code has been revoked",
        "warning"
      );
    }

    await typeLine(
      output,
      "[terminal] type your access code below",
      "accent"
    );

    createCodePrompt(overlay, output);

    return overlay;
  }

  function createCodePrompt(overlay, output) {
    const promptLine = document.createElement("div");

    promptLine.className =
      "akkoflac-terminal-line accent";

    promptLine.textContent = "ACCESS CODE: ";

    const wrap = document.createElement("span");

    wrap.className =
      "akkoflac-gate-prompt";

    const input = document.createElement("input");

    input.className =
      "akkoflac-gate-input";

    input.type = "text";
    input.maxLength = 5;

    input.autocomplete = "off";
    input.autocorrect = "off";
    input.autocapitalize = "characters";
    input.spellcheck = false;

    input.inputMode = "text";

    input.setAttribute(
      "aria-label",
      "Access code"
    );

    wrap.appendChild(input);
    promptLine.appendChild(wrap);

    output.appendChild(promptLine);

    output.scrollTop = output.scrollHeight;

    input.addEventListener(
      "input",
      () => {
        input.value =
          input.value
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(0, 5)
            .toUpperCase();
      }
    );

    input.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Enter" &&
          !input.disabled
        ) {
          redeemAccessCode(
            overlay,
            output,
            input
          );
        }
      }
    );

    setTimeout(() => {
      try {
        input.focus();
      } catch {}
    }, 100);

    return input;
  }

  /* =========================================================
     VERIFY ACCESS CODE
     ========================================================= */

  async function redeemAccessCode(
    overlay,
    output,
    input
  ) {
    if (!input || input.disabled) {
      return;
    }

    const code =
      input.value
        .trim()
        .toUpperCase();

    if (code.length !== 5) {
      addLine(
        output,
        "[error] access code must be 5 characters",
        "warning"
      );

      input.focus();
      return;
    }

    input.disabled = true;

    /*
      Replay exactly what the user entered.
    */

    await typeLine(
      output,
      "[terminal] ACCESS CODE: " + code,
      "accent"
    );

    await typeLine(
      output,
      "[auth] validating code...",
      "system"
    );

    await typeLine(
      output,
      "[database] checking code status...",
      "system"
    );

    try {
      const response = await fetch(
        "/.netlify/functions/verify-code",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          credentials: "include",

          cache: "no-store",

          body: JSON.stringify({
            code
          })
        }
      );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (
        !response.ok ||
        !data.valid
      ) {
        const reason =
          String(
            data.reason ||
            data.error ||
            ""
          ).toLowerCase();

        if (reason.includes("revok")) {
          await typeLine(
            output,
            "[security] this access code has been revoked",
            "warning"
          );
        } else {
          await typeLine(
            output,
            "[error] invalid access code",
            "warning"
          );
        }

        await typeLine(
          output,
          "[terminal] try another code...",
          "system"
        );

        input.disabled = false;
        input.value = "";

        input.focus();

        return;
      }

      await typeLine(
        output,
        "[success] verification successful",
        "success"
      );

      await typeLine(
        output,
        "[system] access granted",
        "system"
      );

      await typeLine(
        output,
        "[system] launching music player...",
        "accent"
      );

      /*
        Give the browser a moment to paint the final line,
        but do not use a long forced delay.
      */

      await sleep(350);

      overlay.remove();

      unlockPage();

    } catch (error) {
      console.error(
        "AkkoAudio access verification error:",
        error
      );

      await typeLine(
        output,
        "[network] connection failed — try again",
        "warning"
      );

      input.disabled = false;
      input.value = "";

      input.focus();
    }
  }

  /* =========================================================
     ACCESS STATUS
     ========================================================= */

  async function checkAccess() {
    try {
      const response =
        await fetch(
          "/.netlify/functions/access-status",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store"
          }
        );

      const data =
        await response
          .json()
          .catch(() => ({}));

      return {
        valid: data.valid === true,

        reason:
          data.reason ||
          (data.valid
            ? "ok"
            : "none")
      };

    } catch (error) {
      console.error(
        "AkkoAudio access-status error:",
        error
      );

      return {
        valid: false,
        reason: "error"
      };
    }
  }

  /* =========================================================
     SUCCESSFUL EXISTING SESSION
     ========================================================= */

  async function finishExistingSession(
    overlay
  ) {
    const output =
      document.getElementById(
        "akkoflac-terminal-output"
      );

    if (!output) {
      overlay.remove();
      unlockPage();
      return;
    }

    await typeLine(
      output,
      "[success] verification successful",
      "success"
    );

    await typeLine(
      output,
      "[system] access granted",
      "system"
    );

    await typeLine(
      output,
      "[system] launching music player...",
      "accent"
    );

    await sleep(350);

    overlay.remove();

    unlockPage();
  }

  /* =========================================================
     MAIN AUTH FLOW
     ========================================================= */

  async function runAuth() {
    if (runAuth.running) {
      return;
    }

    runAuth.running = true;

    try {
      /*
        Start the network request FIRST.
        The terminal renders independently.
      */

      const statusPromise =
        checkAccess();

      const overlay =
        await showVerificationScreen();

      const status =
        await statusPromise;

      if (status.valid) {
        await finishExistingSession(
          overlay
        );

        return;
      }

      overlay.remove();

      await showAccessGate(
        status.reason === "revoked"
      );

    } catch (error) {
      console.error(
        "AkkoAudio gate error:",
        error
      );

      /*
        Last-resort fallback.
        NEVER leave the user with a blank page.
      */

      removeExistingOverlay();

      const overlay =
        createOverlay();

      const output =
        document.getElementById(
          "akkoflac-terminal-output"
        );

      addLine(
        output,
        "AkkoAudio Version 1.07",
        "accent"
      );

      addLine(
        output,
        "",
        "system"
      );

      addLine(
        output,
        "[error] access gate encountered an unexpected error.",
        "error"
      );

      addLine(
        output,
        "[system] please refresh the page and try again.",
        "system"
      );

      console.error(
        "AkkoAudio fatal gate error:",
        error
      );
    }
  }

  /* =========================================================
     ONBOARDING
     ========================================================= */

  function onboardingFinished() {
    return (
      localStorage.getItem(
        "akkoflac-onboarded"
      ) === "1"
    );
  }

  function startAfterOnboarding() {
    if (!onboardingFinished()) {
      return false;
    }

    const onboarding =
      document.getElementById(
        "onboarding"
      );

    /*
      If onboarding still exists and isn't hidden,
      let the main page finish it first.
    */

    if (
      onboarding &&
      !onboarding.classList.contains(
        "hidden"
      )
    ) {
      return false;
    }

    runAuth();

    return true;
  }

  function start() {
    if (started) {
      return;
    }

    started = true;

    installStyles();

    /*
      If onboarding is already complete,
      immediately start authentication.
    */

    if (onboardingFinished()) {
      startAfterOnboarding();
      return;
    }

    const onboarding =
      document.getElementById(
        "onboarding"
      );

    /*
      Wait for the user's onboarding to finish.
    */

    if (onboarding) {
      const observer =
        new MutationObserver(() => {
          if (
            onboardingFinished() &&
            onboarding.classList.contains(
              "hidden"
            )
          ) {
            observer.disconnect();
            runAuth();
          }
        });

      observer.observe(
        onboarding,
        {
          attributes: true,
          attributeFilter: [
            "class",
            "style"
          ]
        });

      /*
        Safety polling in case another script
        changes localStorage without changing
        the onboarding class.
      */

      const poll =
        setInterval(() => {
          if (
            onboardingFinished() &&
            onboarding.classList.contains(
              "hidden"
            )
          ) {
            clearInterval(poll);
            observer.disconnect();
            runAuth();
          }
        }, 300);

      return;
    }

    /*
      If onboarding doesn't exist,
      do not block the entire site.
    */

    runAuth();
  }

  /* =========================================================
     START SAFELY
     ========================================================= */

  if (
    document.readyState ===
    "loading"
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

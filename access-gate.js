(() => {
  "use strict";

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
    #akkoflac-verify-overlay,
    #akkoflac-access-overlay {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      margin: 0 !important;
      padding: 0 !important;
      z-index: 2147483000 !important;
      box-sizing: border-box;
      isolation: isolate;
    }

    /* =========================================================
       FULL SCREEN TERMINAL
       ========================================================= */

    #akkoflac-verify-overlay {
      display: block;
      background: #050505;
      color: #d7dce3;
      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        "Liberation Mono",
        monospace;
      overflow: hidden;
      transition:
        opacity .45s ease,
        visibility .45s ease;
    }

    #akkoflac-verify-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .akkoflac-terminal {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #050505;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      overflow: hidden;
    }

    .akkoflac-terminal-bar {
      height: 36px;
      min-height: 36px;
      flex: 0 0 36px;

      display: flex;
      align-items: center;

      gap: 7px;
      padding: 0 13px;

      background: #101010;
      border-bottom: 1px solid rgba(255,255,255,.08);

      user-select: none;
      -webkit-user-select: none;
    }

    .akkoflac-terminal-dot {
      width: 9px;
      height: 9px;
      flex: 0 0 9px;
      border-radius: 50%;
      background: rgba(255,255,255,.18);
    }

    .akkoflac-terminal-title {
      margin-left: 7px;

      color: rgba(255,255,255,.45);

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 11px;
      letter-spacing: .02em;
    }

    .akkoflac-terminal-output {
      flex: 1;
      min-height: 0;

      width: 100%;
      box-sizing: border-box;

      padding:
        16px
        18px
        32px;

      overflow-y: auto;
      overflow-x: hidden;

      color: #d7dce3;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(12px, 1.55vw, 14px);
      line-height: 1.7;

      text-align: left;

      scrollbar-width: thin;
      scrollbar-color:
        rgba(255,255,255,.18)
        transparent;
    }

    .akkoflac-terminal-line {
      min-height: 1.7em;

      opacity: 0;
      transform: translateY(3px);

      animation:
        akkoTerminalLineIn
        .18s
        ease
        forwards;

      white-space: pre-wrap;
      word-break: break-word;
    }

    @keyframes akkoTerminalLineIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .akkoflac-terminal-line .muted {
      color: rgba(255,255,255,.48);
    }

    .akkoflac-terminal-line .accent {
      color: var(--accent, #7b8cff);
    }

    .akkoflac-terminal-line .success {
      color: #66e39a;
    }

    .akkoflac-terminal-line .warn {
      color: #f5c76a;
    }

    .akkoflac-terminal-line .cursor {
      display: inline-block;

      width: 7px;
      height: 1.05em;

      vertical-align: -0.16em;

      margin-left: 3px;

      background:
        var(--accent, #7b8cff);

      animation:
        akkoTerminalCursor
        .8s
        steps(1,end)
        infinite;
    }

    @keyframes akkoTerminalCursor {
      0%, 48% {
        opacity: 1;
      }

      49%, 100% {
        opacity: 0;
      }
    }

    .akkoflac-terminal-prompt-wrap {
      display: inline-flex;
      align-items: center;
      vertical-align: baseline;
    }

    .akkoflac-terminal-input {
      width: 5.5em;
      min-width: 5.5em;

      margin: 0;
      padding: 0;

      border: 0;
      outline: 0;

      background: transparent;

      color:
        var(--accent, #7b8cff);

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: inherit;
      font-weight: 700;

      letter-spacing: .08em;
      text-transform: uppercase;

      caret-color:
        var(--accent, #7b8cff);
    }

    .akkoflac-terminal-input:disabled {
      opacity: .6;
    }

    .akkoflac-terminal-success {
      text-shadow:
        0 0 22px
        rgba(102,227,154,.22);
    }

    /* =========================================================
       KEEP OLD ACCESS OVERLAY COMPATIBLE
       ========================================================= */

    #akkoflac-access-overlay {
      display: flex;
      align-items: center;
      justify-content: center;

      background:
        var(--theme-bottom,
        var(--bg, #121212));

      overflow: auto;
    }

    #akkoflac-access-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
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

    @media (max-width: 600px) {
      .akkoflac-terminal-output {
        padding:
          14px
          13px
          28px;

        font-size: 12px;
        line-height: 1.75;
      }

      .akkoflac-terminal-bar {
        height: 34px;
        min-height: 34px;
        flex-basis: 34px;
      }

      .akkoflac-terminal-title {
        font-size: 10px;
      }
    }
  `;

  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.appendChild(style);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function clearPreverify() {
    document.documentElement.classList.remove(
      "akkoflac-preverify"
    );
  }

  function hexToRgb(hex) {
    const h = String(hex || "#7b8cff").replace("#", "");

    const full =
      h.length === 3
        ? h.split("").map(c => c + c).join("")
        : h;

    const n = parseInt(full, 16);

    return {
      r: (n >> 16) & 255,
      g: (n >> 8) & 255,
      b: n & 255
    };
  }

  function lightenHex(hex, amount) {
    const { r, g, b } = hexToRgb(hex);

    const lr =
      Math.min(
        255,
        Math.round(r + (255 - r) * amount)
      );

    const lg =
      Math.min(
        255,
        Math.round(g + (255 - g) * amount)
      );

    const lb =
      Math.min(
        255,
        Math.round(b + (255 - b) * amount)
      );

    return "#" +
      [lr, lg, lb]
        .map(v =>
          v.toString(16).padStart(2, "0")
        )
        .join("");
  }

  function applySavedColors() {
    const root = document.documentElement;

    const accent =
      localStorage.getItem("akkoflac-accent") ||
      "#7b8cff";

    const { r, g, b } = hexToRgb(accent);

    root.style.setProperty(
      "--accent",
      accent
    );

    root.style.setProperty(
      "--accent-bright",
      lightenHex(accent, .18)
    );

    root.style.setProperty(
      "--accent-soft",
      `rgba(${r}, ${g}, ${b}, .15)`
    );

    root.style.setProperty(
      "--accent-glow",
      `rgba(${r}, ${g}, ${b}, .35)`
    );

    const themeName =
      localStorage.getItem("akkoflac-theme") ||
      "charcoal";

    const theme =
      THEMES[themeName] ||
      THEMES.charcoal;

    root.style.setProperty(
      "--theme-bottom",
      theme.bottom
    );

    root.style.setProperty(
      "--bg",
      theme.bottom
    );

    root.style.setProperty(
      "--bg-deep",
      theme.bottom
    );
  }

  function lockUI() {
    document.body.classList.add(
      "akkoflac-gate-locked",
      "akkoflac-awaiting-access"
    );

    document.body.style.overflow = "hidden";
  }

  function unlockUI() {
    document.body.classList.remove(
      "akkoflac-gate-locked",
      "akkoflac-awaiting-access"
    );

    document.body.style.overflow = "";
  }

  function createTerminal() {
    const overlay =
      document.createElement("div");

    overlay.id =
      "akkoflac-verify-overlay";

    overlay.setAttribute(
      "aria-live",
      "polite"
    );

    overlay.innerHTML = `
      <div class="akkoflac-terminal">

        <div class="akkoflac-terminal-bar">
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>

          <span class="akkoflac-terminal-title">
            AkkoAudio Terminal
          </span>
        </div>

        <div
          class="akkoflac-terminal-output"
          id="akkoflac-terminal-output"
        ></div>

      </div>
    `;

    document.body.appendChild(overlay);

    return overlay;
  }

  async function typeTerminalLine(
    output,
    text,
    kind = "muted",
    speed = 10
  ) {
    const line =
      document.createElement("div");

    line.className =
      "akkoflac-terminal-line";

    const span =
      document.createElement("span");

    span.className = kind;

    const cursor =
      document.createElement("span");

    cursor.className = "cursor";

    line.appendChild(span);
    line.appendChild(cursor);

    output.appendChild(line);

    output.scrollTop =
      output.scrollHeight;

    for (const character of text) {
      span.textContent += character;

      output.scrollTop =
        output.scrollHeight;

      const randomSpeed =
        speed +
        Math.random() * 7;

      await sleep(randomSpeed);
    }

    cursor.remove();

    await sleep(
      100 +
      Math.random() * 150
    );

    return line;
  }

  function addTerminalLine(
    output,
    text,
    kind = "muted"
  ) {
    const line =
      document.createElement("div");

    line.className =
      "akkoflac-terminal-line";

    const span =
      document.createElement("span");

    span.className = kind;
    span.textContent = text;

    line.appendChild(span);
    output.appendChild(line);

    output.scrollTop =
      output.scrollHeight;

    return line;
  }

  async function showVerifying() {
    if (
      document.getElementById(
        "akkoflac-verify-overlay"
      )
    ) {
      return;
    }

    applySavedColors();
    lockUI();

    const overlay =
      createTerminal();

    const output =
      overlay.querySelector(
        "#akkoflac-terminal-output"
      );

    await typeTerminalLine(
      output,
      "[system] initializing AkkoAudio secure terminal...",
      "muted",
      8
    );

    await typeTerminalLine(
      output,
      "[system] loading verification module...",
      "muted",
      8
    );

    await typeTerminalLine(
      output,
      "[network] connecting to AkkoAudio cloud...",
      "muted",
      8
    );

    await typeTerminalLine(
      output,
      "[network] connection established",
      "muted",
      8
    );

    await typeTerminalLine(
      output,
      "[auth] checking active session...",
      "muted",
      8
    );

    await typeTerminalLine(
      output,
      "[security] checking session credentials...",
      "muted",
      8
    );

    await typeTerminalLine(
      output,
      "[database] checking access status...",
      "muted",
      8
    );

    await typeTerminalLine(
      output,
      "[security] checking code state...",
      "muted",
      8
    );

    await typeTerminalLine(
      output,
      "[verification] waiting for server response...",
      "accent",
      8
    );

    return overlay;
  }

  async function showVerificationSuccess() {
    const overlay =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    if (!overlay) return;

    const output =
      overlay.querySelector(
        "#akkoflac-terminal-output"
      );

    if (!output) return;

    await typeTerminalLine(
      output,
      "[success] verification successful",
      "success",
      9
    );

    await typeTerminalLine(
      output,
      "[system] access granted",
      "success",
      9
    );

    await typeTerminalLine(
      output,
      "[system] launching AkkoAudio...",
      "muted",
      9
    );

    await sleep(1500);
  }

  function hideVerifying() {
    const overlay =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    clearPreverify();

    if (!overlay) return;

    overlay.classList.add("hidden");

    setTimeout(() => {
      overlay.remove();
    }, 500);
  }

  function createGate(opts = {}) {
    clearPreverify();

    const old =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    if (old) old.remove();

    applySavedColors();
    lockUI();

    const revoked =
      !!opts.revoked;

    const overlay =
      createTerminal();

    const output =
      overlay.querySelector(
        "#akkoflac-terminal-output"
      );

    let promptInput = null;
    let promptLine = null;
    let submitting = false;

    function showPrompt() {
      if (promptLine) {
        promptLine.remove();
      }

      promptLine =
        document.createElement("div");

      promptLine.className =
        "akkoflac-terminal-line";

      const label =
        document.createElement("span");

      label.className = "accent";
      label.textContent =
        "ACCESS CODE: ";

      const wrap =
        document.createElement("span");

      wrap.className =
        "akkoflac-terminal-prompt-wrap";

      promptLine.appendChild(label);
      promptLine.appendChild(wrap);

      output.appendChild(promptLine);

      promptInput =
        document.createElement("input");

      promptInput.type = "text";
      promptInput.maxLength = 5;
      promptInput.autocomplete = "off";
      promptInput.autocapitalize =
        "characters";
      promptInput.spellcheck = false;

      promptInput.className =
        "akkoflac-terminal-input";

      promptInput.setAttribute(
        "aria-label",
        "Access code"
      );

      promptInput.setAttribute(
        "inputmode",
        "text"
      );

      wrap.appendChild(promptInput);

      promptInput.addEventListener(
        "input",
        () => {
          promptInput.value =
            promptInput.value
              .replace(
                /[^a-zA-Z0-9]/g,
                ""
              )
              .slice(0, 5)
              .toUpperCase();
        }
      );

      promptInput.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" &&
            !submitting
          ) {
            redeem(
              promptInput.value
                .trim()
                .toUpperCase()
            );
          }
        }
      );

      setTimeout(() => {
        if (promptInput) {
          promptInput.focus();
        }
      }, 40);

      output.scrollTop =
        output.scrollHeight;
    }

    (async () => {
      await typeTerminalLine(
        output,
        "[auth] no active access session...",
        "muted",
        8
      );

      await typeTerminalLine(
        output,
        "[security] access code required",
        "muted",
        8
      );

      if (revoked) {
        await typeTerminalLine(
          output,
          "[security] previous access code has been revoked",
          "warn",
          8
        );
      }

      await typeTerminalLine(
        output,
        "[terminal] enter your access code below",
        "accent",
        8
      );

      showPrompt();
    })();

    async function redeem(code) {
      if (submitting) return;

      if (code.length !== 5) {
        addTerminalLine(
          output,
          "[error] access code must be 5 characters",
          "warn"
        );

        if (promptInput) {
          promptInput.focus();
        }

        return;
      }

      submitting = true;

      if (promptInput) {
        promptInput.disabled = true;
      }

      await typeTerminalLine(
        output,
        "[auth] validating access code...",
        "muted",
        8
      );

      await typeTerminalLine(
        output,
        "[database] checking code status...",
        "muted",
        8
      );

      try {
        const response =
          await fetch(
            "/.netlify/functions/verify-code",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              credentials: "include",

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

          const isRevoked =
            reason.includes("revok");

          await typeTerminalLine(
            output,
            isRevoked
              ? "[security] this access code has been revoked"
              : "[error] invalid access code",
            "warn",
            8
          );

          await typeTerminalLine(
            output,
            "[terminal] try another code...",
            "muted",
            8
          );

          submitting = false;

          showPrompt();

          return;
        }

        await typeTerminalLine(
          output,
          "[success] verification successful",
          "success",
          8
        );

        await typeTerminalLine(
          output,
          "[system] access granted",
          "success",
          8
        );

        await typeTerminalLine(
          output,
          "[system] launching AkkoAudio...",
          "muted",
          8
        );

        await sleep(1500);

        overlay.classList.add(
          "hidden"
        );

        unlockUI();

        setTimeout(() => {
          overlay.remove();
        }, 500);

      } catch (error) {
        await typeTerminalLine(
          output,
          "[network] connection failed — try again",
          "warn",
          8
        );

        submitting = false;

        showPrompt();
      }
    }
  }

  async function checkAccess() {
    try {
      const response =
        await fetch(
          "/.netlify/functions/access-status",
          {
            credentials: "include"
          }
        );

      const data =
        await response.json();

      return {
        valid: !!data.valid,
        reason:
          data.reason ||
          (
            data.valid
              ? "ok"
              : "none"
          )
      };

    } catch {
      return {
        valid: false,
        reason: "error"
      };
    }
  }

  async function runVerifyThenGate() {
    if (
      runVerifyThenGate._running
    ) {
      return;
    }

    runVerifyThenGate._running =
      true;

    const verification =
      showVerifying();

    const statusPromise =
      checkAccess();

    await verification;

    const status =
      await statusPromise;

    if (status.valid) {
      await showVerificationSuccess();

      hideVerifying();

      unlockUI();

      return;
    }

    hideVerifying();

    createGate({
      revoked:
        status.reason === "revoked"
    });
  }

  function isOnboardingDone() {
    return (
      localStorage.getItem(
        "akkoflac-onboarded"
      ) === "1"
    );
  }

  function start() {
    document.body.classList.add(
      "akkoflac-awaiting-access"
    );

    if (isOnboardingDone()) {
      runVerifyThenGate();
      return;
    }

    const onboarding =
      document.getElementById(
        "onboarding"
      );

    const afterOnboarding = () => {
      if (!isOnboardingDone()) {
        return;
      }

      const hidden =
        !onboarding ||
        onboarding.classList.contains(
          "hidden"
        );

      if (!hidden) return;

      observer.disconnect();

      runVerifyThenGate();
    };

    const observer =
      new MutationObserver(
        afterOnboarding
      );

    if (onboarding) {
      observer.observe(
        onboarding,
        {
          attributes: true,
          attributeFilter: [
            "class",
            "style"
          ]
        }
      );
    }

    window.addEventListener(
      "storage",
      event => {
        if (
          event.key ===
            "akkoflac-onboarded" &&
          event.newValue === "1"
        ) {
          afterOnboarding();
        }
      }
    );

    let pollId = null;

    const startPoll = () => {
      if (pollId) return;

      pollId =
        setInterval(() => {
          if (document.hidden) {
            return;
          }

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

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          stopPoll();
        } else {
          startPoll();
        }
      }
    );

    if (!document.hidden) {
      startPoll();
    }

    afterOnboarding();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      start
    );
  } else {
    start();
  }

})();

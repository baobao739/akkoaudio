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

    .akkoflac-terminal-overlay {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      z-index: 2147483647 !important;
      background: #050505;
      color: #d7dce3;
      font-family: "SFMono-Regular", "Cascadia Code", "Roboto Mono", Consolas, monospace;
      overflow: hidden;
    }

    .akkoflac-terminal-window {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #050505;
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

    .akkoflac-terminal-line .muted {
      color: rgba(255,255,255,.38);
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
      background: var(--accent, #7b8cff);
      animation: akkoTerminalCursor .8s steps(1,end) infinite;
    }

    @keyframes akkoTerminalLineIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
      box-shadow:
        0 25px 80px rgba(0,0,0,.45),
        0 0 45px var(--accent-glow, rgba(255,255,255,.08));
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

    .akkoflac-access-button:active {
      transform: translateY(0);
    }

    .akkoflac-access-error {
      min-height: 20px;
      margin-top: 12px;
      color: #ff6b6b;
      font-size: 13px;
      font-weight: 700;
    }

    .akkoflac-access-shake {
      animation: akkoAccessShake .35s ease;
    }

    @keyframes akkoAccessShake {
      0%,100% {
        transform: translateX(0);
      }

      20% {
        transform: translateX(-8px);
      }

      40% {
        transform: translateX(8px);
      }

      60% {
        transform: translateX(-6px);
      }

      80% {
        transform: translateX(6px);
      }
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

    const full = h.length === 3
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

    const lr = Math.min(
      255,
      Math.round(r + (255 - r) * amount)
    );

    const lg = Math.min(
      255,
      Math.round(g + (255 - g) * amount)
    );

    const lb = Math.min(
      255,
      Math.round(b + (255 - b) * amount)
    );

    return "#" + [lr, lg, lb]
      .map(v => v.toString(16).padStart(2, "0"))
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
      lightenHex(accent, 0.18)
    );

    root.style.setProperty(
      "--accent-soft",
      `rgba(${r}, ${g}, ${b}, 0.15)`
    );

    root.style.setProperty(
      "--accent-glow",
      `rgba(${r}, ${g}, ${b}, 0.35)`
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
      "akkoflac-gate-locked"
    );

    document.body.classList.add(
      "akkoflac-awaiting-access"
    );
  }

  function unlockUI() {
    document.body.classList.remove(
      "akkoflac-gate-locked"
    );

    document.body.classList.remove(
      "akkoflac-awaiting-access"
    );

    clearPreverify();
  }

  function sleep(ms) {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
  }

  async function checkAccess() {
    try {
      const response = await fetch(
        "/.netlify/functions/access-status",
        {
          credentials: "include",
          cache: "no-store"
        }
      );

      if (!response.ok) {
        return {
          valid: false,
          reason: "unavailable"
        };
      }

      const data =
        await response.json()
          .catch(() => ({}));

      return {
        valid: !!data.valid,
        reason: data.reason || ""
      };
    } catch {
      return {
        valid: false,
        reason: "network"
      };
    }
  }

  function createTerminalOverlay() {
    const overlay =
      document.createElement("div");

    overlay.className =
      "akkoflac-terminal-overlay";

    overlay.id =
      "akkoflac-start-terminal";

    overlay.innerHTML = `
      <div class="akkoflac-terminal-window">
        <div class="akkoflac-terminal">
          <div class="akkoflac-terminal-bar">
            <span class="akkoflac-terminal-dot"></span>
            <span class="akkoflac-terminal-dot"></span>
            <span class="akkoflac-terminal-dot"></span>

            <span class="akkoflac-terminal-title">
              AkkoAudio Authentication Terminal
            </span>
          </div>

          <div class="akkoflac-terminal-output"></div>
        </div>
      </div>
    `;

    document.body.appendChild(
      overlay
    );

    return {
      overlay,
      output:
        overlay.querySelector(
          ".akkoflac-terminal-output"
        )
    };
  }

  function showVerifying() {
    let overlay =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    if (!overlay) {
      overlay =
        document.createElement("div");

      overlay.id =
        "akkoflac-verify-overlay";

      overlay.innerHTML = `
        <div style="
          display:flex;
          width:100%;
          height:100%;
          align-items:center;
          justify-content:center;
          background:#050505;
          font-family:monospace;
          color:var(--accent,#7b8cff);
        ">
          verifying...
        </div>
      `;

      document.body.appendChild(
        overlay
      );
    }

    overlay.classList.remove(
      "hidden"
    );

    return overlay;
  }

  function showVerificationSuccess() {
    const overlay =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    if (!overlay) {
      return;
    }

    overlay.innerHTML = `
      <div style="
        width:100%;
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#050505;
        color:#66e39a;
        font-family:monospace;
        font-weight:700;
      ">
        VERIFIED
      </div>
    `;
  }

  function createGate() {
    let overlay =
      document.getElementById(
        "akkoflac-access-overlay"
      );

    if (overlay) {
      overlay.remove();
    }

    overlay =
      document.createElement("div");

    overlay.id =
      "akkoflac-access-overlay";

    overlay.innerHTML = `
      <div class="akkoflac-access-box">

        <h1 class="akkoflac-access-title">
          AkkoAudio
        </h1>

        <p class="akkoflac-access-subtitle">
          Enter your 5-character access code to continue.
        </p>

        <input
          class="akkoflac-access-input"
          maxlength="5"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          inputmode="text"
          aria-label="Access code"
        >

        <button class="akkoflac-access-button">
          Continue
        </button>

        <div class="akkoflac-access-error"></div>

      </div>
    `;

    document.body.appendChild(
      overlay
    );

    return overlay;
  }

  async function runVerifyThenGate() {
    lockUI();

    const existingGate =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    if (existingGate) {
      existingGate.remove();
    }

    const existingStart =
      document.getElementById(
        "akkoflac-start-terminal"
      );

    if (existingStart) {
      existingStart.remove();
    }

    applySavedColors();

    const {
      overlay,
      output
    } = createTerminalOverlay();

    const typeLine = async (
      msg,
      type = "muted",
      speed = 9
    ) => {
      const el =
        document.createElement("div");

      el.className =
        "akkoflac-terminal-line";

      const text =
        document.createElement("span");

      text.className = type;

      const cursor =
        document.createElement("span");

      cursor.className =
        "cursor";

      el.appendChild(text);
      el.appendChild(cursor);

      output.appendChild(el);

      output.scrollTop =
        output.scrollHeight;

      for (const char of msg) {
        text.textContent += char;

        output.scrollTop =
          output.scrollHeight;

        await sleep(
          speed + Math.random() * 5
        );
      }

      cursor.remove();

      await sleep(90);

      return el;
    };

    const blankLine = async () => {
      const el =
        document.createElement("div");

      el.className =
        "akkoflac-terminal-line";

      el.innerHTML =
        "&nbsp;";

      output.appendChild(el);

      output.scrollTop =
        output.scrollHeight;

      await sleep(80);
    };

    const makePrompt = (
      label,
      maxLength,
      onSubmit
    ) => {
      const row =
        document.createElement("div");

      row.className =
        "akkoflac-terminal-input-row";

      row.innerHTML =
        `<span>${label}</span>`;

      const input =
        document.createElement("input");

      input.type =
        "text";

      input.autocomplete =
        "off";

      input.autocapitalize =
        "characters";

      input.spellcheck =
        false;

      input.maxLength =
        maxLength;

      input.className =
        "akkoflac-terminal-input";

      input.inputMode =
        "text";

      input.setAttribute(
        "aria-label",
        label.trim()
      );

      row.appendChild(input);

      output.appendChild(row);

      output.scrollTop =
        output.scrollHeight;

      setTimeout(() => {
        input.focus();
      }, 40);

      input.addEventListener(
        "input",
        () => {
          input.value =
            input.value
              .replace(
                /[^a-zA-Z0-9]/g,
                ""
              )
              .slice(
                0,
                maxLength
              )
              .toUpperCase();
        }
      );

      input.addEventListener(
        "keydown",
        e => {
          if (e.key !== "Enter") {
            return;
          }

          e.preventDefault();

          onSubmit(
            input.value
              .trim()
              .toUpperCase(),
            input,
            row
          );
        }
      );

      return {
        input,
        row
      };
    };

    async function showEntryPrompt() {
      await typeLine(
        "[security] type AKKO to enter the music player",
        "accent"
      );

      await blankLine();

      makePrompt(
        "AKKO> ",
        4,
        async (
          entry,
          entryInput
        ) => {
          if (entryInput.disabled) {
            return;
          }

          if (entry !== "AKKO") {
            entryInput.disabled =
              true;

            await typeLine(
              "[error] type AKKO to enter AkkoAudio",
              "warn"
            );

            await blankLine();

            await showEntryPrompt();

            return;
          }

          entryInput.disabled =
            true;

          await typeLine(
            "[input] AKKO",
            "accent"
          );

          await typeLine(
            "[success] AKKO accepted",
            "success"
          );

          await typeLine(
            "[system] entering music player...",
            "muted"
          );

          overlay.classList.add(
            "hidden"
          );

          unlockUI();

          setTimeout(() => {
            overlay.remove();
          }, 500);
        }
      );
    }

    async function showAccessPrompt(
      revoked = false
    ) {
      if (revoked) {
        await typeLine(
          "[security] previous access code has been revoked",
          "warn"
        );
      }

      await typeLine(
        "[security] enter your 5-character access code below",
        "accent"
      );

      await blankLine();

      makePrompt(
        "ACCESS CODE> ",
        5,
        async (
          code,
          input
        ) => {
          if (input.disabled) {
            return;
          }

          if (code.length !== 5) {
            await typeLine(
              "[error] access code must be 5 characters",
              "warn"
            );

            await blankLine();

            input.focus();

            return;
          }

          input.disabled =
            true;

          await typeLine(
            "[input] " + code,
            "accent"
          );

          /*
           * ACCESS CODE VERIFICATION
           *
           * Only the requested checks are shown.
           * Each one is separated by a pause.
           */

          await typeLine(
            "[auth] checking code access...",
            "muted"
          );

          await sleep(350);

          await typeLine(
            "[security] verifying eligible code...",
            "muted"
          );

          await sleep(450);

          await typeLine(
            "[verification] running final auth check...",
            "muted"
          );

          await sleep(550);

          let response;
          let data;

          try {
            response =
              await fetch(
                "/.netlify/functions/verify-code",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  credentials:
                    "include",

                  body:
                    JSON.stringify({
                      code
                    })
                }
              );

            data =
              await response
                .json()
                .catch(
                  () => ({})
                );

          } catch {
            await typeLine(
              "[network] connection failed — try again",
              "warn"
            );

            await blankLine();

            await showAccessPrompt(
              false
            );

            return;
          }

          await typeLine(
            "[verification] response received...",
            "accent"
          );

          await sleep(450);

          if (
            !response.ok ||
            !data.valid
          ) {
            const isRevoked =
              String(
                data.reason ||
                data.error ||
                ""
              )
                .toLowerCase()
                .includes("revok");

            await typeLine(
              isRevoked
                ? "[error] INVALID ACCESS CODE"
                : "[error] INVALID ACCESS CODE",
              "warn"
            );

            await sleep(180);

            await blankLine();

            /*
             * Keep all previous terminal history.
             * The terminal is never cleared.
             */

            await showAccessPrompt(
              isRevoked
            );

            return;
          }

          await typeLine(
            "[success] ACCESS CODE VERIFIED",
            "success"
          );

          await sleep(250);

          await blankLine();

          await showEntryPrompt();
        }
      );
    }

    /*
     * TERMINAL HEADER
     */

    await typeLine(
      "AkkoAudio [Version 1.07]",
      "accent"
    );

    await typeLine(
      "AkkoAudio. All rights reserved.",
      "muted"
    );

    await blankLine();

    /*
     * INITIAL TERMINAL SETUP
     */

    await typeLine(
      "[system] initializing authentication terminal...",
      "muted"
    );

    await typeLine(
      "[system] loading security modules...",
      "muted"
    );

    await typeLine(
      "[system] preparing verification service...",
      "muted"
    );

    await blankLine();

    /*
     * START PROMPT
     */

    await typeLine(
      "[auth] type START to begin authentication",
      "accent"
    );

    await blankLine();

    const showStartPrompt =
      () =>
        makePrompt(
          "AKKO> ",
          5,
          async (
            value,
            input
          ) => {
            if (input.disabled) {
              return;
            }

            if (value !== "START") {
              input.disabled =
                true;

              await typeLine(
                "[error] type START to begin authentication",
                "warn"
              );

              await blankLine();

              showStartPrompt();

              return;
            }

            input.disabled =
              true;

            await typeLine(
              "[input] START",
              "accent"
            );

            await blankLine();

            /*
             * EXACT START VERIFICATION FLOW
             */

            await typeLine(
              "[auth] checking authentication...",
              "muted"
            );

            await sleep(500);

            await typeLine(
              "[security] verifying eligible access code...",
              "muted"
            );

            await sleep(550);

            await typeLine(
              "[verification] running final auth check...",
              "muted"
            );

            await sleep(650);

            await typeLine(
              "[verification] response received...",
              "accent"
            );

            await sleep(450);

            const status =
              await checkAccess();

            if (status.valid) {
              await typeLine(
                "[success] VERIFIED — access authorization confirmed",
                "success"
              );

              await sleep(250);

              await blankLine();

              await showEntryPrompt();

            } else {
              await typeLine(
                "[error] NOT VERIFIED — access authorization required",
                "warn"
              );

              await sleep(250);

              await blankLine();

              await showAccessPrompt(
                status.reason ===
                  "revoked"
              );
            }
          }
        );

    showStartPrompt();

    overlay.setAttribute(
      "aria-busy",
      "false"
    );
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

      if (!hidden) {
        return;
      }

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
      e => {
        if (
          e.key ===
            "akkoflac-onboarded" &&
          e.newValue === "1"
        ) {
          afterOnboarding();
        }
      }
    );

    let pollId = null;

    const startPoll = () => {
      if (pollId) {
        return;
      }

      pollId =
        setInterval(() => {
          if (document.hidden) {
            return;
          }

          afterOnboarding();

          if (
            isOnboardingDone()
          ) {
            clearInterval(
              pollId
            );

            pollId = null;
          }
        }, 400);
    };

    const stopPoll = () => {
      if (pollId) {
        clearInterval(
          pollId
        );

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

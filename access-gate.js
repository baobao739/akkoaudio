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

    .akkoflac-terminal-title {
      height: 36px;
      min-height: 36px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      box-sizing: border-box;
      background: #101010;
      border-bottom: 1px solid rgba(255,255,255,.08);
      color: rgba(255,255,255,.5);
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
    }

    .akkoflac-terminal-input-row {
      white-space: pre;
      margin: 0;
      padding: 0;
      line-height: 1.7;
      font-family: inherit;
      color: #d7dce3;
    }

    .akkoflac-terminal-input-row .akkoflac-terminal-input {
      width: 5ch;
      min-width: 5ch;
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

    const lr = Math.min(255, Math.round(r + (255 - r) * amount));
    const lg = Math.min(255, Math.round(g + (255 - g) * amount));
    const lb = Math.min(255, Math.round(b + (255 - b) * amount));

    return "#" + [lr, lg, lb]
      .map(v => v.toString(16).padStart(2, "0"))
      .join("");
  }

  function applySavedColors() {
    const root = document.documentElement;

    const accent =
      localStorage.getItem("akkoflac-accent") || "#7b8cff";

    const { r, g, b } = hexToRgb(accent);

    root.style.setProperty("--accent", accent);
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
      localStorage.getItem("akkoflac-theme") || "charcoal";

    const theme =
      THEMES[themeName] || THEMES.charcoal;

    root.style.setProperty("--theme-bottom", theme.bottom);
    root.style.setProperty("--bg", theme.bottom);
    root.style.setProperty("--bg-deep", theme.bottom);
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

  function removeExistingOverlays() {
    document
      .querySelectorAll(
        "#akkoflac-verify-overlay, #akkoflac-access-overlay, .akkoflac-terminal-overlay"
      )
      .forEach(el => el.remove());
  }

  async function checkAccess() {
    try {
      const response = await fetch(
        "/.netlify/functions/check-access",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        }
      );

      const data = await response
        .json()
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

  function createGate(opts = {}) {
    removeExistingOverlays();

    applySavedColors();

    const overlay = document.createElement("div");
    overlay.id = "akkoflac-access-overlay";

    overlay.innerHTML = `
      <div class="akkoflac-access-box">
        ${opts.revoked ? `
          <div class="akkoflac-revoked-banner">
            Your previous access code has been revoked.
            Please enter a new valid code.
          </div>
        ` : ""}

        <h2 class="akkoflac-access-title">
          AkkoAudio Access
        </h2>

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
          placeholder="•••••"
        >

        <button class="akkoflac-access-button">
          Verify Access
        </button>

        <div class="akkoflac-access-error"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const box = overlay.querySelector(".akkoflac-access-box");
    const input = overlay.querySelector(".akkoflac-access-input");
    const button = overlay.querySelector(".akkoflac-access-button");
    const error = overlay.querySelector(".akkoflac-access-error");

    const submit = async () => {
      const code = input.value
        .trim()
        .toUpperCase();

      if (code.length !== 5) {
        error.textContent =
          "Access code must be 5 characters.";

        box.classList.remove("akkoflac-access-shake");
        void box.offsetWidth;
        box.classList.add("akkoflac-access-shake");
        return;
      }

      input.disabled = true;
      button.disabled = true;
      error.textContent = "";

      try {
        const response = await fetch(
          "/.netlify/functions/verify-code",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ code })
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok || !data.valid) {
          const revoked = String(
            data.reason || data.error || ""
          )
            .toLowerCase()
            .includes("revok");

          error.textContent = revoked
            ? "This access code has been revoked."
            : "Invalid access code.";

          input.disabled = false;
          button.disabled = false;
          input.value = "";

          box.classList.remove(
            "akkoflac-access-shake"
          );

          void box.offsetWidth;

          box.classList.add(
            "akkoflac-access-shake"
          );

          return;
        }

        overlay.classList.add("hidden");

        unlockUI();

        setTimeout(() => {
          overlay.remove();
        }, 500);
      } catch {
        error.textContent =
          "Connection failed. Try again.";

        input.disabled = false;
        button.disabled = false;
      }
    };

    button.addEventListener("click", submit);

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    });

    input.addEventListener("input", () => {
      input.value = input.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 5)
        .toUpperCase();
    });

    setTimeout(() => input.focus(), 50);
  }

  function showVerifying() {
    removeExistingOverlays();

    applySavedColors();

    const overlay = document.createElement("div");
    overlay.id = "akkoflac-verify-overlay";

    overlay.innerHTML = `
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
    `;

    document.body.appendChild(overlay);

    const output =
      overlay.querySelector(".akkoflac-terminal-output");

    const addLine = (text, cls = "") => {
      const line = document.createElement("div");
      line.className =
        "akkoflac-terminal-line " + cls;
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    };

    addLine("AkkoAudio [Version 1.07]");
    addLine("AkkoAudio. All rights reserved.");
    addLine("");
    addLine("[system] initializing authentication terminal...");
    addLine("[system] loading security modules...");
    addLine("[system] preparing verification service...");
    addLine("");
    addLine("[auth] type START to begin authentication", "accent");
    addLine("");

    return overlay;
  }

  async function showVerificationSuccess(overlay) {
    const output =
      overlay.querySelector(".akkoflac-terminal-output");

    const addLine = (text, cls = "") => {
      const line = document.createElement("div");
      line.className =
        "akkoflac-terminal-line " + cls;
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    };

    addLine("[success] VERIFIED — access authorization confirmed", "success");
  }

  function runVerifyThenGate() {
    lockUI();
    removeExistingOverlays();
    applySavedColors();

    const overlay = document.createElement("div");
    overlay.className = "akkoflac-terminal-overlay";

    overlay.innerHTML = `
      <div class="akkoflac-terminal-window">
        <div class="akkoflac-terminal-title">
          AkkoAudio Terminal
        </div>

        <div
          class="akkoflac-terminal-output"
          id="akkoflac-start-output"
        ></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const output =
      overlay.querySelector("#akkoflac-start-output");

    const sleep = ms =>
      new Promise(resolve => setTimeout(resolve, ms));

    const line = (msg, cls = "") => {
      const el = document.createElement("div");

      el.className =
        "akkoflac-terminal-line " + cls;

      el.textContent = msg;

      output.appendChild(el);

      output.scrollTop =
        output.scrollHeight;

      return el;
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

      input.autocomplete = "off";
      input.autocapitalize = "characters";
      input.spellcheck = false;
      input.maxLength = maxLength;
      input.className =
        "akkoflac-terminal-input";
      input.inputMode = "text";

      row.appendChild(input);
      output.appendChild(row);

      output.scrollTop =
        output.scrollHeight;

      setTimeout(() => input.focus(), 40);

      input.addEventListener(
        "input",
        () => {
          input.value = input.value
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(0, maxLength)
            .toUpperCase();
        }
      );

      input.addEventListener(
        "keydown",
        e => {
          if (e.key === "Enter") {
            onSubmit(
              input.value
                .trim()
                .toUpperCase(),
              input,
              row
            );
          }
        }
      );

      return {
        input,
        row
      };
    };

    line("AkkoAudio [Version 1.07]");
    line("AkkoAudio. All rights reserved.");
    line("");
    line("[system] initializing authentication terminal...");
    line("[system] loading security modules...");
    line("[system] preparing verification service...");
    line("");
    line(
      "[auth] type START to begin authentication",
      "accent"
    );

    // One blank line between the instructions and AKKO>
    line("");

    makePrompt(
      "AKKO> ",
      5,
      async (value, input) => {
        if (input.disabled) return;

        if (value !== "START") {
          line(
            "[error] type START to begin authentication",
            "warn"
          );

          input.value = "";
          input.focus();
          return;
        }

        input.disabled = true;

        line("[input] START");

        await sleep(250);
        line("[auth] authentication started...");

        await sleep(250);
        line("[system] waking dormant audio modules...");

        await sleep(220);
        line("[system] locating AkkoAudio core...");

        await sleep(220);
        line("[core] core response received...");

        await sleep(180);
        line("[network] establishing secure handshake...");

        await sleep(220);
        line("[network] handshake accepted...");

        await sleep(180);
        line("[cache] reading local session cache...");

        await sleep(220);
        line("[cache] session fragments detected...");

        await sleep(180);
        line("[cache] rebuilding authorization state...");

        await sleep(220);
        line("[audio] scanning music engine...");

        await sleep(180);
        line("[audio] checking playback permissions...");

        await sleep(220);
        line("[audio] checking queue integrity...");

        await sleep(180);
        line("[lyrics] checking lyric subsystem...");

        await sleep(220);
        line("[theme] loading interface preferences...");

        await sleep(180);
        line("[storage] reading local configuration...");

        await sleep(220);
        line("[storage] configuration response received...");

        await sleep(180);
        line("[security] generating verification token...");

        await sleep(240);
        line("[security] token generated...");

        await sleep(180);
        line("[security] comparing authorization signatures...");

        await sleep(250);
        line("[security] signature scan complete...");

        await sleep(180);
        line("[system] checking suspiciously normal activity...");

        await sleep(200);
        line("[system] activity appears suspiciously normal...");

        await sleep(180);
        line("[system] counting imaginary security beans...");

        await sleep(200);
        line("[system] 37 beans accounted for...");

        await sleep(180);
        line("[system] checking if the beans are still beans...");

        await sleep(200);
        line("[system] beans confirmed...");

        await sleep(180);
        line("[system] pretending this is extremely important...");

        await sleep(220);
        line("[system] okay, that was important...");

        await sleep(180);
        line("[system] calibrating authentication vibes...");

        await sleep(220);
        line("[system] vibes calibrated...");

        await sleep(180);
        line("[system] asking the terminal if it knows what it is doing...");

        await sleep(240);
        line("[system] terminal response: probably...");

        await sleep(220);
        line("[security] final authorization scan...");

        await sleep(260);
        line("[scan] checking authorization...");

        await sleep(300);
        line("[scan] checking session integrity...");

        await sleep(300);
        line("[scan] checking access permissions...");

        await sleep(300);
        line("[verification] contacting AkkoAudio authorization service...");

        await sleep(300);

        const status =
          await checkAccess();

        if (status.valid) {
          line(
            "[success] VERIFIED — access authorization confirmed",
            "success"
          );

          await sleep(350);

          line(
            "[security] type AKKO to enter the music player",
            "accent"
          );

          showEntryPrompt();
        } else {
          line(
            "[error] NOT VERIFIED — access authorization required",
            "warn"
          );

          await sleep(250);

          line(
            "[security] enter your 5-character access code below",
            "accent"
          );

          showAccessPrompt(
            status.reason === "revoked"
          );
        }
      }
    );

    function showEntryPrompt() {
      makePrompt(
        "AKKO> ",
        4,
        async (entry, entryInput) => {
          if (entryInput.disabled) return;

          if (entry !== "AKKO") {
            entryInput.disabled = true;

            line(
              "[error] type AKKO to enter AkkoAudio",
              "warn"
            );

            await sleep(120);

            showEntryPrompt();

            return;
          }

          entryInput.disabled = true;

          line("[input] AKKO");

          await sleep(120);

          line(
            "[success] AKKO accepted",
            "success"
          );

          await sleep(120);

          line(
            "[system] entering music player...",
            "muted"
          );

          overlay.classList.add("hidden");

          unlockUI();

          setTimeout(() => {
            overlay.remove();
          }, 500);
        }
      );
    }

    function showAccessPrompt(revoked = false) {
      if (revoked) {
        line(
          "[security] previous access code has been revoked",
          "warn"
        );
      }

      makePrompt(
        "ACCESS CODE> ",
        5,
        async (code, input) => {
          if (input.disabled) return;

          if (code.length !== 5) {
            line(
              "[error] access code must be 5 characters",
              "warn"
            );

            input.focus();

            return;
          }

          input.disabled = true;

          line("[input] " + code);

          await sleep(180);

          line(
            "[auth] validating code...",
            "muted"
          );

          await sleep(180);

          line(
            "[database] checking code status...",
            "muted"
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
              const isRevoked =
                String(
                  data.reason ||
                  data.error ||
                  ""
                )
                  .toLowerCase()
                  .includes("revok");

              await sleep(150);

              line(
                isRevoked
                  ? "[security] this access code has been revoked"
                  : "[error] invalid access code",
                "warn"
              );

              line(
                "[terminal] try another code...",
                "muted"
              );

              await sleep(120);

              // IMPORTANT:
              // Do NOT clear the terminal.
              // This simply adds another prompt
              // underneath the existing history.
              showAccessPrompt(isRevoked);

              return;
            }

            line(
              "[success] verification successful",
              "success"
            );

            await sleep(150);

            line(
              "[security] type AKKO to enter the music player",
              "accent"
            );

            // Keep the entire terminal history.
            showEntryPrompt();

          } catch {
            line(
              "[network] connection failed — try again",
              "warn"
            );

            // Keep the terminal history.
            showAccessPrompt(false);
          }
        }
      );
    }
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
      if (!isOnboardingDone()) return;

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

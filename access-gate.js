
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
    #akkoflac-verify-overlay {
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

      margin: 0 !important;
      padding: 0 !important;

      display: block !important;

      background: #050505 !important;
      color: #c7c7c7 !important;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        "Courier New",
        monospace !important;

      overflow: hidden !important;

      opacity: 1 !important;
      visibility: visible !important;

      isolation: isolate !important;

      transition:
        opacity .35s ease !important;
    }

    #akkoflac-verify-overlay.akkoflac-terminal-hidden {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal {
      position: fixed !important;
      inset: 0 !important;

      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;

      margin: 0 !important;
      padding: 0 !important;

      display: flex !important;
      flex-direction: column !important;

      background: #050505 !important;

      border: 0 !important;
      border-radius: 0 !important;

      box-shadow: none !important;

      overflow: hidden !important;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        "Courier New",
        monospace !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-bar {
      height: 36px !important;
      min-height: 36px !important;
      flex: 0 0 36px !important;

      width: 100% !important;

      display: flex !important;
      align-items: center !important;

      box-sizing: border-box !important;

      gap: 7px !important;

      padding: 0 12px !important;

      background: #101010 !important;

      border-bottom:
        1px solid rgba(255,255,255,.08) !important;

      user-select: none !important;
      -webkit-user-select: none !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-dot {
      display: block !important;

      width: 9px !important;
      height: 9px !important;

      min-width: 9px !important;

      border-radius: 50% !important;

      background:
        rgba(255,255,255,.18) !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-title {
      display: block !important;

      margin-left: 7px !important;

      color:
        rgba(255,255,255,.55) !important;

      background: transparent !important;

      font-family:
        "Segoe UI",
        Arial,
        sans-serif !important;

      font-size: 11px !important;

      font-weight: 400 !important;

      line-height: 1 !important;

      opacity: 1 !important;

      visibility: visible !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-output {
      position: relative !important;

      flex: 1 1 auto !important;

      min-height: 0 !important;

      width: 100% !important;

      box-sizing: border-box !important;

      padding:
        14px
        18px
        30px !important;

      margin: 0 !important;

      background: #050505 !important;

      color: #c7c7c7 !important;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        "Courier New",
        monospace !important;

      font-size:
        clamp(12px, 1.55vw, 14px) !important;

      line-height: 1.7 !important;

      text-align: left !important;

      overflow-x: hidden !important;
      overflow-y: auto !important;

      white-space: pre-wrap !important;

      scrollbar-width: thin !important;

      scrollbar-color:
        #333
        #050505 !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-line {
      display: block !important;

      position: relative !important;

      width: 100% !important;

      min-height: 1.7em !important;

      margin: 0 !important;
      padding: 0 !important;

      background: transparent !important;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        "Courier New",
        monospace !important;

      font-size:
        inherit !important;

      font-weight: 400 !important;

      line-height: 1.7 !important;

      text-align: left !important;

      white-space: pre-wrap !important;

      opacity: 0 !important;

      transform:
        translateY(4px) !important;

      animation:
        akkoflacTerminalLineAppear
        .12s
        ease
        forwards !important;

      visibility: visible !important;
    }

    @keyframes akkoflacTerminalLineAppear {
      0% {
        opacity: 0;
        transform:
          translateY(4px);
      }

      100% {
        opacity: 1;
        transform:
          translateY(0);
      }
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-text {
      display: inline !important;

      background: transparent !important;

      color:
        #c7c7c7 !important;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        "Courier New",
        monospace !important;

      font-size: inherit !important;

      font-weight: 400 !important;

      line-height: inherit !important;

      opacity: 1 !important;

      visibility: visible !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-accent {
      display: inline !important;

      color:
        var(--accent, #7b8cff) !important;

      opacity: 1 !important;

      visibility: visible !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-success {
      display: inline !important;

      color:
        #66e39a !important;

      opacity: 1 !important;

      visibility: visible !important;

      text-shadow:
        0 0 18px
        rgba(102,227,154,.18) !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-warning {
      display: inline !important;

      color:
        #f5c76a !important;

      opacity: 1 !important;

      visibility: visible !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-cursor {
      display: inline-block !important;

      width: 7px !important;
      height: 1.05em !important;

      min-width: 7px !important;

      margin-left: 3px !important;

      vertical-align:
        -0.16em !important;

      background:
        var(--accent, #7b8cff) !important;

      opacity: 1 !important;

      visibility: visible !important;

      animation:
        akkoflacTerminalCursor
        .65s
        steps(1, end)
        infinite !important;
    }

    @keyframes akkoflacTerminalCursor {
      0%,
      48% {
        opacity: 1;
      }

      49%,
      100% {
        opacity: 0;
      }
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-prompt-wrap {
      display: inline-flex !important;

      align-items: center !important;

      vertical-align: baseline !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-input {
      display: inline-block !important;

      width: 5ch !important;
      min-width: 5ch !important;
      max-width: 20ch !important;

      height: 1.7em !important;

      margin: 0 !important;
      padding: 0 !important;

      border: 0 !important;
      border-radius: 0 !important;

      outline: 0 !important;

      background: transparent !important;

      box-shadow: none !important;

      color:
        var(--accent, #7b8cff) !important;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        "Courier New",
        monospace !important;

      font-size: inherit !important;

      font-weight: 700 !important;

      line-height: inherit !important;

      letter-spacing: .04em !important;

      caret-color:
        var(--accent, #7b8cff) !important;

      text-transform: uppercase !important;

      appearance: none !important;
      -webkit-appearance: none !important;

      opacity: 1 !important;

      visibility: visible !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-input::selection {
      background:
        rgba(255,255,255,.2) !important;

      color:
        #fff !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-input:disabled {
      opacity: .6 !important;
    }

    body.akkoflac-gate-locked {
      overflow: hidden !important;
    }

    body.akkoflac-awaiting-access {
      overflow: hidden !important;
    }

    @media (max-width: 600px) {
      #akkoflac-verify-overlay
      .akkoflac-terminal-bar {
        height: 34px !important;
        min-height: 34px !important;
        flex-basis: 34px !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-title {
        font-size: 10px !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-output {
        padding:
          10px
          12px
          24px !important;

        font-size: 12px !important;
      }
    }
  `;

  const style =
    document.createElement("style");

  style.id =
    "akkoflac-terminal-style";

  style.textContent =
    STYLE;

  const oldStyle =
    document.getElementById(
      "akkoflac-terminal-style"
    );

  if (oldStyle) {
    oldStyle.remove();
  }

  document.head.appendChild(style);

  function sleep(ms) {
    return new Promise(
      resolve =>
        setTimeout(resolve, ms)
    );
  }

  function clearPreverify() {
    document.documentElement.classList.remove(
      "akkoflac-preverify"
    );
  }

  function hexToRgb(hex) {
    const h =
      String(
        hex || "#7b8cff"
      ).replace("#", "");

    const full =
      h.length === 3
        ? h
            .split("")
            .map(c => c + c)
            .join("")
        : h;

    const n =
      parseInt(full, 16);

    return {
      r: (n >> 16) & 255,
      g: (n >> 8) & 255,
      b: n & 255
    };
  }

  function lightenHex(
    hex,
    amount
  ) {
    const {
      r,
      g,
      b
    } =
      hexToRgb(hex);

    const lr =
      Math.min(
        255,
        Math.round(
          r +
          (255 - r) *
          amount
        )
      );

    const lg =
      Math.min(
        255,
        Math.round(
          g +
          (255 - g) *
          amount
        )
      );

    const lb =
      Math.min(
        255,
        Math.round(
          b +
          (255 - b) *
          amount
        )
      );

    return (
      "#" +
      [lr, lg, lb]
        .map(v =>
          v
            .toString(16)
            .padStart(
              2,
              "0"
            )
        )
        .join("")
    );
  }

  function applySavedColors() {
    const root =
      document.documentElement;

    const accent =
      localStorage.getItem(
        "akkoflac-accent"
      ) ||
      "#7b8cff";

    const {
      r,
      g,
      b
    } =
      hexToRgb(accent);

    root.style.setProperty(
      "--accent",
      accent
    );

    root.style.setProperty(
      "--accent-bright",
      lightenHex(
        accent,
        0.18
      )
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
      localStorage.getItem(
        "akkoflac-theme"
      ) ||
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

    document.body.style.overflow =
      "hidden";
  }

  function unlockUI() {
    document.body.classList.remove(
      "akkoflac-gate-locked",
      "akkoflac-awaiting-access"
    );

    document.body.style.overflow =
      "";
  }

  function removeOverlay() {
    const old =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    if (old) {
      old.remove();
    }
  }

  function createTerminal() {
    removeOverlay();

    const overlay =
      document.createElement(
        "div"
      );

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
            AkkoAudio Version 1.07
          </span>

        </div>

        <div
          class="akkoflac-terminal-output"
          id="akkoflac-terminal-output"
        ></div>

      </div>
    `;

    document.body.appendChild(
      overlay
    );

    return overlay;
  }

  async function typeLine(
    output,
    text,
    type =
      "akkoflac-terminal-text",
    speed = 3
  ) {
    const line =
      document.createElement(
        "div"
      );

    line.className =
      "akkoflac-terminal-line";

    const span =
      document.createElement(
        "span"
      );

    span.className =
      type;

    const validTypes = [
      "akkoflac-terminal-text",
      "akkoflac-terminal-accent",
      "akkoflac-terminal-success",
      "akkoflac-terminal-warning"
    ];

    if (
      !validTypes.includes(type)
    ) {
      span.className =
        "akkoflac-terminal-text";
    }

    const cursor =
      document.createElement(
        "span"
      );

    cursor.className =
      "akkoflac-terminal-cursor";

    line.append(
      span,
      cursor
    );

    output.appendChild(
      line
    );

    for (
      const character of text
    ) {
      span.textContent +=
        character;

      output.scrollTop =
        output.scrollHeight;

      await sleep(
        speed +
        Math.random() * 2
      );
    }

    cursor.remove();

    await sleep(15);

    return line;
  }

  function addStaticLine(
    output,
    text,
    type =
      "akkoflac-terminal-text"
  ) {
    const line =
      document.createElement(
        "div"
      );

    line.className =
      "akkoflac-terminal-line";

    const span =
      document.createElement(
        "span"
      );

    span.className =
      type;

    span.textContent =
      text;

    line.appendChild(
      span
    );

    output.appendChild(
      line
    );

    output.scrollTop =
      output.scrollHeight;

    return line;
  }

  function addPrompt(
    output,
    maxLength
  ) {
    const line =
      document.createElement(
        "div"
      );

    line.className =
      "akkoflac-terminal-line";

    const prefix =
      document.createElement(
        "span"
      );

    prefix.className =
      "akkoflac-terminal-accent";

    prefix.textContent =
      "C:\\AkkoAudio> ";

    line.appendChild(
      prefix
    );

    const input =
      document.createElement(
        "input"
      );

    input.className =
      "akkoflac-terminal-input";

    input.type =
      "text";

    input.maxLength =
      maxLength;

    input.autocomplete =
      "off";

    input.autocapitalize =
      "none";

    input.spellcheck =
      false;

    input.setAttribute(
      "inputmode",
      "text"
    );

    line.appendChild(
      input
    );

    output.appendChild(
      line
    );

    output.scrollTop =
      output.scrollHeight;

    setTimeout(
      () =>
        input.focus(),
      25
    );

    return {
      line,
      input
    };
  }

  async function showVerifying() {
    lockUI();

    clearPreverify();

    applySavedColors();

    const overlay =
      createTerminal();

    const output =
      overlay.querySelector(
        "#akkoflac-terminal-output"
      );

    await typeLine(
      output,
      "[system] initializing secure access check..."
    );

    await typeLine(
      output,
      "[network] connecting to AkkoAudio cloud..."
    );

    await typeLine(
      output,
      "[network] connection established"
    );

    await typeLine(
      output,
      "[auth] checking access session..."
    );

    await typeLine(
      output,
      "[auth] validating session credentials..."
    );

    await typeLine(
      output,
      "[database] checking access status..."
    );

    await typeLine(
      output,
      "[security] checking code state..."
    );

    await typeLine(
      output,
      "[verification] waiting for server response...",
      "akkoflac-terminal-accent"
    );

    return overlay;
  }

  async function showVerificationSuccess() {
    const overlay =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    if (!overlay) {
      return;
    }

    const output =
      overlay.querySelector(
        "#akkoflac-terminal-output"
      );

    if (!output) {
      return;
    }

    await typeLine(
      output,
      "[auth] access session verified."
    );

    await typeLine(
      output,
      "[auth] credentials accepted."
    );

    await typeLine(
      output,
      "[security] access granted."
    );

    await typeLine(
      output,
      "[system] authentication successful.",
      "akkoflac-terminal-success"
    );

    await typeLine(
      output,
      "Authentication complete."
    );

    await typeLine(
      output,
      "Type akko to enter AkkoAudio.",
      "akkoflac-terminal-accent"
    );

    const prompt =
      addPrompt(
        output,
        4
      );

    prompt.input.addEventListener(
      "input",
      () => {
        prompt.input.value =
          prompt.input.value
            .replace(
              /[^a-zA-Z]/g,
              ""
            )
            .slice(
              0,
              4
            );
      }
    );

    prompt.input.addEventListener(
      "keydown",
      async event => {
        if (
          event.key !==
          "Enter"
        ) {
          return;
        }

        event.preventDefault();

        const command =
          prompt.input.value
            .trim()
            .toLowerCase();

        if (
          command !==
          "akko"
        ) {
          await typeLine(
            output,
            "[error] command not recognized.",
            "akkoflac-terminal-warning"
          );

          await typeLine(
            output,
            "[auth] type akko to enter.",
            "akkoflac-terminal-accent"
          );

          prompt.input.value =
            "";

          prompt.input.focus();

          return;
        }

        prompt.input.disabled =
          true;

        await typeLine(
          output,
          "C:\\AkkoAudio> akko",
          "akkoflac-terminal-text",
          3
        );

        await typeLine(
          output,
          "[system] command accepted.",
          "akkoflac-terminal-success"
        );

        await typeLine(
          output,
          "[system] starting AkkoAudio..."
        );

        await typeLine(
          output,
          "[system] entering player..."
        );

        await sleep(250);

        overlay.classList.add(
          "akkoflac-terminal-hidden"
        );

        unlockUI();

        setTimeout(
          () => {
            overlay.remove();
          },
          400
        );
      }
    );
  }

  function createGate(
    opts = {}
  ) {
    clearPreverify();

    removeOverlay();

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

    let submitting =
      false;

    async function createAccessPrompt() {
      const prompt =
        addPrompt(
          output,
          5
        );

      prompt.input.addEventListener(
        "input",
        () => {
          prompt.input.value =
            prompt.input.value
              .replace(
                /[^a-zA-Z0-9]/g,
                ""
              )
              .toUpperCase()
              .slice(
                0,
                5
              );
        }
      );

      prompt.input.addEventListener(
        "keydown",
        event => {
          if (
            event.key ===
              "Enter" &&
            !submitting
          ) {
            event.preventDefault();

            redeem(
              prompt.input.value
                .trim()
                .toUpperCase()
            );
          }
        }
      );

      return prompt;
    }

    async function redeem(
      code
    ) {
      if (submitting) {
        return;
      }

      if (
        code.length !== 5
      ) {
        await typeLine(
          output,
          "[error] access code must be 5 characters.",
          "akkoflac-terminal-warning"
        );

        await createAccessPrompt();

        return;
      }

      submitting =
        true;

      await typeLine(
        output,
        "C:\\AkkoAudio> " + code,
        "akkoflac-terminal-text",
        3
      );

      await typeLine(
        output,
        "[auth] validating access code..."
      );

      await typeLine(
        output,
        "[database] checking code status..."
      );

      try {
        const response =
          await fetch(
            "/.netlify/functions/verify-code",
            {
              method:
                "POST",

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

        const data =
          await response
            .json()
            .catch(
              () => ({})
            );

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

          const wasRevoked =
            reason.includes(
              "revok"
            );

          await typeLine(
            output,
            wasRevoked
              ? "[security] access code has been revoked."
              : "[error] invalid access code.",
            "akkoflac-terminal-warning"
          );

          await typeLine(
            output,
            "[auth] authentication failed."
          );

          await typeLine(
            output,
            "[terminal] try again.",
            "akkoflac-terminal-accent"
          );

          submitting =
            false;

          await createAccessPrompt();

          return;
        }

        await typeLine(
          output,
          "[auth] access code accepted.",
          "akkoflac-terminal-success"
        );

        await typeLine(
          output,
          "[auth] authentication successful.",
          "akkoflac-terminal-success"
        );

        await typeLine(
          output,
          "[security] access granted.",
          "akkoflac-terminal-success"
        );

        await typeLine(
          output,
          "Authentication complete.",
          "akkoflac-terminal-success"
        );

        await typeLine(
          output,
          "Type akko to enter AkkoAudio.",
          "akkoflac-terminal-accent"
        );

        const enterPrompt =
          addPrompt(
            output,
            4
          );

        enterPrompt.input.addEventListener(
          "input",
          () => {
            enterPrompt.input.value =
              enterPrompt.input.value
                .replace(
                  /[^a-zA-Z]/g,
                  ""
                )
                .slice(
                  0,
                  4
                );
          }
        );

        enterPrompt.input.addEventListener(
          "keydown",
          async event => {
            if (
              event.key !==
              "Enter"
            ) {
              return;
            }

            event.preventDefault();

            const command =
              enterPrompt.input.value
                .trim()
                .toLowerCase();

            if (
              command !==
              "akko"
            ) {
              await typeLine(
                output,
                "[error] command not recognized.",
                "akkoflac-terminal-warning"
              );

              await typeLine(
                output,
                "[auth] type akko to enter.",
                "akkoflac-terminal-accent"
              );

              enterPrompt.input.value =
                "";

              enterPrompt.input.focus();

              return;
            }

            enterPrompt.input.disabled =
              true;

            await typeLine(
              output,
              "C:\\AkkoAudio> akko",
              "akkoflac-terminal-text",
              3
            );

            await typeLine(
              output,
              "[system] command accepted.",
              "akkoflac-terminal-success"
            );

            await typeLine(
              output,
              "[system] starting AkkoAudio..."
            );

            await typeLine(
              output,
              "[system] entering player..."
            );

            await sleep(250);

            overlay.classList.add(
              "akkoflac-terminal-hidden"
            );

            unlockUI();

            setTimeout(
              () => {
                overlay.remove();
              },
              400
            );
          }
        );

        setTimeout(
          () =>
            enterPrompt.input.focus(),
          30
        );

      } catch {
        await typeLine(
          output,
          "[network] authentication server unavailable.",
          "akkoflac-terminal-warning"
        );

        await typeLine(
          output,
          "[network] please try again.",
          "akkoflac-terminal-warning"
        );

        submitting =
          false;

        await createAccessPrompt();
      }
    }

    (async () => {
      await typeLine(
        output,
        "[auth] no active access session."
      );

      await typeLine(
        output,
        "[security] access code required."
      );

      if (revoked) {
        await typeLine(
          output,
          "[security] previous access code has been revoked.",
          "akkoflac-terminal-warning"
        );
      }

      await typeLine(
        output,
        "[terminal] enter your access code below",
        "akkoflac-terminal-accent"
      );

      await createAccessPrompt();
    })();

    overlay.addEventListener(
      "click",
      event => {
        const input =
          output.querySelector(
            "input:not(:disabled)"
          );

        if (
          input &&
          (
            event.target ===
              overlay ||
            event.target.closest(
              ".akkoflac-terminal-output"
            )
          )
        ) {
          input.focus();
        }
      }
    );
  }

  async function checkAccess() {
    try {
      const response =
        await fetch(
          "/.netlify/functions/access-status",
          {
            method:
              "GET",

            credentials:
              "include",

            cache:
              "no-store"
          }
        );

      const data =
        await response
          .json()
          .catch(
            () => ({})
          );

      return {
        valid:
          !!data.valid,

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
      runVerifyThenGate.running
    ) {
      return;
    }

    runVerifyThenGate.running =
      true;

    const statusPromise =
      checkAccess();

    await showVerifying();

    const status =
      await statusPromise;

    if (status.valid) {
      await showVerificationSuccess();

      return;
    }

    removeOverlay();

    createGate({
      revoked:
        status.reason ===
        "revoked"
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

    if (
      isOnboardingDone()
    ) {
      runVerifyThenGate();

      return;
    }

    const onboarding =
      document.getElementById(
        "onboarding"
      );

    const afterOnboarding =
      () => {
        if (
          !isOnboardingDone()
        ) {
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
      event => {
        if (
          event.key ===
            "akkoflac-onboarded" &&
          event.newValue ===
            "1"
        ) {
          afterOnboarding();
        }
      }
    );

    let pollId =
      null;

    const startPoll =
      () => {
        if (pollId) {
          return;
        }

        pollId =
          setInterval(
            () => {
              if (
                document.hidden
              ) {
                return;
              }

              afterOnboarding();

              if (
                isOnboardingDone()
              ) {
                clearInterval(
                  pollId
                );

                pollId =
                  null;
              }
            },
            400
          );
      };

    const stopPoll =
      () => {
        if (pollId) {
          clearInterval(
            pollId
          );

          pollId =
            null;
        }
      };

    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.hidden
        ) {
          stopPoll();
        } else {
          startPoll();
        }
      }
    );

    if (
      !document.hidden
    ) {
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

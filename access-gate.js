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
    #akkoflac-verify-overlay {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      z-index: 2147483647 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #050505 !important;
      color: #d7dce3 !important;
      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace !important;
      overflow: hidden !important;
      transition: opacity .35s ease;
    }

    #akkoflac-verify-overlay.hidden {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .akkoflac-terminal {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;

      display: flex !important;
      flex-direction: column !important;

      background: #050505 !important;

      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;

      overflow: hidden !important;
    }

    .akkoflac-terminal-bar {
      height: 36px !important;
      min-height: 36px !important;
      flex: 0 0 36px !important;

      display: flex !important;
      align-items: center !important;

      gap: 7px !important;

      padding: 0 12px !important;

      background: #101010 !important;

      border-bottom:
        1px solid rgba(255,255,255,.08) !important;

      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .akkoflac-terminal-dot {
      width: 9px !important;
      height: 9px !important;

      border-radius: 50% !important;

      background:
        rgba(255,255,255,.18) !important;
    }

    .akkoflac-terminal-title {
      margin-left: 7px !important;

      color:
        rgba(255,255,255,.45) !important;

      font-family:
        "Segoe UI",
        Arial,
        sans-serif !important;

      font-size: 11px !important;

      letter-spacing: .02em !important;
    }

    .akkoflac-terminal-output {
      flex: 1 !important;
      min-height: 0 !important;

      width: 100% !important;

      box-sizing: border-box !important;

      padding:
        14px
        18px
        28px !important;

      overflow-y: auto !important;
      overflow-x: hidden !important;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace !important;

      font-size:
        clamp(12px, 1.55vw, 14px) !important;

      line-height: 1.7 !important;

      text-align: left !important;

      scrollbar-width: thin !important;

      scrollbar-color:
        rgba(255,255,255,.18)
        transparent !important;
    }

    .akkoflac-terminal-line {
      display: block !important;

      min-height: 1.7em !important;

      margin: 0 !important;
      padding: 0 !important;

      opacity: 0 !important;

      transform:
        translateY(4px) !important;

      animation:
        akkoTerminalLineIn
        .14s
        ease
        forwards !important;

      white-space:
        pre-wrap !important;

      text-align: left !important;

      background: transparent !important;
    }

    @keyframes akkoTerminalLineIn {
      to {
        opacity: 1;
        transform:
          translateY(0);
      }
    }

    .muted {
      color:
        #c7c7c7 !important;
    }

    .accent {
      color:
        var(--accent, #7b8cff) !important;
    }

    .success {
      color:
        #66e39a !important;

      text-shadow:
        0 0 18px
        rgba(102,227,154,.18) !important;
    }

    .warn {
      color:
        #f5c76a !important;
    }

    .cursor {
      display: inline-block !important;

      width: 7px !important;
      height: 1.05em !important;

      margin-left: 3px !important;

      vertical-align:
        -0.16em !important;

      background:
        var(--accent, #7b8cff) !important;

      animation:
        akkoTerminalCursor
        .65s
        steps(1,end)
        infinite !important;
    }

    @keyframes akkoTerminalCursor {
      0%, 48% {
        opacity: 1;
      }

      49%, 100% {
        opacity: 0;
      }
    }

    .akkoflac-terminal-input {
      display: inline !important;

      width: 5ch !important;
      min-width: 5ch !important;
      max-width: 20ch !important;

      height: 1.7em !important;

      margin: 0 !important;
      padding: 0 !important;

      border: 0 !important;
      border-radius: 0 !important;
      outline: 0 !important;

      background:
        transparent !important;

      box-shadow: none !important;

      color:
        var(--accent, #7b8cff) !important;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace !important;

      font-size:
        inherit !important;

      font-weight:
        700 !important;

      line-height:
        inherit !important;

      letter-spacing:
        .04em !important;

      caret-color:
        var(--accent, #7b8cff) !important;

      text-transform:
        uppercase !important;

      appearance: none !important;
      -webkit-appearance: none !important;
    }

    .akkoflac-terminal-input::selection {
      background:
        rgba(255,255,255,.2) !important;

      color:
        #fff !important;
    }

    body.akkoflac-gate-locked {
      overflow: hidden !important;
    }

    body.akkoflac-awaiting-access
      > *:not(#akkoflac-verify-overlay) {
      pointer-events: none !important;
    }

    @media (max-width: 600px) {
      .akkoflac-terminal-bar {
        height: 34px !important;
        min-height: 34px !important;
        flex-basis: 34px !important;
      }

      .akkoflac-terminal-title {
        font-size: 10px !important;
      }

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

  if (
    !document.getElementById(
      "akkoflac-terminal-style"
    )
  ) {
    document.head.appendChild(style);
  }

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
      String(hex || "#7b8cff")
        .replace("#", "");

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

  function applySavedColors() {
    const root =
      document.documentElement;

    const accent =
      localStorage.getItem(
        "akkoflac-accent"
      ) ||
      "#7b8cff";

    const rgb =
      hexToRgb(accent);

    root.style.setProperty(
      "--accent",
      accent
    );

    root.style.setProperty(
      "--accent-soft",
      `rgba(${rgb.r},${rgb.g},${rgb.b},.15)`
    );

    root.style.setProperty(
      "--accent-glow",
      `rgba(${rgb.r},${rgb.g},${rgb.b},.35)`
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
    const overlay =
      document.getElementById(
        "akkoflac-verify-overlay"
      );

    if (overlay) {
      overlay.remove();
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
    kind = "muted",
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
      kind;

    const cursor =
      document.createElement(
        "span"
      );

    cursor.className =
      "cursor";

    line.append(
      span,
      cursor
    );

    output.appendChild(
      line
    );

    for (
      const char of text
    ) {
      span.textContent +=
        char;

      output.scrollTop =
        output.scrollHeight;

      await sleep(
        speed +
        Math.random() * 2
      );
    }

    cursor.remove();

    await sleep(20);

    return line;
  }

  function addLine(
    output,
    text,
    kind = "muted"
  ) {
    const line =
      document.createElement(
        "div"
      );

    line.className =
      "akkoflac-terminal-line";

    line.style.animationDelay =
      "0ms";

    const span =
      document.createElement(
        "span"
      );

    span.className =
      kind;

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
      "accent";

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
      () => input.focus(),
      30
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
      "accent"
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
      "success"
    );

    await typeLine(
      output,
      "Authentication complete."
    );

    await typeLine(
      output,
      "Type akko to enter AkkoAudio.",
      "accent"
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

        const value =
          prompt.input.value
            .trim()
            .toLowerCase();

        if (
          value !==
          "akko"
        ) {
          await typeLine(
            output,
            "[error] command not recognized.",
            "warn"
          );

          await typeLine(
            output,
            "[auth] type akko to enter.",
            "accent"
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
          "muted"
        );

        await typeLine(
          output,
          "[system] command accepted.",
          "success"
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
          "hidden"
        );

        unlockUI();

        setTimeout(
          () => overlay.remove(),
          400
        );
      }
    );

    setTimeout(
      () =>
        prompt.input.focus(),
      30
    );
  }

  function showGate(
    opts = {}
  ) {
    lockUI();
    clearPreverify();
    applySavedColors();

    const revoked =
      !!opts.revoked;

    const overlay =
      createTerminal();

    const output =
      overlay.querySelector(
        "#akkoflac-terminal-output"
      );

    addLine(
      output,
      "[auth] no active access session."
    );

    addLine(
      output,
      "[security] access code required."
    );

    if (revoked) {
      addLine(
        output,
        "[security] previous access code has been revoked.",
        "warn"
      );
    }

    addLine(
      output,
      ""
    );

    typeLine(
      output,
      "[terminal] enter your access code below",
      "accent"
    ).then(
      () => createAccessPrompt()
    );

    let submitting =
      false;

    function createAccessPrompt() {
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
          "warn"
        );

        createAccessPrompt();

        return;
      }

      submitting =
        true;

      /*
       * The entered access code is
       * replayed with the same typing
       * effect as the other terminal text.
       */

      await typeLine(
        output,
        "C:\\AkkoAudio> " +
          code,
        "muted",
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
            "warn"
          );

          await typeLine(
            output,
            "[auth] authentication failed."
          );

          await typeLine(
            output,
            "[terminal] try again.",
            "accent"
          );

          addLine(
            output,
            ""
          );

          submitting =
            false;

          createAccessPrompt();

          return;
        }

        /*
         * IMPORTANT:
         * Nothing above is cleared.
         * The successful authentication
         * is appended to the existing
         * terminal history.
         */

        await typeLine(
          output,
          "[auth] access code accepted.",
          "success"
        );

        await typeLine(
          output,
          "[auth] authentication successful.",
          "success"
        );

        await typeLine(
          output,
          "[security] access granted.",
          "success"
        );

        await typeLine(
          output,
          "Authentication complete.",
          "success"
        );

        await typeLine(
          output,
          "Type akko to enter AkkoAudio.",
          "accent"
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
                "warn"
              );

              await typeLine(
                output,
                "[auth] type akko to enter.",
                "accent"
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
              "muted",
              3
            );

            await typeLine(
              output,
              "[system] command accepted.",
              "success"
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
              "hidden"
            );

            unlockUI();

            setTimeout(
              () => overlay.remove(),
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
          "warn"
        );

        await typeLine(
          output,
          "[network] please try again.",
          "warn"
        );

        addLine(
          output,
          ""
        );

        submitting =
          false;

        createAccessPrompt();
      }
    }

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

    /*
     * No minimum 1500ms delay.
     * No forced 1800ms delay.
     *
     * The terminal progresses as
     * quickly as the typing animation
     * and server response allow.
     */

    const status =
      await statusPromise;

    if (status.valid) {
      await showVerificationSuccess();

      return;
    }

    removeOverlay();

    showGate({
      revoked:
        status.reason ===
        "revoked"
    });
  }

  function onboardingFinished() {
    return (
      localStorage.getItem(
        "akkoflac-onboarded"
      ) === "1"
    );
  }

  function start() {
    if (
      onboardingFinished()
    ) {
      runVerifyThenGate();

      return;
    }

    const onboarding =
      document.getElementById(
        "onboarding"
      );

    if (!onboarding) {
      runVerifyThenGate();

      return;
    }

    const observer =
      new MutationObserver(
        () => {
          if (
            onboardingFinished() &&
            onboarding.classList.contains(
              "hidden"
            )
          ) {
            observer.disconnect();

            runVerifyThenGate();
          }
        }
      );

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

    const poll =
      setInterval(
        () => {
          if (
            onboardingFinished() &&
            onboarding.classList.contains(
              "hidden"
            )
          ) {
            clearInterval(
              poll
            );

            observer.disconnect();

            runVerifyThenGate();
          }
        },
        300
      );
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

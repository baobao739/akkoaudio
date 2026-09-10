(() => {
  "use strict";

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
        rgba(255,255,255,.2) !important;
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
      color:
        var(--accent, #7b8cff) !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-success {
      color:
        #66e39a !important;

      text-shadow:
        0 0 18px
        rgba(102,227,154,.18) !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-warning {
      color:
        #f5c76a !important;
    }

    #akkoflac-verify-overlay
    .akkoflac-terminal-caret {
      display: inline-block !important;

      width: 7px !important;
      height: 1.05em !important;

      margin-left: 3px !important;

      vertical-align:
        -0.16em !important;

      background:
        var(--accent, #7b8cff) !important;

      animation:
        akkoflacTerminalCaret
        .65s
        steps(1, end)
        infinite !important;
    }

    @keyframes akkoflacTerminalCaret {
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
      "--accent-soft",
      `rgba(${r},${g},${b},.15)`
    );

    root.style.setProperty(
      "--accent-glow",
      `rgba(${r},${g},${b},.35)`
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
    type = "normal",
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
      "akkoflac-terminal-text";

    if (type === "accent") {
      span.classList.add(
        "akkoflac-terminal-accent"
      );
    }

    if (type === "success") {
      span.classList.add(
        "akkoflac-terminal-success"
      );
    }

    if (type === "warning") {
      span.classList.add(
        "akkoflac-terminal-warning"
      );
    }

    const caret =
      document.createElement(
        "span"
      );

    caret.className =
      "akkoflac-terminal-caret";

    line.append(
      span,
      caret
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

    caret.remove();

    await sleep(15);

    return line;
  }

  function addStaticLine(
    output,
    text,
    type = "normal"
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
      "akkoflac-terminal-text";

    if (type === "accent") {
      span.classList.add(
        "akkoflac-terminal-accent"
      );
    }

    if (type === "success") {
      span.classList.add(
        "akkoflac-terminal-success"
      );
    }

    if (type === "warning") {
      span.classList.add(
        "akkoflac-terminal-warning"
      );
    }

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
      "akkoflac-terminal-text";

    prefix.classList.add(
      "akkoflac-terminal-accent"
    );

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
      () => {
        input.focus();
      },
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
            "warning"
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
          "normal",
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

    addStaticLine(
      output,
      "[auth] no active access session."
    );

    addStaticLine(
      output,
      "[security] access code required."
    );

    if (revoked) {
      addStaticLine(
        output,
        "[security] previous access code has been revoked.",
        "warning"
      );
    }

    addStaticLine(
      output,
      ""
    );

    typeLine(
      output,
      "[terminal] enter your access code below",
      "accent"
    ).then(
      createAccessPrompt
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

    async function redeem(code) {
      if (submitting) {
        return;
      }

      if (
        code.length !== 5
      ) {
        await typeLine(
          output,
          "[error] access code must be 5 characters.",
          "warning"
        );

        createAccessPrompt();

        return;
      }

      submitting =
        true;

      /*
       * Replay the actual entered
       * code with the terminal typing
       * animation.
       */

      await typeLine(
        output,
        "C:\\AkkoAudio> " + code,
        "normal",
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
            "warning"
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

          addStaticLine(
            output,
            ""
          );

          submitting =
            false;

          createAccessPrompt();

          return;
        }

        /*
         * DO NOT CLEAR THE TERMINAL.
         * Everything stays visible and
         * new authentication messages
         * are appended underneath.
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
                "warning"
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

            /*
             * The final akko command
             * also types itself out.
             */

            await typeLine(
              output,
              "C:\\AkkoAudio> akko",
              "normal",
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
          "warning"
        );

        await typeLine(
          output,
          "[network] please try again.",
          "warning"
        );

        addStaticLine(
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
     * NO minimum wait.
     * NO 1500ms timer.
     * NO 1800ms timer.
     *
     * We continue as soon as the
     * server response is available.
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

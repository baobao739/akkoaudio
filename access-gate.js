(() => {
  "use strict";

  /*
    AKKOAUDIO ACCESS GATE
    Version 1.07

    IMPORTANT:
    Terminal text uses INLINE STYLES on purpose.
    This prevents the main AkkoAudio stylesheet
    from hiding or overriding terminal output.
  */

  const OVERLAY_ID = "akkoflac-verify-overlay";

  const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  /* =========================================================
     PREVERIFY
     ========================================================= */

  function clearPreverify() {
    document.documentElement.classList.remove(
      "akkoflac-preverify"
    );
  }

  /* =========================================================
     COLORS
     ========================================================= */

  function getAccent() {
    try {
      return (
        localStorage.getItem("akkoflac-accent") ||
        "#7b8cff"
      );
    } catch {
      return "#7b8cff";
    }
  }

  function applyAccent() {
    const accent = getAccent();

    document.documentElement.style.setProperty(
      "--accent",
      accent
    );
  }

  /* =========================================================
     BODY LOCK
     ========================================================= */

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

  /* =========================================================
     CLEAN OLD GATE
     ========================================================= */

  function removeOldGate() {
    const old =
      document.getElementById(OVERLAY_ID);

    if (old) {
      old.remove();
    }

    const oldStyle =
      document.getElementById(
        "akkoflac-terminal-force-style"
      );

    if (oldStyle) {
      oldStyle.remove();
    }
  }

  /* =========================================================
     TERMINAL CSS

     Only layout is handled here.
     TEXT VISIBILITY IS HANDLED INLINE IN JS.
     ========================================================= */

  function installStyle() {
    const old =
      document.getElementById(
        "akkoflac-terminal-force-style"
      );

    if (old) {
      old.remove();
    }

    const style =
      document.createElement("style");

    style.id =
      "akkoflac-terminal-force-style";

    style.textContent = `
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

        overflow: hidden !important;

        isolation: isolate !important;

        opacity: 1 !important;
        visibility: visible !important;

        transition: opacity .35s ease !important;
      }

      #akkoflac-verify-overlay.akkoflac-gate-fade {
        opacity: 0 !important;
        pointer-events: none !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-root {
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

        overflow: hidden !important;

        border: 0 !important;
        border-radius: 0 !important;

        box-shadow: none !important;

        font-family:
          "SFMono-Regular",
          "Cascadia Code",
          "Roboto Mono",
          Consolas,
          "Courier New",
          monospace !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-header {
        width: 100% !important;

        height: 36px !important;
        min-height: 36px !important;

        flex: 0 0 36px !important;

        display: flex !important;
        align-items: center !important;

        gap: 7px !important;

        padding: 0 12px !important;

        box-sizing: border-box !important;

        background: #101010 !important;

        border-bottom:
          1px solid rgba(255,255,255,.08) !important;

        user-select: none !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-dot {
        width: 9px !important;
        height: 9px !important;

        min-width: 9px !important;

        border-radius: 50% !important;

        display: block !important;

        background:
          rgba(255,255,255,.18) !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-window-title {
        margin-left: 7px !important;

        color:
          rgba(255,255,255,.48) !important;

        font-family:
          "Segoe UI",
          Arial,
          sans-serif !important;

        font-size: 11px !important;

        font-weight: 400 !important;

        line-height: 1 !important;

        background: transparent !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-output {
        flex: 1 1 auto !important;

        min-height: 0 !important;

        width: 100% !important;

        box-sizing: border-box !important;

        padding:
          14px
          18px
          32px !important;

        margin: 0 !important;

        overflow-x: hidden !important;
        overflow-y: auto !important;

        background: #050505 !important;

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

        white-space: pre-wrap !important;

        scrollbar-width: thin !important;

        scrollbar-color:
          #333
          #050505 !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-line {
        display: block !important;

        width: 100% !important;

        min-height: 1.7em !important;

        margin: 0 !important;
        padding: 0 !important;

        background: transparent !important;

        text-align: left !important;

        white-space: pre-wrap !important;

        font-family:
          "SFMono-Regular",
          "Cascadia Code",
          "Roboto Mono",
          Consolas,
          "Courier New",
          monospace !important;

        font-size: inherit !important;

        line-height: 1.7 !important;

        font-weight: 400 !important;

        opacity: 1 !important;

        visibility: visible !important;

        transform: none !important;

        animation: none !important;

        transition: none !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-input {
        display: inline-block !important;

        width: 5ch !important;
        min-width: 5ch !important;
        max-width: 12ch !important;

        height: 1.7em !important;

        margin: 0 !important;
        padding: 0 !important;

        border: 0 !important;
        outline: 0 !important;
        border-radius: 0 !important;

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

        transition: none !important;
      }

      #akkoflac-verify-overlay
      .akkoflac-terminal-input:disabled {
        opacity: .55 !important;
      }

      body.akkoflac-gate-locked {
        overflow: hidden !important;
      }

      body.akkoflac-awaiting-access {
        overflow: hidden !important;
      }

      @media (max-width: 600px) {
        #akkoflac-verify-overlay
        .akkoflac-terminal-header {
          height: 34px !important;
          min-height: 34px !important;
          flex-basis: 34px !important;
        }

        #akkoflac-verify-overlay
        .akkoflac-terminal-window-title {
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

    document.head.appendChild(style);
  }

  /* =========================================================
     CREATE TERMINAL
     ========================================================= */

  function createTerminal() {
    removeOldGate();
    installStyle();

    const overlay =
      document.createElement("div");

    overlay.id =
      OVERLAY_ID;

    overlay.innerHTML = `
      <div class="akkoflac-terminal-root">

        <div class="akkoflac-terminal-header">

          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>
          <span class="akkoflac-terminal-dot"></span>

          <span class="akkoflac-terminal-window-title">
            AkkoAudio Version 1.07
          </span>

        </div>

        <div
          id="akkoflac-terminal-output"
          class="akkoflac-terminal-output"
        ></div>

      </div>
    `;

    document.body.appendChild(
      overlay
    );

    return overlay;
  }

  /* =========================================================
     CREATE TEXT LINE

     INLINE COLOR + INLINE OPACITY.
     THIS IS THE IMPORTANT FIX.
     ========================================================= */

  function createTextLine(
    output,
    type = "normal"
  ) {
    const line =
      document.createElement("div");

    line.className =
      "akkoflac-terminal-line";

    line.style.display =
      "block";

    line.style.opacity =
      "1";

    line.style.visibility =
      "visible";

    line.style.color =
      type === "accent"
        ? getAccent()
        : type === "success"
          ? "#66e39a"
          : type === "warning"
            ? "#f5c76a"
            : "#c7c7c7";

    line.style.fontFamily =
      '"SFMono-Regular","Cascadia Code","Roboto Mono",Consolas,"Courier New",monospace';

    line.style.fontSize =
      "inherit";

    line.style.fontWeight =
      type === "success"
        ? "600"
        : "400";

    line.style.lineHeight =
      "1.7";

    line.style.background =
      "transparent";

    line.style.transition =
      "none";

    line.style.animation =
      "none";

    output.appendChild(
      line
    );

    return line;
  }

  /* =========================================================
     TYPEWRITER
     ========================================================= */

  async function typeLine(
    output,
    text,
    type = "normal",
    speed = 3
  ) {
    const line =
      createTextLine(
        output,
        type
      );

    const textNode =
      document.createTextNode("");

    line.appendChild(
      textNode
    );

    const cursor =
      document.createElement(
        "span"
      );

    cursor.style.display =
      "inline-block";

    cursor.style.width =
      "7px";

    cursor.style.height =
      "1.05em";

    cursor.style.marginLeft =
      "3px";

    cursor.style.verticalAlign =
      "-0.16em";

    cursor.style.background =
      getAccent();

    cursor.style.opacity =
      "1";

    cursor.style.visibility =
      "visible";

    cursor.style.animation =
      "none";

    line.appendChild(
      cursor
    );

    for (
      const character of text
    ) {
      textNode.textContent +=
        character;

      output.scrollTop =
        output.scrollHeight;

      await sleep(
        speed +
        Math.random() * 2
      );
    }

    cursor.remove();

    output.scrollTop =
      output.scrollHeight;

    return line;
  }

  function staticLine(
    output,
    text,
    type = "normal"
  ) {
    const line =
      createTextLine(
        output,
        type
      );

    line.textContent =
      text;

    output.scrollTop =
      output.scrollHeight;

    return line;
  }

  /* =========================================================
     COMMAND PROMPT
     ========================================================= */

  function createPrompt(
    output,
    maxLength
  ) {
    const line =
      createTextLine(
        output,
        "normal"
      );

    const prefix =
      document.createElement(
        "span"
      );

    prefix.textContent =
      "C:\\AkkoAudio> ";

    prefix.style.color =
      getAccent();

    prefix.style.fontWeight =
      "400";

    prefix.style.visibility =
      "visible";

    prefix.style.opacity =
      "1";

    line.appendChild(
      prefix
    );

    const input =
      document.createElement(
        "input"
      );

    input.type =
      "text";

    input.className =
      "akkoflac-terminal-input";

    input.maxLength =
      maxLength;

    input.autocomplete =
      "off";

    input.autocorrect =
      "off";

    input.autocapitalize =
      "none";

    input.spellcheck =
      false;

    input.inputMode =
      "text";

    input.setAttribute(
      "aria-label",
      "Terminal input"
    );

    line.appendChild(
      input
    );

    output.scrollTop =
      output.scrollHeight;

    setTimeout(
      () => {
        try {
          input.focus();
        } catch {}
      },
      30
    );

    return {
      line,
      input
    };
  }

  /* =========================================================
     HIDE / ENTER PLAYER
     ========================================================= */

  async function enterPlayer(
    overlay,
    output
  ) {
    await typeLine(
      output,
      "C:\\AkkoAudio> akko",
      "normal",
      3
    );

    await typeLine(
      output,
      "[system] command accepted.",
      "success",
      3
    );

    await typeLine(
      output,
      "[system] starting AkkoAudio...",
      "normal",
      3
    );

    await typeLine(
      output,
      "[system] entering player...",
      "normal",
      3
    );

    await sleep(200);

    overlay.classList.add(
      "akkoflac-gate-fade"
    );

    unlockUI();

    await sleep(400);

    overlay.remove();

    clearPreverify();
  }

  /* =========================================================
     AKKO COMMAND
     ========================================================= */

  function waitForAkko(
    overlay,
    output
  ) {
    return new Promise(resolve => {
      typeLine(
        output,
        "Type akko to enter AkkoAudio.",
        "accent",
        3
      ).then(() => {
        const prompt =
          createPrompt(
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
                "warning",
                3
              );

              await typeLine(
                output,
                "[auth] type akko to enter.",
                "accent",
                3
              );

              prompt.input.value =
                "";

              prompt.input.focus();

              return;
            }

            prompt.input.disabled =
              true;

            await enterPlayer(
              overlay,
              output
            );

            resolve();
          }
        );
      });
    });
  }

  /* =========================================================
     VERIFICATION
     ========================================================= */

  async function showVerifying() {
    lockUI();

    clearPreverify();

    applyAccent();

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

  /* =========================================================
     VERIFIED SESSION
     ========================================================= */

  async function showVerificationSuccess(
    overlay
  ) {
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

    await waitForAkko(
      overlay,
      output
    );
  }

  /* =========================================================
     ACCESS CODE GATE
     ========================================================= */

  async function showGate(
    revoked = false
  ) {
    lockUI();

    clearPreverify();

    applyAccent();

    const overlay =
      createTerminal();

    const output =
      overlay.querySelector(
        "#akkoflac-terminal-output"
      );

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
        "warning"
      );
    }

    await typeLine(
      output,
      "[terminal] enter your access code below",
      "accent"
    );

    let submitting =
      false;

    async function makePrompt() {
      const prompt =
        createPrompt(
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
        async event => {
          if (
            event.key !==
            "Enter"
          ) {
            return;
          }

          event.preventDefault();

          if (submitting) {
            return;
          }

          const code =
            prompt.input.value
              .trim()
              .toUpperCase();

          if (
            code.length !==
            5
          ) {
            await typeLine(
              output,
              "[error] access code must be 5 characters.",
              "warning"
            );

            prompt.input.value =
              "";

            prompt.input.focus();

            return;
          }

          submitting =
            true;

          prompt.input.disabled =
            true;

          await redeem(
            code
          );
        }
      );
    }

    async function redeem(
      code
    ) {
      /*
        Replay the code with the SAME
        terminal typing effect.
      */

      await typeLine(
        output,
        "C:\\AkkoAudio> " +
          code,
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

          if (
            reason.includes(
              "revok"
            )
          ) {
            await typeLine(
              output,
              "[security] access code has been revoked.",
              "warning"
            );
          } else {
            await typeLine(
              output,
              "[error] invalid access code.",
              "warning"
            );
          }

          await typeLine(
            output,
            "[auth] authentication failed."
          );

          await typeLine(
            output,
            "[terminal] try again.",
            "accent"
          );

          submitting =
            false;

          await makePrompt();

          return;
        }

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

        await waitForAkko(
          overlay,
          output
        );

      } catch (error) {
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

        submitting =
          false;

        await makePrompt();
      }
    }

    await makePrompt();

    overlay.addEventListener(
      "click",
      event => {
        const activeInput =
          output.querySelector(
            "input:not(:disabled)"
          );

        if (
          activeInput &&
          (
            event.target ===
              overlay ||
            event.target.closest(
              "#akkoflac-terminal-output"
            )
          )
        ) {
          activeInput.focus();
        }
      }
    );
  }

  /* =========================================================
     SERVER ACCESS CHECK
     ========================================================= */

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

  /* =========================================================
     VERIFY FLOW

     IMPORTANT:
     showVerifying() IS AWAITED NOW.
     ========================================================= */

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

    const overlay =
      await showVerifying();

    const status =
      await statusPromise;

    if (status.valid) {
      await showVerificationSuccess(
        overlay
      );

      return;
    }

    if (
      overlay &&
      overlay.parentNode
    ) {
      overlay.remove();
    }

    await showGate(
      status.reason ===
      "revoked"
    );
  }

  /* =========================================================
     ONBOARDING
     ========================================================= */

  function onboardingFinished() {
    try {
      return (
        localStorage.getItem(
          "akkoflac-onboarded"
        ) === "1"
      );
    } catch {
      return false;
    }
  }

  function start() {
    applyAccent();

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

    let started =
      false;

    function checkOnboarding() {
      if (started) {
        return;
      }

      if (
        !onboardingFinished()
      ) {
        return;
      }

      if (
        !onboarding.classList.contains(
          "hidden"
        )
      ) {
        return;
      }

      started =
        true;

      observer.disconnect();

      if (poll) {
        clearInterval(
          poll
        );
      }

      runVerifyThenGate();
    }

    const observer =
      new MutationObserver(
        checkOnboarding
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
        checkOnboarding,
        300
      );

    checkOnboarding();
  }

  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      {
        once: true
      }
    );
  } else {
    start();
  }

})();

(() => {
  "use strict";

  const STYLE = `
    #akkoflac-verify-overlay {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      margin: 0 !important;
      padding: 0 !important;
      z-index: 2147483647 !important;
      display: block !important;
      background: #000 !important;
      color: #c7c7c7 !important;
      font-family: Consolas, "Cascadia Mono", "Courier New", monospace !important;
      overflow: hidden !important;
    }

    .akkoflac-terminal {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      display: flex !important;
      flex-direction: column !important;
      background: #000 !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      overflow: hidden !important;
    }

    .akkoflac-terminal-bar {
      height: 30px !important;
      min-height: 30px !important;
      flex: 0 0 30px !important;
      display: flex !important;
      align-items: center !important;
      padding: 0 10px !important;
      background: #101010 !important;
      border-bottom: 1px solid #242424 !important;
      font-family: "Segoe UI", Arial, sans-serif !important;
      box-sizing: border-box !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .akkoflac-terminal-title {
      color: #d8d8d8 !important;
      font-size: 12px !important;
      line-height: 30px !important;
    }

    .akkoflac-terminal-controls {
      margin-left: auto !important;
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      gap: 18px !important;
      color: #bdbdbd !important;
      font-size: 12px !important;
    }

    .akkoflac-terminal-control {
      width: 12px !important;
      text-align: center !important;
      opacity: .8 !important;
    }

    .akkoflac-terminal-output {
      flex: 1 !important;
      min-height: 0 !important;
      width: 100% !important;
      height: calc(100% - 30px) !important;
      box-sizing: border-box !important;
      padding: 10px 12px 30px 12px !important;
      background: #000 !important;
      color: #c7c7c7 !important;
      font-family: Consolas, "Cascadia Mono", "Courier New", monospace !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      text-align: left !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      white-space: pre-wrap !important;
      word-break: break-word !important;
      scrollbar-width: thin !important;
      -webkit-overflow-scrolling: touch !important;
    }

    .akkoflac-terminal-line {
      display: block !important;
      min-height: 21px !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 1 !important;
      background: transparent !important;
      color: #c7c7c7 !important;
      font-family: Consolas, "Cascadia Mono", "Courier New", monospace !important;
      font-size: 14px !important;
      line-height: 21px !important;
      text-align: left !important;
      white-space: pre-wrap !important;
    }

    .akkoflac-terminal-prompt {
      display: inline !important;
      margin: 0 !important;
      padding: 0 !important;
      color: #c7c7c7 !important;
      font-family: Consolas, "Cascadia Mono", "Courier New", monospace !important;
      font-size: 14px !important;
      line-height: 21px !important;
      white-space: pre !important;
    }

    .akkoflac-terminal-input {
      display: inline !important;
      width: 5ch !important;
      min-width: 5ch !important;
      max-width: 5ch !important;
      height: 21px !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      outline: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      color: #c7c7c7 !important;
      font-family: Consolas, "Cascadia Mono", "Courier New", monospace !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      line-height: 21px !important;
      letter-spacing: 0 !important;
      caret-color: #fff !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      text-transform: uppercase !important;
      vertical-align: baseline !important;
    }

    .akkoflac-terminal-caret {
      display: inline-block !important;
      width: 8px !important;
      height: 17px !important;
      margin: 0 !important;
      padding: 0 !important;
      vertical-align: -3px !important;
      background: #c7c7c7 !important;
      animation: akkoCaretBlink 1s steps(1, end) infinite !important;
    }

    @keyframes akkoCaretBlink {
      0%, 49% {
        opacity: 1;
      }

      50%, 100% {
        opacity: 0;
      }
    }

    @media (max-width: 600px) {
      .akkoflac-terminal-output {
        padding: 8px 9px 24px 9px !important;
        font-size: 13px !important;
      }

      .akkoflac-terminal-line,
      .akkoflac-terminal-prompt,
      .akkoflac-terminal-input {
        font-size: 13px !important;
        line-height: 20px !important;
      }

      .akkoflac-terminal-input {
        height: 20px !important;
      }
    }
  `;

  const style = document.createElement("style");
  style.id = "akkoflac-terminal-style";
  style.textContent = STYLE;

  if (!document.getElementById("akkoflac-terminal-style")) {
    document.head.appendChild(style);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  function removeOverlay() {
    const old = document.getElementById(
      "akkoflac-verify-overlay"
    );

    if (old) {
      old.remove();
    }
  }

  function createTerminal() {
    removeOverlay();

    const overlay = document.createElement("div");

    overlay.id = "akkoflac-verify-overlay";

    overlay.innerHTML = `
      <div class="akkoflac-terminal">

        <div class="akkoflac-terminal-bar">

          <div class="akkoflac-terminal-title">
            AkkoAudio
          </div>

          <div class="akkoflac-terminal-controls">
            <span class="akkoflac-terminal-control">—</span>
            <span class="akkoflac-terminal-control">□</span>
            <span class="akkoflac-terminal-control">×</span>
          </div>

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

  async function typeLine(
    output,
    text,
    delay = 12
  ) {
    const line = document.createElement("div");

    line.className =
      "akkoflac-terminal-line";

    output.appendChild(line);

    for (const char of text) {
      line.textContent += char;

      output.scrollTop =
        output.scrollHeight;

      await sleep(
        delay +
        Math.random() * 5
      );
    }

    await sleep(80);

    output.scrollTop =
      output.scrollHeight;

    return line;
  }

  function addLine(
    output,
    text
  ) {
    const line =
      document.createElement("div");

    line.className =
      "akkoflac-terminal-line";

    line.textContent = text;

    output.appendChild(line);

    output.scrollTop =
      output.scrollHeight;

    return line;
  }

  async function showVerifying() {
    lockUI();

    const overlay =
      createTerminal();

    const output =
      overlay.querySelector(
        "#akkoflac-terminal-output"
      );

    await typeLine(
      output,
      "AkkoAudio [Version 1.07]"
    );

    await typeLine(
      output,
      "AkkoAudio. All rights reserved."
    );

    await sleep(300);

    addLine(
      output,
      ""
    );

    await typeLine(
      output,
      "C:\\AkkoAudio> akkoauth.exe --verify"
    );

    await typeLine(
      output,
      ""
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
      "[verification] waiting for server response..."
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

    await typeLine(
      output,
      "[OK] access session verified."
    );

    await typeLine(
      output,
      "[OK] credentials accepted."
    );

    await typeLine(
      output,
      ""
    );

    await typeLine(
      output,
      "C:\\AkkoAudio> launch.exe"
    );

    await sleep(1500);

    overlay.style.transition =
      "opacity .35s ease";

    overlay.style.opacity = "0";

    await sleep(400);

    overlay.remove();

    unlockUI();
  }

  function showGate(opts = {}) {
    lockUI();

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
      "AkkoAudio [Version 1.07]"
    );

    addLine(
      output,
      "AkkoAudio. All rights reserved."
    );

    addLine(
      output,
      ""
    );

    addLine(
      output,
      "C:\\AkkoAudio> akkoauth.exe --login"
    );

    addLine(
      output,
      ""
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
        "[security] previous access code has been revoked."
      );
    }

    addLine(
      output,
      ""
    );

    let activeInput = null;
    let activeCaret = null;
    let submitting = false;

    function addPrompt() {
      const commandLine =
        document.createElement("div");

      commandLine.className =
        "akkoflac-terminal-line";

      commandLine.textContent =
        "C:\\AkkoAudio> ";

      output.appendChild(
        commandLine
      );

      const input =
        document.createElement("input");

      input.className =
        "akkoflac-terminal-input";

      input.type = "text";
      input.maxLength = 5;
      input.autocomplete = "off";
      input.autocapitalize =
        "characters";
      input.spellcheck = false;

      input.setAttribute(
        "inputmode",
        "text"
      );

      input.setAttribute(
        "aria-label",
        "Access code"
      );

      commandLine.appendChild(
        input
      );

      let caret =
        document.createElement("span");

      caret.className =
        "akkoflac-terminal-caret";

      commandLine.appendChild(
        caret
      );

      activeInput = input;
      activeCaret = caret;

      input.addEventListener(
        "input",
        () => {
          input.value =
            input.value
              .replace(
                /[^a-zA-Z0-9]/g,
                ""
              )
              .toUpperCase()
              .slice(0, 5);

          if (caret) {
            caret.remove();
            caret = null;
            activeCaret = null;
          }

          output.scrollTop =
            output.scrollHeight;
        }
      );

      input.addEventListener(
        "focus",
        () => {
          if (caret) {
            caret.remove();
            caret = null;
            activeCaret = null;
          }
        }
      );

      input.addEventListener(
        "blur",
        () => {
          if (submitting) return;

          if (!caret) {
            caret =
              document.createElement(
                "span"
              );

            caret.className =
              "akkoflac-terminal-caret";

            commandLine.appendChild(
              caret
            );

            activeCaret = caret;
          }
        }
      );

      input.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" &&
            !submitting
          ) {
            event.preventDefault();

            redeem(
              input.value
                .trim()
                .toUpperCase(),
              input,
              caret
            );
          }
        }
      );

      output.scrollTop =
        output.scrollHeight;

      setTimeout(
        () => {
          input.focus();

          try {
            input.setSelectionRange(
              input.value.length,
              input.value.length
            );
          } catch {}
        },
        30
      );

      return input;
    }

    async function redeem(
      code,
      input,
      caret
    ) {
      if (submitting) return;

      if (code.length !== 5) {
        addLine(
          output,
          "[error] access code must be 5 characters."
        );

        addLine(
          output,
          ""
        );

        submitting = false;

        if (input) {
          input.value = "";
          input.disabled = true;
        }

        addPrompt();

        return;
      }

      submitting = true;

      input.disabled = true;

      if (caret) {
        caret.remove();
      }

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

          const revoked =
            reason.includes(
              "revok"
            );

          await typeLine(
            output,
            revoked
              ? "[security] access code has been revoked."
              : "[error] invalid access code."
          );

          await typeLine(
            output,
            revoked
              ? "[security] please use a different access code."
              : "[auth] authentication failed."
          );

          addLine(
            output,
            ""
          );

          submitting = false;

          addPrompt();

          return;
        }

        await typeLine(
          output,
          "[OK] access code accepted."
        );

        await typeLine(
          output,
          "[OK] authentication successful."
        );

        await typeLine(
          output,
          ""
        );

        await typeLine(
          output,
          "C:\\AkkoAudio> launch.exe"
        );

        await sleep(1500);

        overlay.style.transition =
          "opacity .35s ease";

        overlay.style.opacity =
          "0";

        await sleep(400);

        overlay.remove();

        unlockUI();

      } catch (error) {
        await typeLine(
          output,
          "[error] unable to connect to authentication server."
        );

        await typeLine(
          output,
          "[network] please try again."
        );

        addLine(
          output,
          ""
        );

        submitting = false;

        addPrompt();
      }
    }

    overlay.addEventListener(
      "click",
      event => {
        if (
          event.target === overlay ||
          event.target.closest(
            ".akkoflac-terminal-output"
          )
        ) {
          if (
            activeInput &&
            !activeInput.disabled
          ) {
            activeInput.focus();
          }
        }
      }
    );

    addPrompt();
  }

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
    } else {
      removeOverlay();

      showGate({
        revoked:
          status.reason ===
          "revoked"
      });
    }
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

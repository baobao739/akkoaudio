(() => {
  "use strict";

  const STYLE = `
    #akkoflac-access-overlay {
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--bg, #121212);
      transition: opacity .45s ease, visibility .45s ease;
    }

    #akkoflac-access-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .akkoflac-access-box {
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
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
  `;

  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.appendChild(style);

  function createGate() {
    if (document.getElementById("akkoflac-access-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "akkoflac-access-overlay";

    overlay.innerHTML = `
      <div class="akkoflac-access-box" id="akkoflac-access-box">
        <h1 class="akkoflac-access-title">Enter Access Code</h1>

        <p class="akkoflac-access-subtitle">
          Enter your 5-character AkkoFlac access code to continue.
        </p>

        <input
          id="akkoflac-access-input"
          class="akkoflac-access-input"
          type="text"
          maxlength="5"
          minlength="5"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          placeholder="•••••"
        />

        <button
          id="akkoflac-access-button"
          class="akkoflac-access-button"
          type="button"
        >
          Continue
        </button>

        <div
          id="akkoflac-access-error"
          class="akkoflac-access-error"
        ></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = document.getElementById("akkoflac-access-input");
    const button = document.getElementById("akkoflac-access-button");
    const error = document.getElementById("akkoflac-access-error");
    const box = document.getElementById("akkoflac-access-box");

    input.addEventListener("input", () => {
      input.value = input.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 5)
        .toUpperCase();

      error.textContent = "";
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") redeem();
    });

    button.addEventListener("click", redeem);

    async function redeem() {
      const code = input.value.trim().toUpperCase();

      if (code.length !== 5) {
        showError("Enter a 5-character code.");
        return;
      }

      button.disabled = true;
      button.textContent = "Checking...";

      try {
        const response = await fetch(
          "/.netlify/functions/verify-code",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.valid) {
          showError(data.error || "Invalid or already-used code.");
          return;
        }

        overlay.classList.add("hidden");

        setTimeout(() => {
          overlay.remove();
        }, 500);

      } catch {
        showError("Couldn't connect. Try again.");
      } finally {
        button.disabled = false;
        button.textContent = "Continue";
      }
    }

    function showError(message) {
      error.textContent = message;

      box.classList.remove("akkoflac-access-shake");
      void box.offsetWidth;
      box.classList.add("akkoflac-access-shake");

      button.disabled = false;
      button.textContent = "Continue";
    }

    setTimeout(() => input.focus(), 150);
  }

  async function checkAccess() {
    try {
      const response = await fetch(
        "/.netlify/functions/access-status",
        {
          credentials: "include"
        }
      );

      const data = await response.json();

      if (data.valid) return true;
    } catch {}

    return false;
  }

  async function start() {
    const hasAccess = await checkAccess();

    if (hasAccess) return;

    const waitForOnboarding = setInterval(() => {
      const onboarding =
        document.getElementById("onboarding");

      const onboardingDone =
        localStorage.getItem("akkoflac-onboarded") === "1";

      if (
        onboardingDone &&
        (!onboarding || onboarding.classList.contains("hidden"))
      ) {
        clearInterval(waitForOnboarding);
        createGate();
      }
    }, 200);

    setTimeout(() => {
      clearInterval(waitForOnboarding);

      if (
        localStorage.getItem("akkoflac-onboarded") === "1" &&
        !document.getElementById("akkoflac-access-overlay")
      ) {
        createGate();
      }
    }, 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

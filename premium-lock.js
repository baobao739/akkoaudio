(() => {
  "use strict";

  const FREE_THEME = "charcoal";
  const FREE_ACCENT = "#fafafa";
  const FREE_FOCUS = "dynamic";

  let isPremium = false;

  function applyFreeDefaults() {
    try {
      localStorage.setItem("akkomusic-theme", FREE_THEME);
      localStorage.setItem("akkomusic-accent", FREE_ACCENT);
      localStorage.setItem("akkomusic-focus-bg", FREE_FOCUS);
    } catch (_) {}

    const root = document.documentElement;
    root.style.setProperty("--accent", FREE_ACCENT);
    root.style.setProperty("--accent-bright", "#ffffff");
    root.style.setProperty("--accent-soft", "rgba(250,250,250,0.15)");
    root.style.setProperty("--accent-glow", "rgba(250,250,250,0.28)");
    root.style.setProperty("--theme-bottom", "#1b1c24");
    root.style.setProperty("--bg", "#1b1c24");
    root.style.setProperty("--bg-deep", "#1b1c24");

    document.querySelectorAll(".theme-option").forEach((el) => {
      const name = (el.dataset.theme || el.getAttribute("data-theme") || "").toLowerCase();
      if (name && name !== FREE_THEME) {
        el.classList.add("akko-premium-locked");
        el.style.display = "none";
      } else {
        el.classList.add("active");
      }
    });

    document.querySelectorAll(".accent-swatch").forEach((el) => {
      const hex = (el.dataset.accent || el.getAttribute("data-accent") || el.style.backgroundColor || "").toLowerCase();
      const isWhite =
        hex.includes("fafafa") ||
        hex.includes("ffffff") ||
        hex.includes("#fff") ||
        hex === "white";
      if (!isWhite) {
        el.classList.add("akko-premium-locked");
        el.style.display = "none";
      } else {
        el.classList.add("active");
      }
    });

    document.querySelectorAll("[data-focus], [data-focus-bg], .focus-option, .focus-bg-option").forEach((el) => {
      const v = (
        el.dataset.focus ||
        el.dataset.focusBg ||
        el.getAttribute("data-focus") ||
        el.getAttribute("data-focus-bg") ||
        ""
      ).toLowerCase();
      if (v && v !== FREE_FOCUS && v !== "dynamic") {
        el.classList.add("akko-premium-locked");
        el.style.display = "none";
      }
    });

    // Hide labeled groups that mention premium-only features
    document.querySelectorAll(".settings-group, .settings-card, .settings-label").forEach((el) => {
      const t = (el.textContent || "").toLowerCase();
      if (
        /trees|flowers|color themes|accent colors|focus background|akko trees/i.test(t) &&
        !/premium/i.test(t)
      ) {
        // don't hide whole card if it also has premium — hide matching rows only
      }
    });
  }

  function unlockPremiumUI() {
    document.querySelectorAll(".akko-premium-locked").forEach((el) => {
      el.classList.remove("akko-premium-locked");
      el.style.display = "";
    });
    document.getElementById("akko-premium-panel")?.classList.add("is-premium");
  }

  function injectPremiumStyles() {
    if (document.getElementById("akko-premium-css")) return;
    const s = document.createElement("style");
    s.id = "akko-premium-css";
    s.textContent =
      ".akko-premium-tab{margin-top:1.25rem;padding:1.1rem 1.15rem;border-radius:18px;" +
      "border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03)}" +
      ".akko-premium-tab h3{margin:0 0 .35rem;font-size:1rem;font-weight:650;letter-spacing:-.02em}" +
      ".akko-premium-tab p{margin:0 0 .85rem;color:#a1a1aa;font-size:.85rem;line-height:1.45}" +
      ".akko-premium-tab input{width:100%;box-sizing:border-box;padding:.85rem 1rem;border-radius:12px;" +
      "border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.25);color:#fafafa;font-size:.95rem;outline:none}" +
      ".akko-premium-tab button{margin-top:.65rem;width:100%;height:44px;border:0;border-radius:999px;" +
      "background:linear-gradient(180deg,#fff,#e8e8ec);color:#0a0a0b;font-weight:650;cursor:pointer}" +
      ".akko-premium-tab .msg{margin-top:.6rem;font-size:.82rem;font-weight:600;min-height:1.1em}" +
      ".akko-premium-tab .msg.ok{color:#4ade80}.akko-premium-tab .msg.err{color:#fb7185}" +
      ".akko-premium-tab.is-premium .redeem-row{display:none}" +
      ".akko-premium-badge{display:inline-block;margin-left:.4rem;padding:.12rem .45rem;border-radius:999px;" +
      "font-size:.65rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;" +
      "background:rgba(250,204,21,.12);color:#facc15;border:1px solid rgba(250,204,21,.25)}";
    document.head.appendChild(s);
  }

  function findSettingsHost() {
    return (
      document.querySelector(".settings-card") ||
      document.querySelector("#settings") ||
      document.querySelector("[data-page=settings]") ||
      document.querySelector(".page-settings") ||
      null
    );
  }

  function injectPremiumTab() {
    if (document.getElementById("akko-premium-panel")) return;
    injectPremiumStyles();

    const host = findSettingsHost();
    const panel = document.createElement("div");
    panel.id = "akko-premium-panel";
    panel.className = "akko-premium-tab" + (isPremium ? " is-premium" : "");
    panel.innerHTML =
      "<h3>AkkoMusic Premium" +
      (isPremium ? '<span class="akko-premium-badge">Active</span>' : "") +
      "</h3>" +
      "<p>" +
      (isPremium
        ? "All themes, accents, and focus backgrounds are unlocked."
        : "Free plan: charcoal theme, white accent, dynamic focus only. Enter a premium code to unlock everything.") +
      "</p>" +
      '<div class="redeem-row">' +
      '<input id="akko-premium-code" maxlength="16" placeholder="Premium code" spellcheck="false" autocomplete="off">' +
      '<button type="button" id="akko-premium-redeem">Unlock Premium</button>' +
      '<div class="msg" id="akko-premium-msg"></div></div>';

    if (host) host.appendChild(panel);
    else {
      panel.style.position = "fixed";
      panel.style.bottom = "88px";
      panel.style.right = "16px";
      panel.style.width = "min(320px, calc(100vw - 32px))";
      panel.style.zIndex = "99999";
      document.body.appendChild(panel);
    }

    const btn = document.getElementById("akko-premium-redeem");
    const input = document.getElementById("akko-premium-code");
    const msg = document.getElementById("akko-premium-msg");
    if (!btn) return;

    btn.onclick = async () => {
      msg.className = "msg";
      msg.textContent = "";
      const code = (input.value || "").trim().toUpperCase();
      if (!code) {
        msg.className = "msg err";
        msg.textContent = "Enter a code.";
        return;
      }
      btn.disabled = true;
      btn.textContent = "Checking…";
      try {
        const r = await fetch("/.netlify/functions/redeem-premium", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) {
          msg.className = "msg err";
          msg.textContent = d.error || "Could not redeem.";
          btn.disabled = false;
          btn.textContent = "Unlock Premium";
          return;
        }
        isPremium = true;
        msg.className = "msg ok";
        msg.textContent = d.message || "Premium unlocked!";
        unlockPremiumUI();
        panel.classList.add("is-premium");
        const h = panel.querySelector("h3");
        if (h && !h.querySelector(".akko-premium-badge")) {
          h.insertAdjacentHTML("beforeend", '<span class="akko-premium-badge">Active</span>');
        }
      } catch {
        msg.className = "msg err";
        msg.textContent = "Network error.";
      }
      btn.disabled = false;
      btn.textContent = "Unlock Premium";
    };
  }

  async function checkPremium() {
    try {
      const r = await fetch("/.netlify/functions/verify-session", {
        credentials: "include",
        cache: "no-store"
      });
      const d = await r.json().catch(() => ({}));
      isPremium = !!(d.valid && d.is_premium);
    } catch {
      isPremium = false;
    }

    if (!isPremium) applyFreeDefaults();
    else unlockPremiumUI();

    injectPremiumTab();
  }

  function start() {
    checkPremium();
    // Re-apply when settings page might re-render
    setInterval(() => {
      if (!isPremium) applyFreeDefaults();
      if (!document.getElementById("akko-premium-panel")) injectPremiumTab();
    }, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

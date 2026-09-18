(() => {
  "use strict";

  const FREE_THEME = "warmblack";
  const FREE_ACCENT = "#fafafa";
  const FREE_FOCUS = "dynamic";

  let isPremium = false;

  function applyFreeDefaults() {
    try {
      localStorage.setItem("akkomusic-theme", FREE_THEME);
      localStorage.setItem("akkomusic-accent", FREE_ACCENT);
      localStorage.setItem("akkomusic-focus-bg", FREE_FOCUS);
      localStorage.setItem("akkomusic-is-premium", "0");
    } catch (_) {}

    const root = document.documentElement;
    root.style.setProperty("--accent", FREE_ACCENT);
    root.style.setProperty("--accent-bright", "#ffffff");
    root.style.setProperty("--accent-soft", "rgba(250,250,250,0.14)");
    root.style.setProperty("--accent-glow", "rgba(250,250,250,0.28)");
    root.style.setProperty("--theme-top", "#121214");
    root.style.setProperty("--theme-mid", "#0a0a0c");
    root.style.setProperty("--theme-bottom", "#050507");
    root.style.setProperty("--bg", "#050507");
    root.style.setProperty("--bg-deep", "#050507");

    document.querySelectorAll(".theme-option").forEach((el) => {
      const name = (el.dataset.theme || el.getAttribute("data-theme") || "").toLowerCase();
      if (name && name !== FREE_THEME) {
        el.classList.add("akko-premium-locked");
        el.style.display = "none";
      } else {
        el.classList.add("active");
        el.style.display = "";
      }
    });

    document.querySelectorAll(".accent-swatch").forEach((el) => {
      const hex = (el.dataset.accent || el.getAttribute("data-accent") || "").toLowerCase();
      const isWhite = hex.includes("fafafa") || hex.includes("ffffff");
      if (!isWhite) {
        el.classList.add("akko-premium-locked");
        el.style.display = "none";
      } else {
        el.classList.add("active");
        el.style.display = "";
      }
    });

    document.querySelectorAll("[data-focus-bg]").forEach((el) => {
      const v = (el.getAttribute("data-focus-bg") || "").toLowerCase();
      if (v && v !== FREE_FOCUS) {
        el.classList.add("akko-premium-locked");
        el.style.display = "none";
      }
    });
  }

  function unlockPremiumUI() {
    document.querySelectorAll(".akko-premium-locked").forEach((el) => {
      el.classList.remove("akko-premium-locked");
      el.style.display = "";
    });
    try { localStorage.setItem("akkomusic-is-premium", "1"); } catch (_) {}
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
  }

  function start() {
    checkPremium();
    setInterval(() => {
      if (!isPremium) applyFreeDefaults();
    }, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

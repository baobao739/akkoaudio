(() => {
  "use strict";

  const FREE_THEME = "warmblack";
  const FREE_ACCENT = "#fafafa";
  const FREE_FOCUS = "dynamic";

  let isPremium = false;
  let checkedOnce = false;

  function applyFreeDefaults() {
    try {
      localStorage.setItem("akkomusic-theme", FREE_THEME);
      localStorage.setItem("akkomusic-accent", FREE_ACCENT);
      localStorage.setItem("akkomusic-focus-bg", FREE_FOCUS);
      localStorage.setItem("akkomusic-is-premium", "0");
    } catch (_) {}

    const root = document.documentElement;
    root.classList.add("akko-free");
    root.classList.remove("akko-premium");
    root.style.setProperty("--accent", FREE_ACCENT);
    root.style.setProperty("--accent-bright", "#ffffff");
    root.style.setProperty("--accent-soft", "rgba(250,250,250,0.14)");
    root.style.setProperty("--accent-glow", "rgba(250,250,250,0.28)");
    root.style.setProperty("--theme-top", "#121214");
    root.style.setProperty("--theme-mid", "#0a0a0c");
    root.style.setProperty("--theme-bottom", "#050507");
    root.style.setProperty("--bg", "#050507");
    root.style.setProperty("--bg-deep", "#050507");

    try {
      if (typeof applyTheme === "function") applyTheme(FREE_THEME);
      if (typeof applyAccent === "function") applyAccent(FREE_ACCENT);
      if (typeof applyFocusBackground === "function") applyFocusBackground(FREE_FOCUS);
    } catch (_) {}

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
      } else {
        el.style.display = "";
      }
    });

    const st = document.getElementById("akkoPremiumStatus");
    if (st) st.textContent = "Free plan: Warm Black, white accent, dynamic focus. Premium is tied to your account on every device.";
  }

  function unlockPremiumUI() {
    document.documentElement.classList.remove("akko-free");
    document.documentElement.classList.add("akko-premium");
    document.querySelectorAll(".akko-premium-locked").forEach((el) => {
      el.classList.remove("akko-premium-locked");
      el.style.display = "";
    });
    document.querySelectorAll(".theme-option, .accent-swatch, [data-focus-bg]").forEach((el) => {
      el.style.display = "";
    });
    try { localStorage.setItem("akkomusic-is-premium", "1"); } catch (_) {}
    const st = document.getElementById("akkoPremiumStatus");
    if (st) st.textContent = "Premium active on this account — works on all your devices when logged in.";
    const redeem = document.getElementById("akkoPremiumRedeem");
    if (redeem) redeem.style.display = "none";
  }

  async function checkPremium() {
    try {
      const r = await fetch("/.netlify/functions/verify-session", {
        credentials: "include",
        cache: "no-store"
      });
      const d = await r.json().catch(() => ({}));
      // Server is source of truth (cross-device)
      isPremium = !!(d.valid && d.is_premium === true);
      checkedOnce = true;
    } catch {
      // network blip: keep previous state, do not force free
      if (!checkedOnce) isPremium = false;
    }

    if (isPremium) unlockPremiumUI();
    else applyFreeDefaults();

    return isPremium;
  }

  function start() {
    checkPremium();
    // Re-check server every 20s so other-device redeem shows up
    setInterval(checkPremium, 20000);
    // Soft UI re-apply without flipping server truth
    setInterval(() => {
      if (!checkedOnce) return;
      if (isPremium) unlockPremiumUI();
      else applyFreeDefaults();
    }, 3000);
  }

  window.akkoRefreshPremium = checkPremium;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

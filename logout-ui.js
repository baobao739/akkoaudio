(() => {
  "use strict";
  async function doLogout() {
    try {
      await fetch("/.netlify/functions/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store"
      });
    } catch (_) {}
    location.href = "/landing";
  }
  function inject() {
    if (document.getElementById("akkomusic-logout-btn-settings")) return;
    const style = document.createElement("style");
    style.textContent = `
      #akkomusic-logout-btn-settings {
        margin-top: 18px; width: 100%; padding: 12px 16px; border-radius: 14px;
        border: 1px solid rgba(255,100,100,0.25); background: rgba(255,80,80,0.1);
        color: #ff8a8a; font-weight: 700; font-size: 14px; cursor: pointer;
      }
      #akkomusic-logout-btn-settings:hover { background: rgba(255,80,80,0.18); }
      #akkomusic-logout-btn {
        display: block; width: 100%; margin-top: 10px; padding: 10px 14px;
        border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,80,80,0.12); color: #ff8a8a; font-weight: 700; font-size: 13px; cursor: pointer;
      }
      @media (max-width: 760px) { #akkomusic-logout-btn { display: none; } }
    `;
    document.head.appendChild(style);
    const credit = document.querySelector(".sidebar-credit");
    if (credit && !document.getElementById("akkomusic-logout-btn")) {
      const b = document.createElement("button");
      b.type = "button";
      b.id = "akkomusic-logout-btn";
      b.textContent = "Log out";
      b.onclick = doLogout;
      credit.appendChild(b);
    }
    const settings = document.querySelector("#settingsPage .settings-card, #settingsPage .credits-card");
    if (settings) {
      const wrap = document.createElement("div");
      wrap.className = "settings-group";
      wrap.innerHTML = '<div class="settings-label">Account</div>';
      const b = document.createElement("button");
      b.type = "button";
      b.id = "akkomusic-logout-btn-settings";
      b.textContent = "Log out";
      b.onclick = doLogout;
      wrap.appendChild(b);
      settings.appendChild(wrap);
    }
  }
  function boot() {
    const tick = () => {
      if (!document.body.classList.contains("akkomusic-gate-locked") &&
          !document.body.classList.contains("akkomusic-awaiting-access")) {
        inject();
        return;
      }
      setTimeout(tick, 500);
    };
    tick();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

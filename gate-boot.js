document.documentElement.classList.add("akkomusic-preverify");
(function () {
  var s = document.createElement("style");
  s.id = "akko-preverify";
  s.textContent =
    "html.akkomusic-preverify,html.akkomusic-preverify body{background:#050507!important}" +
    "html.akkomusic-preverify body{overflow:hidden!important}" +
    "html.akkomusic-preverify .sidebar,html.akkomusic-preverify .main,html.akkomusic-preverify .main-content," +
    "html.akkomusic-preverify .bottom-player,html.akkomusic-preverify .full-player,html.akkomusic-preverify .queue-panel," +
    "html.akkomusic-preverify .focus-panel,html.akkomusic-preverify .page-view,html.akkomusic-preverify .song-grid," +
    "html.akkomusic-preverify .track-list{visibility:hidden!important;pointer-events:none!important;opacity:0!important}" +
    "html.akkomusic-preverify #akkomusic-access-overlay,html.akkomusic-preverify #akkomusic-verify-overlay," +
    "html.akkomusic-preverify #onboarding{visibility:visible!important;pointer-events:auto!important;opacity:1!important}";
  document.documentElement.appendChild(s);
})();

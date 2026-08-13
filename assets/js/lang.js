// Bilingual/English-only toggle.
// The <head> inline script already set html.lang-en (or not) before paint,
// based on the ?lang= URL param or the saved localStorage preference —
// that drives CSS hiding for anything tagged [lang="fa"]. This file wires
// up the button, persists the choice, and hides the "Persian" column in
// vocabulary tables (detected generically, no markdown edits needed).
(function () {
  function currentMode() {
    return document.documentElement.classList.contains("lang-en") ? "en" : "bilingual";
  }

  function toggleFaColumns(mode) {
    document.querySelectorAll("table").forEach(function (table) {
      var headerCells = table.querySelectorAll("thead th");
      if (!headerCells.length) headerCells = table.querySelectorAll("tr:first-child th");
      var colIndex = -1;
      headerCells.forEach(function (th, i) {
        if (th.textContent.trim() === "Persian") colIndex = i + 1; // nth-child is 1-based
      });
      if (colIndex < 1) return;
      table.querySelectorAll("tr > *:nth-child(" + colIndex + ")").forEach(function (cell) {
        cell.classList.toggle("fa-col-hidden", mode === "en");
      });
    });
  }

  function setMode(mode) {
    document.documentElement.classList.toggle("lang-en", mode === "en");
    try {
      localStorage.setItem("dfp-lang-mode", mode);
    } catch (e) { /* localStorage unavailable (e.g. private mode) — ignore */ }
    try {
      var url = new URL(location.href);
      url.searchParams.set("lang", mode);
      history.replaceState(null, "", url);
    } catch (e) { /* ignore */ }
    try {
      toggleFaColumns(mode);
    } catch (e) {
      console.error("lang.js: toggleFaColumns failed", e);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Attach the click handler FIRST — if the table-scan below throws,
    // the toggle button must still work.
    var btn = document.getElementById("lang-toggle-btn");
    if (btn) {
      btn.addEventListener("click", function () {
        setMode(currentMode() === "en" ? "bilingual" : "en");
      });
    }
    try {
      toggleFaColumns(currentMode());
    } catch (e) {
      console.error("lang.js: initial toggleFaColumns failed", e);
    }
  });
})();

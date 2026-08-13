// Homepage-only: renders per-lesson progress badges, the overall summary
// line, and wires up the settings dropdown (export / import / reset).
// Depends on window.DFPProgress from progress.js (must load first).
(function () {
  function scoreClass(correct, total) {
    if (total === 0) return "";
    var ratio = correct / total;
    if (ratio === 1) return "score-good";
    if (ratio >= 0.5) return "score-mid";
    return "score-low";
  }

  function renderBadges() {
    if (!window.DFPProgress) return;
    var data = window.DFPProgress.load();
    var items = document.querySelectorAll(".lesson-list li[data-slug]");
    var viewedCount = 0;
    var total = items.length;

    items.forEach(function (li) {
      var slug = li.getAttribute("data-slug");
      var slot = li.querySelector("[data-progress-slot]");
      if (!slot) return;
      var entry = data.lessons[slug];
      if (!entry) {
        slot.textContent = "";
        return;
      }
      if (entry.viewed) viewedCount++;

      var parts = [];
      if (entry.viewed) parts.push("✅");
      slot.className = "lesson-progress-badge";
      if (entry.quiz && entry.quiz.total) {
        var cls = scoreClass(entry.quiz.correct, entry.quiz.total);
        slot.classList.add(cls);
        parts.push(entry.quiz.correct + "/" + entry.quiz.total);
      }
      slot.textContent = parts.join(" · ");
    });

    var summary = document.getElementById("progress-summary-text");
    if (summary) {
      if (viewedCount === 0) {
        summary.textContent = "You haven't started any lessons yet — pick one below to begin!";
        summary.setAttribute("dir", "ltr");
      } else {
        summary.textContent = "You've completed " + viewedCount + " of " + total + " lessons.";
      }
    }
  }

  function setupSettingsMenu() {
    var btn = document.getElementById("progress-settings-btn");
    var menu = document.getElementById("progress-settings-menu");
    if (!btn || !menu) return;

    function closeMenu() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
    function toggleMenu() {
      var willOpen = menu.hidden;
      menu.hidden = !willOpen;
      btn.setAttribute("aria-expanded", String(willOpen));
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu();
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) closeMenu();
    });

    var exportBtn = document.getElementById("progress-export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        if (window.DFPProgress) window.DFPProgress.exportProgress();
        closeMenu();
      });
    }

    var importInput = document.getElementById("progress-import-input");
    if (importInput) {
      importInput.addEventListener("change", function () {
        var file = importInput.files && importInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          window.DFPProgress.importProgress(String(reader.result), function (err) {
            if (err) {
              alert("Could not import that file — it doesn't look like a valid progress export.");
              return;
            }
            renderBadges();
          });
        };
        reader.readAsText(file);
        importInput.value = "";
        closeMenu();
      });
    }

    var resetBtn = document.getElementById("progress-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (!confirm("Reset all saved progress? This can't be undone (unless you've exported a backup).")) return;
        window.DFPProgress.reset();
        renderBadges();
        closeMenu();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderBadges();
    setupSettingsMenu();
  });
})();

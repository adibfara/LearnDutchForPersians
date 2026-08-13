// Progress tracking: records which lessons have been viewed and how the
// user scored on each lesson's quiz, persisted to localStorage. Also
// provides export/import/reset for backing up progress across devices.
// Exposes a small API on window.DFPProgress used by lesson pages (to mark
// views + quiz results) and the homepage (to render badges + settings UI).
(function () {
  var STORAGE_KEY = "dfp-progress-v1";

  function nowISO() {
    return new Date().toISOString();
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : null;
      if (!data || typeof data !== "object" || !data.lessons) {
        data = { lessons: {} };
      }
      return data;
    } catch (e) {
      return { lessons: {} };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* localStorage unavailable (private mode, quota, etc.) — fail silently */
    }
  }

  function markViewed(slug) {
    if (!slug) return;
    var data = load();
    var entry = data.lessons[slug] || {};
    if (!entry.firstViewedAt) entry.firstViewedAt = nowISO();
    entry.viewed = true;
    entry.lastViewedAt = nowISO();
    data.lessons[slug] = entry;
    save(data);
  }

  function recordQuizAnswer(slug, correct, answered, total) {
    if (!slug) return;
    var data = load();
    var entry = data.lessons[slug] || {};
    entry.viewed = true;
    entry.quiz = {
      correct: correct,
      answered: answered,
      total: total,
      lastAttemptAt: nowISO()
    };
    data.lessons[slug] = entry;
    save(data);
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function exportProgress() {
    var data = load();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "dutch-for-persians-progress.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importProgress(text, cb) {
    try {
      var parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || !parsed.lessons) {
        throw new Error("Invalid progress file");
      }
      save(parsed);
      if (cb) cb(null);
    } catch (e) {
      if (cb) cb(e);
    }
  }

  window.DFPProgress = {
    load: load,
    markViewed: markViewed,
    recordQuizAnswer: recordQuizAnswer,
    reset: reset,
    exportProgress: exportProgress,
    importProgress: importProgress
  };
})();

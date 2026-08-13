// Interactive quiz renderer. Reads adjacent .quiz-data JSON and builds
// a self-grading multiple-choice quiz with instant feedback and a score tally.
// Also renders a "Retry quiz" button that clears just this lesson's saved
// quiz score and rebuilds the quiz from scratch so it can be redone.
(function () {
  function buildQuiz(block) {
    var root = block.querySelector(".quiz-root");
    var dataEl = block.querySelector(".quiz-data");
    if (!root || !dataEl) return;

    var questions;
    try {
      questions = JSON.parse(dataEl.textContent);
    } catch (e) {
      root.textContent = "Quiz failed to load.";
      return;
    }
    if (!questions || !questions.length) return;

    var lessonSlug = root.getAttribute("data-lesson-slug");

    function render() {
      root.innerHTML = "";
      var answered = new Array(questions.length).fill(false);
      var correctCount = 0;

      function updateScore() {
        var done = answered.filter(Boolean).length;
        scoreBox.textContent = "Score: " + correctCount + " / " + done + " answered (" + questions.length + " total)";
        if (lessonSlug && done > 0 && window.DFPProgress) {
          window.DFPProgress.recordQuizAnswer(lessonSlug, correctCount, done, questions.length);
        }
      }

      questions.forEach(function (q, qi) {
        var qWrap = document.createElement("div");
        qWrap.className = "quiz-question";

        var prompt = document.createElement("p");
        prompt.className = "quiz-prompt";
        var enSpan = document.createElement("span");
        enSpan.className = "quiz-prompt-en";
        enSpan.textContent = (qi + 1) + ". " + q.q_en;
        prompt.appendChild(enSpan);
        if (q.q_fa) {
          var faSpan = document.createElement("span");
          faSpan.className = "quiz-prompt-fa";
          faSpan.setAttribute("dir", "rtl");
          faSpan.setAttribute("lang", "fa");
          faSpan.textContent = q.q_fa;
          prompt.appendChild(faSpan);
        }
        qWrap.appendChild(prompt);

        var optList = document.createElement("div");
        optList.className = "quiz-options";

        var feedback = document.createElement("p");
        feedback.className = "quiz-feedback";

        q.options.forEach(function (opt, oi) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "quiz-option";
          btn.textContent = typeof opt === "string" ? opt : opt.text;

          btn.addEventListener("click", function () {
            if (answered[qi]) return;
            answered[qi] = true;

            var buttons = optList.querySelectorAll(".quiz-option");
            buttons.forEach(function (b, bi) {
              b.disabled = true;
              if (bi === q.answer) b.classList.add("correct");
            });

            if (oi === q.answer) {
              btn.classList.add("correct");
              correctCount++;
            } else {
              btn.classList.add("incorrect");
            }

            feedback.textContent = "";
            feedback.appendChild(document.createTextNode(
              (oi === q.answer ? "✅ " : "❌ ") + (q.explain_en || "") + " "
            ));
            if (q.explain_fa) {
              var explainFaSpan = document.createElement("span");
              explainFaSpan.setAttribute("lang", "fa");
              explainFaSpan.setAttribute("dir", "rtl");
              explainFaSpan.textContent = q.explain_fa;
              feedback.appendChild(explainFaSpan);
            }
            feedback.classList.add("visible");

            updateScore();
          });

          optList.appendChild(btn);
        });

        qWrap.appendChild(optList);
        qWrap.appendChild(feedback);
        root.appendChild(qWrap);
      });

      var scoreBox = document.createElement("p");
      scoreBox.className = "quiz-score";
      root.appendChild(scoreBox);
      updateScore();

      var retryBtn = document.createElement("button");
      retryBtn.type = "button";
      retryBtn.className = "quiz-retry-btn";
      retryBtn.textContent = "🔁 Retry quiz";
      retryBtn.addEventListener("click", function () {
        if (lessonSlug && window.DFPProgress) window.DFPProgress.resetQuiz(lessonSlug);
        render();
      });
      root.appendChild(retryBtn);
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz-block").forEach(buildQuiz);
  });
})();

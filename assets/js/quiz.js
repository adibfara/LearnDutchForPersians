// Interactive quiz renderer. Reads adjacent .quiz-data JSON and builds
// a self-grading multiple-choice quiz with instant feedback and a score tally.
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

    var answered = new Array(questions.length).fill(false);
    var correctCount = 0;
    var lessonSlug = root.getAttribute("data-lesson-slug");

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
            var faSpan = document.createElement("span");
            faSpan.setAttribute("lang", "fa");
            faSpan.setAttribute("dir", "rtl");
            faSpan.textContent = q.explain_fa;
            feedback.appendChild(faSpan);
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

    function updateScore() {
      var done = answered.filter(Boolean).length;
      scoreBox.textContent = "Score: " + correctCount + " / " + done + " answered (" + questions.length + " total)";
      if (lessonSlug && done > 0 && window.DFPProgress) {
        window.DFPProgress.recordQuizAnswer(lessonSlug, correctCount, done, questions.length);
      }
    }
    updateScore();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz-block").forEach(buildQuiz);
  });
})();

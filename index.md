---
layout: default
title: Home
---

# Learning Dutch for Persians 🎓
### <span dir="rtl" lang="fa">یادگیری هلندی برای ایرانی‌ها</span>

A free, self-study course taking you from zero Dutch to a solid **A0 → A1** level (CEFR), with bilingual English/Persian explanations, themed vocabulary, and interactive quizzes in every lesson.

<span dir="rtl" lang="fa">یک دوره خودآموز رایگان که شما را از صفر تا سطح A0 به A1 زبان هلندی می‌رساند، با توضیحات دوزبانه انگلیسی/فارسی، واژگان موضوعی و آزمون‌های تعاملی در هر درس.</span>

New here? Read **[How to use this course](/about/)** first — it takes two minutes.

## Your progress / <span dir="rtl" lang="fa">پیشرفت شما</span>

<div class="progress-summary-box">
  <p id="progress-summary-text" class="progress-summary-text">Loading progress…</p>
  <div class="progress-settings">
    <button id="progress-settings-btn" class="progress-settings-btn" type="button" aria-haspopup="true" aria-expanded="false" title="Progress settings">⚙️</button>
    <div id="progress-settings-menu" class="progress-settings-menu" hidden>
      <button id="progress-export-btn" type="button">⬇️ Export progress</button>
      <label class="progress-import-label">
        ⬆️ Import progress
        <input id="progress-import-input" type="file" accept="application/json" hidden>
      </label>
      <button id="progress-reset-btn" type="button" class="progress-reset-btn">🗑️ Reset progress</button>
    </div>
  </div>
</div>

## Lessons / <span dir="rtl" lang="fa">درس‌ها</span>

<ul class="lesson-list">
{% assign sorted = site.lessons | sort: "order" %}
{% for l in sorted %}
  <li data-slug="{{ l.slug }}">
    <div class="lesson-list-main">
      <a href="{{ l.url | relative_url }}">
        {% if l.quiz_lesson %}📝{% else %}{{ l.order }}.{% endif %} {{ l.title }}
      </a>
      {% if l.title_fa %}<span class="lesson-list-title-fa" dir="rtl" lang="fa">{{ l.title_fa }}</span>{% endif %}
    </div>
    <div class="lesson-list-badges">
      <span class="lesson-progress-badge" data-progress-slot></span>
      {% if l.quiz_lesson %}
        <span class="level-badge level-quiz">Quiz</span>
      {% else %}
        <span class="level-badge level-{{ l.level }}">{{ l.level }}</span>
      {% endif %}
    </div>
  </li>
{% endfor %}
</ul>

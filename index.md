---
layout: default
title: Home
---

# Dutch for Persians 🇳🇱
### <span dir="rtl" lang="fa">هلندی برای فارسی‌زبانان</span>

A free, self-study course taking you from zero Dutch to a solid **A0 → A1** level (CEFR), with bilingual English/Persian explanations, themed vocabulary, and interactive quizzes in every lesson.

<span dir="rtl" lang="fa">یک دوره خودآموز رایگان که شما را از صفر تا سطح A0 به A1 زبان هلندی می‌رساند، با توضیحات دوزبانه انگلیسی/فارسی، واژگان موضوعی و آزمون‌های تعاملی در هر درس.</span>

New here? Read **[How to use this course](/about/)** first — it takes two minutes.

## Lessons / <span dir="rtl" lang="fa">درس‌ها</span>

<ul class="lesson-list">
{% assign sorted = site.lessons | sort: "order" %}
{% for l in sorted %}
  <li>
    <a href="{{ l.url | relative_url }}">{{ l.order }}. {{ l.title }}</a>
    <span class="level-badge level-{{ l.level }}">{{ l.level }}</span>
  </li>
{% endfor %}
</ul>

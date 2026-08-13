# Dutch for Persians 🇳🇱

A free, self-study Dutch course for Persian (Farsi) speakers, covering **A0 → A1** (CEFR). Built as a static Jekyll site for GitHub Pages, with bilingual English/Persian explanations and interactive quizzes.

<span dir="rtl" lang="fa">یک دوره خودآموز رایگان هلندی برای فارسی‌زبانان، سطح A0 تا A1، با توضیحات دوزبانه انگلیسی/فارسی و آزمون‌های تعاملی.</span>

🔗 **Live site:** https://adibfara.github.io/LearnDutch/
📦 **Repo:** https://github.com/adibfara/LearnDutch

## Contents

16 lessons (`_lessons/00` → `15`), each with:

- 🎯 Objectives
- 📖 A Dutch–English–Persian vocabulary table
- 📝 Grammar explained in English, with Persian notes on tricky points
- 💬 Example sentences / dialogue
- ✅ An interactive self-grading quiz
- 🔁 A summary recap

See [`about.md`](about.md) for the full study guide, or just open [`index.md`](index.md) for the lesson list.

## Project structure

```
_config.yml          Jekyll site config (lessons collection, kramdown/GFM)
_layouts/             default.html (page shell), lesson.html (lesson template)
_includes/             nav.html (prev/next), quiz.html (renders quiz data)
assets/css/style.css   Site styling (RTL-aware for Persian text)
assets/js/quiz.js      Interactive quiz engine
_lessons/*.md           The 16 lessons
index.md, about.md      Home page and study guide
```

No external Jekyll theme — layouts/includes/CSS are hand-rolled and self-contained.

## Running locally

Requires [Ruby](https://www.ruby-lang.org/) + [Bundler](https://bundler.io/).

```bash
gem install jekyll bundler
jekyll serve
```

Then open `http://localhost:4000`.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)` folder.
3. If this is a project site (`username.github.io/repo-name`), set `baseurl: "/repo-name"` in `_config.yml` first, so asset links resolve correctly.

## Contributing

Found a mistake or want to add a lesson? Open an issue or PR — new lessons should follow the existing structure (objectives → vocab → grammar → examples → quiz → summary) and keep the bilingual EN/FA format.

## License

Content is free to use and adapt for personal, non-commercial study.

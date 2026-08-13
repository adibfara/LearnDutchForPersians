# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static Jekyll site: a free, bilingual (English/Persian) self-study Dutch course, A0→A1 level. No external Jekyll theme — all layouts/includes/CSS/JS are hand-rolled. Deployed via GitHub Pages at `https://adibfara.github.io/LearnDutch/`.

## Commands

No Ruby/Bundler is guaranteed to be present in the dev environment this repo was built in — verify with `ruby -v` / `bundle -v` before assuming they're available.

```bash
gem install jekyll bundler   # first-time setup if Jekyll isn't installed
jekyll serve                 # build + serve at http://localhost:4000
jekyll build                 # build only, outputs to _site/
```

There is no test suite, linter, or CI config. The closest thing to validation is a successful `jekyll build` (catches Liquid/Kramdown/front-matter errors) — run this before pushing when editing `_config.yml`, layouts, includes, or lesson front matter, since none of it has been continuously verified against a real Jekyll build in this environment.

## Architecture

**Lesson content lives entirely in YAML front matter + Markdown body**, not in separate data files. Each `_lessons/NN-slug.md` file (a Jekyll collection, `_config.yml`'s `collections.lessons`) has:
- Front matter: `title`, `title_fa`, `order`, `level` (A0/A1), `slug`, `objectives` (array of `{en, fa}`), `quiz` (array of `{q_en, q_fa, options[], answer, explain_en, explain_fa}`)
- Markdown body: vocab tables, grammar, dialogue, summary

The `quiz` front-matter array is the single source of truth for a lesson's quiz — `_includes/quiz.html` serializes it to JSON via Liquid's `jsonify` filter into a `<script type="application/json">` tag, and `assets/js/quiz.js` parses that at runtime to render the interactive multiple-choice UI (click an option → instant correct/incorrect feedback + explanation, running score). There is no server component; everything is client-side JS reading data the Jekyll build already embedded in the page.

**Lesson ordering and prev/next navigation** are driven by the numeric `order` front-matter field, not by filename or Jekyll's default collection order. `_includes/nav.html` sorts `site.lessons` by `order` and computes prev/next links from that sorted array; `index.md`'s lesson list does the same. When adding a lesson, `order` must be unique and reflect where it should appear in the teaching sequence — filename numbering (`NN-slug.md`) is just a convention that should match `order` but isn't what the site actually reads.

**The bilingual language toggle is content-agnostic, not content-driven.** Persian text throughout the site is simply wrapped in `<span lang="fa" dir="rtl">...</span>` wherever it appears (prose, objectives, quiz prompts/feedback) — there's no separate English-only vs bilingual version of any file. `assets/js/lang.js` + CSS rules in `assets/css/style.css` (`html.lang-en [lang="fa"] { display: none }`) hide/show those spans at runtime based on a toggle button in the header (`_layouts/default.html`). Vocabulary tables are handled specially: `lang.js` scans every `<table>` at runtime for a header cell whose text is exactly `"Persian"` and hides that whole column generically — so any new vocab table automatically works with the toggle as long as its Persian column header is literally the word "Persian" (not "Farsi", not translated, not decorated). Toggle state persists via `localStorage` and is reflected in the URL as `?lang=en`/`?lang=bilingual` (set via `history.replaceState`) so links are shareable. An inline script in `<head>` (before the stylesheet/JS load) applies the `lang-en` class synchronously to avoid a flash of bilingual content before the toggle preference loads.

**Adjacent content depends on prior lessons.** Lesson bodies cross-reference each other via `[[NN-slug]]` — Obsidian-style wiki-links written directly in the Markdown (e.g. "as covered in [[04-articles-pronouns-sentence-structure]]"). These are **not** rendered as clickable links by Jekyll/Kramdown as-is (Jekyll has no wiki-link plugin configured) — they currently render as literal double-bracketed text. If this is ever fixed, either add a wiki-link plugin or replace them with proper `{{ '/lessons/...' | relative_url }}` links; don't assume they already resolve.

## GitHub Pages deployment

`_config.yml` sets `baseurl: "/LearnDutch"` and `url: "https://adibfara.github.io"` because this is a **project site**, not a user/org site — every internal link and asset reference in layouts/includes must go through Liquid's `relative_url` filter (e.g. `{{ '/assets/js/lang.js' | relative_url }}`) rather than a bare absolute path, or it will 404 once deployed (works locally at `localhost:4000/` without the prefix, breaks in prod without the filter). GitHub Pages builds this repo directly from `main` with its built-in Jekyll (Settings → Pages → Deploy from a branch) — there is no GitHub Actions workflow.

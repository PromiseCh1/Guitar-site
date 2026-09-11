# Promise Guitar Learning

A free, mobile-first interactive guitar learning website for beginner students,
built with plain HTML5, CSS3, vanilla JavaScript, and PHP (includes only —
no database, no accounts).

## Status: Stage 1 complete

- Project foundation (folder structure, global styles, shared includes)
- Home page (hero, how-to-use, learning path, tool links, practice tips,
  instructor/contact section)

Chords, Scales, Metronome, and the Fretboard Game are linked from
navigation/home but not yet built — they will be added in later stages.

## Local preview

Requires PHP installed locally.

```bash
cd guitar-learning
php -S localhost:8000
```

Then open http://localhost:8000 in a browser.

## Structure

See the project spec for the full intended folder layout. Currently present:

```
guitar-learning/
├── index.php
├── includes/
│   ├── header.php
│   ├── navbar.php
│   └── footer.php
├── assets/
│   ├── css/
│   │   ├── global.css
│   │   └── home.css
│   ├── js/
│   │   ├── nav.js   (shared navbar toggle, loaded on every page)
│   │   └── home.js  (home page only)
│   └── images/
│       ├── logo/
│       ├── chords/
│       ├── scales/
│       └── general/
└── pages/  (empty, reserved for future stages)
```

Made by Promise Chaudhary — Guitarist & Guitar Instructor — Lamahi, Deukhuri, Nepal.

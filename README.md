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
cd Guitar-site
php -S localhost:8000
```

Then open http://localhost:8000 in a browser.

### Asset paths (works on XAMPP subfolder AND root hosting)

Every page/asset link uses a `BASE_URL` constant defined in
`includes/config.php`, which is included automatically by
`includes/header.php`. It detects whether the project is running:

- **inside a subfolder** during local development, e.g.
  `C:\xampp\htdocs\Guitar-site` → `http://localhost/Guitar-site/`
  → `BASE_URL` becomes `/Guitar-site`
- **at the web server root**, e.g. InfinityFree's `htdocs/`
  → `BASE_URL` becomes `""` (empty)

Because of this, no file ever hardcodes `/assets/...` or `/pages/...`
directly — always `<?php echo BASE_URL; ?>/assets/...` (or
`/pages/...`). This means the same codebase works unmodified on both
XAMPP and InfinityFree.

## Structure

See the project spec for the full intended folder layout. Currently present:

```
Guitar-site/
├── index.php
├── includes/
│   ├── config.php   (BASE_URL detection, included by header.php)
│   ├── header.php
│   ├── navbar.php
│   └── footer.php
├── assets/
│   ├── css/
│   │   ├── global.css
│   │   └── home.css
│   ├── js/
│   │   ├── nav.js     (shared navbar toggle, loaded on every page)
│   │   ├── reveal.js   (shared scroll-reveal, loaded on every page)
│   │   └── home.js     (home page only)
│   └── images/
│       ├── logo/
│       ├── chords/
│       ├── scales/
│       └── general/
└── pages/  (empty, reserved for future stages)
```

Made by Promise Chaudhary — Guitarist & Guitar Instructor — Lamahi, Deukhuri, Nepal.

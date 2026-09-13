/**
 * fretboard-game.js
 * Fretboard note memorization game with four practice modes,
 * a zoomable fretboard, and a score-scaled countdown timer.
 *
 *   Easy     — frets 1–5,  natural notes only,  timer ON
 *   Medium   — frets 1–9,  natural notes only,  timer ON
 *   Hard     — frets 1–12, all 12 chromatic notes, timer ON
 *   Manual   — frets 1–12, user picks strings + notes, NO timer
 *
 * Scoring:
 *   Correct answer  → +10 score, streak++
 *   Wrong answer    → score resets to 0, streak resets to 0
 *   Timeout         → score resets to 0, streak resets to 0
 *   Best streak and totals are kept across sessions in localStorage.
 */
(function () {
  'use strict';

  var NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  var NATURAL_NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  var SHARP_NOTES   = ['A#', 'C#', 'D#', 'F#', 'G#'];
  var MAX_FRET = 12;

  var STRINGS = [
    { id: 'lowE',  label: 'Low E',  shortLabel: 'E', openIndex: NOTES.indexOf('E') },
    { id: 'A',     label: 'A',      shortLabel: 'A', openIndex: NOTES.indexOf('A') },
    { id: 'D',     label: 'D',      shortLabel: 'D', openIndex: NOTES.indexOf('D') },
    { id: 'G',     label: 'G',      shortLabel: 'G', openIndex: NOTES.indexOf('G') },
    { id: 'B',     label: 'B',      shortLabel: 'B', openIndex: NOTES.indexOf('B') },
    { id: 'highE', label: 'High E', shortLabel: 'e', openIndex: NOTES.indexOf('E') }
  ];

  var MODES = {
    easy:   { label: 'Easy',   sub: 'Frets 1–5',  description: 'Get comfortable with the first few frets. Natural notes only. Timer runs on every question.', maxFret: 5,  notePool: NATURAL_NOTES },
    medium: { label: 'Medium', sub: 'Frets 1–9',  description: 'A wider stretch up the neck. Still natural notes only, and the timer ticks faster.', maxFret: 9,  notePool: NATURAL_NOTES },
    hard:   { label: 'Hard',   sub: 'Frets 1–12', description: 'Full neck, every note. Sharps are in play here, and the timer is the tightest of all.', maxFret: 12, notePool: NOTES },
    manual: { label: 'Manual', sub: 'Your choice',description: 'Pick exactly which strings and notes to drill. No timer — practice at your own pace.', maxFret: 12, notePool: null }
  };

  // Timer per mode. base = seconds at score 0, min = floor, scoreStep = score
  // interval that removes 1 second. Manual mode is intentionally absent.
  var TIMER_CONFIG = {
    easy:   { base: 12, min: 5, scoreStep: 20 },
    medium: { base: 9,  min: 4, scoreStep: 20 },
    hard:   { base: 7,  min: 3, scoreStep: 20 }
  };

  var ZOOM_LEVELS = [
    { label: '0.25×', scale: 0.25 },
    { label: '0.5×',  scale: 0.5  },
    { label: '0.75×', scale: 0.75 },
    { label: '1×',    scale: 1.0  },
    { label: '1.5×',  scale: 1.5  },
    { label: 'Fit',   scale: 1.0  }
  ];

  // ---------------------------------------------------------------
  // Messages
  // ---------------------------------------------------------------
  var CORRECT_MESSAGES = [
    "Correct! That was {note}. Nice work.",
    "Nailed it — {note}. Keep it up.",
    "Spot on! It was {note}.",
    "Perfect — {note}. You're getting it.",
    "That's it! {note}. Well done.",
    "Clean and correct — {note}.",
    "Yes! {note}. Right on the money.",
    "Right on — {note}. Great ears.",
    "Bullseye — {note}.",
    "Sharp as ever. It was {note}.",
    "Correct — {note}. You're improving fast.",
    "Bang on — {note}. Keep the streak alive.",
    "That's the one. {note}. Nice.",
    "On fire! {note} was easy for you.",
    "Easy work — {note}. Well played.",
    "Correct! {note}. Muscle memory kicking in.",
    "Got it — {note}. Smooth.",
    "Right answer — {note}. Well spotted.",
    "Yes! {note}. Your ear is sharpening.",
    "Correct. {note}. Beautiful.",
    "That's right — {note}. Confidence growing.",
    "Correct — {note}. You make this look easy.",
    "Right on — {note}. Steady progress.",
    "Got it right — {note}. Keep going.",
    "Nice one — {note}. Your brain is learning fast.",
    "Perfect — {note}. One step closer to mastery.",
    "Correct. {note}. The fretboard is starting to feel familiar.",
    "Right — {note}. Your instincts are sharp.",
    "Yes — {note}. That's how it's done.",
    "Correct — {note}. You're ahead of where you were yesterday.",
    "Nice — {note}. Keep this pace.",
    "Correct! {note}. Clean, quick, confident.",
    "Right on the button — {note}.",
    "That's it — {note}. Superb.",
    "Good call — {note}. Well done.",
    "Correct — {note}. Your practice is showing.",
    "Precise — {note}. Love it.",
    "Right — {note}. Sharp work.",
    "Correct. {note}. You're getting smoother every round.",
    "Yes! {note}. That's a great sign.",
    "Correct — {note}. Consistency is building.",
    "Right answer — {note}. Strong.",
    "Yes — {note}. You're dialed in.",
    "Correct. {note}. Smooth and steady.",
    "That's right — {note}. Beautifully done.",
    "Bullseye again. {note}.",
    "Correct — {note}. You're on a roll.",
    "Right — {note}. Real progress happening.",
    "Yes — {note}. Getting sharper by the minute.",
    "Correct! {note}. Fantastic."
  ];

  var WRONG_MESSAGES = [
    "Not quite — that one was {note}. Score reset — start fresh.",
    "Missed it. It was {note}. Back to zero — you've got this.",
    "Wrong answer, right attitude. It was {note}. Score reset.",
    "Nope — that was {note}. Score back to 0. Go again.",
    "Not this time. It was {note}. Score reset — no pressure.",
    "Close enough to learn from. It was {note}. Starting over.",
    "That was {note}. Score reset — the next round is yours.",
    "Incorrect — score back to 0. That one was {note}.",
    "The note was {note}. Score reset. Don't lose hope.",
    "Not the one. It was {note}. Fresh start — go get it.",
    "Nope — it was {note}. Score reset. Mistakes teach.",
    "Wrong answer. It was {note}. Score back to zero.",
    "That was {note}. Score reset — shake it off.",
    "Not quite — {note}. Score reset. Try again.",
    "Wrong, but you're learning. It was {note}. Score reset.",
    "It was {note}. Score reset — every rep counts.",
    "Missed it. The note was {note}. Score back to 0.",
    "That was {note}. Score reset. Breathe and continue.",
    "Nope — {note}. Score reset. Nobody gets them all.",
    "Wrong answer — but your brain learned. It was {note}.",
    "It was {note}. Score reset — keep your head up.",
    "Not that one. It was {note}. Score reset. Slow down.",
    "That was {note}. Score reset. Every guitarist has been here.",
    "Missed it — {note}. Score reset. Breathe. Focus.",
    "Not quite — it was {note}. Score reset. Great effort.",
    "Wrong. That was {note}. Score reset — reps matter.",
    "It was {note}. Score reset. You're allowed to miss.",
    "Nope — {note}. Score reset. The greats missed too.",
    "That was {note}. Score reset. Credit for trying.",
    "Not it. It was {note}. Score reset — the next one clicks.",
    "Wrong — but warmer. It was {note}. Score reset.",
    "It was {note}. Score reset. Proof you're practicing.",
    "Not the answer. That was {note}. Score reset.",
    "Nope — {note}. Score reset. No shame. Keep playing.",
    "That was {note}. Score reset — push on.",
    "Missed it — {note}. Score reset. One rep closer.",
    "Not quite. It was {note}. Score reset — learning fast.",
    "Wrong, but every pro has been here. It was {note}.",
    "That was {note}. Score reset — focus in.",
    "Nope — {note}. Score reset. Slow is smooth.",
    "It was {note}. Score reset. Try the next one.",
    "Not this one. It was {note}. Score reset.",
    "Wrong — it was {note}. Score reset. Learning takes reps.",
    "That was {note}. Score reset — if it were easy, everyone would.",
    "Missed it — {note}. Score reset. On to the next.",
    "Not quite — {note}. Score reset. Small steps forward.",
    "That was {note}. Score reset. Treat each miss as a lesson.",
    "Nope — {note}. Score reset. Breathe, refocus.",
    "Wrong answer — {note}. Score reset. One note closer.",
    "It was {note}. Score reset — the next one's yours."
  ];

  var TIMEOUT_MESSAGES = [
    "⏱ Time's up — the note was {note}. Score reset — keep the pace up.",
    "⏱ Time ran out — it was {note}. Score reset. Try the next one.",
    "⏱ Out of time — that note was {note}. Score reset. Stay quick.",
    "⏱ Time's up. The answer was {note}. Score reset — go again."
  ];

  var STORAGE_KEYS = {
    mode:            'fretboardGame.mode',
    bestStreak:      'fretboardGame.bestStreak',
    totals:          'fretboardGame.totals',
    selectedStrings: 'fretboardGame.selectedStrings',
    selectedNotes:   'fretboardGame.selectedNotes'
  };

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------
  function noteAt(openIndex, fret) { return NOTES[(openIndex + fret) % 12]; }

  function loadStorage(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function saveStorage(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
    }
    return copy;
  }

  var lastCorrectIndex = -1;
  function pickCorrectMessage(note) {
    var idx;
    do { idx = Math.floor(Math.random() * CORRECT_MESSAGES.length); }
    while (idx === lastCorrectIndex && CORRECT_MESSAGES.length > 1);
    lastCorrectIndex = idx;
    return CORRECT_MESSAGES[idx].replace('{note}', note);
  }

  var lastWrongIndex = -1;
  function pickWrongMessage(note) {
    var idx;
    do { idx = Math.floor(Math.random() * WRONG_MESSAGES.length); }
    while (idx === lastWrongIndex && WRONG_MESSAGES.length > 1);
    lastWrongIndex = idx;
    return WRONG_MESSAGES[idx].replace('{note}', note);
  }

  function pickTimeoutMessage(note) {
    return pickRandom(TIMEOUT_MESSAGES).replace('{note}', note);
  }

  var NEIGHBORS = {
    A: ['G', 'B'], 'A#': ['A', 'B'], B: ['A#', 'C'],
    C: ['B', 'C#'], 'C#': ['C', 'D'], D: ['C#', 'D#'],
    'D#': ['D', 'E'], E: ['D#', 'F'], F: ['E', 'F#'],
    'F#': ['F', 'G'], G: ['F#', 'G#'], 'G#': ['G', 'A']
  };

  // ---------------------------------------------------------------
  // Game state
  // ---------------------------------------------------------------
  var game = {
    mode: 'easy',
    selectedStringIds: ['lowE', 'A', 'D', 'G', 'B', 'highE'],
    selectedNoteNames: NOTES.slice(),
    score: 0,
    streak: 0,
    bestStreak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentQuestion: null,
    answered: false
  };

  var currentZoomIndex = 3; // 1×

  // ---------------------------------------------------------------
  // Question generation
  // ---------------------------------------------------------------
  function getActiveStringIds() { return game.selectedStringIds.slice(); }

  function getActiveNotePool() {
    var def = MODES[game.mode];
    if (def.notePool) { return def.notePool.slice(); }
    return game.selectedNoteNames.slice();
  }

  function buildAnswerChoices(correctNote, pool, useHardDistractors) {
    var others = pool.filter(function (n) { return n !== correctNote; });
    var distractors = [];

    if (useHardDistractors && NEIGHBORS[correctNote]) {
      var neigh = shuffle(NEIGHBORS[correctNote]).filter(function (n) {
        return pool.indexOf(n) !== -1;
      });
      distractors = distractors.concat(neigh);
    }

    var remaining = shuffle(others.filter(function (n) {
      return distractors.indexOf(n) === -1;
    }));

    while (distractors.length < 4 && remaining.length) {
      distractors.push(remaining.shift());
    }

    distractors = distractors.slice(0, 4);
    return shuffle(distractors.concat([correctNote]));
  }

  function generateQuestion() {
    var def = MODES[game.mode];
    var activeStrings = getActiveStringIds();
    var notePool = getActiveNotePool();

    if (!activeStrings.length || !notePool.length) { return null; }

    var candidates = [];
    STRINGS.forEach(function (str, strIdx) {
      if (activeStrings.indexOf(str.id) === -1) return;
      for (var f = 1; f <= def.maxFret; f++) {
        var n = noteAt(str.openIndex, f);
        if (notePool.indexOf(n) !== -1) {
          candidates.push({
            stringId: str.id,
            stringIndex: strIdx,
            fret: f,
            note: n
          });
        }
      }
    });

    if (!candidates.length) { return null; }

    var chosen = pickRandom(candidates);
    var choices = buildAnswerChoices(chosen.note, notePool, game.mode === 'hard');

    return {
      stringId: chosen.stringId,
      stringIndex: chosen.stringIndex,
      fret: chosen.fret,
      note: chosen.note,
      choices: choices
    };
  }

  // ---------------------------------------------------------------
  // SVG fretboard
  // ---------------------------------------------------------------
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        node.setAttribute(key, attrs[key]);
      }
    }
    return node;
  }

  function renderFretboard(container, question) {
    var width        = 900;
    var height       = 260;
    var leftMargin   = 44;
    var rightMargin  = 24;
    var topMargin    = 26;
    var bottomMargin = 26;
    var stringGap    = (height - topMargin - bottomMargin) / (STRINGS.length - 1);
    var fretGap      = (width - leftMargin - rightMargin) / MAX_FRET;

    var svg = el('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      class: 'game-fretboard-svg',
      role: 'img',
      'aria-label': 'Fretboard with a highlighted note to identify'
    });

    function stringY(i) { return (height - bottomMargin) - i * stringGap; }
    function fretX(f) { return leftMargin + f * fretGap; }

    svg.appendChild(el('line', {
      x1: fretX(0), x2: fretX(0),
      y1: stringY(0), y2: stringY(STRINGS.length - 1),
      class: 'game-nut'
    }));

    for (var f = 1; f <= MAX_FRET; f++) {
      svg.appendChild(el('line', {
        x1: fretX(f), x2: fretX(f),
        y1: stringY(0), y2: stringY(STRINGS.length - 1),
        class: 'game-fretline'
      }));
    }

    var midY = (stringY(0) + stringY(STRINGS.length - 1)) / 2;
    [3, 5, 7, 9].forEach(function (f) {
      svg.appendChild(el('circle', {
        cx: fretX(f) - fretGap / 2, cy: midY,
        r: 5, class: 'game-fret-marker'
      }));
    });
    [-4, 4].forEach(function (offset) {
      svg.appendChild(el('circle', {
        cx: fretX(12) - fretGap / 2, cy: midY + offset,
        r: 5, class: 'game-fret-marker'
      }));
    });

    STRINGS.forEach(function (str, si) {
      var y = stringY(si);
      svg.appendChild(el('line', {
        x1: fretX(0), x2: fretX(MAX_FRET),
        y1: y, y2: y,
        class: 'game-stringline'
      }));
      var label = el('text', {
        x: 16, y: y + 5,
        class: 'game-string-label'
      });
      label.textContent = str.shortLabel;
      svg.appendChild(label);
    });

    for (var fn = 1; fn <= MAX_FRET; fn++) {
      var fLabel = el('text', {
        x: fretX(fn) - fretGap / 2,
        y: height - 6,
        class: 'game-fret-number'
      });
      fLabel.textContent = fn;
      svg.appendChild(fLabel);
    }

    if (question) {
      var qx = fretX(question.fret) - fretGap / 2;
      var qy = stringY(question.stringIndex);
      svg.appendChild(el('circle', { cx: qx, cy: qy, r: 18, class: 'game-question-pulse' }));
      svg.appendChild(el('circle', { cx: qx, cy: qy, r: 12, class: 'game-question-dot' }));
    }

    container.innerHTML = '';
    container.appendChild(svg);
  }

  // ---------------------------------------------------------------
  // DOM wiring
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    var setupSection   = document.getElementById('gameSetup');
    var gameSection    = document.getElementById('gameArea');
    var startBtn       = document.getElementById('startGameBtn');
    var setupError     = document.getElementById('setupError');
    var notesBlock     = document.getElementById('notesBlock');
    var modeDescEl     = document.getElementById('modeDescription');
    var stringCountEl  = document.getElementById('stringCount');
    var noteCountEl    = document.getElementById('noteCount');

    var stringCheckboxes = Array.prototype.slice.call(
      document.querySelectorAll('.string-checkbox input'));
    var noteCheckboxes = Array.prototype.slice.call(
      document.querySelectorAll('.note-checkbox input'));
    var modeTabButtons = document.querySelectorAll('.mode-tab');
    var quickButtons = document.querySelectorAll('.quick-btn');

    var fretboardContainer = document.getElementById('gameFretboard');
    var answersGrid = document.getElementById('gameAnswers');
    var feedbackEl = document.getElementById('gameFeedback');
    var changeStringsBtn = document.getElementById('changeStringsBtn');
    var resetStatsBtn = document.getElementById('resetStatsBtn');
    var modeBadgeEl = document.getElementById('gameModeBadge');
    var modeSubEl = document.getElementById('gameModeSub');

    var zoomInBtn = document.getElementById('zoomInBtn');
    var zoomOutBtn = document.getElementById('zoomOutBtn');
    var zoomLabelEl = document.getElementById('zoomLevelLabel');
    var scrollHintEl = document.getElementById('scrollHint');

    var gameTimerEl   = document.getElementById('gameTimer');
    var gameTimerText = document.getElementById('gameTimerText');
    var gameTimerFill = document.getElementById('gameTimerFill');

    var statEls = {
      score:      document.getElementById('statScore'),
      streak:     document.getElementById('statStreak'),
      bestStreak: document.getElementById('statBestStreak'),
      questions:  document.getElementById('statQuestions'),
      correct:    document.getElementById('statCorrect'),
      accuracy:   document.getElementById('statAccuracy')
    };

    if (!setupSection || !gameSection) { return; }

    // ---------------- Timer state ----------------
    var timerState = {
      rafId: null,
      startTime: 0,
      durationMs: 0,
      active: false,
      onTimeout: null
    };

    function computeTimeLimit() {
      var cfg = TIMER_CONFIG[game.mode];
      if (!cfg) { return 0; }
      var reduction = Math.floor(game.score / cfg.scoreStep);
      return Math.max(cfg.min, cfg.base - reduction);
    }

    function startTimer(seconds, onTimeout) {
      stopTimer();
      if (!gameTimerEl || !gameTimerFill || !gameTimerText) { return; }

      gameTimerEl.hidden = false;
      gameTimerFill.style.width = '100%';
      gameTimerFill.className = 'game-timer-fill';
      gameTimerText.textContent = seconds.toFixed(1) + 's';

      timerState.startTime  = performance.now();
      timerState.durationMs = seconds * 1000;
      timerState.active     = true;
      timerState.onTimeout  = onTimeout || null;

      timerState.rafId = requestAnimationFrame(tickTimer);
    }

    function tickTimer() {
      if (!timerState.active) { return; }

      var elapsed   = performance.now() - timerState.startTime;
      var remaining = timerState.durationMs - elapsed;

      if (remaining <= 0) {
        timerState.active = false;
        gameTimerFill.style.width = '0%';
        gameTimerFill.className = 'game-timer-fill is-critical';
        gameTimerText.textContent = '0.0s';
        if (typeof timerState.onTimeout === 'function') {
          timerState.onTimeout();
        }
        return;
      }

      var pct = remaining / timerState.durationMs;
      gameTimerFill.style.width = (pct * 100) + '%';
      gameTimerText.textContent = (remaining / 1000).toFixed(1) + 's';

      var cls = 'game-timer-fill';
      if (pct < 0.3)      cls += ' is-critical';
      else if (pct < 0.6) cls += ' is-warning';
      gameTimerFill.className = cls;

      timerState.rafId = requestAnimationFrame(tickTimer);
    }

    function stopTimer() {
      if (timerState.rafId) {
        cancelAnimationFrame(timerState.rafId);
        timerState.rafId = null;
      }
      timerState.active = false;
      if (gameTimerEl) gameTimerEl.hidden = true;
    }

    // ---------------- Restore saved state ----------------
    var savedMode = loadStorage(STORAGE_KEYS.mode, 'easy');
    if (MODES[savedMode]) { game.mode = savedMode; }

    var savedStrings = loadStorage(STORAGE_KEYS.selectedStrings, null);
    if (savedStrings && savedStrings.length) game.selectedStringIds = savedStrings;

    var savedNotes = loadStorage(STORAGE_KEYS.selectedNotes, null);
    if (savedNotes && savedNotes.length) game.selectedNoteNames = savedNotes;

    game.bestStreak = loadStorage(STORAGE_KEYS.bestStreak, 0);
    var savedTotals = loadStorage(STORAGE_KEYS.totals, { questionsAnswered: 0, correctAnswers: 0 });
    game.questionsAnswered = savedTotals.questionsAnswered || 0;
    game.correctAnswers    = savedTotals.correctAnswers || 0;

    stringCheckboxes.forEach(function (cb) {
      cb.checked = game.selectedStringIds.indexOf(cb.value) !== -1;
      cb.closest('.string-checkbox').classList.toggle('is-checked', cb.checked);
    });

    noteCheckboxes.forEach(function (cb) {
      cb.checked = game.selectedNoteNames.indexOf(cb.value) !== -1;
      cb.closest('.note-checkbox').classList.toggle('is-checked', cb.checked);
      if (SHARP_NOTES.indexOf(cb.value) !== -1) {
        cb.closest('.note-checkbox').classList.add('is-sharp');
      }
    });

    // ---------------- Setup helpers ----------------
    function updateStringCount() {
      var n = stringCheckboxes.filter(function (cb) { return cb.checked; }).length;
      if (stringCountEl) stringCountEl.textContent = n + ' of ' + stringCheckboxes.length;
    }

    function updateNoteCount() {
      var n = noteCheckboxes.filter(function (cb) { return cb.checked; }).length;
      if (noteCountEl) noteCountEl.textContent = n + ' of ' + noteCheckboxes.length;
    }

    function reflectMode(mode) {
      game.mode = mode;
      modeTabButtons.forEach(function (btn) {
        var isActive = btn.getAttribute('data-mode') === mode;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      if (modeDescEl) modeDescEl.textContent = MODES[mode].description;
      if (notesBlock) notesBlock.hidden = (mode !== 'manual');
      saveStorage(STORAGE_KEYS.mode, mode);
    }

    // ---------------- Zoom ----------------
    function getBaseWidth() {
      var holder = document.querySelector('.game-fretboard-holder');
      if (holder) {
        var w = holder.clientWidth - 20;
        return Math.max(260, w);
      }
      return Math.max(260, window.innerWidth - 40);
    }

    function applyZoom() {
      var svg = fretboardContainer.querySelector('.game-fretboard-svg');
      if (!svg) return;

      var level = ZOOM_LEVELS[currentZoomIndex];
      var baseW = getBaseWidth();
      var targetW = Math.round(baseW * level.scale);

      svg.style.minWidth = targetW + 'px';
      svg.style.width    = targetW + 'px';

      if (zoomLabelEl) zoomLabelEl.textContent = level.label;
      if (zoomOutBtn) zoomOutBtn.disabled = (currentZoomIndex === 0);
      if (zoomInBtn)  zoomInBtn.disabled  = (currentZoomIndex === ZOOM_LEVELS.length - 1);

      var needsScroll = targetW > baseW + 4;
      if (scrollHintEl) scrollHintEl.classList.toggle('is-hidden', !needsScroll);
    }

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function () {
        if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
          currentZoomIndex++;
          applyZoom();
        }
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function () {
        if (currentZoomIndex > 0) {
          currentZoomIndex--;
          applyZoom();
        }
      });
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applyZoom, 120);
    });

    // ---------------- Wire mode tabs ----------------
    modeTabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        reflectMode(btn.getAttribute('data-mode'));
      });
    });

    // ---------------- Wire string + note checkboxes ----------------
    stringCheckboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        cb.closest('.string-checkbox').classList.toggle('is-checked', cb.checked);
        updateStringCount();
      });
    });

    noteCheckboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        cb.closest('.note-checkbox').classList.toggle('is-checked', cb.checked);
        updateNoteCount();
      });
    });

    // ---------------- Quick note actions ----------------
    quickButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-quick');
        noteCheckboxes.forEach(function (cb) {
          var isNatural = NATURAL_NOTES.indexOf(cb.value) !== -1;
          var isSharp   = SHARP_NOTES.indexOf(cb.value) !== -1;

          if (action === 'all') cb.checked = true;
          else if (action === 'naturals') cb.checked = isNatural;
          else if (action === 'sharps') cb.checked = isSharp;
          else if (action === 'none') cb.checked = false;

          cb.closest('.note-checkbox').classList.toggle('is-checked', cb.checked);
        });
        updateNoteCount();
      });
    });

    // ---------------- Stats ----------------
    function updateStatsDisplay() {
      var accuracy = game.questionsAnswered > 0
        ? Math.round((game.correctAnswers / game.questionsAnswered) * 100)
        : 0;

      if (statEls.score)      statEls.score.textContent = game.score;
      if (statEls.streak)     statEls.streak.textContent = game.streak;
      if (statEls.bestStreak) statEls.bestStreak.textContent = game.bestStreak;
      if (statEls.questions)  statEls.questions.textContent = game.questionsAnswered;
      if (statEls.correct)    statEls.correct.textContent = game.correctAnswers;
      if (statEls.accuracy)   statEls.accuracy.textContent = accuracy + '%';
    }

    function persistProgress() {
      saveStorage(STORAGE_KEYS.bestStreak, game.bestStreak);
      saveStorage(STORAGE_KEYS.totals, {
        questionsAnswered: game.questionsAnswered,
        correctAnswers: game.correctAnswers
      });
    }

    // ---------------- Answer rendering ----------------
    function renderAnswers() {
      answersGrid.innerHTML = '';
      game.currentQuestion.choices.forEach(function (note) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'game-answer-btn';
        btn.textContent = note;
        btn.addEventListener('click', function () { handleAnswer(note, btn); });
        answersGrid.appendChild(btn);
      });
    }

    function nextQuestion() {
      stopTimer();

      var q = generateQuestion();
      if (!q) {
        feedbackEl.textContent = 'Not enough notes or strings selected. Adjust your setup.';
        feedbackEl.className = 'game-feedback is-incorrect-text';
        return;
      }
      game.currentQuestion = q;
      game.answered = false;
      feedbackEl.textContent = '';
      feedbackEl.className = 'game-feedback';
      renderFretboard(fretboardContainer, q);
      applyZoom();
      renderAnswers();

      if (TIMER_CONFIG[game.mode]) {
        startTimer(computeTimeLimit(), handleTimeout);
      }
    }

    function handleAnswer(selectedNote, btnEl) {
      if (game.answered) { return; }
      game.answered = true;
      stopTimer();

      var correctNote = game.currentQuestion.note;
      var isCorrect = selectedNote === correctNote;

      game.questionsAnswered++;
      if (isCorrect) {
        game.score += 10;
        game.streak++;
        game.correctAnswers++;
        if (game.streak > game.bestStreak) game.bestStreak = game.streak;
      } else {
        // Wrong answer → full score reset and streak reset
        game.score = 0;
        game.streak = 0;
      }

      Array.prototype.forEach.call(answersGrid.children, function (child) {
        child.disabled = true;
        if (child.textContent === correctNote) {
          child.classList.add('is-correct');
        }
      });

      if (isCorrect) {
        feedbackEl.textContent = '✅ ' + pickCorrectMessage(correctNote);
        feedbackEl.className = 'game-feedback is-correct-text';
      } else {
        btnEl.classList.add('is-incorrect');
        feedbackEl.textContent = pickWrongMessage(correctNote);
        feedbackEl.className = 'game-feedback is-incorrect-text';
      }

      updateStatsDisplay();
      persistProgress();

      window.setTimeout(nextQuestion, 1400);
    }

    function handleTimeout() {
      if (game.answered) { return; }
      game.answered = true;
      stopTimer();

      var correctNote = game.currentQuestion.note;

      game.questionsAnswered++;
      // Timeout → full score reset and streak reset
      game.score = 0;
      game.streak = 0;

      Array.prototype.forEach.call(answersGrid.children, function (child) {
        child.disabled = true;
        if (child.textContent === correctNote) {
          child.classList.add('is-correct');
        }
      });

      feedbackEl.textContent = pickTimeoutMessage(correctNote);
      feedbackEl.className = 'game-feedback is-incorrect-text';

      updateStatsDisplay();
      persistProgress();

      window.setTimeout(nextQuestion, 1400);
    }

    // ---------------- Start / back / reset ----------------
    function startGame() {
      game.selectedStringIds = stringCheckboxes
        .filter(function (cb) { return cb.checked; })
        .map(function (cb) { return cb.value; });

      game.selectedNoteNames = noteCheckboxes
        .filter(function (cb) { return cb.checked; })
        .map(function (cb) { return cb.value; });

      if (!game.selectedStringIds.length) {
        setupError.textContent = 'Pick at least one string to practice.';
        return;
      }

      if (game.mode === 'manual' && !game.selectedNoteNames.length) {
        setupError.textContent = 'Pick at least one note for Manual mode.';
        return;
      }

      setupError.textContent = '';
      saveStorage(STORAGE_KEYS.selectedStrings, game.selectedStringIds);
      saveStorage(STORAGE_KEYS.selectedNotes, game.selectedNoteNames);

      game.score = 0;
      game.streak = 0;

      if (modeBadgeEl) modeBadgeEl.textContent = MODES[game.mode].label;
      if (modeSubEl) {
        if (game.mode === 'manual') {
          modeSubEl.textContent = game.selectedStringIds.length + ' strings · ' +
                                  game.selectedNoteNames.length + ' notes';
        } else {
          modeSubEl.textContent = MODES[game.mode].sub;
        }
      }

      setupSection.hidden = true;
      gameSection.hidden = false;

      updateStatsDisplay();
      nextQuestion();
    }

    function backToSetup() {
      stopTimer();
      gameSection.hidden = true;
      setupSection.hidden = false;
    }

    function resetStats() {
      game.score = 0;
      game.streak = 0;
      game.bestStreak = 0;
      game.questionsAnswered = 0;
      game.correctAnswers = 0;
      saveStorage(STORAGE_KEYS.bestStreak, 0);
      saveStorage(STORAGE_KEYS.totals, { questionsAnswered: 0, correctAnswers: 0 });
      updateStatsDisplay();
    }

    // ---------------- Initial state ----------------
    reflectMode(game.mode);
    updateStringCount();
    updateNoteCount();
    updateStatsDisplay();

    startBtn.addEventListener('click', startGame);
    if (changeStringsBtn) changeStringsBtn.addEventListener('click', backToSetup);
    if (resetStatsBtn)   resetStatsBtn.addEventListener('click', resetStats);
  });
})();
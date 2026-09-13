/**
 * fretboard-game.js
 * Fretboard note memorization game.
 *
 * Note mapping is calculated from standard tuning + fret number using
 * correct chromatic (12-tone) pitch relationships — never hardcoded
 * or randomly assigned. Only fret positions whose true note is a
 * natural note (A-G, no sharps/flats) are used as questions, per the
 * beginner-only V1 scope, but the underlying mapping stays musically
 * accurate for every fret 1-12.
 */
(function () {
  'use strict';

  var NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  var NATURAL_NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  var MAX_FRET = 12;

  // Standard tuning, low to high.
  var STRINGS = [
    { id: 'lowE', label: 'Low E', shortLabel: 'E', openIndex: NOTES.indexOf('E') },
    { id: 'A', label: 'A', shortLabel: 'A', openIndex: NOTES.indexOf('A') },
    { id: 'D', label: 'D', shortLabel: 'D', openIndex: NOTES.indexOf('D') },
    { id: 'G', label: 'G', shortLabel: 'G', openIndex: NOTES.indexOf('G') },
    { id: 'B', label: 'B', shortLabel: 'B', openIndex: NOTES.indexOf('B') },
    { id: 'highE', label: 'High E', shortLabel: 'e', openIndex: NOTES.indexOf('E') }
  ];

  function noteAt(openIndex, fret) {
    return NOTES[(openIndex + fret) % 12];
  }

  function isNatural(note) {
    return NATURAL_NOTES.indexOf(note) !== -1;
  }

  // Precompute every natural-note position (fret 1-12) for every string.
  // Each entry: { stringId, stringIndex, fret, note }
  var ALL_NATURAL_POSITIONS = [];
  STRINGS.forEach(function (str, stringIndex) {
    for (var fret = 1; fret <= MAX_FRET; fret++) {
      var note = noteAt(str.openIndex, fret);
      if (isNatural(note)) {
        ALL_NATURAL_POSITIONS.push({
          stringId: str.id,
          stringIndex: stringIndex,
          fret: fret,
          note: note
        });
      }
    }
  });

  // ---------------------------------------------------------------
  // Difficulty
  // Accuracy matters more than speed: difficulty is driven by a
  // sustained correct streak, never by response time. A poor run of
  // recent answers gently lowers the level again instead of letting
  // a struggling student stay stuck on a hard setting.
  // ---------------------------------------------------------------
  var LEVELS = {
    1: { maxFret: 5,  streakToAdvance: 5,  hardDistractors: false },
    2: { maxFret: 8,  streakToAdvance: 8,  hardDistractors: false },
    3: { maxFret: 12, streakToAdvance: 12, hardDistractors: false },
    4: { maxFret: 12, streakToAdvance: Infinity, hardDistractors: true }
  };
  var RECENT_WINDOW = 10;
  var RECENT_ACCURACY_FLOOR = 0.5;

  var STORAGE_KEYS = {
    bestStreak: 'fretboardGame.bestStreak',
    totals: 'fretboardGame.totals',
    selectedStrings: 'fretboardGame.selectedStrings'
  };

  // ---------------------------------------------------------------
  // Game state
  // ---------------------------------------------------------------
  var game = {
    selectedStringIds: [],
    level: 1,
    score: 0,
    streak: 0,
    bestStreak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    recentResults: [], // true/false, most recent last, capped at RECENT_WINDOW
    currentQuestion: null,
    answered: false
  };

  // ---------------------------------------------------------------
  // localStorage helpers (best-effort; game still works without it)
  // ---------------------------------------------------------------
  function loadStorage(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // localStorage unavailable (private browsing, quota, etc.) — ignore.
    }
  }

  function persistProgress() {
    saveStorage(STORAGE_KEYS.bestStreak, game.bestStreak);
    saveStorage(STORAGE_KEYS.totals, {
      questionsAnswered: game.questionsAnswered,
      correctAnswers: game.correctAnswers
    });
  }

  // ---------------------------------------------------------------
  // Question generation
  // ---------------------------------------------------------------

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  /** Natural-note neighbors, for the harder "confusable" distractors at level 4. */
  var NATURAL_NEIGHBORS = {
    A: ['G', 'B'], B: ['A', 'C'], C: ['B', 'D'], D: ['C', 'E'],
    E: ['D', 'F'], F: ['E', 'G'], G: ['F', 'A']
  };

  function buildAnswerChoices(correctNote, hardDistractors) {
    var pool = NATURAL_NOTES.filter(function (n) { return n !== correctNote; });
    var distractors = [];

    if (hardDistractors) {
      var neighbors = NATURAL_NEIGHBORS[correctNote].slice();
      distractors = distractors.concat(shuffle(neighbors));
    }

    var remainingPool = shuffle(pool.filter(function (n) { return distractors.indexOf(n) === -1; }));
    while (distractors.length < 4 && remainingPool.length) {
      distractors.push(remainingPool.shift());
    }
    distractors = distractors.slice(0, 4);

    var choices = shuffle(distractors.concat([correctNote]));
    return choices;
  }

  function generateQuestion() {
    var levelConfig = LEVELS[game.level];
    var candidates = ALL_NATURAL_POSITIONS.filter(function (pos) {
      return game.selectedStringIds.indexOf(pos.stringId) !== -1 && pos.fret <= levelConfig.maxFret;
    });

    if (!candidates.length) {
      return null;
    }

    var chosen = pickRandom(candidates);
    var choices = buildAnswerChoices(chosen.note, levelConfig.hardDistractors);

    return {
      stringId: chosen.stringId,
      stringIndex: chosen.stringIndex,
      fret: chosen.fret,
      note: chosen.note,
      choices: choices
    };
  }

  // ---------------------------------------------------------------
  // Difficulty adjustment
  // ---------------------------------------------------------------

  function recentAccuracy() {
    if (!game.recentResults.length) {
      return 1;
    }
    var correctCount = game.recentResults.filter(Boolean).length;
    return correctCount / game.recentResults.length;
  }

  function updateDifficulty() {
    var levelConfig = LEVELS[game.level];

    if (game.streak > 0 && game.streak % levelConfig.streakToAdvance === 0 && game.level < 4) {
      game.level++;
      return;
    }

    if (game.recentResults.length >= RECENT_WINDOW && recentAccuracy() < RECENT_ACCURACY_FLOOR && game.level > 1) {
      game.level--;
      game.recentResults = []; // give the student a clean slate at the easier level
    }
  }

  // ---------------------------------------------------------------
  // SVG fretboard rendering
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
    var width = 900;
    var height = 220;
    var leftMargin = 40;
    var rightMargin = 20;
    var topMargin = 20;
    var stringGap = (height - topMargin - 20) / (STRINGS.length - 1);
    var fretGap = (width - leftMargin - rightMargin) / MAX_FRET;

    var svg = el('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      class: 'game-fretboard-svg',
      role: 'img',
      'aria-label': 'Fretboard with a highlighted note position to identify'
    });

    function stringY(i) { return topMargin + i * stringGap; }
    function fretX(f) { return leftMargin + f * fretGap; }

    svg.appendChild(el('line', {
      x1: fretX(0), x2: fretX(0), y1: stringY(0), y2: stringY(STRINGS.length - 1),
      class: 'game-nut'
    }));

    for (var f = 1; f <= MAX_FRET; f++) {
      svg.appendChild(el('line', {
        x1: fretX(f), x2: fretX(f), y1: stringY(0), y2: stringY(STRINGS.length - 1),
        class: 'game-fretline'
      }));
    }

    [3, 5, 7, 9].forEach(function (f) {
      svg.appendChild(el('circle', {
        cx: fretX(f) - fretGap / 2, cy: (stringY(0) + stringY(STRINGS.length - 1)) / 2,
        r: 5, class: 'game-fret-marker'
      }));
    });
    [-4, 4].forEach(function (offset) {
      svg.appendChild(el('circle', {
        cx: fretX(12) - fretGap / 2, cy: (stringY(0) + stringY(STRINGS.length - 1)) / 2 + offset,
        r: 5, class: 'game-fret-marker'
      }));
    });

    STRINGS.forEach(function (str, si) {
      svg.appendChild(el('line', {
        x1: fretX(0), x2: fretX(MAX_FRET), y1: stringY(si), y2: stringY(si),
        class: 'game-stringline'
      }));
      var label = el('text', { x: 12, y: stringY(si) + 4, class: 'game-string-label' });
      label.textContent = str.shortLabel;
      svg.appendChild(label);
    });

    for (var fn = 1; fn <= MAX_FRET; fn++) {
      var fLabel = el('text', { x: fretX(fn) - fretGap / 2, y: height - 4, class: 'game-fret-number' });
      fLabel.textContent = fn;
      svg.appendChild(fLabel);
    }

    if (question) {
      var qx = fretX(question.fret) - fretGap / 2;
      var qy = stringY(question.stringIndex);
      svg.appendChild(el('circle', { cx: qx, cy: qy, r: 16, class: 'game-question-pulse' }));
      svg.appendChild(el('circle', { cx: qx, cy: qy, r: 11, class: 'game-question-dot' }));
    }

    container.innerHTML = '';
    container.appendChild(svg);
  }

  // ---------------------------------------------------------------
  // DOM wiring
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    var setupSection = document.getElementById('gameSetup');
    var gameSection = document.getElementById('gameArea');
    var startBtn = document.getElementById('startGameBtn');
    var setupError = document.getElementById('setupError');
    var stringCheckboxes = Array.prototype.slice.call(document.querySelectorAll('.string-checkbox input'));
    var fretboardContainer = document.getElementById('gameFretboard');
    var answersGrid = document.getElementById('gameAnswers');
    var feedbackEl = document.getElementById('gameFeedback');
    var changeStringsBtn = document.getElementById('changeStringsBtn');
    var resetStatsBtn = document.getElementById('resetStatsBtn');
    var levelNoteEl = document.getElementById('gameLevelNote');

    var statEls = {
      score: document.getElementById('statScore'),
      streak: document.getElementById('statStreak'),
      bestStreak: document.getElementById('statBestStreak'),
      questions: document.getElementById('statQuestions'),
      correct: document.getElementById('statCorrect'),
      accuracy: document.getElementById('statAccuracy')
    };

    if (!setupSection || !gameSection) {
      return; // Not on the fretboard game page.
    }

    // Restore previously selected strings, if any.
    var savedSelection = loadStorage(STORAGE_KEYS.selectedStrings, null);
    if (savedSelection && savedSelection.length) {
      stringCheckboxes.forEach(function (cb) {
        cb.checked = savedSelection.indexOf(cb.value) !== -1;
        cb.closest('.string-checkbox').classList.toggle('is-checked', cb.checked);
      });
    }

    game.bestStreak = loadStorage(STORAGE_KEYS.bestStreak, 0);
    var savedTotals = loadStorage(STORAGE_KEYS.totals, { questionsAnswered: 0, correctAnswers: 0 });
    game.questionsAnswered = savedTotals.questionsAnswered || 0;
    game.correctAnswers = savedTotals.correctAnswers || 0;

    stringCheckboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        cb.closest('.string-checkbox').classList.toggle('is-checked', cb.checked);
      });
    });

    function updateStatsDisplay() {
      var accuracy = game.questionsAnswered > 0
        ? Math.round((game.correctAnswers / game.questionsAnswered) * 100)
        : 0;

      if (statEls.score) { statEls.score.textContent = game.score; }
      if (statEls.streak) { statEls.streak.textContent = game.streak; }
      if (statEls.bestStreak) { statEls.bestStreak.textContent = game.bestStreak; }
      if (statEls.questions) { statEls.questions.textContent = game.questionsAnswered; }
      if (statEls.correct) { statEls.correct.textContent = game.correctAnswers; }
      if (statEls.accuracy) { statEls.accuracy.textContent = accuracy + '%'; }
      if (levelNoteEl) { levelNoteEl.textContent = 'Level ' + game.level + ' of 4'; }
    }

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
      var question = generateQuestion();
      if (!question) {
        feedbackEl.textContent = 'Select at least one string to keep practicing.';
        return;
      }
      game.currentQuestion = question;
      game.answered = false;
      feedbackEl.textContent = '';
      feedbackEl.className = 'game-feedback';
      renderFretboard(fretboardContainer, question);
      renderAnswers();
    }

    function handleAnswer(selectedNote, btnEl) {
      if (game.answered) {
        return; // Prevent double-answering the same question.
      }
      game.answered = true;

      var correctNote = game.currentQuestion.note;
      var isCorrect = selectedNote === correctNote;

      game.questionsAnswered++;
      game.recentResults.push(isCorrect);
      if (game.recentResults.length > RECENT_WINDOW) {
        game.recentResults.shift();
      }

      Array.prototype.forEach.call(answersGrid.children, function (child) {
        child.disabled = true;
        if (child.textContent === correctNote) {
          child.classList.add('is-correct');
        }
      });

      if (isCorrect) {
        game.score += 10;
        game.streak++;
        game.correctAnswers++;
        if (game.streak > game.bestStreak) {
          game.bestStreak = game.streak;
        }
        feedbackEl.textContent = '\u2705 Correct! That was ' + correctNote + '.';
        feedbackEl.className = 'game-feedback is-correct-text';
      } else {
        btnEl.classList.add('is-incorrect');
        game.streak = 0;
        feedbackEl.textContent = '\u274C Not quite \u2014 that note was ' + correctNote + '.';
        feedbackEl.className = 'game-feedback is-incorrect-text';
      }

      updateDifficulty();
      updateStatsDisplay();
      persistProgress();

      window.setTimeout(nextQuestion, 1100);
    }

    function startGame() {
      var selected = stringCheckboxes.filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
      if (!selected.length) {
        setupError.textContent = 'Please select at least one string to practice.';
        return;
      }
      setupError.textContent = '';
      saveStorage(STORAGE_KEYS.selectedStrings, selected);

      game.selectedStringIds = selected;
      game.level = 1;
      game.score = 0;
      game.streak = 0;
      game.questionsAnswered = savedTotals.questionsAnswered || 0;
      game.correctAnswers = savedTotals.correctAnswers || 0;
      game.recentResults = [];

      setupSection.hidden = true;
      gameSection.hidden = false;

      updateStatsDisplay();
      nextQuestion();
    }

    function backToSetup() {
      gameSection.hidden = true;
      setupSection.hidden = false;
    }

    function resetStats() {
      game.score = 0;
      game.streak = 0;
      game.bestStreak = 0;
      game.questionsAnswered = 0;
      game.correctAnswers = 0;
      game.recentResults = [];
      saveStorage(STORAGE_KEYS.bestStreak, 0);
      saveStorage(STORAGE_KEYS.totals, { questionsAnswered: 0, correctAnswers: 0 });
      updateStatsDisplay();
    }

    startBtn.addEventListener('click', startGame);
    if (changeStringsBtn) { changeStringsBtn.addEventListener('click', backToSetup); }
    if (resetStatsBtn) { resetStatsBtn.addEventListener('click', resetStats); }
  });
})();

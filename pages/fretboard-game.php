<?php
/**
 * pages/fretboard-game.php
 * Fretboard note memorization game.
 * Setup: Easy / Medium / Hard / Manual modes.
 * Game: zoomable fretboard with countdown timer (Easy/Medium/Hard only).
 */

$pageTitle       = 'Fretboard Game — Promise Guitar Learning';
$pageDescription = 'Learn the guitar fretboard with a note-memorization game. Easy, Medium, Hard, and Manual practice modes.';
$extraCss        = 'fretboard-game.css';
$currentPage     = 'game';
$pageJs          = 'fretboard-game.js';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO -->
  <section class="game-intro reveal">
    <div class="container">
      <span class="eyebrow">Fretboard Game</span>
      <h1>How well do you know the neck?</h1>
      <p>
        Pick a mode, choose what to practice, and name the note at each
        highlighted position. Your stats are saved on your device.
      </p>
    </div>
  </section>

  <!-- SETUP -->
  <section class="game-setup-section reveal" id="gameSetup">
    <div class="container">
      <div class="game-setup-card">

        <div class="setup-head">
          <h2>Set up your practice</h2>
          <p>Choose a mode, then pick what to work on.</p>
        </div>

        <!-- Mode tabs -->
        <div class="mode-tabs" role="tablist" aria-label="Practice mode">
          <button type="button" class="mode-tab is-active" data-mode="easy" role="tab" aria-selected="true">
            <span class="mode-tab-name">Easy</span>
            <span class="mode-tab-hint">Frets 1–5</span>
          </button>
          <button type="button" class="mode-tab" data-mode="medium" role="tab" aria-selected="false">
            <span class="mode-tab-name">Medium</span>
            <span class="mode-tab-hint">Frets 1–9</span>
          </button>
          <button type="button" class="mode-tab" data-mode="hard" role="tab" aria-selected="false">
            <span class="mode-tab-name">Hard</span>
            <span class="mode-tab-hint">Frets 1–12</span>
          </button>
          <button type="button" class="mode-tab" data-mode="manual" role="tab" aria-selected="false">
            <span class="mode-tab-name">Manual</span>
            <span class="mode-tab-hint">Your choice</span>
          </button>
        </div>

        <p class="mode-description" id="modeDescription"></p>

        <!-- String selection -->
        <div class="setup-block">
          <div class="setup-block-head">
            <h3>Strings</h3>
            <span class="setup-count" id="stringCount">6 of 6</span>
          </div>
          <div class="string-select-grid" id="stringSelectGrid">
            <label class="string-checkbox">
              <input type="checkbox" value="lowE" checked>
              <span class="string-checkbox-label">Low E</span>
            </label>
            <label class="string-checkbox">
              <input type="checkbox" value="A" checked>
              <span class="string-checkbox-label">A</span>
            </label>
            <label class="string-checkbox">
              <input type="checkbox" value="D" checked>
              <span class="string-checkbox-label">D</span>
            </label>
            <label class="string-checkbox">
              <input type="checkbox" value="G" checked>
              <span class="string-checkbox-label">G</span>
            </label>
            <label class="string-checkbox">
              <input type="checkbox" value="B" checked>
              <span class="string-checkbox-label">B</span>
            </label>
            <label class="string-checkbox">
              <input type="checkbox" value="highE" checked>
              <span class="string-checkbox-label">High E</span>
            </label>
          </div>
        </div>

        <!-- Note selection (Manual only) -->
        <div class="setup-block" id="notesBlock" hidden>
          <div class="setup-block-head">
            <h3>Notes</h3>
            <span class="setup-count" id="noteCount">12 of 12</span>
          </div>
          <div class="note-select-grid" id="noteSelectGrid">
            <label class="note-checkbox"><input type="checkbox" value="A" checked><span class="note-checkbox-label">A</span></label>
            <label class="note-checkbox"><input type="checkbox" value="A#" checked><span class="note-checkbox-label">A#</span></label>
            <label class="note-checkbox"><input type="checkbox" value="B" checked><span class="note-checkbox-label">B</span></label>
            <label class="note-checkbox"><input type="checkbox" value="C" checked><span class="note-checkbox-label">C</span></label>
            <label class="note-checkbox"><input type="checkbox" value="C#" checked><span class="note-checkbox-label">C#</span></label>
            <label class="note-checkbox"><input type="checkbox" value="D" checked><span class="note-checkbox-label">D</span></label>
            <label class="note-checkbox"><input type="checkbox" value="D#" checked><span class="note-checkbox-label">D#</span></label>
            <label class="note-checkbox"><input type="checkbox" value="E" checked><span class="note-checkbox-label">E</span></label>
            <label class="note-checkbox"><input type="checkbox" value="F" checked><span class="note-checkbox-label">F</span></label>
            <label class="note-checkbox"><input type="checkbox" value="F#" checked><span class="note-checkbox-label">F#</span></label>
            <label class="note-checkbox"><input type="checkbox" value="G" checked><span class="note-checkbox-label">G</span></label>
            <label class="note-checkbox"><input type="checkbox" value="G#" checked><span class="note-checkbox-label">G#</span></label>
          </div>
          <div class="note-quick-actions" role="group" aria-label="Quick note selection">
            <button type="button" class="quick-btn" data-quick="all">All</button>
            <button type="button" class="quick-btn" data-quick="naturals">Naturals</button>
            <button type="button" class="quick-btn" data-quick="sharps">Sharps</button>
            <button type="button" class="quick-btn" data-quick="none">Clear</button>
          </div>
        </div>

        <p class="game-setup-error" id="setupError" aria-live="polite"></p>

        <button type="button" class="btn btn-primary btn-block" id="startGameBtn">Start Practice</button>
      </div>
    </div>
  </section>

  <!-- GAME AREA -->
  <section class="game-play-section reveal" id="gameArea" hidden>
    <div class="container">
      <div class="game-area">

        <div class="game-mode-bar">
          <span class="game-mode-badge" id="gameModeBadge">Easy</span>
          <span class="game-mode-sub" id="gameModeSub">Frets 1–5</span>
        </div>

        <div class="game-stats-bar">
          <div class="game-stat"><span class="game-stat-value" id="statScore">0</span><span class="game-stat-label">Score</span></div>
          <div class="game-stat"><span class="game-stat-value" id="statStreak">0</span><span class="game-stat-label">Streak</span></div>
          <div class="game-stat"><span class="game-stat-value" id="statBestStreak">0</span><span class="game-stat-label">Best</span></div>
          <div class="game-stat"><span class="game-stat-value" id="statQuestions">0</span><span class="game-stat-label">Questions</span></div>
          <div class="game-stat"><span class="game-stat-value" id="statCorrect">0</span><span class="game-stat-label">Correct</span></div>
          <div class="game-stat"><span class="game-stat-value" id="statAccuracy">0%</span><span class="game-stat-label">Accuracy</span></div>
        </div>

        <!-- Fretboard with zoom + swipe hint -->
        <div class="game-fretboard-wrap">
          <div class="game-fretboard-toolbar">
            <p class="game-scroll-hint" id="scrollHint" aria-hidden="true">
              <span>Swipe to see all 12 frets</span>
              <span class="scroll-hint-arrow">→</span>
            </p>
            <div class="fretboard-zoom-controls" role="group" aria-label="Fretboard zoom">
              <button type="button" class="zoom-btn" id="zoomOutBtn" aria-label="Zoom out">&minus;</button>
              <span class="zoom-label" id="zoomLevelLabel">1×</span>
              <button type="button" class="zoom-btn" id="zoomInBtn" aria-label="Zoom in">&plus;</button>
            </div>
          </div>
          <div class="game-fretboard-holder">
            <div id="gameFretboard"></div>
          </div>
        </div>

        <!-- Countdown timer (Easy / Medium / Hard only) -->
        <div class="game-timer" id="gameTimer" hidden>
          <div class="game-timer-head">
            <span class="game-timer-label">Time</span>
            <span class="game-timer-text" id="gameTimerText">10.0s</span>
          </div>
          <div class="game-timer-track">
            <div class="game-timer-fill" id="gameTimerFill"></div>
          </div>
        </div>

        <p class="game-question">What note is at the highlighted position?</p>

        <div class="game-answers-grid" id="gameAnswers"></div>

        <p class="game-feedback" id="gameFeedback" aria-live="polite"></p>

        <div class="game-footer-actions">
          <button type="button" class="btn btn-outline" id="changeStringsBtn">Change Setup</button>
          <button type="button" class="btn btn-outline" id="resetStatsBtn">Reset Stats</button>
        </div>
      </div>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
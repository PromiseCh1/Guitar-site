<?php
/**
 * pages/fretboard-game.php
 * Fretboard note memorization game: choose strings, then identify
 * random natural-note positions on frets 1-12.
 */

$pageTitle       = 'Fretboard Game — Promise Guitar Learning';
$pageDescription = 'Test how well you know the guitar fretboard with a quick natural-note memorization game.';
$extraCss        = 'fretboard-game.css';
$currentPage     = 'game';
$pageJs          = 'fretboard-game.js';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO -->
  <section class="game-intro container reveal">
    <span class="eyebrow">Fretboard Game</span>
    <h1>How well do you know the neck?</h1>
    <p>
      Pick the strings you want to practice, then name the note at
      each highlighted position. The game gets a little harder the
      better you do.
    </p>
  </section>

  <!-- SETUP -->
  <section class="section reveal" id="gameSetup" style="padding-top:0;">
    <div class="container">
      <div class="game-setup card">
        <h2>Choose your strings</h2>
        <p>Select at least one string to practice.</p>

        <div class="string-select-grid">
          <label class="string-checkbox">
            <input type="checkbox" value="lowE" checked>
            Low E
          </label>
          <label class="string-checkbox">
            <input type="checkbox" value="A" checked>
            A
          </label>
          <label class="string-checkbox">
            <input type="checkbox" value="D">
            D
          </label>
          <label class="string-checkbox">
            <input type="checkbox" value="G">
            G
          </label>
          <label class="string-checkbox">
            <input type="checkbox" value="B">
            B
          </label>
          <label class="string-checkbox">
            <input type="checkbox" value="highE">
            High E
          </label>
        </div>

        <p class="game-setup-error" id="setupError" aria-live="polite"></p>

        <button type="button" class="btn btn-primary btn-block" id="startGameBtn">Start Game</button>
      </div>
    </div>
  </section>

  <!-- GAME AREA (hidden until Start Game is pressed) -->
  <section class="section reveal" id="gameArea" style="padding-top:0;" hidden>
    <div class="container">
      <div class="game-area">

        <div class="game-stats-bar">
          <div class="game-stat">
            <span class="game-stat-value" id="statScore">0</span>
            <span class="game-stat-label">Score</span>
          </div>
          <div class="game-stat">
            <span class="game-stat-value" id="statStreak">0</span>
            <span class="game-stat-label">Streak</span>
          </div>
          <div class="game-stat">
            <span class="game-stat-value" id="statBestStreak">0</span>
            <span class="game-stat-label">Best</span>
          </div>
          <div class="game-stat">
            <span class="game-stat-value" id="statQuestions">0</span>
            <span class="game-stat-label">Questions</span>
          </div>
          <div class="game-stat">
            <span class="game-stat-value" id="statCorrect">0</span>
            <span class="game-stat-label">Correct</span>
          </div>
          <div class="game-stat">
            <span class="game-stat-value" id="statAccuracy">0%</span>
            <span class="game-stat-label">Accuracy</span>
          </div>
        </div>

        <p class="game-level-note" id="gameLevelNote">Level 1 of 4</p>

        <div class="game-fretboard-holder">
          <div id="gameFretboard"></div>
        </div>

        <p class="game-question">What note is this?</p>

        <div class="game-answers-grid" id="gameAnswers"></div>

        <p class="game-feedback" id="gameFeedback" aria-live="polite"></p>

        <div class="game-footer-actions">
          <button type="button" class="btn btn-outline" id="changeStringsBtn">Change Strings</button>
          <button type="button" class="btn btn-outline" id="resetStatsBtn">Reset Stats</button>
        </div>
      </div>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<?php

/**
 * index.php
 * Home page: full-bleed hero photo, process, learning path,
 * tools with emoji icons, animated practice tips, instructor.
 */

$pageTitle       = 'Beginner Guitar Practice Tools';
$pageDescription = 'A free practice space for beginner guitar students: chord reference, scale charts, a metronome and a fretboard memorization game.';
$extraCss        = 'home.css';
$currentPage     = 'home';
$pageJs          = 'home.js';

include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<main id="main-content">

  <!-- 1. HERO — full-bleed photo with dark overlay -->
  <section class="hero">
    <div class="container">
      <div class="hero-copy">
        <span class="eyebrow">Guitar Learning &amp; Practice</span>
        <h1>Learn guitar.<br><span class="accent">Practice with purpose.</span></h1>
        <p class="hero-subtitle">
          Simple, interactive tools for beginner guitarists — chords, scales,
          timing and fretboard knowledge. No sign-up, no clutter.
        </p>
        <div class="hero-actions">
          <a href="<?php echo BASE_URL; ?>/pages/chords.php" class="btn btn-primary">Start Learning</a>
          <button type="button" id="exploreToolsBtn" class="btn btn-outline">Explore Tools</button>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. HOW TO USE -->
  <section class="section section--alt reveal">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">How It Works</span>
        <h2>A simple learning loop</h2>
        <p>Four steps that make practice actually stick.</p>
      </div>

      <ol class="process-list">
        <li class="process-item">
          <span class="process-num">01</span>
          <h3>Learn</h3>
          <p>Open Chords or Scales and take in one new thing at a time.</p>
        </li>
        <li class="process-item">
          <span class="process-num">02</span>
          <h3>Understand</h3>
          <p>Read the short practice tip so you know what your hands should do.</p>
        </li>
        <li class="process-item">
          <span class="process-num">03</span>
          <h3>Practice</h3>
          <p>Pick up your guitar and use the metronome to keep things even.</p>
        </li>
        <li class="process-item">
          <span class="process-num">04</span>
          <h3>Test</h3>
          <p>Check what stuck with the Fretboard Game, then go back and repeat.</p>
        </li>
      </ol>
    </div>
  </section>

  <!-- 3. LEARNING PATH -->
  <section class="section reveal">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Start Here</span>
        <h2>A path for complete beginners</h2>
        <p>Not sure where to start? Follow this order.</p>
      </div>

      <ol class="path-list">
        <li>
          <a href="<?php echo BASE_URL; ?>/pages/chords.php" class="path-item">
            <span class="path-num">1</span>
            <div class="path-body">
              <h3>Learn your first open chords</h3>
              <p>Start with E Minor, A Minor and C Major on the Chords page.</p>
            </div>
            <span class="path-arrow" aria-hidden="true">→</span>
          </a>
        </li>
        <li>
          <a href="<?php echo BASE_URL; ?>/pages/metronome.php" class="path-item">
            <span class="path-num">2</span>
            <div class="path-body">
              <h3>Practice switching slowly</h3>
              <p>Use the Metronome at a slow tempo and switch between two chords.</p>
            </div>
            <span class="path-arrow" aria-hidden="true">→</span>
          </a>
        </li>
        <li>
          <a href="<?php echo BASE_URL; ?>/pages/scales.php" class="path-item">
            <span class="path-num">3</span>
            <div class="path-body">
              <h3>Get to know your fretboard</h3>
              <p>Play the Chromatic Scale one fret at a time on the Scales page.</p>
            </div>
            <span class="path-arrow" aria-hidden="true">→</span>
          </a>
        </li>
        <li>
          <a href="<?php echo BASE_URL; ?>/pages/fretboard-game.php" class="path-item">
            <span class="path-num">4</span>
            <div class="path-body">
              <h3>Test your note memory</h3>
              <p>Try the Fretboard Game to see how quickly you can name the notes.</p>
            </div>
            <span class="path-arrow" aria-hidden="true">→</span>
          </a>
        </li>
      </ol>
    </div>
  </section>

  <!-- 4. TOOLS -->
  <section class="section section--alt reveal" id="tools">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Practice Tools</span>
        <h2>Four tools for your practice</h2>
        <p>No sign-up. Free to use. Made for the phone in your hand.</p>
      </div>

      <div class="tools-grid">

        <a href="<?php echo BASE_URL; ?>/pages/chords.php" class="tool-card">
          <span class="tool-icon" aria-hidden="true">🎸</span>
          <h3>Chords</h3>
          <p>Diagrams for 7 major and 7 minor open chords, with finger positions.</p>
          <span class="tool-link">Open Chords <span aria-hidden="true">→</span></span>
        </a>

        <a href="<?php echo BASE_URL; ?>/pages/scales.php" class="tool-card">
          <span class="tool-icon" aria-hidden="true">🎼</span>
          <h3>Scales</h3>
          <p>The Chromatic and Major scales with simple fretboard patterns.</p>
          <span class="tool-link">Open Scales <span aria-hidden="true">→</span></span>
        </a>

        <a href="<?php echo BASE_URL; ?>/pages/metronome.php" class="tool-card">
          <span class="tool-icon" aria-hidden="true">⏱️</span>
          <h3>Metronome</h3>
          <p>A steady click with adjustable tempo, tap tempo and beat accents.</p>
          <span class="tool-link">Open Metronome <span aria-hidden="true">→</span></span>
        </a>

        <a href="<?php echo BASE_URL; ?>/pages/fretboard-game.php" class="tool-card">
          <span class="tool-icon" aria-hidden="true">🎯</span>
          <h3>Fretboard Game</h3>
          <p>Test how well you know the notes on the neck with a quick game.</p>
          <span class="tool-link">Play the Game <span aria-hidden="true">→</span></span>
        </a>

      </div>
    </div>
  </section>

  <!-- 5. ANIMATED PRACTICE TIPS -->
  <section class="section reveal">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Practice Tips</span>
        <h2>Small habits, faster progress</h2>
      </div>

      <div class="tips-showcase">
        <p class="tip-display" id="randomTip" aria-live="polite">Loading tip…</p>
      </div>
    </div>
  </section>

  <!-- 6. INSTRUCTOR -->
  <section class="section section--alt reveal">
    <div class="container">
      <div class="instructor-card">
        <div class="instructor-avatar">
          <img src="<?php echo BASE_URL; ?>/assets/images/general/pp.png"
            alt="Promise Chaudhary, guitarist and guitar instructor">
        </div>
        <div class="instructor-body">
          <span class="instructor-eyebrow">From the Instructor</span>
          <h2 class="instructor-name">Promise</h2>
          <p class="instructor-role">
            <span>Guitarist</span>
          </p>
          <p class="instructor-note">
            “This website is designed for beginners who want to learn guitar in a fun and interactive way. Dedicated learners are welcome here!”
          </p>
          <div class="instructor-actions">
            <a href="https://wa.me/9779822899750" target="_blank" rel="noopener" class="btn btn-primary">
              Message on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>

<?php include __DIR__ . '/includes/footer.php'; ?>
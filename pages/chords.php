<?php

/**
 * pages/chords.php
 * Interactive chord reference with colored finger diagrams,
 * practice progressions (with audio playback), and a teacher's note.
 */

$pageTitle       = 'Guitar Chords for Beginners — Guitar with Promise';
$pageDescription = 'Learn common major and minor guitar chords with clear chord diagrams and beginner-friendly finger positions.';
$extraCss        = 'chords.css';
$currentPage     = 'chords';
$pageJs          = 'chords.js';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO with background image -->
  <section class="chords-intro reveal">
    <div class="container">
      <span class="eyebrow">Chord Reference</span>
      <h1>Learn your first guitar chords</h1>
      <p>
        Tap any chord to see where your fingers go. Start with the easy
        ones — the harder shapes come later.
      </p>
    </div>
  </section>

  <!-- TABS + GRID + SELECTED CHORD PANEL -->
  <section class="section reveal">
    <div class="container">
      <div class="chord-tabs" role="tablist" aria-label="Chord category">
        <button type="button" class="chord-tab is-active" data-type="major" role="tab" aria-selected="true">Major</button>
        <button type="button" class="chord-tab" data-type="minor" role="tab" aria-selected="false">Minor</button>
        <button type="button" class="chord-tab" data-type="power" role="tab" aria-selected="false">Power</button>
      </div>

      <div class="chord-grid" id="chordGrid" role="group" aria-label="Choose a chord">
        <noscript>
          <p>This chord chart needs JavaScript enabled to work.</p>
        </noscript>
      </div>

      <div class="chord-panel card">
        <h2 class="chord-panel-name" id="selectedChordName">E Major</h2>

        <div class="chord-diagram-holder" id="selectedChordDiagram" aria-live="polite"></div>

        <p class="chord-finger-legend">
          <span><b>1</b> index</span>
          <span><b>2</b> middle</span>
          <span><b>3</b> ring</span>
          <span><b>4</b> pinky</span>
          <span><b>○</b> open</span>
          <span><b>×</b> don't play</span>
        </p>

        <p class="chord-tip" id="selectedChordTip"></p>
      </div>
    </div>
  </section>

  <!-- HOW TO PRACTICE -->
  <section class="section reveal section--alt">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">How to Practice</span>
        <h2>Getting a clean sound</h2>
        <p>Follow these steps for any chord above.</p>
      </div>

      <ol class="practice-steps-list" id="genericPracticeSteps"></ol>
    </div>
  </section>

  <!-- PROGRESSIONS with audio playback -->
  <section class="section reveal">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Practice Progressions</span>
        <h2>Real progressions to practice</h2>
        <p>Tap any chord to see how it's played, or hit <strong>Play</strong> to hear the whole progression.</p>
      </div>

      <div class="progressions-grid" id="progressionsGrid"></div>
    </div>
  </section>

  <!-- NOTE FROM THE TEACHER -->
  <section class="chord-note reveal">
    <div class="container">
      <div class="chord-note-card">
        <span class="chord-note-label">A note before you go</span>
        <p class="chord-note-text">
          Nobody plays these clean the first time. Slow down until your
          fingers land right, then worry about speed. Ten minutes a day
          beats one long session on the weekend.
        </p>
      </div>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
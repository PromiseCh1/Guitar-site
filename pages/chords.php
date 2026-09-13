<?php
/**
 * pages/chords.php
 * Interactive chord reference: 7 major + 7 minor beginner chords,
 * with SVG diagrams, finger positions, and practice guidance.
 * Chord data lives in assets/js/chords.js (single source of truth).
 */

$pageTitle       = 'Chords — Promise Guitar Learning';
$pageDescription = 'Beginner-friendly diagrams for 7 major and 7 minor open guitar chords, with finger positions and practice tips.';
$extraCss        = 'chords.css';
$currentPage     = 'chords';
$pageJs          = 'chords.js';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO -->
  <section class="chords-intro container reveal">
    <span class="eyebrow">Chord Reference</span>
    <h1>Learn your first guitar chords</h1>
    <p>
      Tap a chord below to see how to play it. Start with the easier
      shapes — E Minor, A Minor, and G Major — before trying the
      barre chords like F and B.
    </p>
  </section>

  <!-- TABS + GRID -->
  <section class="section reveal" style="padding-top:0;">
    <div class="container">
      <div class="chord-tabs" role="tablist" aria-label="Chord category">
        <button type="button" class="chord-tab is-active" data-type="major" role="tab" aria-selected="true">Major</button>
        <button type="button" class="chord-tab" data-type="minor" role="tab" aria-selected="false">Minor</button>
      </div>

      <div class="chord-grid" id="chordGrid" role="group" aria-label="Choose a chord">
        <noscript>
          <p>This chord chart needs JavaScript enabled to work.</p>
        </noscript>
      </div>

      <!-- SELECTED CHORD PANEL -->
      <div class="chord-panel card">
        <h2 class="chord-panel-name" id="selectedChordName">E Major</h2>

        <div class="chord-diagram-holder" id="selectedChordDiagram" aria-live="polite"></div>

        <p class="chord-finger-legend">1 = index &nbsp;·&nbsp; 2 = middle &nbsp;·&nbsp; 3 = ring &nbsp;·&nbsp; 4 = pinky &nbsp;·&nbsp; ○ = open string &nbsp;·&nbsp; × = don't play</p>

        <p class="chord-tip" id="selectedChordTip"></p>
      </div>
    </div>
  </section>

  <!-- HOW TO PRACTICE THIS CHORD -->
  <section class="section reveal" style="background-color: var(--color-bg-alt);">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">How to Practice</span>
        <h2>Getting a clean sound</h2>
        <p>Follow these steps for any chord above.</p>
      </div>

      <ol class="practice-steps-list" id="genericPracticeSteps"></ol>
    </div>
  </section>

  <!-- SWITCH PRACTICE -->
  <section class="section reveal">
    <div class="container">
      <div class="switch-practice">
        <span class="eyebrow">Switch Practice</span>
        <h2>Practice changing between chords</h2>
        <p class="switch-pair-label" id="switchPairLabel">G → C</p>

        <div class="switch-practice-pair">
          <div class="switch-slot">
            <div class="switch-slot-name" id="switchNameA">G</div>
            <div id="switchDiagramA"></div>
          </div>
          <span class="switch-arrow" aria-hidden="true">→</span>
          <div class="switch-slot">
            <div class="switch-slot-name" id="switchNameB">C</div>
            <div id="switchDiagramB"></div>
          </div>
        </div>

        <button type="button" class="btn btn-primary" id="switchNextBtn">Next Pair</button>
      </div>
    </div>
  </section>

  <!-- BEGINNER REMINDER -->
  <section class="section reveal" style="padding-top:0;">
    <div class="container">
      <p class="beginner-reminder">
        🎯 Don't worry about playing every chord perfectly right away.
        A few clean strums a day will get you there faster than
        forcing it all at once.
      </p>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

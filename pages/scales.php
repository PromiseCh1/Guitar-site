<?php
/**
 * pages/scales.php
 * Beginner scale reference: Chromatic Scale and Major Scale,
 * with fretboard visualizations built in assets/js/scales.js.
 */

$pageTitle       = 'Scales — Promise Guitar Learning';
$pageDescription = 'Beginner-friendly guide to the Chromatic Scale and Major Scale, with fretboard visualizations and practice tips.';
$extraCss        = 'scales.css';
$currentPage     = 'scales';
$pageJs          = 'scales.js';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO -->
  <section class="scales-intro container reveal">
    <span class="eyebrow">Scales</span>
    <h1>Get to know your fretboard</h1>
    <p>
      Scales help you learn where the notes are and train your fingers
      to move smoothly. Start with the Chromatic Scale to explore the
      neck, then try the Major Scale to hear a familiar musical sound.
    </p>
  </section>

  <!-- CHROMATIC SCALE -->
  <section class="section reveal" style="padding-top:0;">
    <div class="container">
      <div class="scale-block card">
        <span class="eyebrow">Scale 1</span>
        <h2>Chromatic Scale</h2>
        <p>
          The chromatic scale uses <strong>every note</strong> available on
          the guitar. Each note is one fret apart — this small distance is
          called a <strong>semitone</strong>. It's the best way to explore
          every position on the neck.
        </p>

        <p class="scale-sequence" id="chromaticSequence" aria-live="polite"></p>

        <div class="scale-fretboard-holder">
          <div id="chromaticFretboard"></div>
        </div>
        <div class="scale-legend">
          <span><span class="scale-legend-swatch" style="background-color: var(--color-secondary);"></span>Every note, one fret at a time</span>
        </div>

        <h3 style="margin-top: var(--space-lg);">What to Practice</h3>
        <ul class="scale-practice-list">
          <li>Start slowly — around 60 BPM on the metronome.</li>
          <li>Play one note per beat, one fret at a time.</li>
          <li>Use one finger per fret if you can (1-2-3-4 on frets 1-2-3-4).</li>
          <li>Only speed up once every note sounds clean.</li>
          <li>Try it going up the neck, then coming back down.</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- MAJOR SCALE -->
  <section class="section reveal" style="background-color: var(--color-bg-alt);">
    <div class="container">
      <div class="scale-block card">
        <span class="eyebrow">Scale 2</span>
        <h2>Major Scale</h2>
        <p>
          The major scale is the happy, familiar sound you hear in most
          pop and folk songs. It only uses <strong>7 different notes</strong>
          before repeating. The notes follow a pattern of
          <strong>whole steps (W)</strong> and <strong>half steps (H)</strong>:
        </p>

        <div class="scale-step-pattern" aria-hidden="true">
          <span class="step-w">W</span>
          <span class="step-w">W</span>
          <span class="step-h">H</span>
          <span class="step-w">W</span>
          <span class="step-w">W</span>
          <span class="step-w">W</span>
          <span class="step-h">H</span>
        </div>
        <p style="text-align:center; font-size: var(--fs-sm);">
          A whole step (W) moves 2 frets. A half step (H) moves 1 fret.
        </p>

        <div class="root-selector">
          <label for="majorRootSelect">Choose a root note:</label>
          <select id="majorRootSelect">
            <option value="C">C</option>
            <option value="G">G</option>
            <option value="D">D</option>
            <option value="A">A</option>
            <option value="E">E</option>
          </select>
        </div>

        <p class="scale-sequence" id="majorSequence" aria-live="polite"></p>

        <div class="scale-fretboard-holder">
          <div id="majorFretboard"></div>
        </div>
        <div class="scale-legend">
          <span><span class="scale-legend-swatch" style="background-color: var(--color-primary);"></span>Root note</span>
          <span><span class="scale-legend-swatch" style="background-color: var(--color-secondary);"></span>Other scale notes</span>
        </div>

        <h3 style="margin-top: var(--space-lg);">What to Practice</h3>
        <ul class="scale-practice-list">
          <li>Play the scale slowly, one note at a time, ascending.</li>
          <li>Then play it descending, back to the root note.</li>
          <li>Say each note name out loud as you play it.</li>
          <li>Use a metronome and keep the timing even.</li>
          <li>Only increase speed once you can play it without mistakes.</li>
        </ul>
      </div>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

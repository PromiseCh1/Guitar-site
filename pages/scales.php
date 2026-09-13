<?php
/**
 * pages/scales.php
 * Interactive scale reference: Chromatic, Major, Pentatonic, and Blues.
 * Mobile-optimized: swipe hint above the fretboard, thumb-friendly tabs.
 */

$pageTitle       = 'Guitar Scales for Beginners — Guitar with Promise';
$pageDescription = 'Learn basic guitar scales with simple fretboard patterns, root notes, and beginner-friendly explanations.';
$extraCss        = 'scales.css';
$currentPage     = 'scales';
$pageJs          = 'scales.js';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO -->
  <section class="scales-intro reveal">
    <div class="container">
      <span class="eyebrow">Scales</span>
      <h1>Get to know your fretboard</h1>
      <p>
        Scales train your fingers to move smoothly and show you where
        the notes live. Pick one below and explore it across the whole neck.
      </p>
    </div>
  </section>

  <!-- SCALE BROWSER + PANEL -->
  <section class="scale-browser reveal">
    <div class="container">

      <div class="scale-tabs" role="tablist" aria-label="Scale type">
        <button type="button" class="scale-tab is-active" data-scale="chromatic" role="tab" aria-selected="true">Chromatic</button>
        <button type="button" class="scale-tab" data-scale="major" role="tab" aria-selected="false">Major</button>
        <button type="button" class="scale-tab" data-scale="pentatonic" role="tab" aria-selected="false">Pentatonic</button>
        <button type="button" class="scale-tab" data-scale="blues" role="tab" aria-selected="false">Blues</button>
      </div>

      <!-- SCALE PANEL -->
      <div class="scale-panel card">
        <div class="scale-panel-head">
          <h2 class="scale-panel-name" id="scaleName">Chromatic Scale</h2>
          <span class="scale-badge" id="scaleBadge">12 notes</span>
        </div>

        <div class="scale-root-row" id="scaleRootRow" hidden>
          <label for="scaleRoot">Root note</label>
          <select id="scaleRoot">
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="A">A</option>
          </select>
        </div>

        <ul class="scale-points" id="scalePoints"></ul>

        <div class="scale-formula-block" id="scaleFormulaBlock">
          <span class="scale-block-label">Step formula</span>
          <div class="scale-pattern" id="scalePattern"></div>
          <p class="scale-formula-note" id="scaleFormulaNote"></p>
        </div>

        <div class="scale-arrow-block" id="scaleSequenceBlock">
          <span class="scale-block-label">Notes in order</span>
          <p class="scale-sequence-arrows" id="scaleSequence"></p>
        </div>

        <!-- Fretboard with mobile swipe hint -->
        <div class="scale-fretboard-wrap">
          <p class="scale-scroll-hint" aria-hidden="true">
            <span>Swipe to see all 12 frets</span>
            <span class="scroll-hint-arrow">→</span>
          </p>
           <div class="scale-fretboard-wrap">
          <div class="scale-fretboard-toolbar">
            <p class="scale-scroll-hint" id="scrollHint" aria-hidden="true">
              <span>Swipe to see all 12 frets</span>
              <span class="scroll-hint-arrow">→</span>
            </p>
            <div class="fretboard-zoom-controls" role="group" aria-label="Fretboard zoom">
              <button type="button" class="zoom-btn" id="zoomOutBtn" aria-label="Zoom out">&minus;</button>
              <span class="zoom-label" id="zoomLevelLabel">1×</span>
              <button type="button" class="zoom-btn" id="zoomInBtn" aria-label="Zoom in">&plus;</button>
            </div>
          </div>
          <div class="scale-fretboard-holder">
            <div id="scaleFretboard"></div>
          </div>
        </div>
        </div>

        <div class="scale-legend" id="scaleLegend"></div>
      </div>

    </div>
  </section>

  <!-- PRACTICE -->
  <section class="scale-practice reveal section--alt">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">How to Practice</span>
        <h2>Getting the most out of scales</h2>
        <p>Apply these ideas to any scale above.</p>
      </div>
      <ol class="practice-steps-list" id="scalePracticeSteps"></ol>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
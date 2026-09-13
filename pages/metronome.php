<?php
/**
 * pages/metronome.php
 * Interactive Web Audio API metronome: BPM control, tap tempo,
 * 4/4 time with accented beat 1, and None/8th/16th subdivisions.
 */
$pageTitle       = 'Free Online Guitar Metronome — Guitar with Promise';
$pageDescription = 'Practice guitar timing with a free online metronome featuring adjustable BPM, tap tempo, accents, and subdivisions.';
$extraCss        = 'metronome.css';
$currentPage     = 'metronome';
$pageJs          = 'metronome.js';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO with background image -->
  <section class="metronome-intro reveal">
    <div class="container">
      <span class="eyebrow">Metronome</span>
      <h1>Practice with steady timing</h1>
      <p>
        A metronome keeps a steady beat so you can practice chord
        changes and scales evenly. Start slow — speed only matters
        once you can play cleanly.
      </p>
    </div>
  </section>

  <!-- METRONOME PANEL -->
  <section class="metronome-section reveal">
    <div class="container">
      <div class="metronome-panel card">

        <!-- BPM display -->
        <div class="bpm-display">
          <button type="button" class="bpm-btn" id="bpmDown" aria-label="Decrease BPM by 1">&minus;</button>
          <div class="bpm-center">
            <span class="bpm-value" id="bpmValue">100</span>
            <span class="bpm-unit">BPM</span>
          </div>
          <button type="button" class="bpm-btn" id="bpmUp" aria-label="Increase BPM by 1">&plus;</button>
        </div>

        <div class="bpm-fine-controls">
          <button type="button" class="bpm-fine-btn" id="bpmDown5" aria-label="Decrease BPM by 5">&minus;5</button>
          <button type="button" class="bpm-fine-btn" id="bpmUp5" aria-label="Increase BPM by 5">&plus;5</button>
        </div>

        <!-- Beat indicator -->
        <div class="beat-indicator" aria-hidden="true">
          <span class="beat-dot is-accent"></span>
          <span class="beat-dot"></span>
          <span class="beat-dot"></span>
          <span class="beat-dot"></span>
        </div>

        <!-- Main controls -->
        <div class="metronome-main-controls">
          <button type="button" class="btn btn-primary" id="startStopBtn">Start</button>
          <button type="button" class="btn btn-outline" id="tapTempoBtn">Tap Tempo</button>
        </div>

        <!-- Subdivision -->
        <div class="subdivision-group">
          <h3>Subdivision</h3>
          <div class="subdivision-options" role="group" aria-label="Beat subdivision">
            <button type="button" class="subdivision-btn is-active" data-subdivision="none" aria-pressed="true">None</button>
            <button type="button" class="subdivision-btn" data-subdivision="8th" aria-pressed="false">8th Notes</button>
            <button type="button" class="subdivision-btn" data-subdivision="16th" aria-pressed="false">16th Notes</button>
          </div>
        </div>

        <!-- Status -->
        <p class="metronome-status" id="metronomeStatus" aria-live="polite">
          Stopped. Tap Start when you&rsquo;re ready to practice.
        </p>

        <!-- Note about audio -->
        <div class="metronome-note">
          <span class="metronome-note-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z"/>
              <path d="M15.5 8.5a5 5 0 0 1 0 7"/>
              <path d="M18 6a9 9 0 0 1 0 12"/>
            </svg>
          </span>
          <p class="metronome-note-text">
            Uses your device's Web Audio — sound will begin right after you tap Start.
          </p>
        </div>

      </div>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
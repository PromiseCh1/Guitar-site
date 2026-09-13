<?php
/**
 * pages/metronome.php
 * Interactive Web Audio API metronome: BPM control, tap tempo,
 * 4/4 time with accented beat 1, and None/8th/16th subdivisions.
 */

$pageTitle       = 'Metronome — Promise Guitar Learning';
$pageDescription = 'A free online metronome for guitar practice: adjustable BPM, tap tempo, and 8th/16th note subdivisions.';
$extraCss        = 'metronome.css';
$currentPage     = 'metronome';
$pageJs          = 'metronome.js';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO -->
  <section class="metronome-intro container reveal">
    <span class="eyebrow">Metronome</span>
    <h1>Practice with steady timing</h1>
    <p>
      A metronome keeps a steady beat so you can practice chord
      changes and scales evenly. Start slow — speed only matters
      once you can play cleanly.
    </p>
  </section>

  <!-- METRONOME PANEL -->
  <section class="section reveal" style="padding-top:0;">
    <div class="container">
      <div class="metronome-panel card">

        <div class="bpm-display">
          <button type="button" class="bpm-btn" id="bpmDown" aria-label="Decrease BPM by 1">&minus;</button>
          <div>
            <span class="bpm-value" id="bpmValue">100</span>
            <span class="bpm-unit">BPM</span>
          </div>
          <button type="button" class="bpm-btn" id="bpmUp" aria-label="Increase BPM by 1">&plus;</button>
        </div>

        <div class="bpm-fine-controls">
          <button type="button" class="bpm-fine-btn" id="bpmDown5" aria-label="Decrease BPM by 5">&minus;5</button>
          <button type="button" class="bpm-fine-btn" id="bpmUp5" aria-label="Increase BPM by 5">&plus;5</button>
        </div>

        <div class="beat-indicator" aria-hidden="true">
          <span class="beat-dot is-accent"></span>
          <span class="beat-dot"></span>
          <span class="beat-dot"></span>
          <span class="beat-dot"></span>
        </div>

        <div class="metronome-main-controls">
          <button type="button" class="btn btn-primary" id="startStopBtn">Start</button>
          <button type="button" class="btn btn-outline" id="tapTempoBtn">Tap Tempo</button>
        </div>

        <div class="subdivision-group">
          <h3>Subdivision</h3>
          <div class="subdivision-options" role="group" aria-label="Beat subdivision">
            <button type="button" class="subdivision-btn is-active" data-subdivision="none" aria-pressed="true">None</button>
            <button type="button" class="subdivision-btn" data-subdivision="8th" aria-pressed="false">8th Notes</button>
            <button type="button" class="subdivision-btn" data-subdivision="16th" aria-pressed="false">16th Notes</button>
          </div>
        </div>

        <p class="metronome-status" id="metronomeStatus" aria-live="polite">
          Stopped. Tap Start when you&rsquo;re ready to practice.
        </p>

        <p class="metronome-audio-note">
          Uses your device's Web Audio — sound will begin right after you tap Start.
        </p>
      </div>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

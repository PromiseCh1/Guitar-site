<?php
/**
 * index.php
 * Home page: welcome, how-to-use, learning path, tool links,
 * practice tips, and instructor/contact section.
 */

$pageTitle       = 'Promise Guitar Learning — Free Beginner Guitar Lessons';
$pageDescription = 'Learn guitar from zero with free interactive tools: chord reference, scales, metronome, and a fretboard memorization game.';
$extraCss        = 'home.css';
$currentPage     = 'home';
$pageJs          = 'home.js';

include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<main id="main-content">

  <!-- 1. HERO -->
  <section class="hero">
    <div class="container">
      <div class="hero-icon" aria-hidden="true">🎸</div>
      <span class="eyebrow">For Complete Beginners</span>
      <h1>Learn guitar from <span>zero</span>, one small step at a time</h1>
      <p class="hero-subtitle">
        Free interactive tools to help you practice chords, scales, rhythm,
        and the fretboard — built for beginners, made for your phone.
      </p>
      <div class="hero-actions">
        <a href="<?php echo BASE_URL; ?>/pages/chords.php" class="btn btn-primary btn-block">Start Learning Now</a>
        <button type="button" id="exploreToolsBtn" class="btn btn-outline btn-block">See the Tools</button>
      </div>
    </div>
  </section>

  <!-- 2. SHORT INTRODUCTION -->
  <section class="section reveal">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Welcome</span>
        <h2>What is this website?</h2>
        <p>
          This is a free practice space for beginner guitar students,
          made by guitar instructor Promise Chaudhary. It's not a course
          you sign up for — it's a set of simple tools you can open
          anytime you want to practice, even without a lesson happening.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. HOW TO USE THE WEBSITE -->
  <section class="section reveal" id="how-to-use" style="padding-top:0;">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">How to Use This Site</span>
        <h2>Learn → Understand → Practice → Test → Improve</h2>
        <p>Every tool on this site fits into one simple learning loop.</p>
      </div>

      <div class="steps-list">
        <div class="step-card card">
          <span class="step-number" aria-hidden="true">1</span>
          <div>
            <h3>Learn</h3>
            <p>Open the Chords or Scales page and look at one new thing at a time.</p>
          </div>
        </div>
        <div class="step-card card">
          <span class="step-number" aria-hidden="true">2</span>
          <div>
            <h3>Understand</h3>
            <p>Read the short practice tip so you know exactly what to do with your hands.</p>
          </div>
        </div>
        <div class="step-card card">
          <span class="step-number" aria-hidden="true">3</span>
          <div>
            <h3>Practice</h3>
            <p>Pick up your guitar and use the Metronome to practice slowly and evenly.</p>
          </div>
        </div>
        <div class="step-card card">
          <span class="step-number" aria-hidden="true">4</span>
          <div>
            <h3>Test &amp; Improve</h3>
            <p>Play the Fretboard Game to check what you've actually memorized.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. BEGINNER LEARNING PATH -->
  <section class="section reveal" style="background-color: var(--color-bg-alt);">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Where to Start</span>
        <h2>A simple path for complete beginners</h2>
        <p>Not sure where to begin? Follow this order — tap any step to jump there.</p>
      </div>

      <div class="path-list">
        <a href="<?php echo BASE_URL; ?>/pages/chords.php" class="path-item card">
          <span class="path-badge">Step 1</span>
          <div class="path-body">
            <h3>Learn your first open chords</h3>
            <p>Start with E Minor, A Minor, and C Major on the Chords page.</p>
          </div>
          <span class="path-arrow" aria-hidden="true">→</span>
        </a>
        <a href="<?php echo BASE_URL; ?>/pages/metronome.php" class="path-item card">
          <span class="path-badge">Step 2</span>
          <div class="path-body">
            <h3>Practice switching slowly</h3>
            <p>Use the Metronome at a slow speed and switch between two chords.</p>
          </div>
          <span class="path-arrow" aria-hidden="true">→</span>
        </a>
        <a href="<?php echo BASE_URL; ?>/pages/scales.php" class="path-item card">
          <span class="path-badge">Step 3</span>
          <div class="path-body">
            <h3>Get to know your fretboard</h3>
            <p>Play through the Chromatic Scale on the Scales page, one fret at a time.</p>
          </div>
          <span class="path-arrow" aria-hidden="true">→</span>
        </a>
        <a href="<?php echo BASE_URL; ?>/pages/fretboard-game.php" class="path-item card">
          <span class="path-badge">Step 4</span>
          <div class="path-body">
            <h3>Test your note memory</h3>
            <p>Try the Fretboard Game to see how quickly you can name the notes.</p>
          </div>
          <span class="path-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>

  <!-- 5. TOOLS -->
  <section class="section reveal" id="tools">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Learning Tools</span>
        <h2>Everything you need to practice</h2>
        <p>Four simple tools. No sign-up needed.</p>
      </div>

      <div class="tools-grid">

        <a href="<?php echo BASE_URL; ?>/pages/chords.php" class="tool-card card">
          <span class="tool-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="6" width="28" height="18" rx="3" stroke="currentColor" stroke-width="2.5"/>
              <line x1="16" y1="6" x2="16" y2="24" stroke="currentColor" stroke-width="2"/>
              <line x1="24" y1="6" x2="24" y2="24" stroke="currentColor" stroke-width="2"/>
              <line x1="32" y1="6" x2="32" y2="24" stroke="currentColor" stroke-width="2"/>
              <line x1="10" y1="11" x2="38" y2="11" stroke="currentColor" stroke-width="1.4" opacity="0.6"/>
              <line x1="10" y1="15" x2="38" y2="15" stroke="currentColor" stroke-width="1.4" opacity="0.6"/>
              <line x1="10" y1="19" x2="38" y2="19" stroke="currentColor" stroke-width="1.4" opacity="0.6"/>
              <circle cx="20" cy="15" r="2.6" fill="currentColor"/>
              <circle cx="28" cy="19" r="2.6" fill="currentColor"/>
              <path d="M14 30c4 8 16 8 20 0" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </span>
          <h3>Chords</h3>
          <p>Clear diagrams for 7 major and 7 minor open chords, with finger positions.</p>
          <span class="tool-link">Open Chords <span aria-hidden="true">→</span></span>
        </a>

        <a href="<?php echo BASE_URL; ?>/pages/scales.php" class="tool-card card">
          <span class="tool-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="14" x2="42" y2="14" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="34" x2="42" y2="34" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="14" r="3" fill="currentColor"/>
              <circle cx="20" cy="24" r="3" fill="currentColor"/>
              <circle cx="28" cy="14" r="3" fill="currentColor"/>
              <circle cx="36" cy="34" r="3" fill="currentColor"/>
              <circle cx="16" cy="34" r="3" fill="currentColor" opacity="0.4"/>
            </svg>
          </span>
          <h3>Scales</h3>
          <p>Learn the Chromatic and Major scales with simple fretboard patterns.</p>
          <span class="tool-link">Open Scales <span aria-hidden="true">→</span></span>
        </a>

        <a href="<?php echo BASE_URL; ?>/pages/metronome.php" class="tool-card card">
          <span class="tool-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 40h14l-3-28h-8z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
              <line x1="24" y1="16" x2="30" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="24" cy="14" r="2.5" fill="currentColor"/>
              <line x1="14" y1="40" x2="34" y2="40" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </span>
          <h3>Metronome</h3>
          <p>Keep steady time with an adjustable click, tap tempo, and accent beat.</p>
          <span class="tool-link">Open Metronome <span aria-hidden="true">→</span></span>
        </a>

        <a href="<?php echo BASE_URL; ?>/pages/fretboard-game.php" class="tool-card card">
          <span class="tool-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2.5"/>
              <circle cx="24" cy="24" r="9" stroke="currentColor" stroke-width="2.5"/>
              <circle cx="24" cy="24" r="2.6" fill="currentColor"/>
            </svg>
          </span>
          <h3>Fretboard Game</h3>
          <p>Test how well you know the notes on the neck with a quick memory game.</p>
          <span class="tool-link">Play the Game <span aria-hidden="true">→</span></span>
        </a>

      </div>
    </div>
  </section>

  <!-- 6. PRACTICE TIPS -->
  <section class="section reveal" style="background-color: var(--color-bg-alt);">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Practice Tips</span>
        <h2>How to practice effectively</h2>
        <p>A few habits that make a big difference for beginners.</p>
      </div>

      <div class="tips-grid">
        <div class="tip-card card">
          <span class="tip-icon" aria-hidden="true">🐢</span>
          <div>
            <h4>Go slow on purpose</h4>
            <p>Playing slowly and correctly builds muscle memory faster than rushing.</p>
          </div>
        </div>
        <div class="tip-card card">
          <span class="tip-icon" aria-hidden="true">⏳</span>
          <div>
            <h4>Practice a little, often</h4>
            <p>15 focused minutes a day beats one long session a week.</p>
          </div>
        </div>
        <div class="tip-card card">
          <span class="tip-icon" aria-hidden="true">👂</span>
          <div>
            <h4>Listen to every note</h4>
            <p>After placing your fingers, strum slowly and check each string rings clearly.</p>
          </div>
        </div>
        <div class="tip-card card">
          <span class="tip-icon" aria-hidden="true">🔁</span>
          <div>
            <h4>Repeat the hard parts</h4>
            <p>If a chord change feels awkward, that's exactly what needs more repetition.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. CTA -->
  <section class="section reveal">
    <div class="container">
      <div class="cta-banner">
        <h2>Ready to start practicing?</h2>
        <p>Pick up your guitar, open the Chords page, and learn your first shape today.</p>
        <a href="<?php echo BASE_URL; ?>/pages/chords.php" class="btn btn-primary">Start with Chords</a>
      </div>
    </div>
  </section>

  <!-- 8. INSTRUCTOR / CONTACT -->
  <section class="section reveal" style="background-color: var(--color-bg-alt);">
    <div class="container">
      <div class="instructor-section">
        <div class="instructor-avatar" aria-hidden="true">🎸</div>
        <div>
          <h2 class="instructor-name">Promise Chaudhary</h2>
          <p class="instructor-role">Guitarist &amp; Guitar Instructor</p>
          <p class="instructor-location">📍 Lamahi, Deukhuri, Nepal</p>
        </div>
        <p class="instructor-note">
          This site is free to use for practice. If you'd like more personal
          guidance, one-to-one lessons are also available.
        </p>
        <div class="instructor-actions">
          <a href="https://wa.me/9779822899750" target="_blank" rel="noopener" class="btn btn-primary">
            Message on WhatsApp
          </a>
          <a href="tel:9822899750" class="btn btn-outline">Call 9822899750</a>
        </div>
      </div>
    </div>
  </section>

</main>

<?php include __DIR__ . '/includes/footer.php'; ?>

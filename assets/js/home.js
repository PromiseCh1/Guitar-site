/**
 * home.js
 * Home-page-specific interactions:
 *   - Smooth-scroll to tools section
 *   - Animated random practice tips (fade in/out, 25 tips)
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------
  // 1. Smooth-scroll to tools
  // -------------------------------------------------------------
  var exploreBtn = document.getElementById('exploreToolsBtn');
  var toolsSection = document.getElementById('tools');

  if (exploreBtn && toolsSection) {
    exploreBtn.addEventListener('click', function () {
      toolsSection.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  }

  // -------------------------------------------------------------
  // 2. Animated random practice tips
  // -------------------------------------------------------------
  var TIPS = [
    "Play slowly enough that you never make a mistake.",
    "Keep your thumb behind the neck, not wrapped over.",
    "Press just behind the fret, not on top of it.",
    "Let your fingertips curl so they don't touch other strings.",
    "Practice chord changes without strumming at first.",
    "Count out loud while you play.",
    "If your hand hurts, take a break. Tension is the enemy.",
    "Record yourself once a week and listen back.",
    "Learn a song you actually like — it keeps you motivated.",
    "Warm up with finger stretches before you play.",
    "Use a metronome even when you think you don't need one.",
    "Change one chord at a time when you're learning a new song.",
    "Play the same thing in different positions on the neck.",
    "Don't ignore your pinky — it needs practice too.",
    "Tune your guitar every single time you pick it up.",
    "Practice standing up sometimes. It changes everything.",
    "Close your eyes and feel where your fingers land.",
    "Learn the notes on the low E string first.",
    "Strum from your wrist, not your elbow.",
    "If a chord buzzes, press closer to the fret.",
    "Practice the transition, not just the chord.",
    "Play quietly sometimes — it reveals sloppy technique.",
    "Don't compare your week one to someone's year five.",
    "Fifteen focused minutes beats an hour of distracted playing.",
    "End every practice session with something that sounds good."
  ];

  var tipEl = document.getElementById('randomTip');

  if (!tipEl) {
    return;
  }

  var currentIndex = -1;

  function showRandomTip() {
    var newIndex;
    do {
      newIndex = Math.floor(Math.random() * TIPS.length);
    } while (newIndex === currentIndex && TIPS.length > 1);

    currentIndex = newIndex;

    if (prefersReducedMotion) {
      tipEl.textContent = TIPS[currentIndex];
      window.setTimeout(showRandomTip, 5000);
      return;
    }

    // Fade out current tip
    tipEl.classList.add('tip-fade-out');

    window.setTimeout(function () {
      tipEl.textContent = TIPS[currentIndex];
      tipEl.classList.remove('tip-fade-out');
      tipEl.classList.add('tip-fade-in');

      window.setTimeout(function () {
        tipEl.classList.remove('tip-fade-in');
      }, 550);

      window.setTimeout(showRandomTip, 4500);
    }, 550);
  }

  showRandomTip();
})();
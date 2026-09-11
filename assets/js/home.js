/**
 * home.js
 * Home-page-specific interactions only.
 * Shared navbar behavior lives in nav.js, shared scroll-reveal
 * behavior lives in reveal.js.
 */
(function () {
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth-scroll to the tools section when the hero's
  // "See the tools" button is clicked.
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
})();

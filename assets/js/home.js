/**
 * home.js
 * Home-page-specific interactions only.
 * Shared navbar behavior lives in nav.js.
 */
(function () {
  // Smooth-scroll to the tools section when the hero's
  // "See the tools" button is clicked.
  var exploreBtn = document.getElementById('exploreToolsBtn');
  var toolsSection = document.getElementById('tools');

  if (exploreBtn && toolsSection) {
    exploreBtn.addEventListener('click', function () {
      toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();

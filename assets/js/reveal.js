/**
 * reveal.js
 * Shared "fade/slide in on scroll" behavior for any page that uses
 * the .reveal utility class (see global.css). Not page-specific,
 * so it lives alongside nav.js and is loaded on every page.
 *
 * Respects prefers-reduced-motion: if the user has that setting on,
 * elements are just shown immediately (global.css already handles
 * the visual side of this; here we skip the observer entirely).
 */
(function () {
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) {
    return;
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Nothing to animate — just mark everything visible.
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();

/**
 * nav.js
 * Shared mobile navigation toggle logic.
 * Loaded on every page (not page-specific), since the navbar
 * is a shared component used across the whole site.
 */
(function () {
  var toggleBtn = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  if (!toggleBtn || !menu) {
    return;
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    menu.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close menu');
  }

  toggleBtn.addEventListener('click', function () {
    var isOpen = menu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu when a link inside it is clicked (mobile UX).
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close the menu if the viewport is resized past the mobile breakpoint.
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 860) {
      closeMenu();
    }
  });
})();

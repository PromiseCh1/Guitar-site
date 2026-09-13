/**
 * nav.js
 * Shared mobile navigation toggle + transparent navbar scroll effect.
 * Loaded on every page (the navbar is a shared component).
 *
 * Handles:
 *   - Toggle button (open / close)
 *   - Link clicks inside the menu (auto-close)
 *   - Escape key (auto-close)
 *   - Resize past the mobile breakpoint (auto-close)
 *   - Outside click (auto-close)
 *   - Body scroll lock while the menu is open
 *   - .is-scrolled class on the header when the user scrolls past
 *     ~20px, so the transparent bar gains a dark background.
 */
(function () {
  'use strict';

  var toggleBtn = document.getElementById('navToggle');
  var menu      = document.getElementById('navMenu');

  if (!toggleBtn || !menu) {
    return;
  }

  var isOpen = false;

  // ---------------------------------------------------------------
  // Transparent navbar → solid on scroll
  // ---------------------------------------------------------------
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    var applyScrolled = function () {
      if (window.scrollY > 20) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };
    applyScrolled();
    window.addEventListener('scroll', applyScrolled, { passive: true });
  }

  // ---------------------------------------------------------------
  // Mobile menu open / close
  // ---------------------------------------------------------------
  function openMenu() {
    isOpen = true;
    menu.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // --- Toggle button ---
  // A single 'click' listener covers mouse + touch on modern browsers.
  // preventDefault + stopPropagation guard against any parent handler.
  toggleBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  // --- Close when a link inside the menu is clicked ---
  // Event delegation so it works even if links are replaced later.
  menu.addEventListener('click', function (e) {
    var target = e.target;
    while (target && target !== menu) {
      if (target.tagName === 'A') {
        closeMenu();
        return;
      }
      target = target.parentNode;
    }
  });

  // --- Close on Escape key ---
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && isOpen) {
      closeMenu();
    }
  });

  // --- Close on resize past the mobile breakpoint ---
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (window.innerWidth >= 860 && isOpen) {
        closeMenu();
      }
    }, 100);
  });

  // --- Close on outside click (only when the menu is open) ---
  document.addEventListener('click', function (e) {
    if (!isOpen) { return; }
    if (menu.contains(e.target) || toggleBtn.contains(e.target)) { return; }
    closeMenu();
  });
})();
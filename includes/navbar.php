<?php
/**
 * navbar.php
 * Responsive site navigation, included on every page.
 * Expects (optional):
 *   $currentPage - string identifier of the active page.
 *                  One of: 'home', 'chords', 'scales', 'metronome', 'game'
 */

if (!isset($currentPage)) {
    $currentPage = '';
}

/**
 * Small helper to print "active" class + aria-current
 * only on the link matching the current page.
 */
function nav_active_attrs($linkId, $currentPage) {
    if ($linkId === $currentPage) {
        echo ' class="active" aria-current="page"';
    }
}
?>
<header class="site-header">
  <div class="container navbar">
    <a href="/index.php" class="navbar-brand">
      <span class="brand-icon" aria-hidden="true">🎸</span>
      <span>
        Promise Guitar
        <span class="brand-sub">Learn to Play</span>
      </span>
    </a>

    <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <nav class="nav-menu" id="navMenu" aria-label="Main navigation">
      <a href="/index.php" <?php nav_active_attrs('home', $currentPage); ?>>Home</a>
      <a href="/pages/chords.php" <?php nav_active_attrs('chords', $currentPage); ?>>Chords</a>
      <a href="/pages/scales.php" <?php nav_active_attrs('scales', $currentPage); ?>>Scales</a>
      <a href="/pages/metronome.php" <?php nav_active_attrs('metronome', $currentPage); ?>>Metronome</a>
      <a href="/pages/fretboard-game.php" <?php nav_active_attrs('game', $currentPage); ?>>Fretboard Game</a>
    </nav>
  </div>
</header>

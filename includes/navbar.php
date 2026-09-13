<?php
/**
 * navbar.php
 * Responsive site navigation, included on every page.
 * Expects (optional):
 *   $currentPage - 'home' | 'chords' | 'scales' | 'metronome' | 'game' | 'support'
 */

require_once __DIR__ . '/logo.php';

if (!isset($currentPage)) {
    $currentPage = '';
}

function nav_active_attrs($linkId, $currentPage) {
    if ($linkId === $currentPage) {
        echo ' class="active" aria-current="page"';
    }
}
?>
<header class="site-header">
  <div class="container navbar">
    <a href="<?php echo BASE_URL; ?>/index.php" class="navbar-brand" aria-label="Guitar with Promise — home">
      <span class="brand-mark"><?php render_logo_mark(30); ?></span>
      <span class="brand-text">
        <span class="brand-name">Guitar with Promise</span>
        <span class="brand-sub">Learn. Practice. Play.</span>
      </span>
    </a>

    <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <nav class="nav-menu" id="navMenu" aria-label="Main navigation">
      <a href="<?php echo BASE_URL; ?>/index.php" <?php nav_active_attrs('home', $currentPage); ?>>Home</a>
      <a href="<?php echo BASE_URL; ?>/pages/chords.php" <?php nav_active_attrs('chords', $currentPage); ?>>Chords</a>
      <a href="<?php echo BASE_URL; ?>/pages/scales.php" <?php nav_active_attrs('scales', $currentPage); ?>>Scales</a>
      <a href="<?php echo BASE_URL; ?>/pages/metronome.php" <?php nav_active_attrs('metronome', $currentPage); ?>>Metronome</a>
      <a href="<?php echo BASE_URL; ?>/pages/fretboard-game.php" <?php nav_active_attrs('game', $currentPage); ?>>Fretboard Game</a>
      <a href="<?php echo BASE_URL; ?>/pages/support.php" <?php nav_active_attrs('support', $currentPage); ?>>Support Me</a>
    </nav>
  </div>
</header>
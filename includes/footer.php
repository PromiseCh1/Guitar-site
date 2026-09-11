<?php
/**
 * footer.php
 * Site footer + closing tags, included on every page.
 * Expects (optional):
 *   $pageJs - string, filename of the page-specific JS file in /assets/js/
 *             (e.g. 'home.js'). The navbar toggle logic lives in each
 *             page's JS file so it's always loaded.
 */
if (!isset($pageJs)) {
    $pageJs = 'home.js';
}
?>
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <div class="footer-brand">🎸 Promise Guitar</div>
      <p class="footer-tagline">A free space to learn guitar at your own pace.</p>
    </div>

    <nav class="footer-nav" aria-label="Footer navigation">
      <a href="<?php echo BASE_URL; ?>/index.php">Home</a>
      <a href="<?php echo BASE_URL; ?>/pages/chords.php">Chords</a>
      <a href="<?php echo BASE_URL; ?>/pages/scales.php">Scales</a>
      <a href="<?php echo BASE_URL; ?>/pages/metronome.php">Metronome</a>
      <a href="<?php echo BASE_URL; ?>/pages/fretboard-game.php">Fretboard Game</a>
    </nav>

    <div class="footer-contact">
      <span>Made by <strong>Promise Chaudhary</strong></span>
      <span>Guitarist &amp; Guitar Instructor</span>
      <a href="https://wa.me/9779822899750" target="_blank" rel="noopener">WhatsApp: 9822899750</a>
      <span>Lamahi, Deukhuri, Nepal</span>
    </div>
  </div>

  <div class="footer-bottom">
    &copy; <?php echo date('Y'); ?> Promise Guitar Learning. Made by Promise Chaudhary.
  </div>
</footer>

<script src="<?php echo BASE_URL; ?>/assets/js/nav.js"></script>
<script src="<?php echo BASE_URL; ?>/assets/js/reveal.js"></script>
<script src="<?php echo BASE_URL; ?>/assets/js/<?php echo htmlspecialchars($pageJs, ENT_QUOTES, 'UTF-8'); ?>"></script>
</body>
</html>

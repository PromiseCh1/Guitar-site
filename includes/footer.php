<?php
/**
 * footer.php
 * Simplified site footer. No footer-top columns.
 * Expects (optional): $pageJs - filename in /assets/js/.
 */

if (!isset($pageJs)) {
    $pageJs = 'home.js';
}
?>
<footer class="site-footer">
  <div class="container">
    <div class="footer-bottom">
      <p>&copy; <?php echo date('Y'); ?>  Made with ❤️ by Mr.Promise</p>
       
      </p>
    </div>
  </div>
</footer>

<script src="<?php echo BASE_URL; ?>/assets/js/nav.js"></script>
<script src="<?php echo BASE_URL; ?>/assets/js/reveal.js"></script>
<script src="<?php echo BASE_URL; ?>/assets/js/<?php echo htmlspecialchars($pageJs, ENT_QUOTES, 'UTF-8'); ?>"></script>
</body>
</html>
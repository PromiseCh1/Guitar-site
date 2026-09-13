<?php
/**
 * logo.php
 * Reusable SVG logo mark (guitar pick + string).
 * Uses currentColor so the mark inherits text color.
 */
if (!function_exists('render_logo_mark')) {
    function render_logo_mark($size = 28) {
        $size = (int) $size;
        ?>
        <svg class="logo-mark" width="<?php echo $size; ?>" height="<?php echo $size; ?>"
             viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
             aria-hidden="true" focusable="false">
          <path d="M16 3.2c-6.9 0-12 4.1-12 9.6 0 7 8.5 14.3 11.1 15.9.6.35 1.2.35 1.8 0C19.5 27.1 28 19.8 28 12.8 28 7.3 22.9 3.2 16 3.2Z"
                stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
          <line x1="16" y1="6.8" x2="16" y2="25.2" stroke="currentColor" stroke-width="1.2" opacity="0.55"/>
          <line x1="11.8" y1="8.4" x2="11.8" y2="23.6" stroke="currentColor" stroke-width="1" opacity="0.35"/>
          <line x1="20.2" y1="8.4" x2="20.2" y2="23.6" stroke="currentColor" stroke-width="1" opacity="0.35"/>
          <circle cx="16" cy="14" r="2.6" fill="currentColor"/>
        </svg>
        <?php
    }
}
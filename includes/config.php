<?php
/**
 * config.php
 * Works out the site's base URL automatically so that every asset
 * and internal link works whether the project lives at the web
 * server root (e.g. InfinityFree: http://yoursite.com/) or inside
 * a subfolder during local development
 * (e.g. XAMPP: http://localhost/Guitar-site/).
 *
 * Every page should include this (via header.php) before outputting
 * any HTML, then use the BASE_URL constant for all asset/page links:
 *
 *   <link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/global.css">
 *   <a href="<?php echo BASE_URL; ?>/pages/chords.php">Chords</a>
 *
 * Do not hardcode "/assets/..." or "/pages/..." anywhere else.
 */

if (!defined('BASE_URL')) {

    // Filesystem path of the project root (one level above /includes).
    $projectRoot = str_replace('\\', '/', dirname(__DIR__));

    // Filesystem path of the web server's document root.
    $docRoot = isset($_SERVER['DOCUMENT_ROOT'])
        ? rtrim(str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']), '/')
        : '';

    $baseUrl = '';

    if ($docRoot !== '' && strpos($projectRoot, $docRoot) === 0) {
        // Project lives inside a subfolder of the document root
        // (e.g. htdocs/Guitar-site) -> "/Guitar-site".
        // Project lives AT the document root (e.g. InfinityFree htdocs)
        // -> "" (empty string), which is exactly what we want.
        $baseUrl = substr($projectRoot, strlen($docRoot));
    }

    // Normalize: no trailing slash, always starts with "/" or is "".
    $baseUrl = rtrim($baseUrl, '/');

    define('BASE_URL', $baseUrl);
}

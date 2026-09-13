<?php

/**
 * header.php
 * Outputs the <head> section with SEO metadata, favicon, canonical URL,
 * Open Graph, Twitter cards, and JSON-LD structured data.
 *
 * Expects (optional) variables set by the including page:
 *   $pageTitle       - string, page-specific title
 *   $pageDescription - string, meta description
 *   $extraCss        - string, stylesheet filename in /assets/css/
 *   $canonicalUrl    - string, full canonical URL (auto-derived if omitted)
 *   $ogImage         - string, absolute URL to the OG image (auto if omitted)
 *   $pageRobots      - string, robots directive (default: index,follow)
 */

require_once __DIR__ . '/config.php';

/* ---------- Production domain ---------- */
if (!defined('SITE_PROTOCOL')) define('SITE_PROTOCOL', 'https');
if (!defined('SITE_DOMAIN'))   define('SITE_DOMAIN', 'guitar.promise.com.np');
if (!defined('SITE_BASE_URL')) define('SITE_BASE_URL', SITE_PROTOCOL . '://' . SITE_DOMAIN);

/* ---------- Defaults ---------- */
if (!isset($pageTitle) || $pageTitle === '') {
    $pageTitle = 'Guitar with Promise — Free Beginner Guitar Lessons & Practice Tools';
}

if (!isset($pageDescription) || $pageDescription === '') {
    $pageDescription = 'Learn guitar from the beginning with free beginner-friendly lessons, chord diagrams, scales, a metronome, and an interactive fretboard game.';
}

if (!isset($pageRobots)) {
    $pageRobots = 'index,follow';
}

/* ---------- Canonical URL ----------
   Always points at the production domain, even when browsing locally
   (e.g. http://localhost/Guitar-site/pages/chords.php). We strip the
   local subfolder (BASE_URL) from the path so the canonical matches
   the live site's URL structure. */
if (!isset($canonicalUrl) || $canonicalUrl === '') {
    $currentPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

    if ($currentPath !== '/') {
        $currentPath = rtrim($currentPath, '/');
    }

    // Strip local subfolder prefix (BASE_URL) if present
    if (BASE_URL !== '' && strpos($currentPath, BASE_URL) === 0) {
        $currentPath = substr($currentPath, strlen(BASE_URL));
        if ($currentPath === '' || $currentPath[0] !== '/') {
            $currentPath = '/' . $currentPath;
        }
    }

    // If we're on the homepage (no .php filename), canonical is the root.
    if (substr($currentPath, -4) !== '.php') {
        $currentPath = '/';
    }

    $canonicalUrl = SITE_BASE_URL . $currentPath;
}

/* ---------- OG image ---------- */
if (!isset($ogImage) || $ogImage === '') {
    $ogImage = SITE_BASE_URL . '/assets/images/general/og-image.jpg';
}

/* ---------- Homepage detection (for JSON-LD) ---------- */
$isHomePage = (basename($_SERVER['SCRIPT_NAME'] ?? '') === 'index.php');

/* ---------- Escape helper ---------- */
function h($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary -->
    <title><?php echo h($pageTitle); ?></title>
    <meta name="description" content="<?php echo h($pageDescription); ?>">
    <meta name="robots" content="<?php echo h($pageRobots); ?>">

    <!-- Canonical -->
    <link rel="canonical" href="<?php echo h($canonicalUrl); ?>">

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="96x96" href="<?php echo BASE_URL; ?>/assets/images/logo/favicon-96x96.png">
    <link rel="icon" type="image/svg+xml" href="<?php echo BASE_URL; ?>/assets/images/logo/favicon.svg">
    <link rel="shortcut icon" href="<?php echo BASE_URL; ?>/assets/images/logo/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo BASE_URL; ?>/assets/images/logo/apple-touch-icon.png">
    <link rel="manifest" href="<?php echo BASE_URL; ?>/assets/images/logo/site.webmanifest">
    <meta name="theme-color" content="#0a0a0a">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Guitar with Promise">
    <meta property="og:title" content="<?php echo h($pageTitle); ?>">
    <meta property="og:description" content="<?php echo h($pageDescription); ?>">
    <meta property="og:url" content="<?php echo h($canonicalUrl); ?>">
    <meta property="og:image" content="<?php echo h($ogImage); ?>">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo h($pageTitle); ?>">
    <meta name="twitter:description" content="<?php echo h($pageDescription); ?>">
    <meta name="twitter:image" content="<?php echo h($ogImage); ?>">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/global.css">
    <?php if (!empty($extraCss)): ?>
        <link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/<?php echo h($extraCss); ?>">
    <?php endif; ?>

    <?php if ($isHomePage): ?>
        <!-- Structured data: WebSite + Person -->
        <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Guitar with Promise",
                "url": "https://guitar.promise.com.np/",
                "description": "Free beginner guitar lessons and interactive practice tools.",
                "inLanguage": "en",
                "publisher": {
                    "@type": "Person",
                    "name": "Promise Chaudhary",
                    "jobTitle": "Guitarist & Guitar Instructor",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Lamahi",
                        "addressRegion": "Deukhuri",
                        "addressCountry": "NP"
                    }
                }
            }
        </script>
    <?php endif; ?>
</head>

<body>
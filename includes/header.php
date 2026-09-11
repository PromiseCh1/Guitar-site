<?php
/**
 * header.php
 * Outputs the <head> section for every page.
 * Expects (optional) variables set by the including page:
 *   $pageTitle       - string, page-specific title
 *   $pageDescription - string, meta description
 *   $extraCss        - string, path to a page-specific stylesheet (relative to /assets/css/)
 */

require_once __DIR__ . '/config.php';

if (!isset($pageTitle)) {
    $pageTitle = 'Promise Guitar Learning';
}
if (!isset($pageDescription)) {
    $pageDescription = 'Free interactive guitar lessons for beginners: chords, scales, metronome and a fretboard memorization game.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
<meta name="description" content="<?php echo htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8'); ?>">
<link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/global.css">
<?php if (!empty($extraCss)): ?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/<?php echo htmlspecialchars($extraCss, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
</head>
<body>

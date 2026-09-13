<?php
/**
 * pages/support.php
 * Support Me — simple page to support the project via eSewa QR.
 * No JavaScript required.
 */

$pageTitle       = 'Support Guitar with Promise';
$pageDescription = 'Support Guitar with Promise and help keep free guitar learning and practice tools available for everyone.';
$extraCss        = 'support.css';
$currentPage     = 'support';

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main id="main-content">

  <!-- INTRO -->
  <section class="support-intro reveal">
    <div class="container">
      <h1>Support Me</h1>
      <p class="support-lead">
        This website is free and always will be. If it's helped your
        playing, you're welcome to support the project — but there's
        absolutely no pressure. Just keep practicing.
      </p>
    </div>
  </section>

  <!-- SUPPORT CARD -->
  <section class="support-section reveal">
    <div class="container">
      <div class="support-card">

        <img
          class="support-qr-img"
          src="<?php echo BASE_URL; ?>/assets/images/general/support-me.jpeg"
          alt="eSewa QR code for supporting Guitar with Promise"
          width="320"
          height="320"
        >

        <dl class="support-details">
          <div class="support-detail">
            <dt>Wallet</dt>
            <dd>eSewa</dd>
          </div>
          <div class="support-detail">
            <dt>Name</dt>
            <dd>Promise Chaudhary</dd>
          </div>
          <div class="support-detail">
            <dt>eSewa Number</dt>
            <dd>9822899750</dd>
          </div>
        </dl>

        <p class="support-momo">
          Buy Me a Momo <span aria-hidden="true">🥟</span>
        </p>

        <p class="support-note">
          Even a small contribution helps me keep improving this website
          and building more useful guitar tools.
        </p>

        <p class="support-thanks">
          <strong>Thank you ❤️</strong><br>
          Thanks for supporting the project and helping keep these
          guitar resources free.
        </p>
      </div>
    </div>
  </section>

  <!-- BACK HOME -->
  <section class="support-back reveal">
    <div class="container">
      <a href="<?php echo BASE_URL; ?>/index.php" class="btn btn-outline">
        ← Back to home
      </a>
    </div>
  </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
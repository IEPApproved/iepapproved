import Head from 'next/head'
import styles from '../styles/Legal.module.css'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — IEP Approved</title>
        <meta name="description" content="Terms of Service for IEP Approved" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <nav className={styles.nav}>
        <a href="/" className={styles.navLogo}>IEP <span>Approved</span></a>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </nav>

      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <span className={styles.label}>Legal</span>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.date}>Effective Date: June 1, 2026 | Last Updated: June 1, 2026</p>
          </div>

          <div className={styles.content}>

            <p className={styles.intro}>Please read these Terms of Service carefully before using IEP Approved. By accessing or using our platform, you agree to be bound by these terms.</p>

            <h2>1. About IEP Approved</h2>
            <p>IEP Approved ("we," "us," or "our") is an educational platform that provides information, resources, and AI-assisted guidance to parents, educators, and healthcare professionals navigating the special education system. IEP Approved is owned and operated by IEP Approved LLC, a Florida limited liability company.</p>

            <h2>2. What We Provide</h2>
            <p>IEP Approved provides:</p>
            <ul>
              <li>AI-assisted legal information through our guide "Ada"</li>
              <li>Downloadable educational resources and templates</li>
              <li>Community connection features</li>
              <li>Educational content about federal and state special education laws</li>
            </ul>
            <p><strong>IEP Approved provides legal information, not legal advice.</strong> The content on this platform is for educational purposes only and does not constitute an attorney-client relationship. For advice specific to your situation, please consult a qualified special education attorney.</p>

            <h2>3. User Accounts</h2>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activity under your account</li>
            </ul>

            <h2>4. Subscription Plans and Payments</h2>
            <p>IEP Approved offers free and paid subscription tiers. By subscribing to a paid plan, you agree to:</p>
            <ul>
              <li>Pay the applicable subscription fees as described at checkout</li>
              <li>Allow automatic renewal unless cancelled before the renewal date</li>
              <li>Our refund policy: subscriptions may be cancelled at any time; no partial refunds are issued for unused portions of a billing period</li>
            </ul>
            <p>All payments are processed securely through Stripe. IEP Approved does not store your payment card information.</p>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the platform for any unlawful purpose</li>
              <li>Share your account credentials with others</li>
              <li>Reproduce, distribute, or sell our downloadable resources without permission</li>
              <li>Use Ada or our content to provide legal advice to others</li>
              <li>Attempt to reverse-engineer or scrape our platform</li>
              <li>Post harmful, harassing, or inappropriate content in community features</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>All content on IEP Approved — including the Know Me Method, Ada's responses, downloadable resources, text, graphics, and the IEP Approved brand — is the intellectual property of IEP Approved LLC. You may use downloaded resources for personal, non-commercial advocacy purposes only.</p>

            <h2>7. Ada — AI-Assisted Information</h2>
            <p>Ada is an AI guide powered by Claude (Anthropic). Ada provides general legal information based on federal law. You acknowledge that:</p>
            <ul>
              <li>Ada's responses are informational only and not legal advice</li>
              <li>Ada may make errors or omissions</li>
              <li>Laws change — always verify current law with an attorney</li>
              <li>Ada does not create an attorney-client relationship</li>
              <li>IEP Approved is not liable for outcomes based on Ada's responses</li>
            </ul>

            <h2>8. Community Features</h2>
            <p>IEP Pro and Advocate+ members have access to community features. By participating, you agree to treat all community members with respect. We reserve the right to remove content or suspend accounts that violate community standards.</p>

            <h2>9. Privacy</h2>
            <p>Your use of IEP Approved is also governed by our <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

            <h2>10. Disclaimers</h2>
            <p>IEP Approved is provided "as is" without warranties of any kind. We do not guarantee that our platform will be error-free, uninterrupted, or that any particular outcome will result from use of our resources or Ada's guidance.</p>

            <h2>11. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, IEP Approved LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>

            <h2>12. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of Florida. Any disputes shall be resolved in the courts of Florida.</p>

            <h2>13. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. We will notify registered users of material changes by email. Continued use of the platform after changes constitutes acceptance of the updated Terms.</p>

            <h2>14. Contact</h2>
            <p>Questions about these Terms? Contact us at <a href="mailto:info@iepapproved.com">info@iepapproved.com</a></p>

          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2026 IEP Approved LLC. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/disclaimer">Disclaimer</a>
          <a href="/contact">Contact Us</a>
        </div>
      </footer>
    </>
  )
}

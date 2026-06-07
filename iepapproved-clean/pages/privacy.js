import Head from 'next/head'
import styles from '../styles/Legal.module.css'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — IEP Approved</title>
        <meta name="description" content="Privacy Policy for IEP Approved" />
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
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.date}>Effective Date: June 1, 2026 | Last Updated: June 1, 2026</p>
          </div>

          <div className={styles.content}>

            <p className={styles.intro}>IEP Approved is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding your data.</p>

            <div className={styles.callout}>
              <strong>Our commitment:</strong> We will never sell your personal information. We will never sell information about your child. Your data exists to serve you — not to generate revenue from advertisers.
            </div>

            <h2>1. Information We Collect</h2>

            <h3>Information you provide directly:</h3>
            <ul>
              <li>Account information: name, email address, password</li>
              <li>Profile information: your role (parent, educator, healthcare professional)</li>
              <li>Child information: first name, age, grade, school district, state, diagnosis category, IEP status</li>
              <li>Payment information: processed securely by Stripe — we do not store card numbers</li>
              <li>Communications: questions asked to Ada, emails sent to us</li>
              <li>Community content: posts and messages in community features</li>
            </ul>

            <h3>Information collected automatically:</h3>
            <ul>
              <li>Usage data: pages visited, features used, time spent</li>
              <li>Device information: browser type, operating system, IP address</li>
              <li>Cookies and similar technologies (see Section 6)</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and personalize the IEP Approved platform</li>
              <li>Connect you with state-appropriate resources and community members</li>
              <li>Process payments and manage your subscription</li>
              <li>Send you law change alerts and platform updates (you can opt out)</li>
              <li>Improve Ada's responses and our educational content</li>
              <li>Respond to your questions and support requests</li>
              <li>Comply with legal obligations</li>
              <li>Understand how our platform is used in aggregate (anonymized data only)</li>
            </ul>

            <h2>3. Information About Children</h2>
            <p>We collect limited information about children solely to personalize your experience — connecting you to relevant state resources, community members with similar diagnoses, and appropriate content. We treat this information with the highest level of protection.</p>
            <ul>
              <li>We collect only: first name, age, grade, state, diagnosis category, IEP status</li>
              <li>We do not collect Social Security numbers, medical records, or educational records</li>
              <li>We do not share child information with third parties except as required by law</li>
              <li>IEP Approved is not directed at children under 13 — accounts must be created by adults</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul>
              <li><strong>Service providers:</strong> Stripe (payments), Supabase (database), Vercel (hosting), Anthropic (AI) — all under strict data protection agreements</li>
              <li><strong>Community features:</strong> Information you choose to share in community spaces is visible to other community members</li>
              <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect safety</li>
              <li><strong>Business transfers:</strong> In the event of a merger or acquisition, your data may transfer to the new entity under the same privacy protections</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul>
              <li>Encryption of data in transit (HTTPS) and at rest</li>
              <li>Secure password hashing</li>
              <li>Access controls limiting who can view your data</li>
              <li>Regular security reviews</li>
            </ul>
            <p>No system is perfectly secure. If we become aware of a breach affecting your data, we will notify you promptly.</p>

            <h2>6. Cookies</h2>
            <p>We use essential cookies to keep you logged in and remember your preferences. We do not use advertising cookies or sell cookie data to third parties. You can disable cookies in your browser settings, though this may affect platform functionality.</p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time</li>
            </ul>
            <p>To exercise these rights, email us at <a href="mailto:info@iepapproved.com">info@iepapproved.com</a></p>

            <h2>8. Data Retention</h2>
            <p>We retain your information for as long as your account is active or as needed to provide services. When you delete your account, we delete your personal data within 30 days, except where retention is required by law.</p>

            <h2>9. Third-Party Links</h2>
            <p>Our platform may link to external resources and websites. We are not responsible for the privacy practices of third-party sites. We encourage you to review their privacy policies.</p>

            <h2>10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email and by posting a notice on our platform. Your continued use constitutes acceptance of the updated policy.</p>

            <h2>11. Contact</h2>
            <p>Privacy questions or requests? Contact us at <a href="mailto:info@iepapproved.com">info@iepapproved.com</a></p>
            <p>IEP Approved LLC<br />Florida, United States</p>

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

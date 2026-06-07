import Head from 'next/head'
import styles from '../styles/Legal.module.css'

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer — IEP Approved</title>
        <meta name="description" content="Legal Disclaimer for IEP Approved" />
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
            <h1 className={styles.title}>Legal Disclaimer</h1>
            <p className={styles.date}>Effective Date: June 1, 2026</p>
          </div>

          <div className={styles.content}>

            <div className={styles.callout}>
              <strong>Plain language summary:</strong> IEP Approved and Ada provide legal information — not legal advice. We are not a law firm. Nothing on this platform creates an attorney-client relationship. For advice specific to your child's situation, please consult a qualified special education attorney.
            </div>

            <h2>Not Legal Advice</h2>
            <p>The content provided on IEP Approved — including all information provided by Ada, all downloadable resources, all articles and guides, and all community content — constitutes general legal <strong>information</strong> only. It does not constitute legal <strong>advice</strong>.</p>
            <p>The distinction matters:</p>
            <ul>
              <li><strong>Legal information</strong> explains what the law says in general terms</li>
              <li><strong>Legal advice</strong> applies the law to your specific facts and circumstances and recommends a course of action</li>
            </ul>
            <p>IEP Approved provides legal information. Only a licensed attorney can provide legal advice.</p>

            <h2>No Attorney-Client Relationship</h2>
            <p>Use of IEP Approved, including conversations with Ada, does not create an attorney-client relationship between you and IEP Approved, its founders, employees, or contractors. No confidentiality protections that apply to attorney-client communications apply to your use of this platform.</p>

            <h2>About Ada</h2>
            <p>Ada is an AI assistant powered by Claude (Anthropic). Ada is designed to provide general information about federal special education law including IDEA, ADA, and Section 504. You acknowledge and agree that:</p>
            <ul>
              <li>Ada may make errors, omissions, or provide outdated information</li>
              <li>Ada's responses are not a substitute for professional legal counsel</li>
              <li>Laws and regulations change — always verify current law independently</li>
              <li>Ada's knowledge of state-specific law may be incomplete or inaccurate</li>
              <li>Outcomes in your specific situation may differ from general legal principles Ada describes</li>
              <li>IEP Approved is not responsible for any action taken or not taken based on Ada's responses</li>
            </ul>

            <h2>Accuracy of Information</h2>
            <p>IEP Approved makes reasonable efforts to ensure the accuracy of information on this platform. However, special education law varies by state, changes frequently, and is interpreted differently by courts and administrative bodies across jurisdictions. We do not warrant that any information on this platform is current, complete, or applicable to your specific situation.</p>

            <h2>Downloadable Resources</h2>
            <p>Letter templates, checklists, guides, and other downloadable resources are provided as starting points only. They should be reviewed and customized to your specific situation. IEP Approved is not responsible for outcomes resulting from the use of these resources. We strongly recommend having any significant correspondence reviewed by a qualified special education attorney or advocate before sending.</p>

            <h2>The Know Me Method</h2>
            <p>The Know Me Method is an advocacy framework developed by Kimberly Sandro based on her personal experience as a special needs parent. It is shared for educational and informational purposes. Results will vary based on individual circumstances, school district policies, and other factors outside our control.</p>

            <h2>Community Content</h2>
            <p>Content posted by community members does not represent the views of IEP Approved and has not been reviewed for legal accuracy. Community members sharing their experiences are not providing legal advice. Always verify information with qualified professionals.</p>

            <h2>When You Need an Attorney</h2>
            <p>We encourage you to consult a qualified special education attorney or advocate when:</p>
            <ul>
              <li>You are considering filing for due process</li>
              <li>Your child's placement has been changed against your wishes</li>
              <li>You believe your child's rights have been seriously violated</li>
              <li>You are navigating a disciplinary matter with potential placement implications</li>
              <li>You are in a dispute that may involve litigation</li>
              <li>Any situation where the stakes are high and the outcome significantly affects your child</li>
            </ul>
            <p>Ada will always tell you when your situation may require an attorney. Please listen when she does.</p>

            <h2>External Links</h2>
            <p>IEP Approved may link to external websites, government resources, and third-party content. We do not control and are not responsible for the accuracy, completeness, or availability of external content.</p>

            <h2>Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, IEP Approved LLC, its founders, employees, and contractors shall not be liable for any damages — direct, indirect, incidental, consequential, or otherwise — arising from your use of this platform or reliance on any information provided herein.</p>

            <h2>Contact</h2>
            <p>Questions about this disclaimer? Contact us at <a href="mailto:info@iepapproved.com">info@iepapproved.com</a></p>

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

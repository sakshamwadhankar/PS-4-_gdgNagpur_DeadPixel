import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>⚡</span>
              <span className={styles.logoText}>
                Civic<span className={styles.logoAccent}>Pulse</span>
              </span>
            </div>
            <p className={styles.tagline}>
              Empowering citizens with data-driven civic engagement. 
              Your voice shapes your community.
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Platform</h4>
            <Link href="/page/issues" className={styles.link}>Report Issues</Link>
            <Link href="/page/tenders" className={styles.link}>Browse Tenders</Link>
            <Link href="/page/dashboard" className={styles.link}>Priority Dashboard</Link>
            <Link href="/page/auth" className={styles.link}>Get Verified</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Resources</h4>
            <span className={styles.link}>How It Works</span>
            <span className={styles.link}>API Documentation</span>
            <span className={styles.link}>Privacy Policy</span>
            <span className={styles.link}>Terms of Service</span>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Community</h4>
            <span className={styles.link}>Twitter / X</span>
            <span className={styles.link}>GitHub</span>
            <span className={styles.link}>Discord</span>
            <span className={styles.link}>Contact Us</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2025 CivicPulse. Built for GDG Nagpur Hackathon by Team DeadPixel.</p>
          <p className={styles.madeWith}>
            Made with 💚 for transparent governance
          </p>
        </div>
      </div>
    </footer>
  );
}

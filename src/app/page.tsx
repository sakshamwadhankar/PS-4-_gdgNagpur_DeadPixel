import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>CivicHub</Link>
            <div className={styles.navLinks}>
              <Link href="/dashboard" className="btn btn-outline">Dashboard</Link>
              <Link href="/report" className="btn btn-primary">Report Issue</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1>Empowering Local Communities.</h1>
            <p className={styles.heroSubtitle}>
              A GEOFENCED, AI-DRIVEN PLATFORM FOR CONSTITUENCY PLANNERS AND CITIZENS.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="/report" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.2rem' }}>
                Report an Issue
              </Link>
              <Link href="/dashboard" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.2rem' }}>
                View Dashboard
              </Link>
            </div>
          </div>
          
          <div className={`${styles.heroImage} brutal-panel`}>
            <div className={styles.mockupHeader}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <div className={styles.mockupBody}>
              <div className={styles.mockLine}></div>
              <div className={styles.mockLine} style={{ width: '80%' }}></div>
              <div className={styles.mockLine} style={{ width: '60%' }}></div>
              
              <div className={styles.mockupCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid var(--surface-border)', paddingBottom: '10px', marginBottom: '10px' }}>
                  <strong>Pothole on Main St.</strong>
                  <span style={{ background: 'var(--accent-orange)', padding: '2px 8px', border: '3px solid var(--surface-border)', fontWeight: '900', color: 'var(--bg-color)' }}>Score: 85</span>
                </div>
                <div style={{ fontWeight: '900', fontSize: '1.1rem' }}>
                  STATUS: <span style={{ background: 'var(--accent-teal)', padding: '2px 8px', border: '3px solid var(--surface-border)', color: 'var(--bg-color)' }}>FUNDED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={`${styles.featureCard} brutal-panel`}>
            <h3>Geofenced</h3>
            <p>ISSUES ARE REPORTED BY VERIFIED LOCAL RESIDENTS ONLY.</p>
          </div>
          <div className={`${styles.featureCard} brutal-panel`}>
            <h3>AI Sorted</h3>
            <p>SMART MERGING OF DUPLICATE REPORTS USING GEMINI AI.</p>
          </div>
          <div className={`${styles.featureCard} brutal-panel`}>
            <h3>Priority</h3>
            <p>ALGORITHMS RANK ISSUES BY SEVERITY AND UPVOTES.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

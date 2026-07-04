import Link from "next/link";
import styles from "./page.module.css";

// Mock data based on TRD specifications
const mockIssues = [
  {
    id: "ISS-1029",
    title: "Major Pothole on Main St.",
    status: "In Progress",
    category: "Infrastructure",
    priorityScore: 92.5,
    upvotes: 45,
    severity: 4,
    daysOpen: 12,
    tags: ["infrastructure", "danger"],
    hasMedia: true
  },
  {
    id: "ISS-1045",
    title: "Leaking Water Pipe near Central Park",
    status: "Proposed",
    category: "Utilities",
    priorityScore: 88.0,
    upvotes: 28,
    severity: 5,
    daysOpen: 3,
    tags: ["water", "urgent"],
    hasMedia: true
  },
  {
    id: "ISS-1002",
    title: "Broken Streetlight on 5th Ave",
    status: "Funded",
    category: "Safety",
    priorityScore: 74.0,
    upvotes: 36,
    severity: 3,
    daysOpen: 8,
    tags: ["safety", "night"],
    hasMedia: false
  },
  {
    id: "ISS-1055",
    title: "Park Bench Vandalism",
    status: "Resolved",
    category: "Public Space",
    priorityScore: 45.5,
    upvotes: 12,
    severity: 1,
    daysOpen: 2,
    tags: ["parks", "minor"],
    hasMedia: true
  }
];

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>CivicHub</Link>
            <div className={styles.navLinks}>
              <Link href="/report" className="btn btn-primary">Report Issue</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className={`container ${styles.mainContent}`}>
        <div className={styles.pageHeader}>
          <div className={styles.headerText}>
            <h1>CONSTITUENCY DASHBOARD</h1>
            <p>PRIORITIZED VIEW OF LOCAL ISSUES.</p>
          </div>
          <div className={styles.statsOverview}>
            <div className={`${styles.statCard} brutal-panel`}>
              <span className={styles.statValue}>124</span>
              <span className={styles.statLabel}>ACTIVE ISSUES</span>
            </div>
            <div className={`${styles.statCard} brutal-panel`}>
              <span className={styles.statValue}>3.2k</span>
              <span className={styles.statLabel}>VERIFIED VOTES</span>
            </div>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {mockIssues.map(issue => (
            <div key={issue.id} className={`${styles.issueCard} brutal-panel`}>
              <div className={styles.cardHeader}>
                <span className={styles.issueId}>{issue.id}</span>
                <span className={`${styles.statusBadge} ${styles['status' + issue.status.replace(/\s+/g, '')]}`}>
                  {issue.status}
                </span>
              </div>
              
              <h2 className={styles.issueTitle}>
                {issue.title}
                {issue.hasMedia && <span className={styles.mediaIcon} title="Contains Media">📷</span>}
              </h2>
              
              <div className={styles.tagsContainer}>
                <span className={styles.categoryBadge}>{issue.category}</span>
                {issue.tags.map(tag => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
              
              <div className={styles.scoreSection}>
                <div className={styles.scoreLabel}>PRIORITY SCORE</div>
                <div className={styles.scoreValue}>{issue.priorityScore}</div>
              </div>
              
              <div className={styles.metricsFooter}>
                <span title="Upvotes"><strong>👍 {issue.upvotes}</strong></span>
                <span title="Severity"><strong>⚠️ {issue.severity}/5</strong></span>
                <span title="Days Open"><strong>🕒 {issue.daysOpen}D</strong></span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

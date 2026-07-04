import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { SEVERITY_COLORS, STATUS_COLORS } from '@/lib/mockData';
import styles from './detail.module.css';

const prisma = new PrismaClient();

export default async function IssueDetailPage({ params }) {
  const { id } = await params;
  
  const issue = await prisma.issue.findUnique({
    where: { id },
    include: { author: true }
  });

  if (!issue) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 className="page-title">Issue Not Found</h1>
        <Link href="/page/issues" className="btn btn-primary">← Back to Issues</Link>
      </div>
    );
  }

  // Simplified formula values for UI display
  const vScore = issue.voteCount * 1.5;
  const sScore = issue.severityScore * 2;
  const tScore = 0; // Days open could be calculated here

  return (
    <div className="container">
      <div className="page-header">
        <Link href="/page/issues" className={styles.backLink}>← Back to Issues</Link>
      </div>

      <div className={styles.layout}>
        {/* Main Content */}
        <div className={styles.main}>
          <div className={`glass-card ${styles.issueHeader}`}>
            <div className={styles.badges}>
              <span className="badge" style={{ background: `${STATUS_COLORS[issue.status]}20`, color: STATUS_COLORS[issue.status], border: `1px solid ${STATUS_COLORS[issue.status]}40` }}>
                {issue.status}
              </span>
              <span className="badge badge-gray">{issue.aiCategory}</span>
            </div>
            
            <h1 className={styles.issueText}>{issue.rawText}</h1>
          </div>

          <div className={styles.accountability}>
            <h3 className={styles.sectionTitle}>Accountability Timeline</h3>
            <div className={styles.timeline}>
              <div className={`${styles.step} ${styles.completed}`}>
                <div className={styles.stepDot} />
                <div className={styles.stepContent}>
                  <h4>Proposed</h4>
                  <p>Issue registered and categorized by AI.</p>
                </div>
              </div>
              <div className={`${styles.step} ${issue.status === 'Funded' || issue.status === 'In Progress' || issue.status === 'Resolved' ? styles.completed : ''}`}>
                <div className={styles.stepDot} />
                <div className={styles.stepContent}>
                  <h4>Funded</h4>
                  <p>Budget allocated from constituency fund.</p>
                </div>
              </div>
              <div className={`${styles.step} ${issue.status === 'In Progress' || issue.status === 'Resolved' ? styles.completed : ''}`}>
                <div className={styles.stepDot} />
                <div className={styles.stepContent}>
                  <h4>In Progress</h4>
                  <p>Contractor assigned and work started.</p>
                </div>
              </div>
              <div className={`${styles.step} ${issue.status === 'Resolved' ? styles.completed : ''}`}>
                <div className={styles.stepDot} />
                <div className={styles.stepContent}>
                  <h4>Resolved</h4>
                  <p>Work completed and verified.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={`glass-card ${styles.voteCard}`}>
            <div className={styles.voteCount}>{issue.voteCount}</div>
            <div className={styles.voteLabel}>Citizens Upvoted</div>
            <button className="btn btn-primary" style={{ width: '100%' }}>▲ Upvote Issue</button>
          </div>

          <div className={`glass-card ${styles.aiCard}`}>
            <h3 className={styles.sidebarTitle}>🤖 AI Insights</h3>
            
            <div className={styles.aiMetric}>
              <span className={styles.aiLabel}>Category</span>
              <span className={styles.aiValue}>{issue.aiCategory}</span>
            </div>
            
            <div className={styles.aiMetric}>
              <span className={styles.aiLabel}>Severity Level</span>
              <div className={styles.severityBar}>
                <div 
                  className={styles.severityFill} 
                  style={{ 
                    width: `${(issue.severityScore / 5) * 100}%`,
                    background: SEVERITY_COLORS[issue.severityScore]
                  }} 
                />
              </div>
              <span className={styles.aiValue}>{issue.severityScore}/5</span>
            </div>

            {issue.similarCount > 0 && (
              <div className={styles.mergedInfo}>
                <span className={styles.mergedIcon}>🔗</span>
                <p>{issue.similarCount} duplicate reports were merged into this issue by AI.</p>
              </div>
            )}
          </div>

          <div className={`glass-card ${styles.priorityCard}`}>
            <h3 className={styles.sidebarTitle}>🏆 Priority Score</h3>
            <div className={styles.scoreLarge}>{Math.round(issue.priorityScore)}</div>
            <p className={styles.formulaText}>
              Score = (V × 1.5) + (S × 2) − (T × 0.5)
            </p>
            <div className={styles.scoreBreakdown}>
              <div className={styles.breakdownItem}>
                <span>Votes (V)</span>
                <span>+{vScore.toFixed(1)}</span>
              </div>
              <div className={styles.breakdownItem}>
                <span>Severity (S)</span>
                <span>+{sScore.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className={`glass-card ${styles.locationCard}`}>
            <h3 className={styles.sidebarTitle}>📍 Location</h3>
            <p className={styles.locationText}>{issue.locationText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { use } from 'react';
import Link from 'next/link';
import { MOCK_ISSUES, ISSUE_STATUSES, SEVERITY_LABELS, SEVERITY_COLORS, STATUS_COLORS, formatDate } from '@/lib/mockData';
import styles from './detail.module.css';

export default function IssueDetailPage({ params }) {
  const { id } = use(params);
  const issue = MOCK_ISSUES.find(i => i.issue_id === id);

  if (!issue) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 className="page-title">Issue Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>The issue you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/page/issues" className="btn btn-primary">← Back to Issues</Link>
      </div>
    );
  }

  const statusIdx = ISSUE_STATUSES.indexOf(issue.status);

  return (
    <div className="container">
      <div className="page-header">
        <Link href="/page/issues" className={styles.backLink}>← Back to Issues</Link>
      </div>

      <div className={styles.layout}>
        {/* Main Content */}
        <div className={styles.main}>
          {/* Header */}
          <div className={`glass-card ${styles.headerCard}`}>
            <div className={styles.badges}>
              <span className="badge" style={{ background: `${STATUS_COLORS[issue.status]}20`, color: STATUS_COLORS[issue.status], border: `1px solid ${STATUS_COLORS[issue.status]}40` }}>
                {issue.status}
              </span>
              <span className="badge" style={{ background: `${SEVERITY_COLORS[issue.severity_score]}20`, color: SEVERITY_COLORS[issue.severity_score], border: `1px solid ${SEVERITY_COLORS[issue.severity_score]}40` }}>
                ⚠ {SEVERITY_LABELS[issue.severity_score]} Severity
              </span>
              <span className="badge badge-gray">{issue.ai_category}</span>
            </div>

            <h1 className={styles.title}>{issue.raw_text}</h1>

            <div className={styles.meta}>
              <span>📍 {issue.location_text}</span>
              <span>👤 {issue.author_name}</span>
              <span>📅 {formatDate(issue.created_at)}</span>
              <span>⏱️ {issue.days_open} days open</span>
            </div>
          </div>

          {/* Accountability Timeline */}
          <div className={`glass-card ${styles.timelineCard}`}>
            <h2 className={styles.sectionTitle}>📊 Accountability Timeline</h2>
            <div className={styles.timeline}>
              {ISSUE_STATUSES.map((status, i) => {
                const isCompleted = i <= statusIdx;
                const isCurrent = i === statusIdx;
                const update = issue.updates.find(u => u.status === status);

                return (
                  <div key={status} className={styles.timelineItem}>
                    <div className={styles.timelineLine}>
                      <div
                        className={`${styles.timelineDot} ${isCurrent ? styles.current : ''}`}
                        style={{ background: isCompleted ? STATUS_COLORS[status] : 'var(--color-bg-tertiary)', border: isCompleted ? 'none' : '2px solid var(--color-border)' }}
                      >
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      {i < ISSUE_STATUSES.length - 1 && (
                        <div className={styles.timelineConnector} style={{ background: i < statusIdx ? 'var(--color-emerald)' : 'var(--color-border)' }} />
                      )}
                    </div>
                    <div className={styles.timelineContent}>
                      <h4 className={styles.timelineStatus} style={{ color: isCompleted ? STATUS_COLORS[status] : 'var(--color-text-muted)' }}>
                        {status}
                      </h4>
                      {update ? (
                        <>
                          <p className={styles.timelineDate}>{formatDate(update.date)}</p>
                          <p className={styles.timelineNote}>{update.note}</p>
                        </>
                      ) : (
                        <p className={styles.timelineDate}>Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights */}
          <div className={`glass-card ${styles.aiCard}`}>
            <h2 className={styles.sectionTitle}>🤖 AI Insights</h2>
            <div className={styles.aiGrid}>
              <div className={styles.aiItem}>
                <span className={styles.aiLabel}>Category (AI-assigned)</span>
                <span className={styles.aiValue}>{issue.ai_category}</span>
              </div>
              <div className={styles.aiItem}>
                <span className={styles.aiLabel}>Severity Score</span>
                <span className={styles.aiValue} style={{ color: SEVERITY_COLORS[issue.severity_score] }}>
                  {issue.severity_score}/5 — {SEVERITY_LABELS[issue.severity_score]}
                </span>
              </div>
              <div className={styles.aiItem}>
                <span className={styles.aiLabel}>Similar Issues Merged</span>
                <span className={styles.aiValue}>{issue.similar_count} duplicates detected & merged</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Vote Card */}
          <div className={`glass-card ${styles.voteCard}`}>
            <div className={styles.voteCount}>{issue.vote_count}</div>
            <div className={styles.voteLabel}>Verified Upvotes</div>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              ▲ Upvote This Issue
            </button>
            <p className={styles.voteNote}>Only verified local residents can vote</p>
          </div>

          {/* Priority Score */}
          <div className={`glass-card ${styles.priorityCard}`}>
            <h3 className={styles.sidebarTitle}>Priority Score</h3>
            <div className={styles.priorityScoreNum}>{Math.round(issue.priority_score)}</div>
            <div className={styles.priorityBreakdown}>
              <div className={styles.priorityRow}>
                <span>Votes (V × 1.5)</span>
                <span className={styles.priorityVal}>{(issue.vote_count * 1.5).toFixed(0)}</span>
              </div>
              <div className={styles.priorityRow}>
                <span>Severity (S × 2)</span>
                <span className={styles.priorityVal}>{(issue.severity_score * 2).toFixed(0)}</span>
              </div>
              <div className={styles.priorityRow}>
                <span>Time decay (T × 0.5)</span>
                <span className={styles.priorityVal} style={{ color: 'var(--color-rose)' }}>-{(issue.days_open * 0.5).toFixed(0)}</span>
              </div>
            </div>
            <div className={styles.formula}>
              Score = (V × 1.5) + (S × 2) − (T × 0.5)
            </div>
          </div>

          {/* Location */}
          <div className={`glass-card ${styles.locationCard}`}>
            <h3 className={styles.sidebarTitle}>📍 Location</h3>
            <p className={styles.locationText}>{issue.location_text}</p>
            <div className={styles.mapPlaceholder}>
              <span>🗺️</span>
              <p>Map View</p>
              <p className={styles.coords}>{issue.lat_lng.lat.toFixed(4)}, {issue.lat_lng.lng.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_ISSUES, ISSUE_CATEGORIES, ISSUE_STATUSES, SEVERITY_LABELS, SEVERITY_COLORS, STATUS_COLORS, formatCurrency } from '@/lib/mockData';
import styles from './dashboard.module.css';

function PriorityBar({ score, maxScore }) {
  const pct = Math.min((score / maxScore) * 100, 100);
  return (
    <div className={styles.priorityBar}>
      <div className={styles.priorityFill} style={{ width: `${pct}%` }} />
    </div>
  );
}

function MiniChart({ data, color, label }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className={styles.miniChart}>
      <span className={styles.miniChartLabel}>{label}</span>
      <div className={styles.miniChartBars}>
        {data.map((d, i) => (
          <div key={i} className={styles.miniChartBarWrap} title={`${d.name}: ${d.value}`}>
            <div
              className={styles.miniChartBar}
              style={{ height: `${(d.value / max) * 100}%`, background: color }}
            />
            <span className={styles.miniChartBarLabel}>{d.name.substring(0, 3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [statusUpdate, setStatusUpdate] = useState({});

  const sorted = useMemo(() => {
    return [...MOCK_ISSUES].sort((a, b) => b.priority_score - a.priority_score);
  }, []);

  const maxScore = sorted.length > 0 ? sorted[0].priority_score : 1;

  // Stats
  const totalIssues = MOCK_ISSUES.length;
  const openIssues = MOCK_ISSUES.filter(i => i.status !== 'Resolved').length;
  const criticalIssues = MOCK_ISSUES.filter(i => i.severity_score === 5).length;
  const totalVotes = MOCK_ISSUES.reduce((sum, i) => sum + i.vote_count, 0);

  // Category distribution
  const categoryData = ISSUE_CATEGORIES
    .map(cat => ({ name: cat, value: MOCK_ISSUES.filter(i => i.ai_category === cat).length }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Severity distribution
  const severityData = [1, 2, 3, 4, 5].map(s => ({
    name: SEVERITY_LABELS[s],
    value: MOCK_ISSUES.filter(i => i.severity_score === s).length,
  }));

  // Status distribution
  const statusData = ISSUE_STATUSES.map(s => ({
    name: s,
    value: MOCK_ISSUES.filter(i => i.status === s).length,
  }));

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">📊 Planner Dashboard</h1>
        <p className="page-description">
          Priority-ranked civic issues with data-driven scoring for constituency fund allocation.
        </p>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsRow}>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum}>{totalIssues}</span>
            <span className={styles.statLabel}>Total Issues</span>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.15)' }}>⚡</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum} style={{ color: 'var(--color-gold)' }}>{openIssues}</span>
            <span className={styles.statLabel}>Open Issues</span>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.15)' }}>🔴</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum} style={{ color: 'var(--color-rose)' }}>{criticalIssues}</span>
            <span className={styles.statLabel}>Critical (Severity 5)</span>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.15)' }}>🗳️</div>
          <div className={styles.statInfo}>
            <span className={styles.statNum} style={{ color: 'var(--color-purple)' }}>{totalVotes.toLocaleString()}</span>
            <span className={styles.statLabel}>Total Votes</span>
          </div>
        </div>
      </div>

      <div className={styles.dashLayout}>
        {/* Main: Priority Table */}
        <div className={styles.mainPanel}>
          <div className={`glass-card ${styles.tableCard}`}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>🏆 Priority Ranked Issues</h2>
              <div className={styles.formulaBadge}>
                Score = (V × 1.5) + (S × 2) − (T × 0.5)
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Issue</th>
                    <th>Category</th>
                    <th>Severity</th>
                    <th>Votes</th>
                    <th>Days</th>
                    <th>Score</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((issue, idx) => (
                    <tr key={issue.issue_id} className={styles.tableRow}>
                      <td className={styles.rank}>{idx + 1}</td>
                      <td>
                        <Link href={`/page/issues/${issue.issue_id}`} className={styles.issueLink}>
                          {issue.raw_text.length > 60 ? issue.raw_text.substring(0, 60) + '...' : issue.raw_text}
                        </Link>
                        <span className={styles.issueLocation}>📍 {issue.location_text}</span>
                      </td>
                      <td><span className="badge badge-gray">{issue.ai_category}</span></td>
                      <td>
                        <span
                          className={styles.severityDot}
                          style={{ background: SEVERITY_COLORS[issue.severity_score] }}
                        >
                          {issue.severity_score}
                        </span>
                      </td>
                      <td className={styles.voteCell}>{issue.vote_count}</td>
                      <td className={styles.daysCell}>{issue.days_open}</td>
                      <td className={styles.scoreCell}>{Math.round(issue.priority_score)}</td>
                      <td><PriorityBar score={issue.priority_score} maxScore={maxScore} /></td>
                      <td>
                        <span
                          className="badge"
                          style={{ background: `${STATUS_COLORS[issue.status]}20`, color: STATUS_COLORS[issue.status], border: `1px solid ${STATUS_COLORS[issue.status]}40` }}
                        >
                          {issue.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Charts */}
        <div className={styles.sidePanel}>
          <div className={`glass-card ${styles.chartCard}`}>
            <h3 className={styles.chartTitle}>Issues by Category</h3>
            <div className={styles.barChart}>
              {categoryData.map((d, i) => (
                <div key={d.name} className={styles.barRow}>
                  <span className={styles.barLabel}>{d.name}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${(d.value / categoryData[0].value) * 100}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  </div>
                  <span className={styles.barValue}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`glass-card ${styles.chartCard}`}>
            <h3 className={styles.chartTitle}>Status Distribution</h3>
            <div className={styles.statusGrid}>
              {statusData.map(d => (
                <div key={d.name} className={styles.statusItem}>
                  <div
                    className={styles.statusDot}
                    style={{ background: STATUS_COLORS[d.name] }}
                  />
                  <span className={styles.statusName}>{d.name}</span>
                  <span className={styles.statusCount}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`glass-card ${styles.chartCard}`}>
            <h3 className={styles.chartTitle}>Severity Breakdown</h3>
            <div className={styles.severityList}>
              {severityData.map(d => {
                const sevLevel = [1, 2, 3, 4, 5].find((_, i) => SEVERITY_LABELS[i + 1] === d.name) || 1;
                return (
                  <div key={d.name} className={styles.severityRow}>
                    <span className={styles.severityBadge} style={{ background: SEVERITY_COLORS[sevLevel], color: '#000' }}>
                      {sevLevel}
                    </span>
                    <span className={styles.severityName}>{d.name}</span>
                    <span className={styles.severityCount}>{d.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

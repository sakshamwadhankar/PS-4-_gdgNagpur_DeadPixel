'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_ISSUES, ISSUE_CATEGORIES, ISSUE_STATUSES, SEVERITY_LABELS, SEVERITY_COLORS, STATUS_COLORS, formatDate } from '@/lib/mockData';
import styles from './issues.module.css';

export default function IssuesPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priority');

  const filtered = useMemo(() => {
    let items = [...MOCK_ISSUES];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.raw_text.toLowerCase().includes(q) || i.location_text.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'All') items = items.filter(i => i.ai_category === categoryFilter);
    if (statusFilter !== 'All') items = items.filter(i => i.status === statusFilter);

    items.sort((a, b) => {
      if (sortBy === 'priority') return b.priority_score - a.priority_score;
      if (sortBy === 'votes') return b.vote_count - a.vote_count;
      if (sortBy === 'severity') return b.severity_score - a.severity_score;
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

    return items;
  }, [search, categoryFilter, statusFilter, sortBy]);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">📋 Civic Issues</h1>
        <p className="page-description">
          Browse, upvote, and track local infrastructure issues reported by verified constituents.
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={`input-field ${styles.searchInput}`}
            placeholder="Search issues by keyword or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select className={`input-field ${styles.select}`} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {ISSUE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={`input-field ${styles.select}`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            {ISSUE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className={`input-field ${styles.select}`} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="priority">Sort: Priority Score</option>
            <option value="votes">Sort: Most Votes</option>
            <option value="severity">Sort: Severity</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className={styles.resultCount}>{filtered.length} issues found</p>

      {/* Issue Cards */}
      <div className={styles.issueGrid}>
        {filtered.map((issue, idx) => (
          <Link
            key={issue.issue_id}
            href={`/page/issues/${issue.issue_id}`}
            className={`glass-card ${styles.issueCard} animate-fade-in-up delay-${Math.min(idx + 1, 6)}`}
          >
            <div className={styles.issueHeader}>
              <span
                className={`badge ${styles.statusBadge}`}
                style={{
                  background: `${STATUS_COLORS[issue.status]}20`,
                  color: STATUS_COLORS[issue.status],
                  borderColor: `${STATUS_COLORS[issue.status]}40`,
                }}
              >
                {issue.status}
              </span>
              <span
                className={`badge ${styles.severityBadge}`}
                style={{
                  background: `${SEVERITY_COLORS[issue.severity_score]}20`,
                  color: SEVERITY_COLORS[issue.severity_score],
                  borderColor: `${SEVERITY_COLORS[issue.severity_score]}40`,
                }}
              >
                {SEVERITY_LABELS[issue.severity_score]}
              </span>
            </div>

            <h3 className={styles.issueTitle}>{issue.raw_text}</h3>

            <div className={styles.issueMeta}>
              <span className={styles.metaItem}>📍 {issue.location_text}</span>
              <span className={styles.metaItem}>🏷️ {issue.ai_category}</span>
            </div>

            <div className={styles.issueFooter}>
              <div className={styles.voteBox}>
                <span className={styles.voteIcon}>▲</span>
                <span className={styles.voteCount}>{issue.vote_count}</span>
              </div>
              <div className={styles.priorityBox}>
                <span className={styles.priorityLabel}>Priority</span>
                <span className={styles.priorityScore}>{Math.round(issue.priority_score)}</span>
              </div>
              <div className={styles.dateBox}>
                <span className={styles.dateLabel}>{issue.days_open}d open</span>
              </div>
              {issue.similar_count > 0 && (
                <div className={styles.dupBox}>
                  <span>🤖 {issue.similar_count} merged</span>
                </div>
              )}
            </div>

            {/* Mini timeline */}
            <div className={styles.miniTimeline}>
              {ISSUE_STATUSES.map((s, i) => {
                const statusIdx = ISSUE_STATUSES.indexOf(issue.status);
                const isCompleted = i <= statusIdx;
                return (
                  <div key={s} className={styles.miniTimelineStep}>
                    <div
                      className={styles.miniDot}
                      style={{ background: isCompleted ? STATUS_COLORS[s] : 'var(--color-bg-tertiary)' }}
                    />
                    {i < ISSUE_STATUSES.length - 1 && (
                      <div
                        className={styles.miniLine}
                        style={{ background: i < statusIdx ? 'var(--color-emerald)' : 'var(--color-border)' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Link>
        ))}
      </div>

      {/* FAB */}
      <Link href="/page/issues/new" className={styles.fab}>
        ＋ Report Issue
      </Link>
    </div>
  );
}

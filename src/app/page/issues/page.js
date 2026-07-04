'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Megaphone, Search, ArrowUp, MapPin, Bot } from 'lucide-react';
import { ISSUE_CATEGORIES, ISSUE_STATUSES, SEVERITY_LABELS, SEVERITY_COLORS, STATUS_COLORS } from '@/lib/mockData';
import styles from './issues.module.css';

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    async function fetchIssues() {
      try {
        const res = await fetch('/api/issues');
        const data = await res.json();
        if (data.success) {
          setIssues(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let items = [...issues];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.raw_text.toLowerCase().includes(q) || i.location_text.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'All') {
      items = items.filter(i => i.ai_category === categoryFilter);
    }

    if (statusFilter !== 'All') {
      items = items.filter(i => i.status === statusFilter);
    }

    items.sort((a, b) => {
      if (sortBy === 'priority') return b.priority_score - a.priority_score;
      if (sortBy === 'recent') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'votes') return b.vote_count - a.vote_count;
      return 0;
    });

    return items;
  }, [issues, search, categoryFilter, statusFilter, sortBy]);

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <div className="page-header">
        <h1 className="page-title"><Megaphone size={32} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Civic Issues</h1>
        <p className="page-description">
          Browse, filter, and vote on issues reported by citizens in your ward.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><Search size={16} /></span>
          <input
            type="text"
            className={`input-field ${styles.searchInput}`}
            placeholder="Search issues or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <select className="input-field" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {ISSUE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className="input-field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            {ISSUE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className="input-field" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="priority">Sort by Priority Score</option>
            <option value="recent">Sort by Most Recent</option>
            <option value="votes">Sort by Most Votes</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Loading issues from database...</p>
      ) : (
        <div className={styles.issueGrid}>
          {filteredAndSorted.map(issue => (
            <Link href={`/page/issues/${issue.issue_id}`} key={issue.issue_id} className={`glass-card ${styles.issueCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.badges}>
                  <span
                    className="badge"
                    style={{ background: `${STATUS_COLORS[issue.status]}20`, color: STATUS_COLORS[issue.status], border: `1px solid ${STATUS_COLORS[issue.status]}40` }}
                  >
                    {issue.status}
                  </span>
                  <span
                    className="badge"
                    style={{ background: `${SEVERITY_COLORS[issue.severity_score]}20`, color: SEVERITY_COLORS[issue.severity_score], border: `1px solid ${SEVERITY_COLORS[issue.severity_score]}40` }}
                  >
                    Severity {issue.severity_score}
                  </span>
                </div>
                <div className={styles.voteBadge}>
                  <span className={styles.voteArrow}><ArrowUp size={14} /></span>
                  {issue.vote_count}
                </div>
              </div>

              <p className={styles.issueText}>{issue.raw_text}</p>

              <div className={styles.issueMeta}>
                <span className={styles.location}><MapPin size={14} style={{ display: 'inline-block', verticalAlign: 'text-bottom' }} /> {issue.location_text}</span>
                <span className="badge badge-gray">{issue.ai_category}</span>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.priorityBox}>
                  <span className={styles.priorityLabel}>Priority Score</span>
                  <span className={styles.priorityValue}>{Math.round(issue.priority_score)}</span>
                </div>
                {issue.similar_count > 0 && (
                  <div className={styles.mergedBox} title={`${issue.similar_count} similar reports merged by AI`}>
                    <Bot size={14} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {issue.similar_count} merged
                  </div>
                )}
              </div>
            </Link>
          ))}
          {filteredAndSorted.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              No issues found matching your criteria.
            </p>
          )}
        </div>
      )}

      <Link href="/page/issues/new" className={styles.fab}>
        <span className={styles.fabIcon}>+</span>
        Report Issue
      </Link>
    </div>
  );
}

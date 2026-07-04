'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_TENDERS, PORTAL_COLORS, STATUS_COLORS, formatCurrency, formatDate, daysUntil } from '@/lib/mockData';
import styles from './tenders.module.css';

export default function TendersPage() {
  const [search, setSearch] = useState('');
  const [portalFilter, setPortalFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [view, setView] = useState('card');

  const filtered = useMemo(() => {
    let items = [...MOCK_TENDERS];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(t => t.title.toLowerCase().includes(q) || t.department.toLowerCase().includes(q));
    }
    if (portalFilter !== 'All') items = items.filter(t => t.source_portal === portalFilter);
    if (statusFilter !== 'All') items = items.filter(t => t.status === statusFilter);
    return items;
  }, [search, portalFilter, statusFilter]);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">📑 Government Tenders</h1>
        <p className="page-description">
          Live aggregated data from GEM, CPPP, and State eProcure portals. Transparency into planned government spending.
        </p>
      </div>

      {/* Scraper Status */}
      <div className={styles.scraperStatus}>
        <div className={styles.scraperDot} />
        <span>Last scraped: 3 Jul 2025, 06:00 AM</span>
        <span className={styles.scraperInfo}>• Playwright headless browser • Auto-refresh every 6 hours</span>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={`input-field ${styles.searchInput}`}
            placeholder="Search tenders by keyword or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterRow}>
          <select className={`input-field ${styles.select}`} value={portalFilter} onChange={(e) => setPortalFilter(e.target.value)}>
            <option value="All">All Portals</option>
            <option value="GEM">GEM</option>
            <option value="CPPP">CPPP</option>
            <option value="State eProcure">State eProcure</option>
          </select>
          <select className={`input-field ${styles.select}`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
          <div className={styles.viewToggle}>
            <button className={`${styles.viewBtn} ${view === 'card' ? styles.activeView : ''}`} onClick={() => setView('card')}>▦</button>
            <button className={`${styles.viewBtn} ${view === 'table' ? styles.activeView : ''}`} onClick={() => setView('table')}>☰</button>
          </div>
        </div>
      </div>

      <p className={styles.resultCount}>{filtered.length} tenders found</p>

      {/* Card View */}
      {view === 'card' && (
        <div className={styles.tenderGrid}>
          {filtered.map((tender, idx) => {
            const days = daysUntil(tender.deadline);
            return (
              <Link
                key={tender.tender_id}
                href={`/page/tenders/${tender.tender_id}`}
                className={`glass-card ${styles.tenderCard} animate-fade-in-up delay-${Math.min(idx + 1, 6)}`}
              >
                <div className={styles.tenderHeader}>
                  <span
                    className={`badge ${styles.portalBadge}`}
                    style={{ background: `${PORTAL_COLORS[tender.source_portal]}20`, color: PORTAL_COLORS[tender.source_portal], border: `1px solid ${PORTAL_COLORS[tender.source_portal]}40` }}
                  >
                    {tender.source_portal}
                  </span>
                  <span
                    className={`badge`}
                    style={{ background: `${STATUS_COLORS[tender.status]}20`, color: STATUS_COLORS[tender.status], border: `1px solid ${STATUS_COLORS[tender.status]}40` }}
                  >
                    {tender.status}
                  </span>
                </div>

                <h3 className={styles.tenderTitle}>{tender.title}</h3>

                <p className={styles.tenderDept}>{tender.department}</p>

                <div className={styles.tenderMeta}>
                  <div className={styles.tenderMetaItem}>
                    <span className={styles.metaLabel}>Estimated Value</span>
                    <span className={styles.metaValue}>{formatCurrency(tender.estimated_value)}</span>
                  </div>
                  <div className={styles.tenderMetaItem}>
                    <span className={styles.metaLabel}>Deadline</span>
                    <span className={styles.metaValue}>{formatDate(tender.deadline)}</span>
                  </div>
                  <div className={styles.tenderMetaItem}>
                    <span className={styles.metaLabel}>Days Left</span>
                    <span className={`${styles.metaValue} ${days <= 7 ? styles.urgent : ''}`}>
                      {tender.status === 'Closed' ? 'Closed' : `${days} days`}
                    </span>
                  </div>
                </div>

                <div className={styles.tenderCategory}>
                  <span className="badge badge-gray">{tender.category}</span>
                  <span className={styles.tenderConstituency}>📍 {tender.constituency}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Portal</th>
                <th>Title</th>
                <th>Department</th>
                <th>Value</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tender => (
                <tr key={tender.tender_id}>
                  <td>
                    <span className={`badge`} style={{ background: `${PORTAL_COLORS[tender.source_portal]}20`, color: PORTAL_COLORS[tender.source_portal], border: `1px solid ${PORTAL_COLORS[tender.source_portal]}40` }}>
                      {tender.source_portal}
                    </span>
                  </td>
                  <td>
                    <Link href={`/page/tenders/${tender.tender_id}`} className={styles.tableLink}>
                      {tender.title}
                    </Link>
                  </td>
                  <td className={styles.tableDept}>{tender.department}</td>
                  <td className={styles.tableValue}>{formatCurrency(tender.estimated_value)}</td>
                  <td>{formatDate(tender.deadline)}</td>
                  <td>
                    <span className={`badge`} style={{ background: `${STATUS_COLORS[tender.status]}20`, color: STATUS_COLORS[tender.status], border: `1px solid ${STATUS_COLORS[tender.status]}40` }}>
                      {tender.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

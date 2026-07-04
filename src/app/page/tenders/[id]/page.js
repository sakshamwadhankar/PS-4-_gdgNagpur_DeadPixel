'use client';

import { use } from 'react';
import Link from 'next/link';
import { MOCK_TENDERS, PORTAL_COLORS, STATUS_COLORS, formatCurrency, formatDate, daysUntil } from '@/lib/mockData';
import styles from './tenderDetail.module.css';

export default function TenderDetailPage({ params }) {
  const { id } = use(params);
  const tender = MOCK_TENDERS.find(t => t.tender_id === id);

  if (!tender) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 className="page-title">Tender Not Found</h1>
        <Link href="/page/tenders" className="btn btn-primary">← Back to Tenders</Link>
      </div>
    );
  }

  const days = daysUntil(tender.deadline);

  return (
    <div className="container">
      <div className="page-header">
        <Link href="/page/tenders" className={styles.backLink}>← Back to Tenders</Link>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={`glass-card ${styles.headerCard}`}>
            <div className={styles.badges}>
              <span className="badge" style={{ background: `${PORTAL_COLORS[tender.source_portal]}20`, color: PORTAL_COLORS[tender.source_portal], border: `1px solid ${PORTAL_COLORS[tender.source_portal]}40` }}>
                {tender.source_portal}
              </span>
              <span className="badge" style={{ background: `${STATUS_COLORS[tender.status]}20`, color: STATUS_COLORS[tender.status], border: `1px solid ${STATUS_COLORS[tender.status]}40` }}>
                {tender.status}
              </span>
              <span className="badge badge-gray">{tender.category}</span>
            </div>

            <h1 className={styles.title}>{tender.title}</h1>
            <p className={styles.dept}>{tender.department}</p>
            <p className={styles.desc}>{tender.description}</p>
          </div>

          {/* Tender Details */}
          <div className={`glass-card ${styles.detailsCard}`}>
            <h2 className={styles.sectionTitle}>📋 Tender Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tender ID</span>
                <span className={styles.detailValue}>{tender.portal_tender_id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Source Portal</span>
                <span className={styles.detailValue}>{tender.source_portal}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Estimated Value</span>
                <span className={styles.detailValue} style={{ color: 'var(--color-emerald)' }}>{formatCurrency(tender.estimated_value)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Submission Deadline</span>
                <span className={styles.detailValue}>{formatDate(tender.deadline)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Constituency</span>
                <span className={styles.detailValue}>📍 {tender.constituency}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Scraped</span>
                <span className={styles.detailValue}>{formatDate(tender.scraped_at)}</span>
              </div>
            </div>
          </div>

          {/* Scraper Info */}
          <div className={`glass-card ${styles.scraperCard}`}>
            <h2 className={styles.sectionTitle}>🤖 Scraper Information</h2>
            <p className={styles.scraperText}>
              This tender was automatically scraped from <strong>{tender.source_portal}</strong> using Playwright headless browser.
              Data is refreshed every 6 hours via CRON job.
            </p>
            <div className={styles.scraperMeta}>
              <span>Technology: Playwright (Chromium)</span>
              <span>Frequency: Every 6 hours</span>
              <span>Method: Full DOM render + data extraction</span>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={`glass-card ${styles.deadlineCard}`}>
            <h3 className={styles.sidebarTitle}>⏰ Deadline</h3>
            <div className={styles.deadlineNum} style={{ color: days <= 7 ? 'var(--color-rose)' : 'var(--color-emerald)' }}>
              {tender.status === 'Closed' ? 'Closed' : days}
            </div>
            {tender.status !== 'Closed' && <div className={styles.deadlineLabel}>days remaining</div>}
            <div className={styles.deadlineDate}>{formatDate(tender.deadline)}</div>
          </div>

          <div className={`glass-card ${styles.valueCard}`}>
            <h3 className={styles.sidebarTitle}>💰 Estimated Value</h3>
            <div className={styles.valueNum}>{formatCurrency(tender.estimated_value)}</div>
            <div className={styles.valueExact}>₹{tender.estimated_value.toLocaleString('en-IN')}</div>
          </div>

          <div className={`glass-card ${styles.linkCard}`}>
            <h3 className={styles.sidebarTitle}>🔗 Original Portal</h3>
            <a href={tender.portal_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: '100%' }}>
              View on {tender.source_portal} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ISSUE_CATEGORIES } from '@/lib/mockData';
import styles from './new.module.css';

export default function NewIssuePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ text: '', category: '', location: '', severity: '' });
  const [submitted, setSubmitted] = useState(false);
  const [similar, setSimilar] = useState(null);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate AI dedup check
    if (step === 1 && form.text.length > 10) {
      setSimilar({
        found: true,
        match: 'Massive pothole on Wardha Road near Ajni Square',
        similarity: 72,
        issue_id: 'iss-001'
      });
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container">
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.successTitle}>Issue Submitted!</h1>
          <p className={styles.successDesc}>
            Your civic issue has been recorded and will be reviewed by our AI system for categorization and deduplication.
          </p>
          <div className={styles.successActions}>
            <Link href="/page/issues" className="btn btn-primary">View All Issues</Link>
            <Link href="/page/issues/new" className="btn btn-secondary" onClick={() => { setSubmitted(false); setStep(1); setForm({ text: '', category: '', location: '', severity: '' }); setSimilar(null); }}>
              Report Another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <Link href="/page/issues" className={styles.backLink}>← Back to Issues</Link>
        <h1 className="page-title">🚀 Report New Issue</h1>
        <p className="page-description">
          Help improve your constituency by reporting civic infrastructure issues.
        </p>
      </div>

      {/* Progress Steps */}
      <div className={styles.progress}>
        {['Describe Issue', 'AI Review', 'Confirm & Submit'].map((label, i) => (
          <div key={label} className={`${styles.progressStep} ${i + 1 <= step ? styles.activeStep : ''}`}>
            <div className={styles.progressDot}>{i + 1 < step ? '✓' : i + 1}</div>
            <span className={styles.progressLabel}>{label}</span>
            {i < 2 && <div className={`${styles.progressLine} ${i + 1 < step ? styles.activeLine : ''}`} />}
          </div>
        ))}
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className={styles.formStep}>
              <div className={styles.field}>
                <label className="input-label">Describe the issue *</label>
                <textarea
                  className={`input-field ${styles.textarea}`}
                  placeholder="E.g., The water pipe on Main St is leaking badly. Multiple complaints from residents..."
                  value={form.text}
                  onChange={(e) => handleChange('text', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className="input-label">Category</label>
                  <select className={`input-field ${styles.selectField}`} value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                    <option value="">Auto-detect (AI)</option>
                    {ISSUE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className="input-label">Location *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter address or area name"
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                🤖 Run AI Analysis →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formStep}>
              <div className={styles.aiReview}>
                <h3 className={styles.aiTitle}>🤖 AI Deduplication Check</h3>

                {similar?.found && (
                  <div className={styles.similarCard}>
                    <div className={styles.similarHeader}>
                      <span className="badge badge-gold">⚠ Similar Issue Found</span>
                      <span className={styles.similarScore}>{similar.similarity}% match</span>
                    </div>
                    <p className={styles.similarText}>{similar.match}</p>
                    <div className={styles.similarActions}>
                      <Link href={`/page/issues/${similar.issue_id}`} className="btn btn-secondary btn-sm">
                        View & Upvote Existing →
                      </Link>
                    </div>
                  </div>
                )}

                <div className={styles.aiDecision}>
                  <p className={styles.aiDecisionText}>
                    The match is below 85% threshold. Your issue will be created as a <strong>new entry</strong>.
                  </p>
                  <div className={styles.aiCategories}>
                    <div className={styles.aiCat}>
                      <span className={styles.aiCatLabel}>AI Category</span>
                      <span className={styles.aiCatValue}>{form.category || 'Roads & Transport'}</span>
                    </div>
                    <div className={styles.aiCat}>
                      <span className={styles.aiCatLabel}>AI Severity</span>
                      <span className={styles.aiCatValue} style={{ color: 'var(--color-gold)' }}>4/5 — High</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary">Confirm & Submit →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.formStep}>
              <div className={styles.confirmCard}>
                <h3 className={styles.confirmTitle}>📋 Review Your Submission</h3>
                <div className={styles.confirmField}>
                  <span className={styles.confirmLabel}>Issue Description</span>
                  <p>{form.text}</p>
                </div>
                <div className={styles.confirmField}>
                  <span className={styles.confirmLabel}>Location</span>
                  <p>{form.location}</p>
                </div>
                <div className={styles.confirmField}>
                  <span className={styles.confirmLabel}>Category</span>
                  <p>{form.category || 'Roads & Transport (AI-assigned)'}</p>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button type="submit" className="btn btn-primary btn-lg">🚀 Submit Issue</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

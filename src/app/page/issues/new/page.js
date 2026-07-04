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
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setLoading(true);
      try {
        const res = await fetch('/api/issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: form.text, location: form.location })
        });
        const data = await res.json();
        
        if (data.deduplicated) {
          setSimilar({
            found: true,
            match: data.existing_issue.raw_text,
            similarity: data.similarity,
            issue_id: data.existing_issue.issue_id
          });
          setStep(2);
        } else if (data.success) {
          setAiResult({
            category: data.category,
            severity: data.severity,
            issue_id: data.issue_id
          });
          setStep(2);
        }
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 2) {
      // If we are not a duplicate, we already created the issue in the DB in step 1 (for simplicity).
      // So we just show success.
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="container">
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.successTitle}>Issue Submitted!</h1>
          <p className={styles.successDesc}>
            Your civic issue has been recorded. The AI system has categorized it and assigned a severity score.
          </p>
          <div className={styles.successActions}>
            <Link href="/page/issues" className="btn btn-primary">View All Issues</Link>
            <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setStep(1); setForm({ text: '', category: '', location: '', severity: '' }); setSimilar(null); setAiResult(null); }}>
              Report Another
            </button>
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

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? '🤖 AI Processing...' : '🤖 Run AI Analysis →'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formStep}>
              <div className={styles.aiReview}>
                <h3 className={styles.aiTitle}>🤖 AI Analysis Results</h3>

                {similar?.found ? (
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
                ) : (
                  <div className={styles.aiDecision}>
                    <p className={styles.aiDecisionText}>
                      No duplicates found! The AI has processed your issue:
                    </p>
                    <div className={styles.aiCategories}>
                      <div className={styles.aiCat}>
                        <span className={styles.aiCatLabel}>AI Category</span>
                        <span className={styles.aiCatValue}>{aiResult?.category}</span>
                      </div>
                      <div className={styles.aiCat}>
                        <span className={styles.aiCatLabel}>AI Severity</span>
                        <span className={styles.aiCatValue} style={{ color: 'var(--color-gold)' }}>{aiResult?.severity}/5</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary">Confirm & Finish →</button>
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

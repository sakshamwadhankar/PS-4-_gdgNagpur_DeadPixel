'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './auth.module.css';

const VALID_POSTCODES = ['440001', '440002', '440003', '440004', '440005', '440006', '440008', '440009', '440010'];

export default function AuthPage() {
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [step, setStep] = useState('form'); // form | verifying | success | fail
  const [userType, setUserType] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('verifying');

    setTimeout(() => {
      const isValid = VALID_POSTCODES.includes(postalCode);
      if (isValid) {
        setUserType('verified');
        setStep('success');
      } else {
        setUserType('readonly');
        setStep('fail');
      }
    }, 2000);
  };

  return (
    <div className="container">
      <div className={styles.authContainer}>
        {/* Info Panel */}
        <div className={styles.infoPanel}>
          <h2 className={styles.infoTitle}>How Verification Works</h2>
          <div className={styles.infoSteps}>
            <div className={styles.infoStep}>
              <div className={styles.infoIcon}>📱</div>
              <div>
                <h4>1. Enter Your Details</h4>
                <p>Provide your phone number and postal code</p>
              </div>
            </div>
            <div className={styles.infoStep}>
              <div className={styles.infoIcon}>📍</div>
              <div>
                <h4>2. Geofence Check</h4>
                <p>We validate your postal code against the target constituency boundary</p>
              </div>
            </div>
            <div className={styles.infoStep}>
              <div className={styles.infoIcon}>🔑</div>
              <div>
                <h4>3. Get Access</h4>
                <p>Verified residents receive write access. Others get read-only JWT tokens</p>
              </div>
            </div>
          </div>

          <div className={styles.accessTable}>
            <h3 className={styles.accessTitle}>Access Levels</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Read-Only</th>
                  <th>Verified ✅</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>View issues</td><td>✓</td><td>✓</td></tr>
                <tr><td>View tenders</td><td>✓</td><td>✓</td></tr>
                <tr><td>Vote on issues</td><td>✗</td><td>✓</td></tr>
                <tr><td>Submit new issues</td><td>✗</td><td>✓</td></tr>
                <tr><td>Access dashboard</td><td>✗</td><td>✓</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Auth Form */}
        <div className={styles.formPanel}>
          {step === 'form' && (
            <div className={`glass-card ${styles.formCard}`}>
              <div className={styles.formHeader}>
                <div className={styles.formLogo}>⚡</div>
                <h1 className={styles.formTitle}>Verify Your Identity</h1>
                <p className={styles.formDesc}>
                  Confirm your constituency residence to unlock voting and submission.
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className="input-label">Phone Number</label>
                  <div className={styles.phoneWrap}>
                    <span className={styles.phoneCode}>+91</span>
                    <input
                      type="tel"
                      className={`input-field ${styles.phoneInput}`}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className="input-label">Postal Code</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="440001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                  <span className={styles.hint}>Valid Nagpur codes: 440001–440010</span>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  📍 Verify Location
                </button>
              </form>
            </div>
          )}

          {step === 'verifying' && (
            <div className={`glass-card ${styles.verifyingCard}`}>
              <div className={styles.spinner} />
              <h2 className={styles.verifyTitle}>Verifying Location...</h2>
              <p className={styles.verifyDesc}>Checking postal code against constituency bounding box</p>
              <div className={styles.verifySteps}>
                <div className={styles.verifyStep}>
                  <span className={styles.checkmark}>✓</span> Validating postal code format
                </div>
                <div className={`${styles.verifyStep} ${styles.active}`}>
                  <span className={styles.loadingDot} /> Checking geofence boundary
                </div>
                <div className={styles.verifyStep}>
                  <span className={styles.pending}>○</span> Generating JWT token
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className={`glass-card ${styles.resultCard} ${styles.successCard}`}>
              <div className={styles.resultIcon}>✅</div>
              <h2 className={styles.resultTitle}>Verified!</h2>
              <p className={styles.resultDesc}>
                You are a verified constituent of <strong>Nagpur {postalCode}</strong>. 
                You now have full write access to vote, submit issues, and participate.
              </p>
              <div className={styles.tokenBox}>
                <span className={styles.tokenLabel}>JWT Token (Write-Enabled)</span>
                <code className={styles.tokenCode}>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtbyIsInBvc3RhbF9jb2RlIjoiNDQwMDAxIiwiaXNfdmVyaWZpZWQiOnRydWV9...</code>
              </div>
              <div className={styles.resultActions}>
                <Link href="/page/issues" className="btn btn-primary">Browse Issues →</Link>
                <Link href="/page/issues/new" className="btn btn-outline">Report an Issue</Link>
              </div>
            </div>
          )}

          {step === 'fail' && (
            <div className={`glass-card ${styles.resultCard} ${styles.failCard}`}>
              <div className={styles.resultIcon}>🔒</div>
              <h2 className={styles.resultTitle}>Read-Only Access</h2>
              <p className={styles.resultDesc}>
                Postal code <strong>{postalCode}</strong> is outside the target constituency boundary. 
                You can still browse issues and tenders but cannot vote or submit.
              </p>
              <div className={styles.tokenBox}>
                <span className={styles.tokenLabel}>JWT Token (Read-Only)</span>
                <code className={styles.tokenCode}>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtbyIsInBvc3RhbF9jb2RlIjoiNDQwMDk5IiwiaXNfdmVyaWZpZWQiOmZhbHNlfQ...</code>
              </div>
              <div className={styles.resultActions}>
                <Link href="/page/issues" className="btn btn-secondary">Browse Issues (Read-Only)</Link>
                <button className="btn btn-outline" onClick={() => { setStep('form'); setPostalCode(''); }}>Try Again</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

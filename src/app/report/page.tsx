"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    issueText: "",
    postalCode: "",
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const [media, setMedia] = useState<File[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMedia(prev => [...prev, ...filesArray]);
    }
  };
  
  const removeMedia = (indexToRemove: number) => {
    setMedia(media.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call and AI deduplication
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className={styles.reportContainer}>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>CivicHub</Link>
            <div className={styles.navLinks}>
              <Link href="/dashboard" className="btn btn-outline">Dashboard</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className={`container ${styles.mainContent}`}>
        <div className={`${styles.formWrapper} brutal-panel`}>
          {submitted ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>!!</div>
              <h2>REPORT SUBMITTED</h2>
              <p className={styles.successText}>
                OUR AI ANALYZED YOUR REPORT. IT IS SIMILAR TO: <br/>
                <strong style={{fontSize: '1.5rem'}}>POTHOLE ON MAIN ST.</strong>
              </p>
              <p>WE ADDED YOUR VOTE, TAGS, AND MEDIA TO THIS ISSUE TO BOOST ITS PRIORITY.</p>
              <div className={styles.actionButtons}>
                <Link href="/dashboard" className="btn btn-primary">GO TO DASHBOARD</Link>
                <button className="btn btn-outline" onClick={() => {
                  setSubmitted(false);
                  setFormData({ issueText: "", postalCode: "" });
                  setTags([]);
                  setMedia([]);
                }}>REPORT ANOTHER</button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.formHeader}>
                <h1>FILE A REPORT</h1>
                <p className={styles.warningBanner}>WARNING: FALSE REPORTS WILL RESULT IN GEOFENCE BAN.</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="issueText">ISSUE DESCRIPTION</label>
                  <textarea
                    id="issueText"
                    rows={4}
                    placeholder="E.G., THE WATER PIPE ON MAIN ST IS LEAKING..."
                    value={formData.issueText}
                    onChange={(e) => setFormData({ ...formData, issueText: e.target.value })}
                    required
                    className="brutal-input"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="tags">TAGS (PRESS ENTER)</label>
                  <div className={styles.tagsInputContainer}>
                    <div className={styles.tagsList}>
                      {tags.map(tag => (
                        <span key={tag} className={styles.tagPill}>
                          #{tag}
                          <button type="button" onClick={() => removeTag(tag)}>×</button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      id="tags"
                      placeholder={tags.length === 0 ? "e.g. infrastructure, water" : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className={styles.tagInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>ATTACH MEDIA (IMAGES/VIDEOS)</label>
                  <div className={styles.mediaUploadContainer}>
                    <input 
                      type="file" 
                      id="media" 
                      multiple 
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className={styles.fileInput}
                    />
                    <label htmlFor="media" className={styles.fileLabel}>
                      + CHOOSE FILES
                    </label>
                    <span className={styles.mediaHelp}>Show us the issue.</span>
                  </div>
                  
                  {media.length > 0 && (
                    <div className={styles.mediaPreviewList}>
                      {media.map((file, idx) => (
                        <div key={idx} className={styles.mediaPreviewItem}>
                          <span className={styles.mediaIcon}>
                            {file.type.startsWith('video') ? '🎥' : '📷'}
                          </span>
                          <span className={styles.fileName}>{file.name}</span>
                          <button type="button" onClick={() => removeMedia(idx)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="postalCode">YOUR POSTAL CODE</label>
                  <input
                    type="text"
                    id="postalCode"
                    placeholder="E.G., 440001"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                    className="brutal-input"
                  />
                </div>

                <button 
                  type="submit" 
                  className={`btn btn-primary ${styles.submitBtn} ${isSubmitting ? styles.loading : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'ANALYZING...' : 'SUBMIT REPORT'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

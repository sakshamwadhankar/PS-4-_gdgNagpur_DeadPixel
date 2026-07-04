'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Bot, BarChart3, Search, CheckSquare, Rocket, FileText, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

function AnimatedCounter({ end, suffix = '', prefix = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      el.textContent = `${prefix}${current.toLocaleString('en-IN')}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, suffix, prefix]);

  return <span ref={ref}>0</span>;
}

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      const count = Math.floor(canvas.width * canvas.height / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className={styles.particles} />;
}

const FEATURES = [
  {
    icon: <MapPin size={24} />,
    title: 'Geofenced Participation',
    desc: 'Only verified local residents can vote and submit issues. View from anywhere, participate locally.',
    color: 'var(--color-emerald)',
  },
  {
    icon: <Bot size={24} />,
    title: 'AI Deduplication',
    desc: 'Gemini AI automatically merges duplicate complaints, ensuring every issue gets the attention it deserves.',
    color: 'var(--color-purple)',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Priority Dashboard',
    desc: 'Data-driven scoring ranks issues by votes, severity, and urgency — not politics.',
    color: 'var(--color-gold)',
  },
  {
    icon: <Search size={24} />,
    title: 'Tender Transparency',
    desc: 'Live scraping of GEM, CPPP, and eProcure portals surfaces government spending in your area.',
    color: 'var(--color-blue)',
  },
];

const STEPS = [
  { num: '01', title: 'Verify Your Location', desc: 'Enter your postal code or enable GPS to confirm you\'re a local constituent.' },
  { num: '02', title: 'Report or Vote', desc: 'Submit new civic issues or upvote existing ones. AI prevents duplicates automatically.' },
  { num: '03', title: 'Track Accountability', desc: 'Watch issues move from Proposed → Funded → In Progress → Resolved in real-time.' },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <ParticleBackground />
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            GDG Nagpur Hackathon 2025
          </div>
          <h1 className={styles.heroTitle}>
            Your Voice.<br />
            Your Ward.<br />
            <span className={styles.heroAccent}>Your Future.</span>
          </h1>
          <p className={styles.heroDesc}>
            A data-driven civic engagement platform that empowers citizens to report local issues, 
            vote on priorities, and hold representatives accountable — all verified by location.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/page/issues" className="btn btn-primary btn-lg">
              <CheckSquare size={18} /> View Issues
            </Link>
            <Link href="/page/auth" className="btn btn-secondary btn-lg">
              Get Verified <ArrowRight size={18} />
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}><AnimatedCounter end={1247} /></span>
              <span className={styles.heroStatLabel}>Issues Reported</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}><AnimatedCounter end={8543} /></span>
              <span className={styles.heroStatLabel}>Active Citizens</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}><AnimatedCounter end={156} /></span>
              <span className={styles.heroStatLabel}>Tenders Tracked</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={`section ${styles.features}`}>
        <div className="container">
          <h2 className="section-title">Powerful Features for Change</h2>
          <p className="section-subtitle">
            Everything your constituency needs for transparent, data-driven governance.
          </p>
          <div className="grid-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`glass-card ${styles.featureCard} animate-fade-in-up delay-${i + 1}`}
              >
                <div className={styles.featureIcon} style={{ background: `${f.color}20`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={`section ${styles.howItWorks}`}>
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to make your voice count in local governance.
          </p>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={s.num} className={`${styles.step} animate-fade-in-up delay-${i + 1}`}>
                <div className={styles.stepNum}>{s.num}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && <div className={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className={`section ${styles.statsSection}`}>
        <div className="container">
          <div className={styles.statsCard}>
            <div className={styles.statsGlow} />
            <h2 className={styles.statsTitle}>Platform Impact</h2>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNum}><AnimatedCounter end={389} /></span>
                <span className={styles.statLabel}>Issues Resolved</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}><AnimatedCounter end={45} suffix=" Cr" prefix="₹" /></span>
                <span className={styles.statLabel}>Funds Tracked</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}><AnimatedCounter end={12} /></span>
                <span className={styles.statLabel}>Constituencies</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}><AnimatedCounter end={97} suffix="%" /></span>
                <span className={styles.statLabel}>Citizen Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to Transform Your Constituency?</h2>
            <p className={styles.ctaDesc}>
              Join thousands of citizens already making their neighborhoods better through data-driven civic engagement.
            </p>
            <div className={styles.ctaCtas}>
              <Link href="/page/issues/new" className="btn btn-primary btn-lg">
                <Rocket size={18} /> Report an Issue
              </Link>
              <Link href="/page/tenders" className="btn btn-outline btn-lg">
                <FileText size={18} /> Browse Tenders
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

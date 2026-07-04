'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, FileText, BarChart2, Zap } from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: <Home size={18} /> },
  { href: '/page/issues', label: 'Issues', icon: <ClipboardList size={18} /> },
  { href: '/page/tenders', label: 'Tenders', icon: <FileText size={18} /> },
  { href: '/page/dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}><Zap size={24} /></span>
          <span className={styles.logoText}>
            Civic<span className={styles.logoAccent}>Pulse</span>
          </span>
        </Link>

        <div className={`${styles.navLinks} ${mobileOpen ? styles.open : ''}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <Link href="/page/auth" className={`btn btn-primary btn-sm ${styles.authBtn}`}>
            Get Verified
          </Link>
        </div>

        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

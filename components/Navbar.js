"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { label: "The Difference", href: "/#difference" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Real-time", href: "/#real-time" },
    { label: "History", href: "/#history" },
    { label: "Privacy", href: "/#privacy" },
  ];

  return (
    <>
      <header className={`nav-wrap ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">RehabCoach</Link>
          <nav className="nav-desktop">
            {links.map((l) => <a key={l.label} href={l.href} className="nav-link">{l.label}</a>)}
          </nav>
          <div className="nav-actions">
            <Link href="/health-hub" className="btn btn-primary nav-cta-desktop">Get Started</Link>
            <button className="nav-mobile-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={24} /></button>
          </div>
        </div>
      </header>
      <div className={`mobile-overlay ${menuOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <Link href="/" className="nav-logo">RehabCoach</Link>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={24} /></button>
        </div>
        <nav className="mobile-links">
          {links.map((l) => <a key={l.label} href={l.href} className="mobile-link">{l.label}</a>)}
          <Link href="/health-hub" className="btn btn-primary w-full mt-32">Get Started</Link>
        </nav>
      </div>
    </>
  );
}

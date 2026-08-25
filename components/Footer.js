import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-white)', padding: '80px 0 40px', borderTop: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '48px' }}>
          <div>
            <Link href="/" style={{ fontSize: '24px', fontWeight: 800, display: 'block', marginBottom: '16px' }}>Corvo</Link>
            <p style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.4 }}>Move better.<br/>One rep at a time.</p>
          </div>
          <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}>PRODUCT</h4>
              <a href="/#difference" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>The Difference</a>
              <a href="/#how-it-works" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>How It Works</a>
              <a href="/#real-time" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Real-time</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}>LEGAL</h4>
              <Link href="/privacy" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Privacy Policy</Link>
              <Link href="/about" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>About</Link>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '600px' }}>
            Corvo provides movement-quality feedback and does not diagnose injuries, assess recovery, or prescribe treatment.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px' }}>© {new Date().getFullYear()} Corvo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

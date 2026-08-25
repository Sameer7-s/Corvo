import Link from "next/link";
import "./Auth.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>RehabCoach</Link>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="auth-container">
          {children}
        </div>
      </main>
    </div>
  );
}

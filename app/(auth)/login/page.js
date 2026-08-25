"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/health-hub");
      router.refresh();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="auth-header"
    >
      <h1 className="h-app mb-16">Welcome back.</h1>
      <p className="t-body mb-40">Ready for your next movement session?</p>
      
      {error && <div className="f-pill ERROR mb-24" style={{width: '100%', borderRadius: '8px'}}>{error}</div>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="input-group">
          <label className="auth-label">Email</label>
          <input 
            type="email" 
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="demo@rehabcoach.app"
          />
        </div>
        <div className="input-group">
          <label className="auth-label">Password</label>
          <input 
            type="password" 
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <PrimaryButton type="submit" className="w-full" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </PrimaryButton>
      </form>

      <div className="auth-footer mt-24" style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link href="/signup" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Sign up</Link>
      </div>
    </motion.div>
  );
}

"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create account");
      }

      // Auto login after signup
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        throw new Error("Account created, but login failed.");
      }

      router.push("/health-hub");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="auth-header"
    >
      <h1 className="h-app mb-16">Create Account.</h1>
      <p className="t-body mb-40">Start tracking your movement.</p>
      
      {error && <div className="f-pill ERROR mb-24" style={{width: '100%', borderRadius: '8px', padding: '12px'}}>{error}</div>}

      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="input-group">
          <label className="auth-label">Full Name</label>
          <input 
            type="text" 
            className="auth-input"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="John Doe"
          />
        </div>
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
          {loading ? "CREATING..." : "CREATE ACCOUNT"}
        </PrimaryButton>
      </form>

      <div className="auth-footer mt-24" style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Login</Link>
      </div>
    </motion.div>
  );
}

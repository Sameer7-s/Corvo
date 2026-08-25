"use client";
import { useState } from "react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="h-app mb-16">Reset Password.</h1>
        <p className="t-body">Enter your email to receive a reset link.</p>
      </div>

      {!submitted ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <PrimaryButton type="submit" className="w-full mt-16">SEND RESET LINK</PrimaryButton>
        </form>
      ) : (
        <div className="auth-form center">
          <div className="auth-error mb-24" style={{ background: 'var(--soft-blue)', color: 'var(--text-primary)' }}>
            Password reset email service is not configured yet.
          </div>
          <p className="t-body mb-24">In a production environment, a secure reset token would be emailed to {email}.</p>
        </div>
      )}

      <div className="auth-links mt-32">
        <span className="t-small">
          Remembered your password? <Link href="/login" className="bold-link">LOG IN</Link>
        </span>
      </div>
    </>
  );
}

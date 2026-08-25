"use client";
import { signOut } from "next-auth/react";
import SecondaryButton from "@/components/SecondaryButton";
import { LogOut } from "lucide-react";

export default function Profile() {
  return (
    <div className="max-w-2xl">
      <div className="mb-40">
        <h1 className="h-app mb-16">Profile.</h1>
        <p className="t-body">Manage your account.</p>
      </div>

      <div className="dash-card mb-32">
        <h3 className="h-card mb-16">Profile Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <div><span style={{color: 'var(--text-muted)', fontSize: 13, fontWeight: 700}}>NAME</span><div style={{fontWeight: 600}}>Demo Athlete</div></div>
          <div><span style={{color: 'var(--text-muted)', fontSize: 13, fontWeight: 700}}>EMAIL</span><div style={{fontWeight: 600}}>demo@corvo.app</div></div>
        </div>

        <h3 className="h-card mb-16">Account Actions</h3>
        
        <SecondaryButton 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-16"
          style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
        >
          <LogOut size={18} style={{ marginRight: 8 }} />
          Log out
        </SecondaryButton>
      </div>
    </div>
  );
}

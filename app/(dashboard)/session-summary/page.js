"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function SessionSummary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/sessions/${id}`)
        .then(r => r.json())
        .then(res => setData(res.data));
    }
  }, [id]);

  if (!data) return <div className="p-24">Loading summary...</div>;

  return (
    <div className="max-w-2xl mx-auto pt-32">
      <div className="center mb-40">
        <span className="eyebrow">SESSION COMPLETE</span>
        <h1 className="h-app mb-16">Great work today.</h1>
        <p className="t-body">You've completed your bodyweight squat session.</p>
      </div>

      <div className="dash-card mb-32 center" style={{ background: 'var(--text-primary)', color: 'var(--bg-white)' }}>
        <div className="dash-section-title" style={{ color: 'rgba(255,255,255,0.6)' }}>OVERALL MOVEMENT QUALITY</div>
        <div className="metric-val" style={{ fontSize: '72px', margin: '16px 0' }}>{data.movementQuality}%</div>
      </div>

      <div className="dash-grid mb-32" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="dash-card">
          <div className="dash-section-title">ACCEPTED REPS</div>
          <div className="metric-val" style={{ color: 'var(--color-success)' }}>{data.acceptedReps}</div>
          <div className="t-small">out of {data.attemptedReps} attempted</div>
        </div>
        <div className="dash-card">
          <div className="dash-section-title">REJECTED REPS</div>
          <div className="metric-val" style={{ color: 'var(--color-error)' }}>{data.rejectedReps}</div>
          <div className="t-small">due to form breakdown</div>
        </div>
      </div>

      {data.rejectedReps > 0 && (
        <div className="dash-card mb-40" style={{ background: 'var(--soft-blue)', borderColor: 'transparent' }}>
          <div className="dash-section-title">AI FEEDBACK</div>
          <div className="t-body" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            <AlertCircle size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} color="var(--color-error)" />
            Your depth was slightly insufficient on {data.rejectedReps} reps. Try to break parallel on your next session.
          </div>
        </div>
      )}

      <div className="center mt-64">
        <PrimaryButton onClick={() => router.push("/health-hub")}>RETURN TO DASHBOARD</PrimaryButton>
      </div>
    </div>
  );
}

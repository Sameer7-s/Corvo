"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/PrimaryButton";
import { Camera, Check } from "lucide-react";

export default function Calibration() {
  const [status, setStatus] = useState("NOT_STARTED");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/calibration")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setStatus(data.data.status);
        }
        setLoading(false);
      });
  }, []);

  const handleStart = async () => {
    // Mock calibration completion
    await fetch("/api/calibration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED", baselineData: { height: 180, proportions: { leg: 0.5, torso: 0.4 } } })
    });
    router.push("/health-hub");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-40">
        <h1 className="h-app mb-16">Calibration.</h1>
        <p className="t-body">We need to map your body proportions for accurate movement analysis.</p>
      </div>

      {status === "COMPLETED" ? (
        <div className="dash-card center" style={{ background: 'var(--soft-green)', borderColor: 'transparent' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--bg-white)', borderRadius: '50%', color: 'var(--color-success)', marginBottom: '24px' }}>
            <Check size={40} />
          </div>
          <h2 className="h-card mb-16">Calibration Complete</h2>
          <p className="t-body mb-32">Your baseline proportions have been mapped successfully.</p>
          <PrimaryButton onClick={() => setStatus("NOT_STARTED")}>RECALIBRATE</PrimaryButton>
        </div>
      ) : (
        <div className="dash-card">
          <div className="center mb-32">
            <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--soft-blue)', borderRadius: '50%', color: 'var(--color-ai)', marginBottom: '24px' }}>
              <Camera size={40} />
            </div>
            <h2 className="h-card mb-16">Baseline Mapping</h2>
            <p className="t-body max-w-2xl mx-auto">Stand in front of your camera in an "A-pose" (arms slightly out) so we can map your limb lengths.</p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px' }}>
              <li style={{ display: 'flex', gap: '12px' }}><strong>1.</strong> Ensure your full body is visible from head to toe.</li>
              <li style={{ display: 'flex', gap: '12px' }}><strong>2.</strong> Wear form-fitting clothing for better accuracy.</li>
              <li style={{ display: 'flex', gap: '12px' }}><strong>3.</strong> Ensure the room is well lit.</li>
            </ul>
          </div>

          <PrimaryButton onClick={handleStart} className="w-full">START CALIBRATION</PrimaryButton>
        </div>
      )}
    </div>
  );
}

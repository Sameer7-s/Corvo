"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => setStep(2);
  
  const handleFinish = async () => {
    // In a real app, we'd save these preferences to the user profile via API
    // For now we just route to health-hub
    router.push("/health-hub");
  };

  return (
    <>
      <div className="auth-header mb-32">
        <h1 className="h-app mb-16">
          {step === 1 ? "What's your primary goal?" : "How to set up."}
        </h1>
        <p className="t-body">
          {step === 1 ? "We'll customize your movement analysis based on what you want to achieve." : "RehabCoach uses your phone's camera to analyze your movement in real-time."}
        </p>
      </div>

      {step === 1 ? (
        <div className="auth-form" style={{ gap: '16px' }}>
          <SecondaryButton type="button" className="w-full" onClick={handleNext} style={{ justifyContent: 'flex-start', padding: '16px 24px', fontWeight: 500 }}>
            <span style={{ fontSize: '20px', marginRight: '16px' }}>🏃</span> Return from injury
          </SecondaryButton>
          <SecondaryButton type="button" className="w-full" onClick={handleNext} style={{ justifyContent: 'flex-start', padding: '16px 24px', fontWeight: 500 }}>
            <span style={{ fontSize: '20px', marginRight: '16px' }}>🏋️</span> Improve form & technique
          </SecondaryButton>
          <SecondaryButton type="button" className="w-full" onClick={handleNext} style={{ justifyContent: 'flex-start', padding: '16px 24px', fontWeight: 500 }}>
            <span style={{ fontSize: '20px', marginRight: '16px' }}>🧘</span> Increase mobility
          </SecondaryButton>
        </div>
      ) : (
        <div className="auth-form">
          <div className="dash-card mb-24" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
            <h3 className="h-card mb-16" style={{ fontSize: '18px' }}>1. Find a clear space</h3>
            <p className="t-body" style={{ fontSize: '14px' }}>Ensure you have enough room to perform the movement safely.</p>
          </div>
          <div className="dash-card mb-32" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
            <h3 className="h-card mb-16" style={{ fontSize: '18px' }}>2. Position your camera</h3>
            <p className="t-body" style={{ fontSize: '14px' }}>Prop up your phone vertically so your full body is visible.</p>
          </div>
          <PrimaryButton type="button" className="w-full" onClick={handleFinish}>
            ENTER HEALTH HUB
          </PrimaryButton>
        </div>
      )}
    </>
  );
}

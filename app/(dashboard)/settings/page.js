"use client";
import { useState, useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton";

export default function Settings() {
  const [settings, setSettings] = useState({ targetReps: 10, voiceFeedback: true, voiceVolume: 70 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) setSettings(data.data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) setMsg("Settings saved successfully.");
    } catch (err) {
      setMsg("Failed to save settings.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-40">
        <h1 className="h-app mb-16">Settings.</h1>
        <p className="t-body">Customize your session preferences.</p>
      </div>

      {msg && <div className="mb-24 p-16" style={{ background: 'var(--soft-green)', color: 'var(--color-success)', borderRadius: '8px', fontWeight: 600 }}>{msg}</div>}

      <form onSubmit={handleSave} className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
          <h3 className="h-card mb-16">Session Defaults</h3>
          <div className="form-group">
            <label>Default Target Reps</label>
            <input type="number" min="1" max="50" value={settings.targetReps} onChange={e => setSettings({...settings, targetReps: parseInt(e.target.value)})} />
          </div>
        </div>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
          <h3 className="h-card mb-16">Audio Feedback</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <input type="checkbox" id="voiceFeedback" checked={settings.voiceFeedback} onChange={e => setSettings({...settings, voiceFeedback: e.target.checked})} style={{ width: '20px', height: '20px' }} />
            <label htmlFor="voiceFeedback" style={{ fontSize: '15px', fontWeight: 600 }}>Enable real-time voice corrections</label>
          </div>
          
          <div className="form-group">
            <label>Voice Volume ({settings.voiceVolume}%)</label>
            <input type="range" min="0" max="100" value={settings.voiceVolume} onChange={e => setSettings({...settings, voiceVolume: parseInt(e.target.value)})} disabled={!settings.voiceFeedback} />
          </div>
        </div>

        <PrimaryButton type="submit" disabled={saving}>{saving ? "SAVING..." : "SAVE SETTINGS"}</PrimaryButton>
      </form>
    </div>
  );
}

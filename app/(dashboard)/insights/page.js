"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Target, Zap } from "lucide-react";

export default function Insights() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/insights")
      .then(r => r.json())
      .then(res => setData(res.data));
  }, []);

  if (!data) return <div>Loading insights...</div>;

  if (data.isEmpty) {
    return (
      <div>
        <h1 className="h-app mb-16">Insights.</h1>
        <div className="dash-card center p-32">
          <p className="t-body">Complete a few sessions to see your movement trends and AI insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-40">
        <h1 className="h-app mb-16">Insights.</h1>
        <p className="t-body">AI-driven analysis of your movement over time.</p>
      </div>

      <div className="dash-grid mb-32">
        <div className="dash-card">
          <div className="dash-section-title">CURRENT QUALITY</div>
          <div className="metric-val">{data.currentQuality}%</div>
          {data.qualityTrend != null && (
            <div className={`trend ${data.qualityTrend >= 0 ? 'positive' : 'negative'}`}>
              <TrendingUp size={16} /> {data.qualityTrend >= 0 ? '+' : ''}{data.qualityTrend}% trend
            </div>
          )}
        </div>
        
        <div className="dash-card">
          <div className="dash-section-title">CONSISTENCY SCORE</div>
          <div className="metric-val">{data.mostConsistent || 0}%</div>
          <div className="t-small">Based on variation between reps</div>
        </div>
        
        <div className="dash-card">
          <div className="dash-section-title">TOTAL SESSIONS</div>
          <div className="metric-val">{data.totalSessions}</div>
        </div>
      </div>

      <div className="dash-grid">
        {data.mostCommonIssue && (
          <div className="dash-card" style={{ background: 'var(--soft-blue)', borderColor: 'transparent' }}>
            <div className="dash-section-title" style={{ color: 'var(--text-secondary)' }}>AREA TO FOCUS ON</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginTop: '16px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-white)', borderRadius: '12px', color: 'var(--text-primary)' }}>
                <Target size={24} />
              </div>
              <div>
                <h3 className="h-card mb-8">{data.mostCommonIssue.type}</h3>
                <p className="t-body">This error occurred {data.mostCommonIssue.count} times recently. Focus on maintaining control during the eccentric phase.</p>
              </div>
            </div>
          </div>
        )}

        {data.improvingArea && (
          <div className="dash-card" style={{ background: 'var(--soft-green)', borderColor: 'transparent' }}>
            <div className="dash-section-title" style={{ color: 'var(--text-secondary)' }}>IMPROVING AREA</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginTop: '16px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-white)', borderRadius: '12px', color: 'var(--text-primary)' }}>
                <Zap size={24} />
              </div>
              <div>
                <h3 className="h-card mb-8">{data.improvingArea.area}</h3>
                <p className="t-body">Your {data.improvingArea.area.toLowerCase()} score has improved by {data.improvingArea.change}% over your last few sessions. Great work.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

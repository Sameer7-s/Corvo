"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then(r => r.json())
      .then(data => {
        if (data.success) setSessions(data.data.filter(s => s.completedAt));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading history...</div>;

  return (
    <div>
      <div className="mb-40">
        <h1 className="h-app mb-16">History.</h1>
        <p className="t-body">Your past movement sessions.</p>
      </div>

      <div className="dash-card">
        {sessions.length > 0 ? (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>DATE</th>
                <th style={{ padding: '16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>EXERCISE</th>
                <th style={{ padding: '16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>REPS</th>
                <th style={{ padding: '16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>QUALITY</th>
                <th style={{ padding: '16px 0', fontSize: '12px', color: 'var(--text-muted)' }}></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '24px 0', fontWeight: 600 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '24px 0', textTransform: 'capitalize' }}>{s.exercise.replace('_', ' ')}</td>
                  <td style={{ padding: '24px 0' }}>{s.acceptedReps} / {s.attemptedReps}</td>
                  <td style={{ padding: '24px 0' }}>{s.movementQuality}%</td>
                  <td style={{ padding: '24px 0', textAlign: 'right' }}>
                    <Link href={`/session-summary?id=${s.id}`} style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
                      View <ArrowRight size={16} style={{ marginLeft: 4 }} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="t-body center py-32">No completed sessions yet.</div>
        )}
      </div>
    </div>
  );
}

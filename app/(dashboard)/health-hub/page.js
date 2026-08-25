"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HealthHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, insightsRes] = await Promise.all([
          fetch("/api/sessions"),
          fetch("/api/insights")
        ]);
        const sessionsData = await sessionsRes.json();
        const insightsData = await insightsRes.json();
        
        setData({
          sessions: sessionsData.data || [],
          insights: insightsData.data || {}
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-24">Loading your data...</div>;

  const latestSession = data?.sessions?.[0];
  const recentSessions = data?.sessions?.slice(0, 3) || [];
  const quality = data?.insights?.currentQuality || 0;
  const trend = data?.insights?.qualityTrend;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } }
  };

  return (
    <motion.div 
      className="health-hub"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="dash-grid">
        {/* Today's Movement */}
        <motion.div variants={itemVariants} className="dash-card dash-main-action" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="dash-section-title">TODAY'S MOVEMENT</div>
          <h2 className="h-app mb-8">BODYWEIGHT SQUAT</h2>
          <div className="action-meta">
            <span className="target-reps">10 TARGET REPS</span>
            <span className="est-time">Est. time: 5 min</span>
          </div>
          <PrimaryButton href="/session" className="mt-32 w-full lg-auto">
            START SESSION
          </PrimaryButton>
        </motion.div>

        {/* Movement Quality */}
        <motion.div variants={itemVariants} className="dash-card dash-metric">
          <div className="dash-section-title">MOVEMENT QUALITY</div>
          <div className="metric-val">{quality ? `${quality}%` : '--'}</div>
          {trend != null && (
            <div className={`trend ${trend >= 0 ? 'positive' : 'negative'}`}>
              <ArrowUpRight size={16} /> {trend >= 0 ? '+' : ''}{trend}% from previous
            </div>
          )}
        </motion.div>

        {/* Last Session */}
        <motion.div variants={itemVariants} className="dash-card dash-last-session">
          <div className="dash-section-title">LAST SESSION</div>
          {latestSession ? (
            <>
              <div className="last-session-stats">
                <div className="stat">
                  <span className="s-val">{latestSession.acceptedReps} / {latestSession.attemptedReps}</span>
                  <span className="s-lbl">GOOD REPS</span>
                </div>
                <div className="stat">
                  <span className="s-val">{latestSession.movementQuality || 0}%</span>
                  <span className="s-lbl">QUALITY</span>
                </div>
              </div>
              <Link href={`/history/${latestSession.id}`} className="dash-link">
                VIEW SESSION <ArrowRight size={16} />
              </Link>
            </>
          ) : (
             <div className="t-body">Complete a session to see stats.</div>
          )}
        </motion.div>

        {/* Today's Insight */}
        <motion.div variants={itemVariants} className="dash-card dash-insight">
          <div className="dash-section-title">TODAY'S INSIGHT</div>
          <p className="insight-text">
            {data?.insights?.mostCommonIssue 
              ? `"Your most common issue recently was ${data.insights.mostCommonIssue.type.toLowerCase()}."`
              : `"You're moving well. Keep up the consistency!"`}
          </p>
          <Link href="/insights" className="dash-link">
            VIEW DETAILS <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div variants={itemVariants} className="dash-card dash-recent">
          <div className="dash-section-title">RECENT SESSIONS</div>
          <div className="recent-list">
            {recentSessions.length > 0 ? recentSessions.map(s => (
              <Link key={s.id} href={`/history/${s.id}`} className="recent-item">
                <div className="r-left">
                  <span className="r-date">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="r-mid">
                  <span className="r-reps">{s.acceptedReps} / {s.attemptedReps}</span>
                </div>
                <div className="r-right">
                  <span className="r-qual">{s.movementQuality}%</span>
                </div>
              </Link>
            )) : (
              <div className="t-body">No sessions yet.</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

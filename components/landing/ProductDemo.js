"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, User, Expand, Maximize, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./ProductDemo.css";

export default function ProductDemo() {
  const [squatting, setSquatting] = useState(false);
  const [repCount, setRepCount] = useState(8);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Animation Loop: Stand (2s) -> Squat (1s) -> Form Good (1s) -> Stand -> rep++
    const loop = setInterval(() => {
      setSquatting(true);
      
      setTimeout(() => {
        setShowFeedback(true);
      }, 800); // Near bottom of squat

      setTimeout(() => {
        setSquatting(false);
        setRepCount(prev => prev < 10 ? prev + 1 : 1);
      }, 1500); // Ascending

      setTimeout(() => {
        setShowFeedback(false);
      }, 2500); // Hide feedback after standing

    }, 4000);

    return () => clearInterval(loop);
  }, []);

  return (
    <div className="demo-container">
      {/* Header */}
      <div className="demo-header">
        <div className="demo-title">
          <div style={{width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%'}}></div>
          LIVE ANALYSIS
        </div>
        <div className="demo-status">
          <Activity size={14} /> TRACKING
        </div>
      </div>

      {/* Camera Area & Skeleton */}
      <div className="demo-camera-area">
        <div className={`demo-skeleton ${squatting ? "squat" : ""}`}>
          <div className="sk-head sk-joint"></div>
          <div className="sk-line sk-torso"></div>
          <div className="sk-hip sk-joint"></div>
          
          <div className="sk-line sk-thigh-l"></div>
          <div className="sk-knee-l sk-joint"></div>
          <div className="sk-line sk-calf-l"></div>
          
          <div className="sk-line sk-thigh-r"></div>
          <div className="sk-knee-r sk-joint"></div>
          <div className="sk-line sk-calf-r"></div>

          <div className="sk-line sk-arm-l"></div>
          <div className="sk-line sk-arm-r"></div>
        </div>
      </div>

      {/* Left Panel */}
      <div className="demo-left-panel">
        <div className="demo-exercise-name">BODYWEIGHT SQUAT</div>
        <div className="demo-rep-count">{repCount} <span>/ 10</span></div>
        <div className="demo-rep-label">GOOD REPS</div>
        
        <div style={{ height: 40 }}>
          <AnimatePresence>
            {showFeedback && (
              <motion.div 
                className="demo-feedback-pill"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 size={16} color="var(--primary)"/> FORM GOOD
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="demo-progress-bg">
          <div className="demo-progress-fill" style={{ width: `${(repCount / 10) * 100}%` }}></div>
        </div>
      </div>

      {/* Right Sidebar Stats */}
      <div className="demo-sidebar">
        <div className="demo-stat-card">
          <div className="demo-stat-header">
            <span>DEPTH</span> <Expand size={14} className="demo-stat-icon"/>
          </div>
          <div className="demo-stat-val">92%</div>
          <div className="demo-stat-bar-bg"><div className="demo-stat-bar-fill" style={{width: '92%'}}></div></div>
        </div>
        
        <div className="demo-stat-card">
          <div className="demo-stat-header">
            <span>ALIGNMENT</span> <Maximize size={14} className="demo-stat-icon"/>
          </div>
          <div className="demo-stat-val">89%</div>
          <div className="demo-stat-bar-bg"><div className="demo-stat-bar-fill" style={{width: '89%'}}></div></div>
        </div>

        <div className="demo-stat-card">
          <div className="demo-stat-header">
            <span>TRACKING</span> <Activity size={14} className="demo-stat-icon"/>
          </div>
          <div className="demo-stat-val">97%</div>
          <div className="demo-stat-bar-bg"><div className="demo-stat-bar-fill" style={{width: '97%'}}></div></div>
        </div>
      </div>

      {/* Bottom Badge */}
      <div className="demo-bottom-badge">
        <User size={14} /> BODY DETECTED
      </div>

    </div>
  );
}

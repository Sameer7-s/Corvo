"use client";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import ProductDemo from "@/components/landing/ProductDemo";
import "./Landing.css";
import { ArrowRight, Target, Activity, ShieldCheck, History, Eye, CheckCircle2, Lock, Camera, BrainCircuit, LineChart } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, y: 0,
      transition: { type: "spring", stiffness: 70, damping: 15 }
    }
  };

  return (
    <div className="landing">
      
      {/* 01. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-grid">
          
          <motion.div 
            className="hero-text"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={itemVariants} className="hero-eyebrow">
              REAL-TIME MOVEMENT ANALYSIS
            </motion.span>
            
            <motion.h1 variants={itemVariants} className="h-hero-main">
              YOUR MOVEMENT.<br /><span>UNDERSTOOD.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="hero-description">
              Camera-powered rehabilitation that doesn't just count reps. Corvo analyzes movement quality, alignment, and depth in real time.
            </motion.p>
            
            <motion.div variants={itemVariants} className="hero-actions">
              <PrimaryButton href="/health-hub">START A SESSION <ArrowRight size={16} className="ml-8"/></PrimaryButton>
              <SecondaryButton href="#how-it-works">SEE HOW IT WORKS</SecondaryButton>
            </motion.div>

            {/* Trust Line */}
            <motion.div variants={itemVariants} className="trust-line">
              <div className="trust-label">Trusted by people on their recovery journey</div>
              <div className="trust-badges">
                <div className="trust-badge"><ShieldCheck size={16} color="var(--primary)"/> Privacy First</div>
                <div className="trust-badge"><Lock size={16} color="var(--primary)"/> Secure Sessions</div>
                <div className="trust-badge"><Activity size={16} color="var(--primary)"/> AI-Powered Insights</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 50, damping: 20 }}
          >
            <ProductDemo />
          </motion.div>

        </div>
      </section>

      {/* Feature Strip (Below Hero) */}
      <div id="difference" className="feature-strip-container">
        <div className="feature-strip">
          <div className="strip-item">
            <div className="strip-icon"><Camera size={20}/></div>
            <div className="strip-text">
              <h4>Camera-Powered</h4>
              <p>Works with your device. No extra equipment.</p>
            </div>
          </div>
          <div className="strip-item">
            <div className="strip-icon"><BrainCircuit size={20}/></div>
            <div className="strip-text">
              <h4>AI Movement Analysis</h4>
              <p>Advanced computer vision analyzes your form.</p>
            </div>
          </div>
          <div className="strip-item">
            <div className="strip-icon"><Activity size={20}/></div>
            <div className="strip-text">
              <h4>Real-Time Feedback</h4>
              <p>Immediate insights to help you move better.</p>
            </div>
          </div>
          <div className="strip-item">
            <div className="strip-icon"><LineChart size={20}/></div>
            <div className="strip-text">
              <h4>Track Progress</h4>
              <p>Every session helps you improve over time.</p>
            </div>
          </div>
        </div>
      </div>


      {/* 03. HOW IT WORKS */}
      <section id="how-it-works" className="section-padding bg-primary">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="center mb-64 text-center">
            <motion.h2 variants={itemVariants} className="h-section mb-16">HOW IT WORKS</motion.h2>
          </div>

          <div className="features-grid">
            <motion.div variants={itemVariants} className="dash-card" style={{textAlign: 'center', background: 'var(--bg-white)', border: '1px solid var(--border-color)', boxShadow: 'none'}}>
              <span className="step-number">01 / POSITION</span>
              <p className="t-body" style={{fontWeight: 600, color: 'var(--text-primary)'}}>Stand in front of your camera.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="dash-card" style={{textAlign: 'center', background: 'var(--bg-white)', border: '1px solid var(--border-color)', boxShadow: 'none'}}>
              <span className="step-number">02 / MOVE</span>
              <p className="t-body" style={{fontWeight: 600, color: 'var(--text-primary)'}}>Perform your exercise naturally.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="dash-card" style={{textAlign: 'center', background: 'var(--bg-white)', border: '1px solid var(--border-color)', boxShadow: 'none'}}>
              <span className="step-number">03 / ANALYZE</span>
              <p className="t-body" style={{fontWeight: 600, color: 'var(--text-primary)'}}>Corvo evaluates movement in real time.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 04. REAL-TIME FEEDBACK */}
      <section id="real-time" className="section-padding bg-secondary">
        <motion.div 
          className="container hero-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="dash-card" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div><span style={{fontSize: 10, fontWeight: 800, color: 'var(--text-muted)'}}>GOOD REP</span><div style={{fontSize: 32, fontWeight: 800}}>8 / 10</div></div>
              <div style={{background: 'var(--success)', color: 'white', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8}}><CheckCircle2 size={14}/> GOOD</div>
            </div>
            <div style={{display: 'flex', gap: 16}}>
              <div style={{flex: 1, background: 'var(--bg-primary)', padding: 16, borderRadius: 12}}>
                <div style={{fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)'}}>DEPTH</div>
                <div style={{fontSize: 20, fontWeight: 800, color: 'var(--primary-dark)'}}>92%</div>
              </div>
              <div style={{flex: 1, background: 'var(--bg-primary)', padding: 16, borderRadius: 12}}>
                <div style={{fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)'}}>ALIGNMENT</div>
                <div style={{fontSize: 20, fontWeight: 800, color: 'var(--primary-dark)'}}>89%</div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="h-section mb-24">REAL-TIME FEEDBACK</h2>
            <p className="t-body max-w-lg">
              Immediate feedback helps users understand how they are moving, not just how much.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 05. HISTORY */}
      <section id="history" className="section-padding bg-primary">
        <motion.div 
          className="container hero-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h2 className="h-section mb-24">YOUR PROGRESS,<br/>OVER TIME.</h2>
            <p className="t-body max-w-lg">
              Every completed session becomes part of your personal movement history.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            <div className="dash-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px'}}>
              <span style={{fontWeight: 700, color: 'var(--text-secondary)'}}>AUG 25</span>
              <div style={{textAlign: 'right'}}><span style={{fontWeight: 800, fontSize: 18}}>8 / 10</span> <span style={{color: 'var(--primary)', fontWeight: 700, marginLeft: 16}}>84%</span></div>
            </div>
            <div className="dash-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', opacity: 0.8}}>
              <span style={{fontWeight: 700, color: 'var(--text-secondary)'}}>AUG 24</span>
              <div style={{textAlign: 'right'}}><span style={{fontWeight: 800, fontSize: 18}}>7 / 10</span> <span style={{color: 'var(--primary)', fontWeight: 700, marginLeft: 16}}>79%</span></div>
            </div>
            <div className="dash-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', opacity: 0.6}}>
              <span style={{fontWeight: 700, color: 'var(--text-secondary)'}}>AUG 22</span>
              <div style={{textAlign: 'right'}}><span style={{fontWeight: 800, fontSize: 18}}>6 / 10</span> <span style={{color: 'var(--primary)', fontWeight: 700, marginLeft: 16}}>71%</span></div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 06. PRIVACY */}
      <section id="privacy" className="section-padding bg-secondary">
        <motion.div 
          className="container center text-center max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="icon-wrap mb-24"><ShieldCheck size={32} color="var(--primary)"/></motion.div>
          <motion.h2 variants={itemVariants} className="h-section mb-24">YOUR MOVEMENT.<br/>YOUR DATA.</motion.h2>
          <motion.p variants={itemVariants} className="t-body">
            Corvo is designed around privacy. Camera access is only requested when you start a movement session.
          </motion.p>
        </motion.div>
      </section>

      {/* 07. FINAL CTA */}
      <section className="section-padding bg-dark">
        <motion.div 
          className="container center text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="h-section mb-24">READY TO MOVE BETTER?</h2>
          <p className="t-body mb-40" style={{color: 'rgba(255,255,255,0.7)'}}>Start your first movement session with Corvo.</p>
          <PrimaryButton href="/health-hub" className="mt-16">START A SESSION</PrimaryButton>
        </motion.div>
      </section>
    </div>
  );
}

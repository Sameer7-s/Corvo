"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Camera, ShieldAlert } from "lucide-react";
import { usePoseDetector } from "@/components/camera/usePoseDetector";
import { drawPose } from "@/components/camera/PoseOverlay";
import { SquatAnalyzer } from "@/lib/movement/squatAnalyzer";
import { validateRep } from "@/lib/movement/repValidator";
import { analyzePushupWithAPI } from "@/lib/movement/externalApiAnalyzer";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import "./Session.css";

export default function Session() {
  const router = useRouter();
  
  // Exercise Selection
  const [exercise, setExercise] = useState("SQUAT"); // "SQUAT" or "PUSHUP"

  // SETUP -> PERMISSION -> READY -> COUNTDOWN -> ACTIVE -> FINISHED
  const [phase, setPhase] = useState("SETUP"); 
  const [countdown, setCountdown] = useState(3);
  
  // Session Data
  const [sessionId, setSessionId] = useState(null);
  const targetReps = 10;
  const [repCount, setRepCount] = useState(0);
  const [sessionData, setSessionData] = useState({ 
    attempted: 0, accepted: 0, rejected: 0, depth: [], align: [] 
  });
  
  // Camera & ML State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [personVisible, setPersonVisible] = useState(false);
  const [feedback, setFeedback] = useState({ type: "NONE", msg: "" });
  
  const { landmarker, isReady, error: mlError } = usePoseDetector();
  const analyzerRef = useRef(null);
  const lastApiCallTime = useRef(0);

  // Initialize the Squat Analyzer
  useEffect(() => {
    analyzerRef.current = new SquatAnalyzer((depthScore, alignmentScore) => {
      if (exercise !== "SQUAT") return; // Only process if Squat is active

      setSessionData(prev => {
        const attempted = prev.attempted + 1;
        const validation = validateRep(depthScore, alignmentScore);
        
        const repData = {
          number: attempted,
          status: validation.isValid ? "ACCEPTED" : "REJECTED",
          errorType: validation.errorType,
          feedback: validation.feedback,
          depthScore: Math.round(depthScore),
          alignmentScore: Math.round(alignmentScore),
          trackingConfidence: 95
        };

        // UI Update
        if (validation.isValid) {
          setRepCount(prevCount => prevCount + 1);
          setFeedback({ type: "GOOD", msg: "✓ FORM GOOD" });
        } else {
          setFeedback({ type: "ERROR", msg: `✕ ${validation.feedback}` });
        }
        setTimeout(() => setFeedback({ type: "NONE", msg: "" }), 3000);

        // Async API Save
        setSessionId(currentId => {
          if (currentId) {
            fetch("/api/repetitions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: currentId, ...repData })
            }).catch(console.error);
          }
          return currentId;
        });

        return {
          attempted,
          accepted: validation.isValid ? prev.accepted + 1 : prev.accepted,
          rejected: validation.isValid ? prev.rejected : prev.rejected + 1,
          depth: [...prev.depth, repData.depthScore],
          align: [...prev.align, repData.alignmentScore]
        };
      });
    });
  }, [exercise]);

  // Request Camera Permissions
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setPhase("READY");
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      setCameraError("Camera access denied or unavailable. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Inference Loop
  useEffect(() => {
    let animationFrameId;
    let lastVideoTime = -1;

    const renderLoop = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && landmarker && video.readyState >= 2 && (phase === "READY" || phase === "ACTIVE" || phase === "COUNTDOWN")) {
        const ctx = canvas.getContext("2d");
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Only run Local Pose Detection for Squats (or if we still want to draw the skeleton for Pushups)
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const result = landmarker.detectForVideo(video, performance.now());
          
          if (result && result.landmarks && result.landmarks.length > 0) {
            setPersonVisible(true);
            drawPose(ctx, result.landmarks[0]);
            
            // LOCAL SQUAT ANALYSIS
            if (phase === "ACTIVE" && exercise === "SQUAT" && analyzerRef.current) {
              analyzerRef.current.analyze(result.landmarks[0]);
            }
          } else {
            setPersonVisible(false);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          // EXTERNAL API PUSHUP ANALYSIS (Throttle to 1 frame every 500ms to avoid spamming the API)
          if (phase === "ACTIVE" && exercise === "PUSHUP") {
            const now = Date.now();
            if (now - lastApiCallTime.current > 500) {
              lastApiCallTime.current = now;
              
              // Extract frame as Base64 Image
              const base64Image = canvas.toDataURL("image/jpeg", 0.7);
              
              // Fire and forget API call
              analyzePushupWithAPI(base64Image).then(apiResult => {
                if (apiResult.repCompleted && apiResult.isValid) {
                  setRepCount(prev => prev + 1);
                  setFeedback({ type: "GOOD", msg: `✓ ${apiResult.feedback || "GOOD PUSHUP"}` });
                  setTimeout(() => setFeedback({ type: "NONE", msg: "" }), 2500);
                } else if (apiResult.repCompleted && !apiResult.isValid) {
                  setFeedback({ type: "ERROR", msg: `✕ ${apiResult.feedback || "POOR FORM"}` });
                  setTimeout(() => setFeedback({ type: "NONE", msg: "" }), 2500);
                }
              }).catch(e => console.error(e));
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [landmarker, phase, exercise]);

  // Session Management
  const startSession = async () => {
    setPhase("COUNTDOWN");
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetReps, exercise })
      });
      const data = await res.json();
      if (data.success) setSessionId(data.data.id);
    } catch (e) { console.error("Failed to start session in DB", e); }
  };

  useEffect(() => {
    if (phase === "COUNTDOWN") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase("ACTIVE");
      }
    }
  }, [phase, countdown]);

  useEffect(() => {
    if (repCount >= targetReps && phase === "ACTIVE") {
      setPhase("FINISHED");
    }
  }, [repCount, phase, targetReps]);

  useEffect(() => {
    if (phase === "FINISHED" && sessionId) {
      stopCamera();
      
      const avgDepth = sessionData.depth.length > 0 ? sessionData.depth.reduce((a,b)=>a+b,0)/sessionData.depth.length : 0;
      const avgAlign = sessionData.align.length > 0 ? sessionData.align.reduce((a,b)=>a+b,0)/sessionData.align.length : 0;
      const consistency = (avgDepth + avgAlign) / 2;
      const quality = sessionData.attempted > 0 ? Math.round((sessionData.accepted / sessionData.attempted) * 100) : 0;

      fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: 300,
          attemptedReps: sessionData.attempted,
          acceptedReps: sessionData.accepted,
          rejectedReps: sessionData.rejected,
          movementQuality: quality,
          depthScore: Math.round(avgDepth),
          alignmentScore: Math.round(avgAlign),
          consistencyScore: Math.round(consistency)
        })
      }).then(() => {
        router.push(`/session-summary?id=${sessionId}`);
      });
    }
  }, [phase, sessionId, sessionData, router]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleEnd = () => {
    stopCamera();
    router.push("/health-hub");
  };

  return (
    <div className="session-container">
      <div className="session-header">
        <button onClick={handleEnd} className="session-close-btn"><X size={24} /></button>
        
        {/* Exercise Selector */}
        {phase === "SETUP" || phase === "READY" ? (
          <select 
            value={exercise} 
            onChange={e => setExercise(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 600 }}
          >
            <option value="SQUAT">BODYWEIGHT SQUAT (Local AI)</option>
            <option value="PUSHUP">PUSHUPS (External API)</option>
          </select>
        ) : (
          <div className="session-title">{exercise === "SQUAT" ? "BODYWEIGHT SQUAT" : "PUSHUPS"}</div>
        )}

        <div className="session-status">
          {phase === "ACTIVE" ? (
             <><span className="dot pulse"></span> LIVE TRACKING</>
          ) : (
             <><span className="dot"></span> READY</>
          )}
        </div>
      </div>

      <div className="camera-feed">
        {phase === "SETUP" && (
          <div className="permission-screen">
            <Camera size={48} className="mb-24" color="var(--text-secondary)" />
            <h2 className="h-app mb-16">CAMERA ACCESS REQUIRED</h2>
            <p className="t-body max-w-sm text-center mb-32">
              Corvo needs access to your camera to analyze your movement during the session.
            </p>
            {cameraError && (
              <div className="f-pill ERROR mb-24"><ShieldAlert size={16}/> {cameraError}</div>
            )}
            <div style={{display: 'flex', gap: 16}}>
              <SecondaryButton onClick={handleEnd}>CANCEL</SecondaryButton>
              <PrimaryButton onClick={startCamera}>ENABLE CAMERA</PrimaryButton>
            </div>
          </div>
        )}

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`camera-video ${(phase === "SETUP" || phase === "FINISHED") ? "hidden" : ""}`}
        />
        <canvas 
          ref={canvasRef} 
          className={`camera-canvas ${(phase === "SETUP" || phase === "FINISHED") ? "hidden" : ""}`}
        />

        {phase === "READY" && (
          <div className="overlay-msg ready-box">
            <div className="checks mb-24">
              <div className="check"><CheckCircle2 size={16}/> Camera Connected</div>
              <div className="check">
                {personVisible ? <CheckCircle2 size={16}/> : <AlertCircle size={16} color="orange"/>} 
                {personVisible ? "Person Detected" : "Step into frame"}
              </div>
              <div className="check">
                {isReady ? <CheckCircle2 size={16}/> : <span className="loader"></span>}
                {isReady ? "AI Model Ready" : "Loading Model..."}
              </div>
            </div>
            <PrimaryButton 
              onClick={startSession} 
              disabled={!personVisible || !isReady}
            >
              START SESSION
            </PrimaryButton>
          </div>
        )}

        {phase === "COUNTDOWN" && <div className="overlay-countdown">{countdown > 0 ? countdown : "GO!"}</div>}
        {phase === "FINISHED" && <div className="overlay-msg">SESSION COMPLETE!</div>}

        {phase === "ACTIVE" && feedback.type !== "NONE" && (
          <div className="feedback-layer">
            <div className={`f-pill ${feedback.type}`}>
              <span>{feedback.msg}</span>
            </div>
          </div>
        )}
      </div>

      <div className="session-footer">
        <div className="s-stat">
          <span className="s-lbl">GOOD REPS</span>
          <span className="s-val">{repCount}</span>
        </div>
        <div className="s-stat">
          <span className="s-lbl">TOTAL</span>
          <span className="s-val">{repCount} <span style={{ fontSize: 24, color: 'var(--text-muted)' }}>/ {targetReps}</span></span>
        </div>
      </div>
    </div>
  );
}

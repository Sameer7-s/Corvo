import { useState, useEffect, useRef } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

export function usePoseDetector() {
  const [landmarker, setLandmarker] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        if (!active) return;

        const detector = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (!active) return;
        setLandmarker(detector);
        setIsReady(true);
      } catch (err) {
        console.error("Failed to load PoseLandmarker", err);
        setError("Failed to load movement analysis engine.");
      }
    }

    init();

    return () => {
      active = false;
      if (landmarker) {
        landmarker.close();
      }
    };
  }, []);

  return { landmarker, isReady, error };
}

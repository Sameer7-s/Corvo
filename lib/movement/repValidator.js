/**
 * Validates a squat repetition based on minimum thresholds.
 */

const THRESHOLDS = {
  MIN_DEPTH_SCORE: 70, // 0-100 scale
  MIN_ALIGNMENT_SCORE: 65, // 0-100 scale
};

export function validateRep(depthScore, alignmentScore) {
  if (depthScore < THRESHOLDS.MIN_DEPTH_SCORE) {
    return {
      isValid: false,
      errorType: "INSUFFICIENT_DEPTH",
      feedback: "Squat deeper. Break parallel.",
    };
  }

  if (alignmentScore < THRESHOLDS.MIN_ALIGNMENT_SCORE) {
    return {
      isValid: false,
      errorType: "KNEE_ALIGNMENT",
      feedback: "Keep your knees tracking over your toes.",
    };
  }

  return {
    isValid: true,
    errorType: "NONE",
    feedback: "Good form!",
  };
}

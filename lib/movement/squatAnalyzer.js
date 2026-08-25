import { calculateAngle, normalizeScore } from "./angleUtils";

// A squat state machine
export class SquatAnalyzer {
  constructor(onRepCompleted) {
    this.state = "IDLE"; // IDLE, DESCENDING, BOTTOM, ASCENDING, STANDING
    this.onRepCompleted = onRepCompleted;
    
    // Tracking current rep metrics to find the "bottom" of the squat
    this.currentRepMinKneeAngle = 180;
    this.currentRepAvgAlignment = 100;
    this.alignmentSamples = 0;
  }

  analyze(landmarks) {
    if (!landmarks || landmarks.length < 33) return null;

    // Get key landmarks (MediaPipe indices)
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    // Calculate Knee Angles (Hip - Knee - Ankle)
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    // Calculate Hip Angles (Shoulder - Hip - Knee)
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    // Simplistic Knee Alignment Score (Difference between hip and knee x-coordinates relative to width)
    // In a real pro app this uses 3D Z-coordinates and knee-over-toe vectors. 
    // Here we use a heuristic based on lateral knee collapse (valgus).
    const hipWidth = Math.abs(leftHip.x - rightHip.x);
    const kneeWidth = Math.abs(leftKnee.x - rightKnee.x);
    // Ideally knees should be at least as wide as hips during a squat
    const alignmentRatio = kneeWidth / (hipWidth || 0.1); 
    let alignmentScore = normalizeScore(alignmentRatio, 0.5, 1.5);
    if (alignmentRatio > 2.0) alignmentScore -= 20; // Penalize excessive bowing

    this._updateState(avgKneeAngle, alignmentScore);

    return {
      state: this.state,
      avgKneeAngle,
      alignmentScore
    };
  }

  _updateState(kneeAngle, alignmentScore) {
    // 160+ is standing straight
    // < 100 is parallel (depending on camera angle, 90-110 is often visual parallel)
    
    if (this.state === "IDLE" || this.state === "STANDING") {
      if (kneeAngle < 150) {
        this.state = "DESCENDING";
        this.currentRepMinKneeAngle = kneeAngle;
        this.currentRepAvgAlignment = alignmentScore;
        this.alignmentSamples = 1;
      }
    } 
    else if (this.state === "DESCENDING") {
      // Keep tracking the deepest point (lowest angle)
      if (kneeAngle < this.currentRepMinKneeAngle) {
        this.currentRepMinKneeAngle = kneeAngle;
      }
      
      this.currentRepAvgAlignment += alignmentScore;
      this.alignmentSamples++;

      if (kneeAngle > this.currentRepMinKneeAngle + 10) {
        // Angle is increasing significantly, user is standing up
        this.state = "ASCENDING";
      }
    }
    else if (this.state === "ASCENDING") {
      if (kneeAngle > 150) {
        this.state = "STANDING";
        this._finalizeRep();
      }
    }
  }

  _finalizeRep() {
    // Determine depth score based on the lowest knee angle achieved
    // (e.g. 140 = shallow 0%, 90 = deep 100%)
    const depthScore = normalizeScore(this.currentRepMinKneeAngle, 140, 80, true);
    
    const avgAlignment = this.alignmentSamples > 0 
      ? this.currentRepAvgAlignment / this.alignmentSamples 
      : 100;

    if (this.onRepCompleted) {
      this.onRepCompleted(depthScore, avgAlignment);
    }

    // Reset for next rep
    this.currentRepMinKneeAngle = 180;
    this.currentRepAvgAlignment = 100;
    this.alignmentSamples = 0;
  }
}

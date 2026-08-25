/**
 * Calculate the angle between three 2D/3D points (a, b, c) where b is the vertex.
 * Returns the angle in degrees.
 */
export function calculateAngle(a, b, c) {
  if (!a || !b || !c) return 0;
  
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return angle;
}

/**
 * Normalizes a score between 0-100 based on a min/max range.
 * Useful for mapping joint angles to a 0-100% "Depth" or "Alignment" score.
 */
export function normalizeScore(value, min, max, invert = false) {
  let score = ((value - min) / (max - min)) * 100;
  score = Math.max(0, Math.min(100, score)); // Clamp 0-100
  return invert ? 100 - score : score;
}

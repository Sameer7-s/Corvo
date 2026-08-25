export function drawPose(ctx, landmarks) {
  if (!landmarks || !landmarks.length) return;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Connections for a stick figure
  const CONNECTIONS = [
    [11, 12], [11, 23], [12, 24], [23, 24], // Torso
    [11, 13], [13, 15], // Left Arm
    [12, 14], [14, 16], // Right Arm
    [23, 25], [25, 27], // Left Leg
    [24, 26], [26, 28], // Right Leg
  ];

  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(0, 112, 243, 0.8)"; // Tech blue
  
  // Draw connections
  for (const [startIdx, endIdx] of CONNECTIONS) {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
      ctx.beginPath();
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
      ctx.stroke();
    }
  }

  // Draw joints
  ctx.fillStyle = "#ffffff";
  const JOINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
  
  for (const idx of JOINTS) {
    const pt = landmarks[idx];
    if (pt && pt.visibility > 0.5) {
      ctx.beginPath();
      ctx.arc(pt.x * width, pt.y * height, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }
}

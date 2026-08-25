import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

// GET /api/insights — calculate insights from user's historical session data
export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } }, { status: 401 });
  }

  const sessions = await prisma.movementSession.findMany({
    where: { userId: user.id, completedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    include: { repetitions: true },
  });

  if (sessions.length === 0) {
    return NextResponse.json({
      success: true,
      data: {
        totalSessions: 0,
        currentQuality: null,
        qualityTrend: null,
        mostConsistent: null,
        mostCommonIssue: null,
        improvingArea: null,
        isEmpty: true,
      },
    });
  }

  // Current quality = latest session
  const latest = sessions[0];
  const currentQuality = latest.movementQuality;

  // Quality trend = compare last 3 to previous 3
  let qualityTrend = null;
  if (sessions.length >= 2) {
    const recentAvg = sessions.slice(0, Math.min(3, sessions.length)).reduce((sum, s) => sum + (s.movementQuality || 0), 0) / Math.min(3, sessions.length);
    const olderAvg = sessions.slice(Math.min(3, sessions.length)).reduce((sum, s) => sum + (s.movementQuality || 0), 0) / Math.max(1, sessions.length - Math.min(3, sessions.length));
    qualityTrend = Math.round(recentAvg - olderAvg);
  }

  // Count error types across all reps
  const allReps = sessions.flatMap((s) => s.repetitions);
  const depthErrors = allReps.filter((r) => r.errorType === "INSUFFICIENT_DEPTH").length;
  const alignErrors = allReps.filter((r) => r.errorType === "KNEE_ALIGNMENT").length;

  const mostCommonIssue = depthErrors >= alignErrors && depthErrors > 0
    ? { type: "Insufficient depth", count: depthErrors }
    : alignErrors > 0
    ? { type: "Knee alignment", count: alignErrors }
    : null;

  // Consistency = average consistency score
  const consistencyScores = sessions.filter((s) => s.consistencyScore != null).map((s) => s.consistencyScore);
  const mostConsistent = consistencyScores.length > 0
    ? Math.round(consistencyScores.reduce((a, b) => a + b, 0) / consistencyScores.length)
    : null;

  // Improving area = compare first half vs second half depth/alignment scores
  let improvingArea = null;
  if (sessions.length >= 2) {
    const mid = Math.floor(sessions.length / 2);
    const recentDepth = sessions.slice(0, mid).filter((s) => s.depthScore != null);
    const olderDepth = sessions.slice(mid).filter((s) => s.depthScore != null);
    if (recentDepth.length > 0 && olderDepth.length > 0) {
      const recentAvg = recentDepth.reduce((s, v) => s + v.depthScore, 0) / recentDepth.length;
      const olderAvg = olderDepth.reduce((s, v) => s + v.depthScore, 0) / olderDepth.length;
      const improvement = Math.round(recentAvg - olderAvg);
      if (improvement > 0) {
        improvingArea = { area: "Depth", change: improvement };
      }
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      totalSessions: sessions.length,
      currentQuality,
      qualityTrend,
      mostConsistent,
      mostCommonIssue,
      improvingArea,
      isEmpty: false,
    },
  });
}

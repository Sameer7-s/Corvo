import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

// GET /api/sessions/[sessionId]
export async function GET(request, { params }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  const { sessionId } = await params;

  const session = await prisma.movementSession.findUnique({
    where: { id: sessionId },
    include: {
      repetitions: { orderBy: { number: "asc" } },
    },
  });

  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Session not found." } },
      { status: 404 }
    );
  }

  // Verify ownership
  if (session.userId !== user.id) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Access denied." } },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, data: session });
}

// PATCH /api/sessions/[sessionId] — update session on completion
export async function PATCH(request, { params }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  const { sessionId } = await params;

  // Verify ownership
  const existing = await prisma.movementSession.findUnique({
    where: { id: sessionId },
  });

  if (!existing || existing.userId !== user.id) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Access denied." } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Clamp scores to 0-100
    const clamp = (v) => (v != null ? Math.min(100, Math.max(0, Number(v))) : null);

    const session = await prisma.movementSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        duration: body.duration,
        attemptedReps: body.attemptedReps,
        acceptedReps: body.acceptedReps,
        rejectedReps: body.rejectedReps,
        movementQuality: clamp(body.movementQuality),
        depthScore: clamp(body.depthScore),
        alignmentScore: clamp(body.alignmentScore),
        consistencyScore: clamp(body.consistencyScore),
      },
    });

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("Update session error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

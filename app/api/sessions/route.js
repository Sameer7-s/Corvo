import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Helper to get authenticated user
async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

// GET /api/sessions — list user's sessions
export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  const sessions = await prisma.movementSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { repetitions: true } },
    },
  });

  return NextResponse.json({ success: true, data: sessions });
}

// POST /api/sessions — create a new session
export async function POST(request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const targetReps = body.targetReps || 10;

    const session = await prisma.movementSession.create({
      data: {
        userId: user.id,
        exercise: "bodyweight_squat",
        targetReps,
        startedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

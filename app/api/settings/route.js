import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

// GET /api/settings
export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } }, { status: 401 });
  }

  let settings = await prisma.userSettings.findUnique({ where: { userId: user.id } });
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { userId: user.id, targetReps: 10, voiceFeedback: true, voiceVolume: 70 },
    });
  }

  return NextResponse.json({ success: true, data: settings });
}

// PATCH /api/settings
export async function PATCH(request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        ...(body.targetReps !== undefined && { targetReps: Math.min(50, Math.max(1, body.targetReps)) }),
        ...(body.voiceFeedback !== undefined && { voiceFeedback: Boolean(body.voiceFeedback) }),
        ...(body.voiceVolume !== undefined && { voiceVolume: Math.min(100, Math.max(0, body.voiceVolume)) }),
        ...(body.preferredCamera !== undefined && { preferredCamera: body.preferredCamera }),
      },
      create: {
        userId: user.id,
        targetReps: body.targetReps || 10,
        voiceFeedback: body.voiceFeedback ?? true,
        voiceVolume: body.voiceVolume ?? 70,
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Something went wrong." } }, { status: 500 });
  }
}

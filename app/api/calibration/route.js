import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

// GET /api/calibration
export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } }, { status: 401 });
  }

  const calibration = await prisma.calibration.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ success: true, data: calibration });
}

// POST /api/calibration
export async function POST(request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } }, { status: 401 });
  }

  try {
    const body = await request.json();
    const calibration = await prisma.calibration.upsert({
      where: { userId: user.id },
      update: {
        status: body.status || "COMPLETED",
        baselineData: body.baselineData || null,
      },
      create: {
        userId: user.id,
        status: body.status || "COMPLETED",
        baselineData: body.baselineData || null,
      },
    });

    return NextResponse.json({ success: true, data: calibration });
  } catch (error) {
    console.error("Calibration error:", error);
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Something went wrong." } }, { status: 500 });
  }
}

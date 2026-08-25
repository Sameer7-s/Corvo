import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const repSchema = z.object({
  sessionId: z.string(),
  number: z.number().int().positive(),
  status: z.enum(["ACCEPTED", "REJECTED"]),
  errorType: z.enum(["NONE", "INSUFFICIENT_DEPTH", "KNEE_ALIGNMENT", "TRACKING_ERROR"]).default("NONE"),
  feedback: z.string().optional(),
  depthScore: z.number().min(0).max(100).optional(),
  alignmentScore: z.number().min(0).max(100).optional(),
});

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = repSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: result.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { sessionId, ...repData } = result.data;

    // Verify session ownership
    const movementSession = await prisma.movementSession.findUnique({
      where: { id: sessionId },
    });

    if (!movementSession || movementSession.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Access denied." } },
        { status: 403 }
      );
    }

    const repetition = await prisma.repetition.create({
      data: {
        sessionId,
        ...repData,
      },
    });

    return NextResponse.json({ success: true, data: repetition }, { status: 201 });
  } catch (error) {
    console.error("Create repetition error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

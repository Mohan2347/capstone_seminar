import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateWeightsFromFeedback } from "@/lib/algorithm/rl";
import { z } from "zod";
import { FeedbackAction } from "@prisma/client";

const feedbackSchema = z.object({
  internshipId: z.string(),
  action: z.nativeEnum(FeedbackAction),
  rating: z.number().int().min(1).max(5).optional(),
  recommendationId: z.string().optional(),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { student: true },
  });

  if (!user?.student) {
    return NextResponse.json({ error: "Student profile required" }, { status: 404 });
  }

  const { internshipId, action, rating, recommendationId } = parsed.data;

  const feedback = await db.feedback.create({
    data: {
      studentId: user.student.id,
      internshipId,
      action,
      rating,
      recommendationId,
    },
  });

  // Trigger RL weight update asynchronously
  updateWeightsFromFeedback(
    user.student.id,
    internshipId,
    action,
    rating
  ).catch(console.error);

  return NextResponse.json({ feedback }, { status: 201 });
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const internshipId = searchParams.get("internshipId");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { student: true },
  });

  if (!user?.student) {
    return NextResponse.json({ feedback: [] });
  }

  const where: Record<string, unknown> = { studentId: user.student.id };
  if (internshipId) where.internshipId = internshipId;

  const feedback = await db.feedback.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ feedback });
}

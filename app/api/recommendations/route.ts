import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateRecommendations } from "@/lib/algorithm/hybrid";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const refresh = searchParams.get("refresh") === "true";

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { student: true },
  });

  if (!user?.student) {
    return NextResponse.json(
      { error: "Student profile required" },
      { status: 404 }
    );
  }

  // Check for cached recommendations (< 1 hour old) unless refresh requested
  if (!refresh) {
    const cached = await db.recommendation.findMany({
      where: { studentId: user.student.id },
      include: {
        internship: {
          include: {
            company: { select: { name: true, logoUrl: true } },
          },
        },
      },
      orderBy: { rank: "asc" },
    });

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (
      cached.length > 0 &&
      cached[0].createdAt > oneHourAgo
    ) {
      return NextResponse.json({ recommendations: cached, cached: true });
    }
  }

  // Generate fresh recommendations
  const recommendations = await generateRecommendations(user.student.id, {
    forceRefresh: refresh,
  });

  return NextResponse.json({ recommendations, cached: false });
}

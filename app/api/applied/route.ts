import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { student: true },
  });

  if (!user?.student) {
    return NextResponse.json({ applied: [] });
  }

  const appliedFeedback = await db.feedback.findMany({
    where: { studentId: user.student.id, action: "APPLIED" },
    include: {
      internship: {
        include: {
          company: { select: { name: true, logoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Deduplicate by internshipId — keep only the most recent APPLIED record
  const seen = new Set<string>();
  const unique = appliedFeedback.filter((f) => {
    if (seen.has(f.internshipId)) return false;
    seen.add(f.internshipId);
    return true;
  });

  return NextResponse.json({ applied: unique });
}

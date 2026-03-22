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
    return NextResponse.json({ saved: [] });
  }

  const savedFeedback = await db.feedback.findMany({
    where: { studentId: user.student.id, action: "SAVED" },
    include: {
      internship: {
        include: {
          company: { select: { name: true, logoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Deduplicate by internshipId — keep only the most recent SAVED record
  const seen = new Set<string>();
  const unique = savedFeedback.filter((f) => {
    if (seen.has(f.internshipId)) return false;
    seen.add(f.internshipId);
    return true;
  });

  return NextResponse.json({ saved: unique });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const internshipId = searchParams.get("internshipId");
  if (!internshipId) {
    return NextResponse.json({ error: "internshipId required" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { student: true },
  });

  if (!user?.student) {
    return NextResponse.json({ error: "Student profile required" }, { status: 404 });
  }

  await db.feedback.deleteMany({
    where: {
      studentId: user.student.id,
      internshipId,
      action: "SAVED",
    },
  });

  return NextResponse.json({ success: true });
}

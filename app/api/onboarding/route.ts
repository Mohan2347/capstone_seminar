import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Ensures a User record exists in the DB for the authenticated Clerk user.
 * Called on first login when the webhook might not have fired yet.
 */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { email, role } = body as { email: string; role?: "STUDENT" | "COMPANY" };

  const user = await db.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email,
      role: role ?? "STUDENT",
    },
    include: { student: true, company: true },
  });

  return NextResponse.json({ user });
}

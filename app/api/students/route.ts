import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const studentSchema = z.object({
  name: z.string().min(1),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  gpa: z.number().min(0).max(10).optional(),
  major: z.string().optional(),
  university: z.string().optional(),
  graduationYear: z.number().int().optional(),
  skills: z.array(z.string()).default([]),
  experience: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        duration: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .default([]),
  preferredRoles: z.array(z.string()).default([]),
  preferredIndustries: z.array(z.string()).default([]),
  preferredLocations: z.array(z.string()).default([]),
  workTypes: z.array(z.string()).default([]),
  personality: z.record(z.string(), z.number()).default({}),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { student: true },
  });

  if (!user?.student) {
    return NextResponse.json({ student: null });
  }

  return NextResponse.json({ student: user.student });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = studentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await db.student.findUnique({ where: { userId: user.id } });
  if (existing) {
    return NextResponse.json(
      { error: "Profile already exists. Use PUT to update." },
      { status: 409 }
    );
  }

  const { personality, ...rest } = parsed.data;
  const student = await db.student.create({
    data: {
      ...rest,
      personality: personality as Prisma.InputJsonValue,
      userId: user.id,
    },
  });

  return NextResponse.json({ student }, { status: 201 });
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = studentSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { personality, ...rest } = parsed.data;
  const student = await db.student.update({
    where: { userId: user.id },
    data: {
      ...rest,
      ...(personality !== undefined
        ? { personality: personality as Prisma.InputJsonValue }
        : {}),
      embedding: Prisma.DbNull,
      embeddingUpdatedAt: null,
    },
  });

  return NextResponse.json({ student });
}

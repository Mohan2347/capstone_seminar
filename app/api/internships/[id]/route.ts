import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
  requiredGpa: z.number().min(0).max(4).optional().nullable(),
  industry: z.string().optional(),
  location: z.string().optional(),
  workType: z.enum(["remote", "hybrid", "onsite"]).optional(),
  duration: z.string().optional(),
  stipend: z.string().optional(),
  openings: z.number().int().min(1).optional(),
  deadline: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const internship = await db.internship.findUnique({
    where: { id },
    include: {
      company: {
        select: { name: true, logoUrl: true, industry: true, website: true, description: true },
      },
    },
  });

  if (!internship) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ internship });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  });

  const internship = await db.internship.findUnique({ where: { id } });
  if (!internship || internship.companyId !== user?.company?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await db.internship.update({
    where: { id },
    data: {
      ...parsed.data,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
      // Invalidate embedding on description/skills change
      embedding: Prisma.DbNull,
      embeddingUpdatedAt: null,
    },
    include: { company: { select: { name: true, logoUrl: true } } },
  });

  return NextResponse.json({ internship: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  });

  const internship = await db.internship.findUnique({ where: { id } });
  if (!internship || internship.companyId !== user?.company?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.internship.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

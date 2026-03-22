import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const internshipSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  requiredGpa: z.number().min(0).max(4).optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  workType: z.enum(["remote", "hybrid", "onsite"]).optional(),
  duration: z.string().optional(),
  stipend: z.string().optional(),
  openings: z.number().int().min(1).default(1),
  deadline: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const industry = searchParams.get("industry");
  const workType = searchParams.get("workType");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { isActive: true };
  if (industry) where.industry = industry;
  if (workType) where.workType = workType;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [internships, total] = await Promise.all([
    db.internship.findMany({
      where,
      include: { company: { select: { name: true, logoUrl: true, industry: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.internship.count({ where }),
  ]);

  return NextResponse.json({ internships, total, page, limit });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = internshipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  });

  if (!user?.company) {
    return NextResponse.json(
      { error: "Company profile required" },
      { status: 403 }
    );
  }

  const internship = await db.internship.create({
    data: {
      ...parsed.data,
      companyId: user.company.id,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
    },
    include: { company: { select: { name: true, logoUrl: true } } },
  });

  return NextResponse.json({ internship }, { status: 201 });
}

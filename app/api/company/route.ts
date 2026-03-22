import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const companySchema = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().optional(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      company: {
        include: {
          internships: {
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { recommendations: true, feedback: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json({ company: user?.company ?? null });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = companySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await db.company.findUnique({ where: { userId: user.id } });
  if (existing) {
    return NextResponse.json({ error: "Company already exists" }, { status: 409 });
  }

  const [company] = await db.$transaction([
    db.company.create({
      data: { ...parsed.data, userId: user.id },
    }),
    db.user.update({
      where: { id: user.id },
      data: { role: "COMPANY" },
    }),
  ]);

  return NextResponse.json({ company }, { status: 201 });
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = companySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const company = await db.company.update({
    where: { userId: user.id },
    data: parsed.data,
  });

  return NextResponse.json({ company });
}

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Briefcase,
  TrendingUp,
  User,
  ChevronRight,
  Sparkles,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      student: {
        include: {
          recommendations: {
            orderBy: { rank: "asc" },
            take: 5,
            include: {
              internship: {
                include: { company: { select: { name: true } } },
              },
            },
          },
          feedback: { orderBy: { createdAt: "desc" }, take: 5 },
          _count: {
            select: { recommendations: true, feedback: true },
          },
        },
      },
      company: {
        include: {
          _count: { select: { internships: true } },
          internships: { take: 3, orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  // Redirect to onboarding if new user
  if (!user) redirect("/onboarding");

  const student = user.student;
  const company = user.company;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s your overview.
        </p>
      </div>

      {/* Profile incomplete banner */}
      {!student && !company && (
        <Card className="bg-primary/10 border-primary/30 mb-6">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Complete your profile</p>
                <p className="text-sm text-muted-foreground">
                  Set up your student profile to get personalized recommendations.
                </p>
              </div>
            </div>
            <Link href="/profile">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Set Up Profile
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {student && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Bookmark}
            label="Recommendations"
            value={student._count.recommendations}
            color="text-primary"
            bg="bg-primary/10"
          />
          <StatCard
            icon={TrendingUp}
            label="Interactions"
            value={student._count.feedback}
            color="text-chart-4"
            bg="bg-chart-4/10"
          />
          <StatCard
            icon={User}
            label="Profile Score"
            value={getProfileScore(student) + "%"}
            color="text-chart-5"
            bg="bg-chart-5/10"
          />
          <StatCard
            icon={Briefcase}
            label="Applied"
            value={
              student.feedback.filter((f) => f.action === "APPLIED").length
            }
            color="text-secondary-foreground"
            bg="bg-secondary/30"
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Recommendations */}
        {student && (
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Top Recommendations
              </CardTitle>
              <Link
                href="/recommendations"
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.recommendations.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm mb-3">
                    No recommendations yet
                  </p>
                  <Link href="/recommendations">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Generate Recommendations
                    </Button>
                  </Link>
                </div>
              ) : (
                student.recommendations.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/internships/${rec.internshipId}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {rec.internship.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rec.internship.company.name}
                      </p>
                    </div>
                    <Badge className="ml-2 shrink-0 bg-primary/20 text-primary border-primary/30 text-xs">
                      {Math.round(rec.hybridScore * 100)}%
                    </Badge>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {student && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.feedback.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">No activity yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Browse internships to get started
                  </p>
                </div>
              ) : (
                student.feedback.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/20"
                  >
                    <ActionBadge action={f.action} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground capitalize">
                        {f.action.toLowerCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60 shrink-0">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(f.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Company panel */}
        {company && (
          <Card className="bg-card border-border md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                {company.name} — Active Listings
              </CardTitle>
              <Link
                href="/company"
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Manage <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {company._count.internships} total internship
                {company._count.internships !== 1 ? "s" : ""} posted.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  bg: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}

function ActionBadge({ action }: { action: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    APPLIED: { cls: "bg-chart-5/20 text-chart-5", label: "Applied" },
    SAVED: { cls: "bg-chart-4/20 text-chart-4", label: "Saved" },
    VIEWED: { cls: "bg-muted text-muted-foreground", label: "Viewed" },
    DISMISSED: { cls: "bg-destructive/20 text-destructive", label: "Dismissed" },
  };
  const { cls, label } = map[action] ?? { cls: "bg-muted text-muted-foreground", label: action };
  return <Badge className={`${cls} border-0 text-xs shrink-0`}>{label}</Badge>;
}

function getProfileScore(student: {
  name: string;
  bio: string | null;
  gpa: number | null;
  major: string | null;
  university: string | null;
  skills: unknown;
  experience: unknown;
  preferredRoles: unknown;
}): number {
  let score = 0;
  const fields = [
    student.name,
    student.bio,
    student.gpa,
    student.major,
    student.university,
    (student.skills as string[]).length > 0,
    (student.experience as unknown[]).length > 0,
    (student.preferredRoles as string[]).length > 0,
  ];
  fields.forEach((f) => {
    if (f) score += 1;
  });
  return Math.round((score / fields.length) * 100);
}

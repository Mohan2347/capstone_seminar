import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Building2,
  Globe,
  ChevronLeft,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import FeedbackButtons from "./feedback-buttons";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InternshipDetailPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();

  const internship = await db.internship.findUnique({
    where: { id },
    include: {
      company: {
        select: { name: true, logoUrl: true, industry: true, description: true, website: true },
      },
    },
  });

  if (!internship || !internship.isActive) notFound();

  const WORK_TYPE_LABELS: Record<string, string> = {
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
  };

  const deadlineStr = internship.deadline
    ? new Date(internship.deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const daysLeft = internship.deadline
    ? Math.ceil((new Date(internship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Back link */}
      <Link
        href="/internships"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Internships
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Building2 className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-foreground mb-1">{internship.title}</h1>
                <p className="text-primary font-medium">{internship.company.name}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {internship.location && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {internship.location}
                    </div>
                  )}
                  {internship.workType && (
                    <Badge className="bg-secondary/30 text-secondary-foreground border-secondary/50">
                      {WORK_TYPE_LABELS[internship.workType] ?? internship.workType}
                    </Badge>
                  )}
                  {internship.industry && (
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      {internship.industry}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              About this Role
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>
          </div>

          {/* Skills */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold text-foreground">Skills &amp; Requirements</h2>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {internship.requiredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-primary/15 text-primary border-primary/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {internship.preferredSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Nice to Have
                </p>
                <div className="flex flex-wrap gap-2">
                  {internship.preferredSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-border text-muted-foreground"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {internship.requiredGpa && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Minimum GPA
                </p>
                <p className="text-foreground font-medium">{internship.requiredGpa.toFixed(1)}</p>
              </div>
            )}
          </div>

          {/* Company */}
          {internship.company.description && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                About {internship.company.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {internship.company.description}
              </p>
              {internship.company.website && (
                <a
                  href={internship.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Visit website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick info */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-foreground text-sm">Internship Details</h2>

            {internship.duration && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium text-foreground">{internship.duration}</p>
                </div>
              </div>
            )}

            {internship.stipend && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stipend</p>
                  <p className="text-sm font-medium text-primary">{internship.stipend}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Openings</p>
                <p className="text-sm font-medium text-foreground">{internship.openings}</p>
              </div>
            </div>

            {deadlineStr && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="text-sm font-medium text-foreground">{deadlineStr}</p>
                  {daysLeft !== null && daysLeft > 0 && (
                    <p className="text-xs text-chart-4 mt-0.5">{daysLeft} days left</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="bg-card border border-border rounded-xl p-5">
            <FeedbackButtons internshipId={internship.id} isLoggedIn={!!userId} />
          </div>
        </div>
      </div>
    </div>
  );
}

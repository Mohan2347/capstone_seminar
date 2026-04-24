"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Building2, MapPin, Clock, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface AppliedFeedback {
  id: string;
  internshipId: string;
  createdAt: string;
  internship: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    workType: string | null;
    duration: string | null;
    stipend: string | null;
    requiredSkills: string[];
    company: { name: string; logoUrl: string | null };
  };
}

const WORK_TYPE_LABELS: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export default function AppliedPage() {
  const router = useRouter();
  const [applied, setApplied] = useState<AppliedFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applied")
      .then((r) => r.json())
      .then((data) => setApplied(data.applied ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Send className="h-6 w-6 text-chart-5" />
          <h1 className="text-2xl font-bold text-foreground">Applied Internships</h1>
        </div>
        <p className="text-muted-foreground">
          {applied.length > 0 ? `You've applied to ${applied.length} internship${applied.length !== 1 ? "s" : ""}` : "You haven't applied to any internships yet"}
        </p>
      </div>

      {applied.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-xl">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg font-medium">No Applications</p>
          <p className="text-muted-foreground text-sm mt-1 mb-6">
            Browse recommendations and start applying!
          </p>
          <Button
            onClick={() => router.push("/internships")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Browse Internships
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applied.map((item) => (
            <Card
              key={item.id}
              className="bg-card border-border hover:border-chart-5/40 transition-all border-l-4 border-l-chart-5"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => router.push(`/internships/${item.internshipId}`)}
                  >
                    <h3 className="font-semibold text-foreground hover:text-chart-5 transition-colors">
                      {item.internship.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-sm">{item.internship.company.name}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-chart-5/20 text-chart-5 border-0">
                    Applied on {new Date(item.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.internship.description}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {item.internship.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.internship.location}
                    </div>
                  )}
                  {item.internship.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {item.internship.duration}
                    </div>
                  )}
                  {item.internship.workType && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-secondary/30 text-secondary-foreground border-secondary/50"
                    >
                      {WORK_TYPE_LABELS[item.internship.workType] ?? item.internship.workType}
                    </Badge>
                  )}
                  {item.internship.stipend && (
                    <span className="text-primary font-medium">{item.internship.stipend}</span>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-border mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/internships/${item.internshipId}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

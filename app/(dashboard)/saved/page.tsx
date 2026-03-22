"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Building2, MapPin, Clock, Trash2, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SavedFeedback {
  id: string;
  internshipId: string;
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

export default function SavedPage() {
  const router = useRouter();
  const [saved, setSaved] = useState<SavedFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => setSaved(data.saved ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (internshipId: string) => {
    setRemoving(internshipId);
    await fetch(`/api/saved?internshipId=${internshipId}`, { method: "DELETE" });
    setSaved((prev) => prev.filter((f) => f.internshipId !== internshipId));
    setRemoving(null);
  };

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
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Saved Internships</h1>
        </div>
        <p className="text-muted-foreground">
          {saved.length > 0 ? `${saved.length} saved internship${saved.length !== 1 ? "s" : ""}` : "No saved internships yet"}
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-xl">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg font-medium">Nothing saved yet</p>
          <p className="text-muted-foreground text-sm mt-1 mb-6">
            Browse internships and click Save to add them here.
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
          {saved.map((item) => (
            <Card
              key={item.id}
              className="bg-card border-border hover:border-primary/40 transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => router.push(`/internships/${item.internshipId}`)}
                  >
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                      {item.internship.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-sm">{item.internship.company.name}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={removing === item.internshipId}
                    onClick={() => handleRemove(item.internshipId)}
                    className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    {removing === item.internshipId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
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

                <div className="flex flex-wrap gap-1.5">
                  {item.internship.requiredSkills.slice(0, 4).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-xs border-border text-muted-foreground"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {item.internship.requiredSkills.length > 4 && (
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      +{item.internship.requiredSkills.length - 4}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/internships/${item.internshipId}`)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  RefreshCw,
  Briefcase,
  MapPin,
  Clock,
  Bookmark,
  Send,
  X,
  ExternalLink,
  Sparkles,
  BarChart3,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";

type Company = {
  name: string;
  logoUrl: string | null;
};

type Internship = {
  id: string;
  title: string;
  location: string | null;
  workType: string | null;
  duration: string | null;
  stipend: string | null;
  industry: string | null;
  requiredSkills: string[];
  company: Company;
};

type Recommendation = {
  id: string;
  internshipId: string;
  contentScore: number;
  collaborativeScore: number;
  hybridScore: number;
  rank: number;
  internship: Internship;
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cached, setCached] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<Set<string>>(new Set());

  const fetchRecommendations = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(
        `/api/recommendations${refresh ? "?refresh=true" : ""}`
      );
      
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        toast.error("Failed to load recommendations", {
          description: "Server error occurred. Please try again later.",
        });
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (!res.ok) {
        toast.error("Failed to load recommendations", {
          description: data.error || "Unknown error",
        });
      } else {
        setRecommendations(data.recommendations);
        setCached(data.cached);
      }
    } catch (error) {
      toast.error("Network error", {
        description: "Could not connect to the server.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const sendFeedback = async (
    internshipId: string,
    recommendationId: string,
    action: "APPLIED" | "SAVED" | "DISMISSED"
  ) => {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internshipId, recommendationId, action }),
    });

    if (res.ok) {
      setFeedbackSent((prev) => new Set([...prev, internshipId + action]));
      const labels: Record<string, string> = {
        APPLIED: "Marked as applied!",
        SAVED: "Saved for later",
        DISMISSED: "Dismissed",
      };
      toast.success(labels[action]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating recommendations…</p>
        <p className="text-xs text-muted-foreground/60">
          Computing embeddings and hybrid scores
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Your Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            {recommendations.length} internship
            {recommendations.length !== 1 ? "s" : ""} matched
            {cached ? " (cached)" : " (fresh)"}
          </p>
        </div>
        <Button
          onClick={() => fetchRecommendations(true)}
          disabled={refreshing}
          variant="outline"
          className="border-border text-muted-foreground hover:bg-muted"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-2xl border border-border">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No recommendations yet
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Complete your profile with skills, experience and preferences to
            generate personalized recommendations.
          </p>
          <Link href="/profile">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Complete Profile
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              feedbackSent={feedbackSent}
              onFeedback={sendFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationCard({
  rec,
  feedbackSent,
  onFeedback,
}: {
  rec: Recommendation;
  feedbackSent: Set<string>;
  onFeedback: (
    internshipId: string,
    recId: string,
    action: "APPLIED" | "SAVED" | "DISMISSED"
  ) => void;
}) {
  const skills = rec.internship.requiredSkills ?? [];
  const matchPct = Math.round(rec.hybridScore * 100);

  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Rank badge */}
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                #{rec.rank}
              </Badge>
              {rec.internship.industry && (
                <Badge className="bg-muted text-muted-foreground border-border text-xs">
                  {rec.internship.industry}
                </Badge>
              )}
            </div>

            <Link href={`/internships/${rec.internshipId}`}>
              <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                {rec.internship.title}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm">{rec.internship.company.name}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
              {rec.internship.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {rec.internship.location}
                </span>
              )}
              {rec.internship.workType && (
                <span className="flex items-center gap-1 capitalize">
                  <Briefcase className="h-3 w-3" />
                  {rec.internship.workType}
                </span>
              )}
              {rec.internship.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {rec.internship.duration}
                </span>
              )}
              {rec.internship.stipend && (
                <span className="text-chart-5 font-medium">
                  {rec.internship.stipend}
                </span>
              )}
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skills.slice(0, 5).map((s) => (
                  <Badge
                    key={s}
                    className="bg-secondary/30 text-secondary-foreground border-secondary/50 text-xs"
                  >
                    {s}
                  </Badge>
                ))}
                {skills.length > 5 && (
                  <Badge className="bg-muted text-muted-foreground border-border text-xs">
                    +{skills.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Score panel */}
          <div className="shrink-0 w-40 space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{matchPct}%</div>
              <div className="text-xs text-muted-foreground">Match Score</div>
            </div>
            <Progress value={matchPct} className="h-1.5" />

            <Separator className="bg-border" />

            <ScoreRow
              icon={Target}
              label="Content"
              value={Math.round(rec.contentScore * 100)}
              color="text-chart-4"
            />
            <ScoreRow
              icon={Users}
              label="Collab"
              value={Math.round(rec.collaborativeScore * 100)}
              color="text-chart-5"
            />
            <ScoreRow
              icon={BarChart3}
              label="Hybrid"
              value={matchPct}
              color="text-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
          <Link href={`/internships/${rec.internshipId}`}>
            <Button
              size="sm"
              variant="outline"
              className="border-border text-muted-foreground hover:bg-muted"
              onClick={() =>
                onFeedback(rec.internshipId, rec.id, "APPLIED")
              }
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              View
            </Button>
          </Link>
          <Button
            size="sm"
            className={
              feedbackSent.has(rec.internshipId + "APPLIED")
                ? "bg-chart-5/30 text-chart-5 border-chart-5/30"
                : "bg-chart-5 hover:bg-chart-5/90 text-primary-foreground"
            }
            disabled={feedbackSent.has(rec.internshipId + "APPLIED")}
            onClick={() => onFeedback(rec.internshipId, rec.id, "APPLIED")}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Apply
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={
              feedbackSent.has(rec.internshipId + "SAVED")
                ? "border-chart-4/40 text-chart-4 bg-chart-4/10"
                : "border-border text-muted-foreground hover:bg-muted"
            }
            disabled={feedbackSent.has(rec.internshipId + "SAVED")}
            onClick={() => onFeedback(rec.internshipId, rec.id, "SAVED")}
          >
            <Bookmark className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50 ml-auto"
            disabled={feedbackSent.has(rec.internshipId + "DISMISSED")}
            onClick={() => onFeedback(rec.internshipId, rec.id, "DISMISSED")}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className={`h-3 w-3 ${color}`} />
        {label}
      </div>
      <span className={`text-xs font-mono ${color}`}>{value}%</span>
    </div>
  );
}

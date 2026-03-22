"use client";

import { useState, useEffect } from "react";
import { Heart, Send, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FeedbackButtonsProps {
  internshipId: string;
  isLoggedIn: boolean;
}

export default function FeedbackButtons({ internshipId, isLoggedIn }: FeedbackButtonsProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    // Check if already saved
    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => {
        const isSaved = data.saved?.some(
          (f: { internshipId: string }) => f.internshipId === internshipId
        );
        setSaved(!!isSaved);
      })
      .catch(() => {});
  }, [internshipId, isLoggedIn]);

  const handleFeedback = async (action: "SAVED" | "APPLIED" | "DISMISSED") => {
    if (!isLoggedIn) {
      router.push("/sign-in");
      return;
    }
    setLoading(action);
    try {
      if (action === "SAVED" && saved) {
        // Unsave
        await fetch(`/api/saved?internshipId=${internshipId}`, { method: "DELETE" });
        setSaved(false);
      } else {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ internshipId, action }),
        });
        if (action === "SAVED") setSaved(true);
        if (action === "APPLIED") setApplied(true);
      }
    } finally {
      setLoading(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => router.push("/sign-in")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign in to Apply
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/sign-in")}
          className="border-border text-foreground w-full"
        >
          <Heart className="h-4 w-4 mr-2" />
          Sign in to Save
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => handleFeedback("APPLIED")}
        disabled={applied || loading === "APPLIED"}
        className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        {applied ? "Applied!" : "Apply Now"}
      </Button>
      <Button
        variant="outline"
        onClick={() => handleFeedback("SAVED")}
        disabled={loading === "SAVED"}
        className={`w-full border-border transition-colors ${
          saved
            ? "bg-primary/10 text-primary border-primary/50"
            : "text-foreground hover:border-primary/50"
        }`}
      >
        <Heart className={`h-4 w-4 mr-2 ${saved ? "fill-primary" : ""}`} />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback("DISMISSED")}
        disabled={loading === "DISMISSED"}
        className="text-muted-foreground hover:text-foreground w-full"
      >
        <EyeOff className="h-4 w-4 mr-2" />
        Not Interested
      </Button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Heart, Send, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FeedbackButtonsProps {
  internshipId: string;
  isLoggedIn: boolean;
}

export default function FeedbackButtons({ internshipId, isLoggedIn }: FeedbackButtonsProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", resumeUrl: "" });

  const confirmApply = async () => {
    // Simulated Mailer confirmation
    console.log(`[MAILER MOCK]: Confirmation Email Sent to ${formData.email} for application! Resume attached/parsed: ${formData.resumeUrl}!`);
    setIsModalOpen(false);
    await handleFeedback("APPLIED");
  };

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
      {applied ? (
        <Button disabled className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
          <Send className="h-4 w-4 mr-2" />
          Applied!
        </Button>
      ) : (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={loading === "APPLIED"}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Apply for Internship</DialogTitle>
              <DialogDescription>
                Confirm your details before sending your application. An email confirmation will be sent upon success!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane.doe@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="resume">Resume Add Link (Drive, Github, etc.)</Label>
                <Input
                  id="resume"
                  type="url"
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={confirmApply}
                disabled={!formData.name || !formData.email || !formData.resumeUrl}
              >
                Submit Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
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

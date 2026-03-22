"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, GraduationCap, Building2, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const selectRole = async (role: "STUDENT" | "COMPANY") => {
    if (!user) return;
    setLoading(true);

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.primaryEmailAddress?.emailAddress,
        role,
      }),
    });

    router.push(role === "STUDENT" ? "/profile" : "/company");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold text-foreground">SmartMatch</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
        </h1>
        <p className="text-muted-foreground mb-10">
          How would you like to use SmartMatch?
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Card
            className="bg-card border-border hover:border-primary/40 cursor-pointer transition-all"
            onClick={() => !loading && selectRole("STUDENT")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">I&apos;m a Student</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Find personalized internship recommendations powered by AI
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-card border-border hover:border-chart-4/40 cursor-pointer transition-all"
            onClick={() => !loading && selectRole("COMPANY")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-chart-4/20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-7 w-7 text-chart-4" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">I&apos;m a Company</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Post internships and reach the most qualified student candidates
              </p>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Setting up your account…</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="mt-6 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard")}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}

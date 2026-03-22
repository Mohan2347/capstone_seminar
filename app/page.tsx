import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrainCircuit,
  Layers,
  TrendingUp,
  Users,
  Zap,
  ChevronRight,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Embeddings",
    description:
      "Converts student profiles and internship descriptions into semantic vectors using BERT-based embeddings for deep contextual understanding.",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    icon: Target,
    title: "Content-Based Matching",
    description:
      "Calculates cosine similarity between student and internship embeddings, enriched with skills overlap and GPA eligibility scoring.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    icon: Users,
    title: "Collaborative Filtering",
    description:
      "Incorporates patterns from similar users — if students like you applied to certain internships, you'll see them too.",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  {
    icon: Layers,
    title: "Hybrid Scoring Model",
    description:
      "Combines content similarity and collaborative signals using dynamically weighted hybrid scoring for accurate results.",
    color: "text-secondary-foreground",
    bg: "bg-secondary/30",
  },
  {
    icon: TrendingUp,
    title: "Reinforcement Learning",
    description:
      "Learns from your interactions. Every view, save, and application updates the recommendation weights in real time.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: BarChart3,
    title: "Personalized Rankings",
    description:
      "Threshold-filtered, top-K ranked recommendations — only the most relevant internships surface for each student.",
    color: "text-accent-foreground",
    bg: "bg-accent/40",
  },
];

const stats = [
  { label: "Algorithm Components", value: "6" },
  { label: "Profile Dimensions", value: "12+" },
  { label: "Embedding Dimensions", value: "768" },
  { label: "Real-time Updates", value: "RL" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg text-foreground">SmartMatch</span>
            <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
              AI
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Hybrid AI Recommendation Engine
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
            Find Your Perfect
            <br />
            Internship Match
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            SmartMatch uses BERT embeddings, cosine similarity, collaborative
            filtering, and reinforcement learning to intelligently match students
            with internships they&apos;ll love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Show when="signed-out">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base"
                >
                  Start Matching
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/internships">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-muted-foreground hover:bg-muted h-12 text-base"
                >
                  Browse Internships
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/recommendations">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base"
                >
                  View My Recommendations
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Show>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            How SmartMatch Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A multi-layered algorithm that gets smarter with every interaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card
              key={f.title}
              className="bg-card border-border hover:border-primary/30 transition-colors"
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Algorithm Flow */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              The Algorithm Pipeline
            </h2>
            <p className="text-muted-foreground text-lg">
              From profile to personalized ranking in milliseconds.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {[
              { step: "1", label: "Profile Analysis", desc: "Academic + Skills + Personality" },
              { step: "2", label: "BERT Embedding", desc: "768-dim semantic vectors" },
              { step: "3", label: "Cosine Similarity", desc: "Content-based scores" },
              { step: "4", label: "Collaborative Filter", desc: "Peer interaction signals" },
              { step: "5", label: "Hybrid Score", desc: "Weighted combination" },
              { step: "6", label: "RL Optimization", desc: "Continuous learning" },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold mb-2 mx-auto">
                    {item.step}
                  </div>
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-25">{item.desc}</div>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-border hidden md:block shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="bg-linear-to-r from-primary/20 via-primary/10 to-secondary/20 border border-primary/20 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to find your match?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Create your profile and let the AI do the heavy lifting.
          </p>
          <Show when="signed-out">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-12 text-base"
              >
                Create Free Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Show>
          <Show when="signed-in">
            <Link href="/profile">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-12 text-base"
              >
                Complete Your Profile
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Show>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>SmartMatch AI</span>
          </div>
          <p>Powered by Gemini · Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}

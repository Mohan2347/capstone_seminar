import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">SmartMatch</span>
            <Badge className="text-xs bg-primary/20 text-primary border-primary/30">AI</Badge>
          </Link>

          <div className="flex items-center gap-3">
            {userId ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="border-border text-foreground">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/saved">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Saved
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

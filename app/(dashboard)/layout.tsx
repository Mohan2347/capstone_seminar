import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SidebarNav from "./sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border flex flex-col bg-sidebar sticky top-0 h-screen">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sidebar-foreground">SmartMatch</span>
          {/* <Badge className="text-xs bg-primary/20 text-primary border-primary/30 ml-1">
            AI
          </Badge> */}
        </div>

        <SidebarNav />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
          {/* <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            SmartMatch 
          </Link> */}
          <div></div>
          <UserButton />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

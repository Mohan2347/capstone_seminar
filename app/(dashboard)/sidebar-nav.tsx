"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Bookmark,
  Briefcase,
  Building2,
  Heart,
  Send,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recommendations", label: "Recommendations", icon: Bookmark },
  { href: "/internships", label: "Browse Internships", icon: Briefcase },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/applied", label: "Applied", icon: Send },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/company", label: "Company", icon: Building2 },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

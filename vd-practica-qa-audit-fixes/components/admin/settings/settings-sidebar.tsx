"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  ShieldCheck, 
  Database, 
  Users, 
  Bell, 
  Key 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const settingsNav = [
  {
    title: "General",
    href: "/admin/settings/general",
    icon: User,
  },
  {
    title: "Security",
    href: "/admin/settings/security",
    icon: ShieldCheck,
  },
  {
    title: "Team",
    href: "/admin/settings/team",
    icon: Users,
  },
  {
    title: "Database",
    href: "/admin/settings/database",
    icon: Database,
  },
  {
    title: "Notifications",
    href: "/admin/settings/notifications",
    icon: Bell,
  },
  {
    title: "API",
    href: "/admin/settings/api",
    icon: Key,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const filteredNav = settingsNav.filter((item) => {
    if (
      item.href === "/admin/settings/team" ||
      item.href === "/admin/settings/database" ||
      item.href === "/admin/settings/api"
    ) {
      return role === "ADMIN";
    }
    return true;
  });

  return (
    <nav className="flex flex-col gap-1 w-full">
      <h2 className="mb-4 px-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Settings
      </h2>
      <div className="flex flex-col gap-1">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-accent/20 text-foreground font-bold" 
                  : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "size-4 transition-colors", 
                  isActive ? "text-foreground" : "text-accent/80 group-hover:text-muted-foreground"
                )} 
              />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

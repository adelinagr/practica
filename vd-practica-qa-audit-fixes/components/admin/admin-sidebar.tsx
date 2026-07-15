"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Users,
  BarChart2,
  Settings,
  LogOut,
  CheckCircle2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { UserAvatar } from "@/components/shared/user-avatar";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard",            icon: LayoutDashboard,  exact: true },
  { href: "/admin/appointments",   label: "Appointments",   icon: Calendar },
  { href: "/admin/questionnaires", label: "Questionnaires", icon: ClipboardList },
  { href: "/admin/content",        label: "Content",        icon: FileText },
  { href: "/admin/leads",          label: "Leads",          icon: Users },
  { href: "/admin/analytics",      label: "Analytics",      icon: BarChart2 },
  { href: "/admin/settings",       label: "Settings",       icon: Settings },
];

interface AdminSidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null; role?: string };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (user.role === "VIEWER") {
      return (
        item.href === "/admin" ||
        item.href === "/admin/questionnaires" ||
        item.href === "/admin/leads"
      );
    }
    return true;
  });

  return (
    <aside className="m-4 flex h-[calc(100vh-2rem)] w-[240px] flex-shrink-0 flex-col rounded-[1.5rem] border border-secondary/30 bg-secondary/10 backdrop-blur-xl shadow-2xl">
      {/* Logo */}
      <div className="flex items-center border-b border-secondary/30 px-4 py-5">
        <Logo className="w-[160px] h-auto" />
      </div>

      <div className="px-4 py-3">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2 text-[12px] font-semibold text-foreground shadow-sm transition-all hover:bg-accent/20 hover:text-primary"
        >
          <ExternalLink className="size-3.5" />
          Înapoi la Site
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2.5 py-3">
        {filteredNavItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-300",
                active
                  ? "bg-primary/20 text-primary-foreground shadow-[0_0_15px_rgba(242, 174, 188,0.15)]"
                  : "text-muted-foreground hover:bg-accent/20 hover:text-foreground",
              )}
            >
              <Icon
                className={cn("size-4 transition-colors", active ? "text-primary" : "text-muted-foreground")}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User row */}
      <div className="flex items-center gap-2.5 border-t border-secondary/30 px-3.5 py-4">
        <UserAvatar
          user={{ name: user?.name || null, image: user?.image || null }}
          className="size-8 border border-secondary/30 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-foreground">
            {user?.name ?? "Admin"}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign out"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent/20 hover:text-destructive"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}

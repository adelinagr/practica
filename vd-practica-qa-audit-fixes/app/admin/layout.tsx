// app/(protected)/admin/layout.tsx
// Full-screen admin shell — bypasses the generic (protected)/layout.tsx
// Uses its own dedicated sidebar so the admin area feels distinct.

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/login");
  }

  // Fetch fresh user data to verify status and role
  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, name: true, email: true, image: true, role: true, status: true },
  });

  if (
    !dbUser ||
    dbUser.status !== "ACTIVE" ||
    (dbUser.role !== "ADMIN" && dbUser.role !== "EDITOR" && dbUser.role !== "VIEWER")
  ) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AdminSidebar user={dbUser} />
      <main className="flex-1 overflow-hidden p-4 pl-0">
        <div className="h-full w-full rounded-[1.5rem] border border-secondary/30 bg-secondary/10 backdrop-blur-xl overflow-auto shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-[1.5rem]" />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

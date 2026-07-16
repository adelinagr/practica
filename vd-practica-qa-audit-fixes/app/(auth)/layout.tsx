import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

import { getCurrentUser } from "@/lib/session";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getCurrentUser();

  if (user) {
    // Fetch fresh user data to verify status and role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, status: true },
    });

    if (dbUser && dbUser.status === "ACTIVE") {
      if (dbUser.role === "ADMIN" || dbUser.role === "EDITOR" || dbUser.role === "VIEWER") {
        redirect("/admin");
      }
      redirect("/dashboard");
    }
    // If not active, do not redirect to prevent infinite loops with protected layouts
  }

  return <div className="min-h-screen">{children}</div>;
}

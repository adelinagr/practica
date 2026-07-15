import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { TeamSettingsClient } from "@/components/admin/team-settings-client";

export const metadata = { title: "Team Settings - Admin" };

export const dynamic = "force-dynamic";

export default async function TeamSettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  // Only ADMIN is allowed to manage the team
  if (sessionUser.role !== "ADMIN") {
    redirect("/admin");
  }

  // Fetch all team members
  const teamMembers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      image: true,
    },
  });

  return (
    <TeamSettingsClient 
      initialMembers={teamMembers as any} 
      currentUser={{ id: sessionUser.id!, email: sessionUser.email }} 
    />
  );
}

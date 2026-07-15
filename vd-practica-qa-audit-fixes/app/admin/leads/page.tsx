import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminLeadsClient } from "@/components/admin/admin-leads-client";

export const metadata = { title: "Leads Admin – VreauDigitalizare" };

export default async function AdminLeadsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR" && user.role !== "VIEWER")) {
    redirect("/login");
  }

  const questionnaireFilter = user.role === "ADMIN" ? {} : {
    OR: [
      { ownerId: user.id },
      { allowedRoles: { has: user.role } },
      { allowedUsers: { some: { id: user.id } } },
    ],
  };

  const leads = await prisma.lead.findMany({
    where: {
      questionnaire: questionnaireFilter,
    },
    orderBy: { createdAt: "desc" },
    include: {
      questionnaire: {
        select: {
          title: true,
          slug: true,
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return <AdminLeadsClient initialLeads={leads} />;
}

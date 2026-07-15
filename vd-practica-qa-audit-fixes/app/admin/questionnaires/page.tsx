import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminQuestionnairesClient } from "@/components/admin/admin-questionnaires-client";

export const metadata = {
  title: "Chestionare Admin – VreauDigitalizare",
};

export const dynamic = "force-dynamic";

export default async function AdminQuestionnairesPage() {
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

  const questionnaires = await prisma.questionnaire.findMany({
    where: questionnaireFilter,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      status: true,
      category: true,
      estimatedMinutes: true,
      resultInterpretations: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      allowedRoles: true,
      allowedUsers: {
        select: { id: true, name: true, email: true }
      },
      _count: { select: { leads: true, questions: true } },
    },
  });

  // Shape data to match client interface
  const data = questionnaires.map((q) => ({
    id: q.id,
    slug: q.slug,
    title: q.title,
    description: q.description,
    status: q.status,
    category: q.category,
    estimatedMinutes: q.estimatedMinutes,
    resultInterpretations: q.resultInterpretations,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
    _count: { leads: q._count.leads },
    _questionCount: q._count.questions,
    ownerId: q.ownerId,
    allowedRoles: q.allowedRoles,
    allowedUsers: q.allowedUsers,
  }));

  return (
    <AdminQuestionnairesClient
      initialData={data}
      currentUser={{
        id: user.id!,
        role: user.role,
        name: user.name,
        email: user.email,
      }}
    />
  );
}

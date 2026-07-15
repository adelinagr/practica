import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR" && user.role !== "VIEWER")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const questionnaireFilter = user.role === "ADMIN" ? {} : {
    OR: [
      { ownerId: user.id },
      { allowedRoles: { has: user.role } },
      { allowedUsers: { some: { id: user.id } } },
    ],
  };

  const leadFilter = user.role === "ADMIN" ? {} : {
    questionnaire: {
      OR: [
        { ownerId: user.id },
        { allowedRoles: { has: user.role } },
        { allowedUsers: { some: { id: user.id } } },
      ],
    },
  };

  const [
    totalQuestionnaires,
    publishedQuestionnaires,
    totalLeads,
    recentLeads,
    questionnaires,
  ] = await Promise.all([
    prisma.questionnaire.count({ where: questionnaireFilter }),
    prisma.questionnaire.count({ where: { status: "PUBLISHED", ...questionnaireFilter } }),
    prisma.lead.count({ where: leadFilter }),
    // Leads in the last 30 days
    prisma.lead.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        ...leadFilter,
      },
    }),
    // Last 5 questionnaires for recent activity
    prisma.questionnaire.findMany({
      where: questionnaireFilter,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, createdAt: true, status: true },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalQuestionnaires,
      publishedQuestionnaires,
      totalLeads,
      recentLeads,
    },
    recentQuestionnaires: questionnaires,
  });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// GET /api/admin/analytics?range=30d|7d
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR" && user.role !== "VIEWER"))
    return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") ?? "30d";

  const days = range === "7d" ? 7 : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

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

  const accessibleQIds = user.role === "ADMIN" ? [] : (await prisma.questionnaire.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { allowedRoles: { has: user.role } },
        { allowedUsers: { some: { id: user.id } } },
      ],
    },
    select: { id: true }
  })).map(q => q.id);

  // Parallel queries for performance
  const [
    totalQuestionnaires,
    publishedQuestionnaires,
    totalLeads,
    recentLeads,
    questionnairesWithLeads,
    leadsBySource,
    leadsByDay,
  ] = await Promise.all([
    prisma.questionnaire.count({ where: questionnaireFilter }),
    prisma.questionnaire.count({ where: { status: "PUBLISHED", ...questionnaireFilter } }),
    prisma.lead.count({ where: leadFilter }),
    prisma.lead.count({ where: { createdAt: { gte: since }, ...leadFilter } }),

    // Per questionnaire stats
    prisma.questionnaire.findMany({
      where: questionnaireFilter,
      orderBy: { leads: { _count: "desc" } },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        _count: { select: { leads: true } },
      },
    }),

    // Group leads by source for donut chart
    prisma.lead.groupBy({
      by: ["source"],
      _count: { source: true, _all: true },
      orderBy: { _count: { source: "desc" } },
      take: 6,
      where: leadFilter,
    }),

    // Leads per day (raw query for date grouping)
    user.role === "ADMIN"
      ? prisma.$queryRaw<{ date: string; count: bigint }[]>`
          SELECT
            DATE("createdAt")::text AS date,
            COUNT(*)::bigint AS count
          FROM leads
          WHERE "createdAt" >= ${since}
          GROUP BY DATE("createdAt")
          ORDER BY DATE("createdAt") ASC
        `
      : accessibleQIds.length > 0
        ? prisma.$queryRaw<{ date: string; count: bigint }[]>`
            SELECT
              DATE("createdAt")::text AS date,
              COUNT(*)::bigint AS count
            FROM leads
            WHERE "createdAt" >= ${since}
              AND "questionnaireId" = ANY(${accessibleQIds})
            GROUP BY DATE("createdAt")
            ORDER BY DATE("createdAt") ASC
          `
        : Promise.resolve([] as { date: string; count: bigint }[]),
  ]);

  // Build daily series (fill in missing days with 0)
  const dailyMap = new Map<string, number>();
  for (const row of leadsByDay) {
    dailyMap.set(row.date, Number(row.count));
  }

  const dailySeries: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailySeries.push({ date: key, count: dailyMap.get(key) ?? 0 });
  }

  const completionRate =
    totalQuestionnaires > 0
      ? Math.round((totalLeads / Math.max(totalLeads, 1)) * 100)
      : 0;

  return NextResponse.json({
    summary: {
      totalQuestionnaires,
      publishedQuestionnaires,
      totalLeads,
      recentLeads,
      completionRate,
    },
    questionnairesWithLeads,
    leadsBySource: leadsBySource.map((s) => ({
      source: s.source ?? "direct",
      count: s._count._all ?? 0,
    })),
    dailySeries,
  });
}

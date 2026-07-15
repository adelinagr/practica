import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminAnalyticsClient } from "@/components/admin/admin-analytics-client";

export const metadata = { title: "Analytics Admin – VreauDigitalizare" };
export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const since365d = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const since30d  = new Date(Date.now() -  30 * 24 * 60 * 60 * 1000);
  const since7d   = new Date(Date.now() -   7 * 24 * 60 * 60 * 1000);

  const [
    totalQuestionnaires,
    publishedQuestionnaires,
    totalLeads,
    recentLeads7d,
    recentLeads30d,
    questionnairesWithLeads,
    leadsBySource,
    leadsByDay365d,
  ] = await Promise.all([
    prisma.questionnaire.count(),
    prisma.questionnaire.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: since7d } } }),
    prisma.lead.count({ where: { createdAt: { gte: since30d } } }),

    prisma.questionnaire.findMany({
      orderBy: { leads: { _count: "desc" } },
      take: 10,
      select: {
        id: true, title: true, slug: true, status: true,
        _count: { select: { leads: true, questions: true } },
      },
    }),

    prisma.lead.groupBy({
      by: ["source"],
      _count: { source: true, _all: true },
      orderBy: { _count: { source: "desc" } },
      take: 6,
    }),

    prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT
        DATE("createdAt")::text AS date,
        COUNT(*)::bigint AS count
      FROM leads
      WHERE "createdAt" >= ${since365d}
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `,
  ]);

  // Fill daily series — last 365 days
  const dailyMap = new Map<string, number>();
  for (const row of leadsByDay365d) {
    dailyMap.set(row.date, Number(row.count));
  }

  const dailySeries: { date: string; count: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailySeries.push({ date: key, count: dailyMap.get(key) ?? 0 });
  }

  return (
    <AdminAnalyticsClient
      summary={{ totalQuestionnaires, publishedQuestionnaires, totalLeads, recentLeads7d, recentLeads30d }}
      questionnairesWithLeads={questionnairesWithLeads.map((q) => ({
        id: q.id, title: q.title, slug: q.slug, status: q.status,
        leadCount: q._count.leads, questionCount: q._count.questions,
      }))}
      leadsBySource={leadsBySource.map((s) => ({
        source: s.source ?? "direct",
        count: s._count._all ?? 0,
      }))}
      dailySeries={dailySeries}
    />
  );
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

// GET /api/admin/analytics/booking
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN" || !user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const adminId = user.id;

    // 1. Fetch count stats
    const total = await prisma.appointment.count({ where: { adminId } });
    const pending = await prisma.appointment.count({ where: { adminId, status: "PENDING" } });
    const approved = await prisma.appointment.count({ where: { adminId, status: "APPROVED" } });
    const cancelled = await prisma.appointment.count({
      where: {
        adminId,
        status: { in: ["CANCELLED", "REJECTED"] }
      }
    });

    // 2. Fetch daily breakdown for the last 14 days
    const dailyStats: { date: string; count: number }[] = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const targetDay = subDays(today, i);
      const start = startOfDay(targetDay);
      const end = endOfDay(targetDay);
      
      const count = await prisma.appointment.count({
        where: {
          adminId,
          startTime: {
            gte: start,
            lte: end
          }
        }
      });

      dailyStats.push({
        date: format(targetDay, "dd MMM"),
        count
      });
    }

    // 3. Fetch recent bookings (limit 5) for quick overview
    const recent = await prisma.appointment.findMany({
      where: { adminId },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    return NextResponse.json({
      metrics: {
        total,
        pending,
        approved,
        cancelled
      },
      chartData: dailyStats,
      recent
    });
  } catch (error) {
    console.error("Error generating booking analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

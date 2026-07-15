import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// GET /api/admin/appointments
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN" || !user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status"); // PENDING, APPROVED, etc.

    const whereClause: any = {
      adminId: user.id
    };

    if (statusParam) {
      whereClause.status = statusParam;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: { startTime: "asc" }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

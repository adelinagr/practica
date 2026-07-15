import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// GET /api/admin/leads
export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR" && user.role !== "VIEWER")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const filter = user.role === "ADMIN" ? {} : {
    questionnaire: {
      OR: [
        { ownerId: user.id },
        { allowedRoles: { has: user.role } },
        { allowedUsers: { some: { id: user.id } } },
      ],
    },
  };

  const leads = await prisma.lead.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
    include: {
      questionnaire: { select: { title: true, slug: true } },
    },
  });

  return NextResponse.json(leads);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET /api/admin/questionnaires — list all questionnaires for admin
export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR" && user.role !== "VIEWER")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const filter = user.role === "ADMIN" ? {} : {
    OR: [
      { ownerId: user.id },
      { allowedRoles: { has: user.role } },
      { allowedUsers: { some: { id: user.id } } },
    ],
  };

  const questionnaires = await prisma.questionnaire.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { leads: true },
      },
    },
  });

  return NextResponse.json(questionnaires);
}

// POST /api/admin/questionnaires — create a new questionnaire
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { title, description, slug, category, estimatedMinutes } = body;

  if (!title?.trim() || !slug?.trim()) {
    return new Response("Title and slug are required", { status: 400 });
  }

  const existing = await prisma.questionnaire.findUnique({ where: { slug } });
  if (existing) {
    return new Response("Slug already exists", { status: 409 });
  }

  const questionnaire = await prisma.questionnaire.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      slug: slug.trim(),
      status: "DRAFT",
      category: category?.trim() || null,
      estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : null,
      ownerId: user.id,
      allowedUsers: {
        connect: { id: user.id },
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      status: true,
      category: true,
      estimatedMinutes: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      allowedRoles: true,
      allowedUsers: {
        select: { id: true, name: true, email: true }
      },
    },
  });

  return NextResponse.json(questionnaire, { status: 201 });
}


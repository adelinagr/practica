import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// PATCH /api/admin/questionnaires/[id] — update/publish
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Load existing questionnaire to check access
  const source = await prisma.questionnaire.findUnique({
    where: { id: params.id },
    select: {
      ownerId: true,
      allowedRoles: true,
      allowedUsers: { select: { id: true } }
    }
  });

  if (!source) return new Response("Questionnaire not found", { status: 404 });

  const isOwner = source.ownerId === user.id;
  const isAllowedRole = source.allowedRoles.includes(user.role);
  const isAllowedUser = source.allowedUsers.some(u => u.id === user.id);

  if (user.role !== "ADMIN" && !(user.role === "EDITOR" && (isOwner || isAllowedRole || isAllowedUser))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  // Enforce access control edits: only ADMIN can transfer ownership or update access permissions
  if (user.role !== "ADMIN" && (body.allowedRoles !== undefined || body.allowedUserIds !== undefined || body.ownerId !== undefined)) {
    return new Response("Forbidden: only administrators can manage access permissions", { status: 403 });
  }

  // Check slug uniqueness if changing
  if (body.slug) {
    const existing = await prisma.questionnaire.findFirst({
      where: { slug: body.slug, NOT: { id: params.id } },
    });
    if (existing) return new Response("Slug already exists", { status: 409 });
  }

  const questionnaire = await prisma.questionnaire.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.estimatedMinutes !== undefined && { estimatedMinutes: body.estimatedMinutes }),
      ...(body.isPinned !== undefined && { isPinned: body.isPinned }),
      ...(body.resultInterpretations !== undefined && { resultInterpretations: body.resultInterpretations }),
      ...(body.allowedRoles !== undefined && { allowedRoles: body.allowedRoles }),
      ...(body.ownerId !== undefined && { ownerId: body.ownerId }),
      ...(body.allowedUserIds !== undefined && {
        allowedUsers: {
          set: body.allowedUserIds.map((userId: string) => ({ id: userId })),
        },
      }),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      status: true,
      isPinned: true,
      category: true,
      estimatedMinutes: true,
      resultInterpretations: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      allowedRoles: true,
      allowedUsers: {
        select: { id: true, name: true, email: true }
      }
    },
  });

  return NextResponse.json(questionnaire);
}


// DELETE /api/admin/questionnaires/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return new Response("Unauthorized", { status: 401 });

  await prisma.questionnaire.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

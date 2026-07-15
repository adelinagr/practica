import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";

// PATCH /api/admin/team/[id] — update member role or status
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  // Prevent self-deactivation or self-role change to maintain at least one admin
  if (user.id === params.id) {
    return new Response("Cannot modify your own role or status", { status: 400 });
  }

  try {
    const body = await req.json();
    const { role, status } = body;

    const data: any = {};
    if (role !== undefined) {
      if (!Object.values(UserRole).includes(role as UserRole)) {
        return new Response("Invalid role", { status: 400 });
      }
      data.role = role as UserRole;
    }

    if (status !== undefined) {
      if (!Object.values(UserStatus).includes(status as UserStatus)) {
        return new Response("Invalid status", { status: 400 });
      }
      data.status = status as UserStatus;
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update member error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/admin/team/[id] — remove member
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  if (user.id === params.id) {
    return new Response("Cannot remove yourself", { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Delete member error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

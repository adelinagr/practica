import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/admin/team — list all team members
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      image: true,
    },
  });

  return NextResponse.json(members);
}

// POST /api/admin/team — invite a team member
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return new Response("Email and role are required", { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return new Response("Invalid role", { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.status === "PENDING") {
        // If pending, we can update their role and treat it as a re-invite
        const updated = await prisma.user.update({
          where: { id: existing.id },
          data: { role: role as UserRole },
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
      }
      return new Response("User with this email already exists", { status: 409 });
    }

    // Create a pending user
    const member = await prisma.user.create({
      data: {
        email: normalizedEmail,
        role: role as UserRole,
        status: "PENDING",
        name: normalizedEmail.split("@")[0],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Invite error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

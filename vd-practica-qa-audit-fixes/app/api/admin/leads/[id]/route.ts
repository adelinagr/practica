import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// GET /api/admin/leads/[id] — lead detail with all answers
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR" && user.role !== "VIEWER"))
    return new Response("Unauthorized", { status: 401 });

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      questionnaire: {
        select: {
          id: true,
          title: true,
          slug: true,
          ownerId: true,
          allowedRoles: true,
          allowedUsers: { select: { id: true } }
        },
      },
      answers: {
        include: {
          question: {
            select: { id: true, text: true, type: true, order: true },
          },
        },
        orderBy: { question: { order: "asc" } },
      },
    },
  });

  if (!lead) return new Response("Lead not found", { status: 404 });

  // Access validation for non-admin
  if (user.role !== "ADMIN") {
    if (lead.questionnaire) {
      const isOwner = lead.questionnaire.ownerId === user.id;
      const isAllowedRole = lead.questionnaire.allowedRoles.includes(user.role);
      const isAllowedUser = lead.questionnaire.allowedUsers.some(u => u.id === user.id);

      if (!isOwner && !isAllowedRole && !isAllowedUser) {
        return new Response("Unauthorized", { status: 401 });
      }
    } else {
      // Leads without questionnaire are restricted to ADMIN only
      return new Response("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.json({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    score: lead.score,
    level: lead.level,
    aiReport: lead.aiReport,
    status: lead.status,
    timeline: lead.timeline,
    createdAt: lead.createdAt,
    questionnaire: lead.questionnaire,
    answers: lead.answers.map((a) => ({
      id: a.id,
      questionId: a.questionId,
      questionText: a.question.text,
      questionType: a.question.type,
      questionOrder: a.question.order,
      answer: (() => {
        try {
          return JSON.parse(a.answer);
        } catch {
          return a.answer;
        }
      })(),
    })),
  });
}

// PATCH /api/admin/leads/[id] — update lead status or append custom timeline notes
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR" && user.role !== "VIEWER")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, note } = body;
    if (!status && !note) {
      return new Response("Status or Note is required", { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      select: {
        status: true,
        timeline: true,
        questionnaire: {
          select: {
            ownerId: true,
            allowedRoles: true,
            allowedUsers: { select: { id: true } },
          },
        },
      },
    });

    if (!lead) return new Response("Lead not found", { status: 404 });

    // Validate access for non-admin
    if (user.role !== "ADMIN") {
      if (lead.questionnaire) {
        const isOwner = lead.questionnaire.ownerId === user.id;
        const isAllowedRole = lead.questionnaire.allowedRoles.includes(user.role);
        const isAllowedUser = lead.questionnaire.allowedUsers.some(u => u.id === user.id);

        if (!isOwner && !isAllowedRole && !isAllowedUser) {
          return new Response("Unauthorized", { status: 401 });
        }
      } else {
        // If there's no questionnaire associated with this lead, restrict access to ADMIN only
        return new Response("Unauthorized", { status: 401 });
      }
    }

    let currentTimeline: any[] = [];
    if (lead.timeline && typeof lead.timeline === "object") {
      if (Array.isArray(lead.timeline)) {
        currentTimeline = lead.timeline;
      }
    }

    const updatedData: any = {};
    const newEvents: any[] = [];

    if (status) {
      updatedData.status = status;
      newEvents.push({
        event: `Status schimbat în ${status}`,
        date: new Date().toISOString(),
        user: user.name || user.email || "Utilizator",
      });
    }

    if (note) {
      newEvents.push({
        event: `Notă: ${note}`,
        date: new Date().toISOString(),
        user: user.name || user.email || "Utilizator",
        isNote: true,
      });
    }

    const updatedTimeline = [...currentTimeline, ...newEvents];
    updatedData.timeline = updatedTimeline;

    const updatedLead = await prisma.lead.update({
      where: { id: params.id },
      data: updatedData,
    });

    return NextResponse.json({
      status: updatedLead.status,
      timeline: updatedLead.timeline,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/admin/leads/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  await prisma.lead.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

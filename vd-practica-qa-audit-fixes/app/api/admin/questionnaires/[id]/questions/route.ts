import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

async function hasQuestionnaireAccess(questionnaireId: string, userId: string, role: string) {
  if (role === "ADMIN") return true;

  const questionnaire = await prisma.questionnaire.findUnique({
    where: { id: questionnaireId },
    select: {
      ownerId: true,
      allowedRoles: true,
      allowedUsers: { select: { id: true } }
    }
  });

  if (!questionnaire) return false;

  const isOwner = questionnaire.ownerId === userId;
  const isAllowedRole = questionnaire.allowedRoles.includes(role);
  const isAllowedUser = questionnaire.allowedUsers.some(u => u.id === userId);

  return isOwner || isAllowedRole || isAllowedUser;
}

// GET /api/admin/questionnaires/[id]/questions
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR" && user.role !== "VIEWER")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const allowed = await hasQuestionnaireAccess(params.id, user.id!, user.role);
  if (!allowed) {
    return new Response("Unauthorized", { status: 401 });
  }

  const questions = await prisma.question.findMany({
    where: { questionnaireId: params.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    questions.map((q) => ({
      ...q,
      options: q.options ? (q.options as string[]) : null,
      validations: q.validations ?? null,
    })),
  );
}

// POST /api/admin/questionnaires/[id]/questions
// Body: { questions: QuestionPayload[] }
// Full replace — deletes removed questions, upserts the rest
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR"))
    return new Response("Unauthorized", { status: 401 });

  const allowed = await hasQuestionnaireAccess(params.id, user.id!, user.role);
  if (!allowed) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const incoming: any[] = body.questions ?? [];

  // Validate questionnaire exists
  const questionnaire = await prisma.questionnaire.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!questionnaire)
    return new Response("Questionnaire not found", { status: 404 });

  // Run in transaction
  const result = await prisma.$transaction(async (tx) => {
    const incomingIds = incoming
      .filter((q) => q.id && !q.id.startsWith("new_"))
      .map((q) => q.id);

    // Delete questions that are no longer in the payload
    await tx.question.deleteMany({
      where: {
        questionnaireId: params.id,
        id: { notIn: incomingIds },
      },
    });

    // Upsert each question
    const saved: { id: string; type: string; text: string; options: any; validations: any; required: boolean; order: number; questionnaireId: string; createdAt: Date; updatedAt: Date }[] = [];
    for (const q of incoming) {
      const isNew = !q.id || q.id.startsWith("new_");
      if (isNew) {
        const created = await tx.question.create({
          data: {
            questionnaireId: params.id,
            type: q.type ?? "TEXT",
            text: q.text ?? "",
            options: q.options ?? undefined,
            validations: q.validations ?? undefined,
            required: q.required ?? false,
            order: q.order ?? 0,
          },
        });
        saved.push(created);
      } else {
        const updated = await tx.question.update({
          where: { id: q.id },
          data: {
            type: q.type,
            text: q.text,
            options: q.options ?? undefined,
            validations: q.validations ?? undefined,
            required: q.required ?? false,
            order: q.order ?? 0,
          },
        });
        saved.push(updated);
      }
    }

    return saved;
  });

  return NextResponse.json(result, { status: 200 });
}

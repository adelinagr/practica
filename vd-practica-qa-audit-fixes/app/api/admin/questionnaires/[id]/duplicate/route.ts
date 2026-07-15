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

// POST /api/admin/questionnaires/[id]/duplicate
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR"))
    return new Response("Unauthorized", { status: 401 });

  const allowed = await hasQuestionnaireAccess(params.id, user.id!, user.role);
  if (!allowed) {
    return new Response("Unauthorized", { status: 401 });
  }

  const source = await prisma.questionnaire.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          ruleGroups: {
            include: {
              conditions: true,
            },
          },
        },
      },
    },
  });
  if (!source)
    return new Response("Questionnaire not found", { status: 404 });

  // Generate unique slug
  const baseSlug = `${source.slug}-copy`;
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.questionnaire.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const copy = await prisma.$transaction(async (tx) => {
    const newQ = await tx.questionnaire.create({
      data: {
        title: `${source.title} (Copie)`,
        slug,
        description: source.description,
        status: "DRAFT",
        category: source.category,
        estimatedMinutes: source.estimatedMinutes,
        ownerId: user.id,
        allowedUsers: {
          connect: { id: user.id },
        },
      },
    });

    if (source.questions.length > 0) {
      // Map old question IDs to new question IDs to rebuild condition sourceQuestionId mapping
      const oldToNewQuestionMap: Record<string, string> = {};

      for (const q of source.questions) {
        const newQues = await tx.question.create({
          data: {
            questionnaireId: newQ.id,
            type: q.type,
            text: q.text,
            options: q.options ?? undefined,
            validations: q.validations ?? undefined,
            required: q.required,
            order: q.order,
          },
        });
        oldToNewQuestionMap[q.id] = newQues.id;
      }

      // Re-create rule groups and conditions
      for (const q of source.questions) {
        const newQuestionId = oldToNewQuestionMap[q.id];
        if (q.ruleGroups && q.ruleGroups.length > 0) {
          for (const rg of q.ruleGroups) {
            const newRg = await tx.questionRuleGroup.create({
              data: {
                questionId: newQuestionId,
                logicOperator: rg.logicOperator,
              },
            });

            if (rg.conditions && rg.conditions.length > 0) {
              await tx.questionCondition.createMany({
                data: rg.conditions.map((c) => ({
                  ruleGroupId: newRg.id,
                  // Map the sourceQuestionId to the new duplicated question ID!
                  sourceQuestionId: oldToNewQuestionMap[c.sourceQuestionId] || c.sourceQuestionId,
                  operator: c.operator,
                  value: c.value,
                  valueSecondary: c.valueSecondary,
                })),
              });
            }
          }
        }
      }
    }

    return tx.questionnaire.findUniqueOrThrow({
      where: { id: newQ.id },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { leads: true } },
      },
    });
  });

  return NextResponse.json(copy, { status: 201 });
}

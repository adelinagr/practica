import { prisma } from "@/lib/db";
import PublicRenderer from "@/components/questionnaire/PublicRenderer";

// Set dynamic SEO metadata for the questionnaire landing page
export const metadata = {
    title: "Evaluare Maturitate Digitală | VreauDigitalizare",
    description: "Află în doar 3 minute care este nivelul actual de digitalizare al companiei tale și primește un raport detaliat cu recomandări personalizate.",
};

// Disable caching to ensure fresh dynamic questionnaires can be loaded
export const revalidate = 0;

async function getOrSeedQuestionnaire() {
    const slug = "evaluare-maturitate-digitala";

    let questionnaire = await prisma.questionnaire.findUnique({
        where: { slug },
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

    // Seed on the fly if not exists (guarantees dynamic availability without manual intervention)
    if (!questionnaire) {
        questionnaire = await prisma.$transaction(async (tx) => {
            const newQuestionnaire = await tx.questionnaire.create({
                data: {
                    slug,
                    title: "Evaluare Maturitate Digitală",
                    description: "Află în doar 3 minute care este nivelul actual de digitalizare al companiei tale și primește recomandări personalizate pentru eficientizarea proceselor.",
                    status: "PUBLISHED",
                },
            });

            const questionsToCreate = [
                {
                    type: "SINGLE_CHOICE",
                    text: "Cât timp alocă echipa ta zilnic pentru task-uri manuale și introducere de date?",
                    options: [
                        { label: "Mai puțin de 1 oră", value: 5 },
                        { label: "Între 1 și 3 ore", value: 3 },
                        { label: "Mai mult de 3 ore", value: 1 },
                        { label: "Nu știu exact", value: 2 }
                    ],
                    required: true,
                    order: 1,
                },
                {
                    type: "SINGLE_CHOICE",
                    text: "Care este principalul domeniu de activitate al companiei tale?",
                    options: [
                        { label: "Servicii", value: 3 },
                        { label: "Comerț / Retail", value: 3 },
                        { label: "Producție", value: 2 },
                        { label: "Construcții", value: 1 },
                        { label: "Horeca", value: 1 },
                        { label: "Altul", value: 2 }
                    ],
                    required: true,
                    order: 2,
                },
                {
                    type: "RATING",
                    text: "Pe o scară de la 1 la 5, cât de digitalizate sunt procesele interne ale companiei în prezent? (1 = complet manual/hârtie, 5 = complet automatizat)",
                    options: null,
                    required: true,
                    order: 3,
                },
                {
                    type: "MULTIPLE_CHOICE",
                    text: "Ce instrumente folosiți în prezent pentru managementul clienților (CRM) și vânzări? (Alegeți toate opțiunile aplicabile)",
                    options: [
                        { label: "Excel / Spreadsheet", value: 1 },
                        { label: "CRM dedicat (ex: HubSpot, Salesforce, Pipedrive)", value: 5 },
                        { label: "Agendă fizică / Notițe pe hârtie", value: 0 },
                        { label: "Email / WhatsApp", value: 2 },
                        { label: "Niciunul / Nu avem un flux organizat", value: 0 }
                    ],
                    required: true,
                    order: 4,
                },
                {
                    type: "SINGLE_CHOICE",
                    text: "Cum gestionați în prezent documentele, contractele și facturile companiei?",
                    options: [
                        { label: "Fizic (pe hârtie, în dosare și bibliorafturi)", value: 0 },
                        { label: "Stocare în Cloud (Google Drive, Dropbox, OneDrive)", value: 3 },
                        { label: "Server local partajat în rețea (Shared Folder / NAS)", value: 2 },
                        { label: "Sistem dedicat de Document Management (DMS / ERP)", value: 5 }
                    ],
                    required: true,
                    order: 5,
                },
                {
                    type: "TEXT",
                    text: "Care este principalul blocaj sau provocare în implementarea noilor tehnologii în compania ta?",
                    options: null,
                    required: false,
                    order: 6,
                },
                {
                    type: "SINGLE_CHOICE",
                    text: "Care este bugetul estimativ pe care compania l-ar putea aloca pentru digitalizare în următoarele 6 luni?",
                    options: [
                        { label: "Sub 1.000 EUR", value: 1 },
                        { label: "1.000 - 5.000 EUR", value: 3 },
                        { label: "5.000 - 15.000 EUR", value: 4 },
                        { label: "Peste 15.000 EUR", value: 5 }
                    ],
                    required: true,
                    order: 7,
                },
            ];

            await Promise.all(
                questionsToCreate.map((q) =>
                    tx.question.create({
                        data: {
                            questionnaireId: newQuestionnaire.id,
                            type: q.type,
                            text: q.text,
                            options: q.options ? (q.options as any) : undefined,
                            required: q.required,
                            order: q.order,
                        },
                    })
                )
            );

            return tx.questionnaire.findUniqueOrThrow({
                where: { id: newQuestionnaire.id },
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
        });
    }

    // Parse JSON string options back to arrays for UI rendering
    return {
        id: questionnaire.id,
        slug: questionnaire.slug,
        title: questionnaire.title,
        description: questionnaire.description,
        questions: questionnaire.questions.map((q) => ({
            id: q.id,
            type: q.type as any,
            text: q.text,
            options: q.options ? (q.options as any as any[]) : null,
            required: q.required,
            order: q.order,
            ruleGroups: q.ruleGroups.map((g) => ({
                id: g.id,
                questionId: g.questionId,
                logicOperator: g.logicOperator as "AND" | "OR",
                conditions: g.conditions.map((c) => ({
                    id: c.id,
                    ruleGroupId: c.ruleGroupId,
                    sourceQuestionId: c.sourceQuestionId,
                    operator: c.operator as any,
                    value: c.value,
                    valueSecondary: c.valueSecondary,
                })),
            })),
        })),
    };
}

export default async function ChestionarPage() {
    const questionnaireData = await getOrSeedQuestionnaire();

    return (
        <div className="relative min-h-[85vh] flex items-center justify-center py-10 overflow-hidden">
            {/* Visual Accent top background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

            <PublicRenderer data={questionnaireData} />
        </div>
    );
}
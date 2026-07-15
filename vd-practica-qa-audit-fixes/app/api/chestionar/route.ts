import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch the digital maturity questionnaire (auto-seeds if not present)
const expectedQuestions = [
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

export async function GET() {
    try {
        const slug = "evaluare-maturitate-digitala";

        let questionnaire = await prisma.questionnaire.findUnique({
            where: { slug },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                },
            },
        });

        // 2. If it does not exist, seed it automatically
        if (!questionnaire) {
            questionnaire = await prisma.$transaction(async (tx) => {
                // Create the questionnaire
                const newQuestionnaire = await tx.questionnaire.create({
                    data: {
                        slug,
                        title: "Evaluare Maturitate Digitală",
                        description: "Află în doar 3 minute care este nivelul actual de digitalizare al companiei tale și primește recomandări personalizate pentru eficientizarea proceselor.",
                        status: "PUBLISHED",
                    },
                });

                await Promise.all(
                    expectedQuestions.map((q) =>
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

                // Fetch again complete with questions
                return tx.questionnaire.findUniqueOrThrow({
                    where: { id: newQuestionnaire.id },
                    include: {
                        questions: {
                            orderBy: { order: "asc" },
                        },
                    },
                });
            });
        } else {
            // Check if database questions need to be synchronized to have the new question / updated order
            const needsSync = questionnaire.questions.length !== expectedQuestions.length ||
                              questionnaire.questions[0].text !== expectedQuestions[0].text;

            if (needsSync) {
                const qId = questionnaire.id;
                await prisma.$transaction(async (tx) => {
                    const currentQuestions = await tx.question.findMany({
                        where: { questionnaireId: qId },
                    });

                    // Update/Create expected questions
                    for (const eq of expectedQuestions) {
                        const match = currentQuestions.find(cq => cq.text === eq.text);
                        if (match) {
                            await tx.question.update({
                                where: { id: match.id },
                                data: {
                                    type: eq.type,
                                    options: eq.options ? (eq.options as any) : null,
                                    required: eq.required,
                                    order: eq.order,
                                }
                            });
                        } else {
                            await tx.question.create({
                                data: {
                                    questionnaireId: qId,
                                    type: eq.type,
                                    text: eq.text,
                                    options: eq.options ? (eq.options as any) : undefined,
                                    required: eq.required,
                                    order: eq.order,
                                }
                            });
                        }
                    }

                    // Remove any deleted/extra questions
                    const expectedTexts = expectedQuestions.map(eq => eq.text);
                    const extraQuestions = currentQuestions.filter(cq => !expectedTexts.includes(cq.text));
                    if (extraQuestions.length > 0) {
                        await tx.question.deleteMany({
                            where: {
                                id: { in: extraQuestions.map(q => q.id) }
                            }
                        });
                    }
                });

                // Re-fetch synchronized questionnaire
                questionnaire = await prisma.questionnaire.findUniqueOrThrow({
                    where: { id: qId },
                    include: {
                        questions: {
                            orderBy: { order: "asc" },
                        },
                    },
                });
            }
        }

        // Standardize JSON options parsing for UI consumption
        const formattedQuestions = questionnaire.questions.map((q) => ({
            ...q,
            options: q.options ? (q.options as any as any[]) : null,
        }));

        return NextResponse.json({
            id: questionnaire.id,
            slug: questionnaire.slug,
            title: questionnaire.title,
            description: questionnaire.description,
            status: questionnaire.status,
            resultInterpretations: questionnaire.resultInterpretations,
            questions: formattedQuestions,
        });
    } catch (error) {
        console.error("[CHESTIONAR_GET_ERROR]", error);
        return new Response("A apărut o eroare la încărcarea chestionarului.", { status: 500 });
    }
}

// POST: Capture Lead contact info + Questionnaire answers, calculate results
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, source, questionnaireId, responses } = body;

        // 1. Validation
        if (!name || !email || !questionnaireId || !responses) {
            return new Response("Numele, emailul și răspunsurile sunt obligatorii.", { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response("Adresa de email nu este validă.", { status: 400 });
        }

        // 2. Fetch questions and questionnaire details
        const questionnaire = await prisma.questionnaire.findUnique({
            where: { id: questionnaireId },
            include: {
                questions: true,
            },
        });

        if (!questionnaire || questionnaire.questions.length === 0) {
            return new Response("Chestionarul specificat nu există sau nu are întrebări asociate.", { status: 404 });
        }
        
        const questions = questionnaire.questions;

        // 3. Save Lead + Responses inside a Prisma Transaction
        const lead = await prisma.$transaction(async (tx) => {
            const newLead = await tx.lead.create({
                data: {
                    name,
                    email,
                    phone: phone || null,
                    source: source || "questionnaire",
                    questionnaireId,
                },
            });

            // Save each response answer
            const answerPromises = Object.entries(responses).map(([questionId, value]) => {
                // Double-check if the question exists
                const questionExists = questions.some((q) => q.id === questionId);
                if (!questionExists) return Promise.resolve();

                return tx.responseAnswer.create({
                    data: {
                        leadId: newLead.id,
                        questionId,
                        answer: JSON.stringify(value),
                    },
                });
            });

            await Promise.all(answerPromises);
            return newLead;
        });

        // 4. Calculate Dynamic Scoring
        const dimensionRawScores: Record<string, number> = {};
        const dimensionMaxScores: Record<string, number> = {};
        let totalRawScore = 0;
        let totalMaxScore = 0;

        const recommendations: string[] = [];

        questions.forEach((q) => {
            const answerVal = responses[q.id];
            if (answerVal === undefined || answerVal === null) return;

            const category = (q.validations as any)?.category || "General";
            if (!dimensionRawScores[category]) {
                dimensionRawScores[category] = 0;
                dimensionMaxScores[category] = 0;
            }

            let questionScore = 0;
            let questionMaxScore = 0;

            if (q.type === "RATING") {
                questionScore = Number(answerVal) || 0;
                questionMaxScore = 5; // Default max for rating
            } else if (q.type === "SINGLE_CHOICE" || q.type === "DROPDOWN") {
                const options = q.options as any[];
                if (options && Array.isArray(options)) {
                    const selectedOpt = options.find((o) => typeof o === "object" && o !== null ? o.label === answerVal : o === answerVal);
                    if (selectedOpt && typeof selectedOpt === "object" && typeof selectedOpt.value === "number") {
                        questionScore = selectedOpt.value;
                    }
                    questionMaxScore = Math.max(...options.map(o => (typeof o === "object" && typeof o.value === "number") ? o.value : 0), 0);
                }
            } else if (q.type === "MULTIPLE_CHOICE") {
                const options = q.options as any[];
                const selectedVals = Array.isArray(answerVal) ? answerVal : [answerVal];
                if (options && Array.isArray(options)) {
                    options.forEach(o => {
                        const isObj = typeof o === "object" && o !== null;
                        const label = isObj ? o.label : o;
                        if (selectedVals.includes(label)) {
                            if (isObj && typeof o.value === "number") {
                                questionScore += o.value;
                            }
                        }
                    });
                    questionMaxScore = options.reduce((sum, o) => sum + ((typeof o === "object" && typeof o.value === "number") ? o.value : 0), 0);
                }
            }

            dimensionRawScores[category] += questionScore;
            dimensionMaxScores[category] += questionMaxScore;
            totalRawScore += questionScore;
            totalMaxScore += questionMaxScore;
        });

        // Normalize scores to 0-100%
        const dimensionScores: Record<string, number> = {};
        for (const cat in dimensionRawScores) {
            const max = dimensionMaxScores[cat];
            if (max > 0) {
                dimensionScores[cat] = Math.round((dimensionRawScores[cat] / max) * 100);
            } else {
                dimensionScores[cat] = 0;
            }
        }

        const overallScore = totalMaxScore > 0 ? Math.round((totalRawScore / totalMaxScore) * 100) : 0;

        // Classification based on overall score (normalized 0-100)
        let level = "Nivel Începător";
        let title = "Analiză finalizată";
        let description = "Rezultatele tale au fost înregistrate. Compania ta este la începutul procesului de digitalizare, dar cu pași mici poți obține rezultate majore.";
        
        const customInterpretations = questionnaire.resultInterpretations as any[];

        if (customInterpretations && Array.isArray(customInterpretations) && customInterpretations.length > 0) {
            // Find matching interpretation
            const match = customInterpretations.find(
                (i) => overallScore >= (i.minScore || 0) && overallScore <= (i.maxScore || 100)
            );
            
            if (match) {
                level = match.level || level;
                title = match.title || title;
                description = match.description || description;
                if (match.recommendations && Array.isArray(match.recommendations)) {
                    match.recommendations.forEach((r: string) => recommendations.push(r));
                }
            }
        } else {
            // Fallback generic logic
            if (overallScore > 35 && overallScore <= 70) {
                level = "Nivel Intermediar";
                title = "Ești pe drumul cel bun";
                description = "Ai implementat deja bune practici, dar mai sunt zone de optimizat pentru a atinge performanța maximă.";
            } else if (overallScore > 70) {
                level = "Nivel Avansat";
                title = "Performanță excelentă";
                description = "Felicitări! Procesele tale sunt foarte bine structurate. Următorul pas este scalarea și inovarea continuă.";
            }

            if (recommendations.length === 0) {
                recommendations.push("Analizează detaliat fiecare secțiune din raport pentru a identifica punctele critice ce necesită atenție imediată.");
            }
        }

        return NextResponse.json({
            success: true,
            leadId: lead.id,
            score: overallScore,
            dimensionScores, // Return the dynamic scores!
            level,
            title,
            description,
            recommendations,
        });
    } catch (error) {
        console.error("[CHESTIONAR_POST_ERROR]", error);
        return new Response("A apărut o eroare la salvarea răspunsurilor.", { status: 500 });
    }
}
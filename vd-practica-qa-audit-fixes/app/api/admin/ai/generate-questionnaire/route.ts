import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { prompt, numQuestions, context } = await req.json();

    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.object({
        questions: z.array(
          z.object({
            type: z.enum([
              "TEXT",
              "TEXTAREA",
              "SINGLE_CHOICE",
              "MULTIPLE_CHOICE",
              "DROPDOWN",
              "RATING",
              "YES_NO",
              "NUMERIC",
              "EMAIL",
              "PHONE",
              "DATE",
            ]),
            text: z.string().describe("The actual question text in Romanian."),
            options: z
              .array(z.string())
              .nullable()
              .describe("Array of options if type is a choice type, else null."),
            required: z.boolean().describe("Whether this question is required."),
          })
        ),
      }),
      system: "Ești un asistent AI expert în generarea de formulare și chestionare pentru platforme SaaS și procese de business.",
      prompt: `Generează un chestionar cu aproximativ ${numQuestions || 5} întrebări.\nSubiect: ${prompt}\nContext adițional: ${context || 'Niciunul'}\nÎntoarce rezultatul strict în formatul JSON cerut, în limba română.`,
    });

    // We can also save this to AiHistory here if we want:
    // await prisma.aiHistory.create({ ... })

    return NextResponse.json(object);
  } catch (error) {
    console.error("AI Questionnaire Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

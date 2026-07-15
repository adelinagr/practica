import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { prompt, systemPrompt, contextText } = await req.json();

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt || "You are an expert AI assistant for a digital agency.",
      prompt: `${contextText ? `Context:\n${contextText}\n\n` : ''}User Prompt:\n${prompt}`,
      temperature: 0.7,
    });

    return (result as any).toDataStreamResponse();
  } catch (error) {
    console.error("AI Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

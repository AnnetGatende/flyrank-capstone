import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { buildSmsUserPrompt, smsSystemPrompt } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { debtorName, amount, shopName, dueStatus, language } = body;

    if (!debtorName || amount == null) {
      return Response.json(
        { error: "debtorName and amount are required" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        { error: "GOOGLE_GENERATIVE_AI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const { text } = await generateText({
      model: google("gemini-3.5-flash-lite"),
      system: smsSystemPrompt,
      prompt: buildSmsUserPrompt({
        debtorName,
        amount: Number(amount),
        shopName,
        dueStatus,
        language: language ?? "sw",
      }),
    });

    return Response.json({ sms: text.trim() });
  } catch (error) {
    console.error("SMS API error:", error);
    return Response.json(
      {
        error: "Failed to generate SMS",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

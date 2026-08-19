import { google } from "@ai-sdk/google";
import { chatSystemPrompt } from "./prompts";

export const chatModel = google("gemini-1.5-flash");

export const systemPrompt = chatSystemPrompt;

export const modelConfig = {
  temperature: 0.7,
  maxOutputTokens: 800,
};

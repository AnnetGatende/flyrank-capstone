import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { chatModel, systemPrompt, modelConfig } from '@/lib/ai-config';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: chatModel,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    temperature: modelConfig.temperature,
    maxOutputTokens: modelConfig.maxOutputTokens,
  });

  return result.toUIMessageStreamResponse();
}
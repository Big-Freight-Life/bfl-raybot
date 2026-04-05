import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { SYSTEM_PROMPT, ChatMessage } from './knowledge';
import { GEMINI_MODEL, GEMINI_MAX_OUTPUT_TOKENS, GEMINI_TEMPERATURE } from './constants';

/** Singleton model instance — reused across requests within the same serverless instance */
let cachedModel: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!cachedModel) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const genAI = new GoogleGenerativeAI(apiKey);
    cachedModel = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
        temperature: GEMINI_TEMPERATURE,
      },
    });
  }
  return cachedModel;
}

function buildChat(messages: ChatMessage[]) {
  const model = getModel();
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1];
  return { chat: model.startChat({ history }), lastMessage: lastMessage.content };
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  const { chat, lastMessage } = buildChat(messages);
  const result = await chat.sendMessage(lastMessage);
  return result.response.text();
}

export async function* streamChatResponse(messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<string> {
  const { chat, lastMessage } = buildChat(messages);
  const result = await chat.sendMessageStream(lastMessage);
  for await (const chunk of result.stream) {
    if (signal?.aborted) break;
    const text = chunk.text();
    if (text) yield text;
  }
}

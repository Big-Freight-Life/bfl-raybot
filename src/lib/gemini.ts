import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, ChatMessage } from './knowledge';

function createModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  });
}

function buildChat(messages: ChatMessage[]) {
  const model = createModel();
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

export async function* streamChatResponse(messages: ChatMessage[]): AsyncGenerator<string> {
  const { chat, lastMessage } = buildChat(messages);
  const result = await chat.sendMessageStream(lastMessage);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

// lib/chatLogger.ts
import { connectToDatabase } from './mongodb';
import { ChatLog } from '@/models/ChatLog';

interface ChatLogInput {
  sessionId: string;
  userMessage: string;
  botReply: string;
  providerUsed: 'groq' | 'openrouter' | 'mock' | 'gemini';
  responseTimeMs: number;
  success: boolean;
  errorMessage?: string | null;
  locale: string;
  userAgent?: string;
  ipHash?: string;
}

export async function saveChatLog(data: ChatLogInput) {
  try {
    // Conecta ao banco (usa cache)
    await connectToDatabase();

    await ChatLog.create({
      ...data,
      createdAt: new Date(),
    });

    console.log(`📊 Log salvo: ${data.providerUsed} | ${data.responseTimeMs}ms`);
  } catch (error) {
    // Nunca quebra o fluxo principal se o log falhar
    console.error('⚠️ Erro ao salvar log do chat:', error);
  }
}
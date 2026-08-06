// app/api/test-log/route.ts
import { NextResponse } from 'next/server';
import { saveChatLog } from '@/lib/chatLogger';

export async function GET() {
  try {
    await saveChatLog({
      sessionId: 'test-session',
      userMessage: 'Mensagem de teste manual',
      botReply: 'Resposta de teste manual',
      providerUsed: 'mock',
      responseTimeMs: 100,
      success: true,
      locale: 'pt',
    });
    
    return NextResponse.json({ message: 'Log salvo com sucesso!' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar log' }, { status: 500 });
  }
}
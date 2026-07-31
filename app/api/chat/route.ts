import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// ============================================
// 1. DEFINIÇÕES DE TIPO
// ============================================
type Role = 'user' | 'assistant';
type ChatMessage = { role: Role; content: string };
type ChatBody = { messages: ChatMessage[]; locale?: string; sessionId?: string };

// ============================================
// 2. SYSTEM PROMPT
// ============================================
const GEMINI_SYSTEM_PROMPT = `Você é um assistente conversacional integrado ao portfólio de Pedro Freitas — UX Designer Conversacional e AI Engineer.

Responda perguntas sobre:
- Trajetória: transição de carreira, experiência em design de conversa e engenharia de IA
- Habilidades: IBM Watson Assistant, Figma, UX Writing, Prompt Engineering, APIs LLMs, RAG, TypeScript, React, Next.js, Node.js, MongoDB
- Projetos: assistentes Watson, integrações com LLMs, sistemas RAG
- Idiomas: Português (nativo), Inglês (fluente), Espanhol, Mandarim (em estudo)
- Contato: pedrofreitasst@gmail.com | linkedin.com/in/pedro-de-freitas-a776711a1 | github.com/pedrofreitasst

Tom: profissional, direto e conversacional. Se não tiver a informação, indique o email de contato.
Responda no idioma da mensagem do usuário.`;

// ============================================
// 3. FUNÇÃO MOCK
// ============================================
function mockReply(messages: ChatMessage[], locale: string = 'pt'): string {
  const pool: Record<string, { default: string }> = {
    pt: { default: "Posso falar sobre projetos, experiência ou processo. O que te interessa?" },
    en: { default: "I can talk about projects, experience or process. What interests you?" },
    es: { default: "Puedo hablar sobre proyectos, experiencia o proceso. ¿Qué te interessa?" },
    zh: { default: "我可以聊聊项目、经验或流程。你对什么感兴趣？" }
  };

  const currentPool = pool[locale] || pool.pt;
  return currentPool.default;
}

// ============================================
// 4. INICIALIZA OS CLIENTES
// ============================================
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ============================================
// 5. FUNÇÃO PARA OPENROUTER (FALLBACK)
// ============================================
async function callOpenRouter(messages: any[], locale: string) {
  if (!OPENROUTER_API_KEY) return null;
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://pedrodefreitas.vercel.app',
        'X-Title': 'Portfolio Pedro Freitas',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Erro no OpenRouter:', error);
    return null;
  }
}

// ============================================
// 6. FUNÇÃO PRINCIPAL (POST)
// ============================================
export async function POST(req: Request) {
  let currentMessages: ChatMessage[] = [];
  let currentLocale = 'pt';

  try {
    const body: ChatBody = await req.json();
    currentMessages = body.messages || [];
    currentLocale = body.locale || 'pt';

    // Verifica se tem mensagens
    if (currentMessages.length === 0) {
      return NextResponse.json({ text: mockReply(currentMessages, currentLocale) });
    }

    // Tratamento de histórico: encontra a primeira mensagem do usuário
    const firstUserIndex = currentMessages.findIndex(msg => msg.role === 'user');
    const validHistory = firstUserIndex !== -1 ? currentMessages.slice(firstUserIndex) : currentMessages;

    if (validHistory.length === 0) {
      return NextResponse.json({ text: mockReply(currentMessages, currentLocale) });
    }

    // ==========================================
    // PREPARA AS MENSAGENS COM A TIPAGEM CORRETA
    // ==========================================
    // Usamos 'as const' para garantir que os papéis são literais e 
    // fazemos um cast para o tipo que o Groq espera
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { 
        role: 'system' as const, 
        content: GEMINI_SYSTEM_PROMPT 
      },
      ...validHistory.map((msg): Groq.Chat.ChatCompletionMessageParam => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    let replyText: string | null = null;

// ==========================================
// TENTA GROQ PRIMEIRO
// ==========================================
if (process.env.GROQ_API_KEY) {
  try {
    console.log('🟢 Tentando Groq...');
    const response = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile', // ✅ Modelo atualizado!
      temperature: 0.7,
      max_tokens: 500,
    });
    replyText = response.choices[0]?.message?.content || null;
    if (replyText) {
      console.log('✅ Groq funcionou!');
    }
  } catch (error) {
    console.warn('⚠️ Groq falhou:', error);
  }
}

    // ==========================================
    // SE GROQ FALHOU, TENTA OPENROUTER
    // ==========================================
    if (!replyText && OPENROUTER_API_KEY) {
      try {
        console.log('🟡 Tentando OpenRouter (fallback)...');
        replyText = await callOpenRouter(messages, currentLocale);
        if (replyText) {
          console.log('✅ OpenRouter funcionou!');
        }
      } catch (error) {
        console.warn('⚠️ OpenRouter falhou:', error);
      }
    }

    // ==========================================
    // SE TUDO FALHOU, USA O MOCK
    // ==========================================
    replyText = replyText || mockReply(currentMessages, currentLocale);
    
    if (!replyText) {
      console.warn('🔴 Todas as APIs falharam, usando mock');
      replyText = mockReply(currentMessages, currentLocale);
    }

    return NextResponse.json({ text: replyText });

  } catch (error) {
    console.error("❌ Erro crítico:", error);
    return NextResponse.json({ text: mockReply(currentMessages, currentLocale) });
  }
}
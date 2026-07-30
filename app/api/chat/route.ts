import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// System prompt com a sua persona refinada para o portfólio
const GEMINI_SYSTEM_PROMPT = `Você é um assistente conversacional integrado ao portfólio de Pedro Freitas — UX Designer Conversacional e AI Engineer.

Responda perguntas sobre:
- Trajetória: transição de carreira, experiência em design de conversa e engenharia de IA
- Habilidades: IBM Watson Assistant, Figma, UX Writing, Prompt Engineering, APIs LLMs, RAG, TypeScript, React, Next.js, Node.js, MongoDB
- Projetos: assistentes Watson, integrações com LLMs, sistemas RAG
- Idiomas: Português (nativo), Inglês (fluente), Espanhol, Mandarim (em estudo)
- Contato: pedrofreitasst@gmail.com | linkedin.com/in/pedro-de-freitas-a776711a1 | github.com/pedrofreitasst

Tom: profissional, direto e conversacional. Se não tiver a informação, indique o email de contato.
Responda no idioma da mensagem do usuário.`;

type Role = 'user' | 'assistant';
type ChatMessage = { role: Role; content: string };
type ChatBody = { messages: ChatMessage[]; locale?: string; sessionId?: string };

// Inicializa o cliente oficial do Gemini com a chave configurada na Vercel
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Função Fallback (Mock) para consistência multilíngue caso a API falhe ou falte a Key
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

export async function POST(req: Request) {
  // Variável declarada fora do escopo do try para estar disponível no catch caso necessário
  let currentMessages: ChatMessage[] = [];
  let currentLocale = 'pt';

  try {
    const body: ChatBody = await req.json();
    currentMessages = body.messages || [];
    currentLocale = body.locale || 'pt';

    // 1. Validação de segurança caso a chave não esteja acessível
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY não configurada no ambiente.");
      return NextResponse.json({ text: mockReply(currentMessages, currentLocale) });
    }

    // 2. Mapeamento de Roles: O SDK do Gemini exige 'model' no lugar de 'assistant'
    const contents = currentMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // 3. Chamada oficial à API do Gemini usando o modelo estável recomendado
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: GEMINI_SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    const replyText = response.text || mockReply(currentMessages, currentLocale);
    return NextResponse.json({ text: replyText });

  } catch (error) {
    console.error("Erro detectado na rota do Gemini:", error);
    // Retorna o mock respeitando a tipagem correta de array exigida pelo TypeScript
    return NextResponse.json({ text: mockReply(currentMessages, currentLocale) });
  }
}
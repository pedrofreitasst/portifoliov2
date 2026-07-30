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

// Inicializa o cliente do Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

// Banco de dados simulado para fallbacks internacionais
function mockReply(messages: ChatMessage[], locale: string): string {
  const last = messages[messages.length - 1]?.content.toLowerCase() ?? '';
  
  const pool: Record<string, Record<string, string>> = {
    pt: {
      project: 'O Pedro vem trabalhando em assistentes no IBM Watson e com APIs de LLM. Quer falar por email? pedrofreitasst@gmail.com',
      contact: 'Você pode falar com o Pedro por email, LinkedIn ou GitHub, links na seção "Fale Comigo".',
      experience: 'Pedro está em transição para UX Conversacional e AI Engineering, com base técnica em TypeScript, Next.js e Node.js.',
      default: 'Posso falar sobre projetos, experiência ou processo. O que te interessa?',
    },
    en: {
      project: 'Pedro has been working on Watson assistants and LLM API integrations. Want to connect via email? pedrofreitasst@gmail.com',
      contact: 'You can reach Pedro via email, LinkedIn or GitHub, all links are in the "Contact" section.',
      experience: 'Pedro is transitioning into Conversational UX and AI Engineering, with a technical background in TypeScript, Next.js and Node.js.',
      default: "I can talk about Pedro's projects, experience or process. What would you like to know?",
    },
    es: {
      project: 'Pedro ha estado trabajando en asistentes de Watson e integraciones de API de LLM. ¿Quieres contactar por correo? pedrofreitasst@gmail.com',
      contact: 'Puedes contactar con Pedro por correo electrónico, LinkedIn o GitHub, todos los enlaces están en la sección "Contacto".',
      experience: 'Pedro está haciendo la transición a UX Conversacional y AI Engineering, con experiencia técnica en TypeScript, Next.js e Node.js.',
      default: 'Puedo hablar sobre los proyectos, la experiencia o el proceso de Pedro. ¿Qué te gustaría saber?',
    },
    zh: {
      project: 'Pedro 一直在研究 Watson 助手和 LLM API 集成。想通过电子邮件联系吗？ pedrofreitasst@gmail.com',
      contact: '您可以通过电子邮件、LinkedIn 或 GitHub 联系 Pedro，所有链接都在“联系”部分。',
      experience: 'Pedro 正在转型为对话式 UX 和 AI 工程，具有 TypeScript、Next.js 和 Node.js 的技术背景。',
      default: '我可以谈谈 Pedro 的项目、经验或流程。你想知道什么？',
    }
  };

  const currentLocale = locale.startsWith('zh') ? 'zh' : locale;
  const p = pool[currentLocale] ?? pool.pt;
  
  if (/projeto|project|proyecto|项目|watson|rag|llm/.test(last)) return p.project;
  if (/contato|contact|contacto|联系|email|fal/.test(last)) return p.contact;
  if (/experiên|background|trajet|experiencia|经验/.test(last)) return p.experience;
  return p.default;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatBody;
    const messages = body.messages ?? [];
    const locale = body.locale ?? 'pt';
    const userMessage = messages[messages.length - 1]?.content ?? '';

    if (!userMessage) {
      return NextResponse.json({ reply: 'Mensagem vazia.' }, { status: 400 });
    }

    const hasGemini = !!process.env.GEMINI_API_KEY;

    if (!hasGemini) {
      console.warn('[api/chat] Chave GEMINI_API_KEY ausente. Caindo no mock.');
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json({ reply: mockReply(messages, locale), source: 'mock' });
    }

    try {
      // Mapeia o histórico para o formato da SDK do Gemini ('user' ou 'model')
      const formattedContents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction: GEMINI_SYSTEM_PROMPT,
          temperature: 0.7, 
        }
      });

      const replyText = response.text ?? 'Desculpe, não consegui formular uma resposta.';

      return NextResponse.json({
        reply: replyText,
        source: 'gemini',
        sessionId: body.sessionId // Retorna o ID enviado para o front não quebrar regras de estado
      });

    } catch (geminiError) {
      console.error('[api/chat] Erro na API do Gemini:', geminiError);
      return NextResponse.json({
        reply: mockReply(messages, locale),
        source: 'mock',
        error: String(geminiError),
        sessionId: body.sessionId
      });
    }

  } catch (err) {
    console.error('[api/chat] Erro crítico interno:', err);
    return NextResponse.json(
      { reply: 'Erro interno. Tente novamente em instantes.' },
      { status: 500 },
    );
  }
}
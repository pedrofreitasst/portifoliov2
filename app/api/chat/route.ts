import { NextResponse } from 'next/server';


const WATSON_CONFIDENCE_THRESHOLD = 0.7;


const CLAUDE_SYSTEM_PROMPT = `Você é um assistente conversacional integrado ao portfólio de Pedro Freitas — UX Designer Conversacional e AI Engineer.

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



async function getWatsonToken(): Promise<string> {
  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${process.env.WATSON_API_KEY}`,
  });
  if (!res.ok) throw new Error(`Watson IAM error ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

async function createWatsonSession(token: string): Promise<string> {
  const url = `${process.env.WATSON_SERVICE_URL}/v2/assistants/${process.env.WATSON_ASSISTANT_ID}/sessions?version=2023-06-15`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Watson session error ${res.status}`);
  const data = await res.json();
  return data.session_id as string;
}

interface WatsonResult {
  text: string | null;
  confidence: number;
  topIntent: string | null;
  isAnythingElse: boolean;
}

async function askWatson(
  token: string,
  sessionId: string,
  userMessage: string,
): Promise<WatsonResult> {
  const url = `${process.env.WATSON_SERVICE_URL}/v2/assistants/${process.env.WATSON_ASSISTANT_ID}/sessions/${sessionId}/message?version=2023-06-15`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { message_type: 'text', text: userMessage } }),
  });
  if (!res.ok) throw new Error(`Watson message error ${res.status}`);
  const data = await res.json();

  const output = data.output ?? {};
  const intents: { intent: string; confidence: number }[] = output.intents ?? [];
  const genericResponses: { response_type: string; text?: string }[] = output.generic ?? [];

  const topIntent = intents[0]?.intent ?? null;
  const confidence = intents[0]?.confidence ?? 0;

  // Detecta se bateu no nó "Anything else" ou se não há texto de resposta
  const textResponses = genericResponses.filter((r) => r.response_type === 'text');
  const responseText = textResponses[0]?.text ?? null;
  const isAnythingElse = !responseText || confidence < WATSON_CONFIDENCE_THRESHOLD;

  return { text: responseText, confidence, topIntent, isAnythingElse };
}


// Anthropic Claude — resposta de fallback / perguntas abertas


async function askClaude(
  messages: ChatMessage[],
  watsonIntent: string | null,
): Promise<string> {
  const systemWithContext = watsonIntent
    ? `${CLAUDE_SYSTEM_PROMPT}\n\nContexto: o Watson detectou a intenção "${watsonIntent}" mas não tinha resposta suficientemente confiante para essa pergunta.`
    : CLAUDE_SYSTEM_PROMPT;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: systemWithContext,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const data = await res.json();
  const block = (data.content ?? []).find((b: { type: string }) => b.type === 'text');
  return (block as { text: string } | undefined)?.text ?? 'Desculpe, não consegui processar agora.';
}


// Respostas mock 


function mockReply(messages: ChatMessage[], locale: string): string {
  const last = messages[messages.length - 1]?.content.toLowerCase() ?? '';

  const pool: Record<string, Record<string, string>> = {
    pt: {
      project: 'O Pedro vem trabalhando em assistentes no IBM Watson e com APIs de LLM. Quer falar por email? pedrofreitasst@gmail.com',
      contact: 'Você pode falar com o Pedro por email, LinkedIn ou GitHub — links na seção "Fale Comigo".',
      experience: 'Pedro está em transição para UX Conversacional e AI Engineering, com base técnica em TypeScript, Next.js e Node.js.',
      default: 'Posso falar sobre projetos, experiência ou processo. O que te interessa?',
    },
    en: {
      project: 'Pedro has been working on Watson assistants and LLM API integrations. Want to connect via email? pedrofreitasst@gmail.com',
      contact: 'You can reach Pedro via email, LinkedIn or GitHub — all links are in the "Contact" section.',
      experience: 'Pedro is transitioning into Conversational UX and AI Engineering, with a technical background in TypeScript, Next.js and Node.js.',
      default: "I can talk about Pedro's projects, experience or process. What would you like to know?",
    },
  };

  const p = pool[locale] ?? pool.pt;
  if (/projeto|project|watson|rag|llm/.test(last)) return p.project;
  if (/contato|contact|email|fal/.test(last)) return p.contact;
  if (/experiên|background|trajet/.test(last)) return p.experience;
  return p.default;
}


// Handler principal


export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatBody;
    const messages = body.messages ?? [];
    const locale = body.locale ?? 'pt';
    const userMessage = messages[messages.length - 1]?.content ?? '';

    if (!userMessage) {
      return NextResponse.json({ reply: 'Mensagem vazia.' }, { status: 400 });
    }

    const hasWatson = !!(process.env.WATSON_API_KEY && process.env.WATSON_SERVICE_URL && process.env.WATSON_ASSISTANT_ID);
    const hasClaude = !!process.env.ANTHROPIC_API_KEY;

    // Modo mock — nenhuma API configurada
    if (!hasWatson && !hasClaude) {
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json({ reply: mockReply(messages, locale) });
    }

    let watsonIntent: string | null = null;
    let watsonConfidence = 0;

    // Passo 1: Watson (se configurado)
    if (hasWatson) {
      try {
        const token = await getWatsonToken();
        //  em produção, armazenar o sessionId no cliente (cookie/localStorage)
        //   para manter contexto entre mensagens. Aqui criamos uma nova sessão por request
        //   para simplificar o exemplo de portfólio.
        const sessionId = body.sessionId ?? (await createWatsonSession(token));
        const watsonResult = await askWatson(token, sessionId, userMessage);

        watsonIntent = watsonResult.topIntent;
        watsonConfidence = watsonResult.confidence;

        // Watson respondeu com confiança suficiente
        if (!watsonResult.isAnythingElse && watsonResult.text) {
          return NextResponse.json({
            reply: watsonResult.text,
            source: 'watson',
            intent: watsonIntent,
            confidence: watsonConfidence,
          });
        }
      } catch (err) {
        // Watson falhou — continua para Claude como fallback silencioso
        console.error('[api/chat] Watson error (falling back to Claude):', err);
      }
    }

    // Passo 2: Claude (fallback ou modo solo)
    if (hasClaude) {
      const reply = await askClaude(messages, watsonIntent);
      return NextResponse.json({
        reply,
        source: 'claude',
        // Útil para depuração — pode remover em produção
        watsonIntent,
        watsonConfidence,
      });
    }

    // Fallback final se Claude também não estiver configurado
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ reply: mockReply(messages, locale) });
  } catch (err) {
    console.error('[api/chat] erro:', err);
    return NextResponse.json(
      { reply: 'Erro interno. Tente novamente em instantes.' },
      { status: 500 },
    );
  }
}

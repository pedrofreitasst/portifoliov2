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
  const apiKey = encodeURIComponent(process.env.WATSON_API_KEY ?? '');
  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Watson IAM error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

interface WatsonResult {
  text: string | null;
  confidence: number;
  topIntent: string | null;
  isAnythingElse: boolean;
}

/**
 * Normaliza texto vindo do Watson Actions:
 *  - <br />, <br/>, <br>           → \n
 *  - Múltiplas quebras seguidas    → no máx 2
 *  - Trim
 * Markdown (**bold**, *italic*, [link](url)) é tratado no cliente via renderer.
 */
function normalizeWatsonText(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Endpoint STATELESS do Watson v2 — funciona com modelo Actions (novo) e
 * Dialog clássico. Não precisa criar sessão (evita o 404 comum quando o
 * Assistant ID na verdade era um Environment ID).
 *
 * Para WATSON_ASSISTANT_ID, no painel "View API details" do Watson:
 *   - Modelo Actions: use o "Draft environment ID" ou "Live environment ID"
 *   - Modelo Dialog clássico: use o "Assistant ID"
 */
async function askWatson(
  token: string,
  userMessage: string,
): Promise<WatsonResult> {
  const url = `${process.env.WATSON_SERVICE_URL}/v2/assistants/${process.env.WATSON_ASSISTANT_ID}/message?version=2024-08-25`;
  console.log('[api/chat] Watson URL:', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { message_type: 'text', text: userMessage } }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Watson message error ${res.status}: ${text}`);
  }
  const data = await res.json();

  const output = data.output ?? {};
  const intents: { intent: string; confidence: number }[] = output.intents ?? [];
  const genericResponses: { response_type: string; text?: string }[] = output.generic ?? [];
  // O modelo Actions sinaliza fallback via output.actions[].name === 'system_fallback'.
  // O modelo Dialog clássico sinaliza via confidence baixa em intents.
  const actions: { name?: string; type?: string }[] = output.actions ?? [];

  const topIntent = intents[0]?.intent ?? null;
  const confidence = intents[0]?.confidence ?? 0;

  // Concatena todos os blocos de texto (Watson às vezes manda vários),
  // separados por uma linha em branco, e normaliza tags de formatação.
  const textResponses = genericResponses.filter((r) => r.response_type === 'text');
  const rawText = textResponses.map((r) => r.text ?? '').filter(Boolean).join('\n\n');
  const responseText = rawText ? normalizeWatsonText(rawText) : null;

  // Detecção robusta de fallback — funciona com Dialog clássico E modelo Actions:
  //   1. Sem texto de resposta → Watson não tinha o que dizer
  //   2. Modelo Actions disparou explicitamente system_fallback
  //   3. Modelo Dialog clássico: há intents detectadas MAS a confiança é baixa
  //      (importante: se não houver intents — modelo Actions —, não rejeita por isso)
  const hitFallbackAction = actions.some((a) => a.name === 'system_fallback');
  const lowConfidenceDialog =
    intents.length > 0 && confidence < WATSON_CONFIDENCE_THRESHOLD;
  const isAnythingElse = !responseText || hitFallbackAction || lowConfidenceDialog;

  // Log de diagnóstico — útil enquanto está afinando o assistant.
  // Remova ou troque por um logger estruturado em produção.
  console.log('[api/chat] Watson:', {
    hasText: !!responseText,
    topIntent,
    confidence,
    hitFallbackAction,
    isAnythingElse,
  });

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
    let watsonErrorMessage: string | null = null;

    // Passo 1: Watson (se configurado) — chamada STATELESS, sem session.
    if (hasWatson) {
      try {
        console.log('[api/chat] Step 1/2: obtendo token IAM...');
        const token = await getWatsonToken();
        console.log('[api/chat] Step 1/2: token obtido ✓');

        console.log('[api/chat] Step 2/2: enviando mensagem ao assistant...');
        const watsonResult = await askWatson(token, userMessage);
        console.log('[api/chat] Step 2/2: resposta recebida ✓');

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
        watsonErrorMessage = err instanceof Error ? err.message : String(err);
        console.error('[api/chat] Watson error (falling back to Claude):', watsonErrorMessage);
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

    // Fallback final se Claude também não estiver configurado.
    // Se você ver este log, significa que o Watson não respondeu com confiança
    // suficiente (ou o assistant não foi reconhecido) E a chave Anthropic não
    // está disponível — então o chat caiu pra resposta mock.
    console.warn('[api/chat] Caindo em mock', {
      hasWatson,
      hasClaude,
      watsonIntent,
      watsonConfidence,
      watsonErrorMessage,
    });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({
      reply: mockReply(messages, locale),
      source: 'mock',
      watsonIntent,
      watsonConfidence,
      // Erro do Watson exposto em dev — facilita debug pelo Network tab.
      // Em produção, retire este campo.
      watsonError: watsonErrorMessage,
    });
  } catch (err) {
    console.error('[api/chat] erro:', err);
    return NextResponse.json(
      { reply: 'Erro interno. Tente novamente em instantes.' },
      { status: 500 },
    );
  }
}

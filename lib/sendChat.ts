export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatResponse = {
  text: string;
  sessionId?: string;
  provider?: string;
};

/** Thin client for existing /api/chat. Contract unchanged. */
export async function sendChat(params: {
  messages: ChatMessage[];
  locale?: string;
  sessionId?: string;
}): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
      locale: params.locale ?? 'en',
      sessionId: params.sessionId,
    }),
  });

  if (!res.ok) {
    throw new Error('Chat request failed (' + res.status + ')');
  }

  const data = (await res.json()) as ChatResponse;
  return {
    text: data?.text ?? 'Sorry, I could not process that just now. Try again in a moment.',
    sessionId: data?.sessionId,
    provider: data?.provider,
  };
}

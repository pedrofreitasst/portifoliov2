'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useT } from '@/lib/i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Detecta URLs e emails para transformá-los em links clicáveis.
// Limita o tamanho dos matches pra evitar pegar lixo.
const LINK_REGEX = /(https?:\/\/[^\s<>"']+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

/**
 * Renderiza o conteúdo da mensagem do assistant preservando quebras de linha
 * (via whitespace-pre-line no container) e transformando URLs/emails em <a>.
 * Markdown simples (**bold**, *italic*) é renderizado também.
 */
function renderMessageContent(content: string) {
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(LINK_REGEX.source, 'g');

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push(formatInline(content.slice(lastIndex, match.index), `t-${match.index}`));
    }
    const raw = match[0];
    const isEmail = raw.includes('@') && !raw.startsWith('http');
    const href = isEmail ? `mailto:${raw}` : raw;
    segments.push(
      <a
        key={`l-${match.index}`}
        href={href}
        target={isEmail ? undefined : '_blank'}
        rel={isEmail ? undefined : 'noopener noreferrer'}
        className="underline underline-offset-2 decoration-cream-dim hover:decoration-ember"
      >
        {raw}
      </a>,
    );
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < content.length) {
    segments.push(formatInline(content.slice(lastIndex), `t-end`));
  }
  return segments;
}

// Markdown inline minimalista: **bold** e *italic*.
function formatInline(text: string, key: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return (
    <span key={key}>
      {parts.map((p, i) => {
        if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (/^\*[^*\n]+\*$/.test(p)) return <em key={i}>{p.slice(1, -1)}</em>;
        return p;
      })}
    </span>
  );
}

export default function Chatbot() {
  const { t, locale } = useT();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('chatbot.greeting') }]);
  }, [locale, t]);


  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);


  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          locale,
          sessionId: sessionId ?? undefined, 
        }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId); 
      const reply =
        data?.reply ??
        'Desculpe, não consegui processar agora. Tente novamente em instantes.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'Houve um erro de conexão. Verifique se o servidor está rodando e a chave da API está configurada.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('chatbot.close_label') : t('chatbot.open_label')}
        aria-expanded={open}
        className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ember text-cream shadow-xl shadow-ember/30 transition hover:scale-105 hover:bg-ember-dim md:bottom-8 md:right-8 md:h-16 md:w-16"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Janela do chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-40 flex h-[32rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink-200/60 bg-ink-100/95 shadow-2xl shadow-black/40 backdrop-blur-md md:bottom-28 md:right-8"
            role="dialog"
            aria-labelledby="chatbot-title"
          >
            {/* Cabeçalho */}
            <div className="flex items-start justify-between border-b border-ink-200/60 px-5 py-4">
              <div>
                <p id="chatbot-title" className="font-serif text-lg text-cream">
                  {t('chatbot.title')}
                </p>
                <p className="mt-1 text-xs text-cream-dim">{t('chatbot.subtitle')}</p>
              </div>
              <div className="flex h-2 w-2 translate-y-2 rounded-full bg-ember" aria-hidden />
            </div>

            {/* Mensagens */}
            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-line break-words rounded-2xl px-4 py-2.5 leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-ember/90 text-cream'
                        : 'bg-ink-200/70 text-cream'
                    }`}
                  >
                    {m.role === 'assistant' ? renderMessageContent(m.content) : m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-ink-200/70 px-4 py-2.5 text-cream-muted">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cream-muted [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cream-muted [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cream-muted" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-ink-200/60 px-3 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatbot.placeholder')}
                disabled={loading}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream-dim focus:outline-none disabled:opacity-50"
                aria-label={t('chatbot.placeholder')}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t('chatbot.send')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-cream transition hover:bg-ember-dim disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

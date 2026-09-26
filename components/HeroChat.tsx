'use client';

import { FormEvent, useRef, useState } from 'react';
import { sendChat, type ChatMessage } from '@/lib/sendChat';
import FaceMark from '@/components/FaceMark';

const CHIPS = [
  'Where are you located?',
  'What is your availability?',
  'How does the chatbot work?',
  'Who is Sani?',
] as const;

/** Canned replies — Pedro owns the copy. */
const MOCK_REPLIES: Record<(typeof CHIPS)[number], string> = {
  'Where are you located?':
    "Pedro is based in Rio de Janeiro, Brazil, and he's open to remote work and relocation.",
  'What is your availability?':
    "He's open to full-time roles, collaborations, and contract work, and happy to find a timeline that works for both sides.",
  'How does the chatbot work?':
    "I started as an IBM Watson bot in a corner bubble. When IBM discontinued that version, Pedro rebuilt me here in the hero. Now I run on Groq as the main brain, with OpenRouter as a backup, and a pre-written fallback if both fail.",
  'Who is Sani?':
    "Sani is Pedro, the name he's gone by online since he first really started using the internet. It's short for Sanitaurus, and it's the name behind all of his art over the years. Since most of his work and life happen online, Sani sometimes feels more like him than Pedro does. Fun coincidence: it echoes names like the Hindu deity Shani Dev, but there's no specific origin. He picked it because it's easy for English speakers to say.",
};

const GENERIC_MOCK =
  "Thanks for asking! If you're seeing this it means something API related failed. Try a chip below, or check back soon while I untangle these wires.";

function mockFor(question: string): string | undefined {
  return MOCK_REPLIES[question as (typeof CHIPS)[number]];
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Classic Mac-ish field: sharp corners, thin border, hard bevel, face mark.
 * Empty state shows a blinking block caret so it reads as a place to type
 * (replaces the generic sparkle “AI” cue).
 */
export default function HeroChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = messages.length > 0 || loading;
  const showCaret = !input && !loading && !focused;

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const canned = mockFor(trimmed);
      if (canned) {
        await wait(380);
        setMessages((m) => [...m, { role: 'assistant', content: canned }]);
        return;
      }

      try {
        const data = await sendChat({
          messages: next,
          locale: 'en',
          sessionId,
        });
        if (data.sessionId) setSessionId(data.sessionId);
        setMessages((m) => [...m, { role: 'assistant', content: data.text }]);
      } catch {
        await wait(280);
        setMessages((m) => [...m, { role: 'assistant', content: GENERIC_MOCK }]);
      }
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      });
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={onSubmit} className="relative">
        <label htmlFor="hero-chat-input" className="sr-only">
          Ask Ori anything
        </label>
        <div
          className={
            'hero-mac-field flex items-stretch bg-white transition-shadow ' +
            (focused ? 'hero-mac-field--focus' : '')
          }
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => inputRef.current?.focus()}
            className="flex shrink-0 items-center border-r border-black/20 px-3"
          >
            <FaceMark className="h-5 w-5 object-contain" />
          </button>

          <div className="relative min-w-0 flex-1">
            {showCaret && (
              <span
                className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 font-display text-body text-black/65"
                aria-hidden
              >
                <span className="hero-mac-caret" />
                <span className={focused ? 'opacity-0' : ''}>In a rush? Ask Ori Anything</span>
              </span>
            )}
            <input
              ref={inputRef}
              id="hero-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder=""
              disabled={loading}
              autoComplete="off"
              className="h-12 w-full bg-transparent px-3 pr-2 font-display text-body font-normal text-black outline-none focus:outline-none focus-visible:outline-none disabled:opacity-60 md:h-14"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send question"
            className="m-1.5 flex h-9 w-9 shrink-0 items-center justify-center border border-black/25 bg-black text-white transition hover:bg-[#B76203] disabled:border-black/10 disabled:bg-black/15 disabled:text-black/35 md:h-10 md:w-10"
          >
            <ArrowIcon />
          </button>
        </div>
      </form>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => void ask(chip)}
            disabled={loading}
            className="hero-mac-chip min-h-10 px-3 py-2 text-left font-display text-nav font-normal text-black/80 transition hover:border-black hover:text-black disabled:opacity-50 sm:text-center"
          >
            {chip}
          </button>
        ))}
      </div>

      {open && (
        <div
          ref={listRef}
          className="hero-mac-panel mt-5 max-h-72 overflow-y-auto bg-white px-4 py-4 text-left"
          role="log"
          aria-live="polite"
          aria-label="Chat answers"
        >
          {messages.map((m, i) => (
            <div
              key={m.role + '-' + i}
              className={'mb-3 last:mb-0 ' + (m.role === 'user' ? 'text-black' : 'text-black/75')}
            >
              <p className="mb-1 text-xs uppercase tracking-[0.18em] text-black/60">
                {m.role === 'user' ? 'You' : 'Ori'}
              </p>
              <p className="whitespace-pre-wrap font-body text-body font-normal">{m.content}</p>
            </div>
          ))}
          {loading && (
            <p className="flex items-center gap-1 font-body text-body text-black/60" aria-label="Thinking">
              <span className="hero-mac-dot" />
              <span className="hero-mac-dot hero-mac-dot--2" />
              <span className="hero-mac-dot hero-mac-dot--3" />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h12M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

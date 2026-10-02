'use client';

import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { sendChat, type ChatMessage } from '@/lib/sendChat';

const CHIPS = [
  'Where are you located?',
  'What is your availability?',
  'How does the chatbot work?',
  'Who is Sani?',
] as const;

/** Tab-session key: survives client navigations; clears on tab close. */
const SESSION_STORAGE_KEY = 'ori-chat-messages';

type StoredChat = {
  messages: ChatMessage[];
  sessionId?: string;
};

function readStoredChat(): StoredChat | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredChat;
    if (!parsed || !Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredChat(messages: ChatMessage[], sessionId?: string) {
  try {
    const payload: StoredChat = { messages, sessionId };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota / private mode - chat still works in memory
  }
}

function clearStoredChat() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Canned replies — Pedro owns the copy. */
const MOCK_REPLIES: Record<(typeof CHIPS)[number], string> = {
  'Where are you located?':
    "Pedro is based in Rio de Janeiro, Brazil, and he's open to remote work and relocation.",
  'What is your availability?':
    "He's open to full-time roles, collaborations, and contract work, and happy to find a timeline that works for both sides.",
  'How does the chatbot work?':
    "I started as an IBM Watson bot in a corner bubble. Now I live in the sidebar - open me from the Ori face opposite the logo; I peek like a bookmark when the panel is open. I run on Groq as the main brain, with OpenRouter as a backup, and a pre-written fallback if both fail.",
  'Who is Sani?':
    "Sani is Pedro, the name he's gone by online since he first really started using the internet. It's short for Sanitaurus, and it's the name behind all of his art over the years. Since most of his work and life happen online, Sani sometimes feels more like him than Pedro does. Fun coincidence: it echoes names like the Hindu deity Shani Dev, but there's no specific origin. He picked it because it's easy for English speakers to say.",
};

const GENERIC_MOCK =
  "Thanks for asking! If you're seeing this it means something API related failed. Try a suggestion below, or check back soon while I untangle these wires.";

function mockFor(question: string): string | undefined {
  return MOCK_REPLIES[question as (typeof CHIPS)[number]];
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  const sel =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
  );
}

/**
 * Site-wide Ori corner chat — Rachel Chen style slide-in from the right.
 * Opens from the header Ori icon (no bottom-right FAB).
 */
export default function OriCornerChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [resetAnimating, setResetAnimating] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Restore tab-session conversation after mount (avoid SSR mismatch)
  useEffect(() => {
    const stored = readStoredChat();
    if (stored?.messages.length) {
      setMessages(stored.messages);
      if (stored.sessionId) setSessionId(stored.sessionId);
    }
    setHydrated(true);
  }, []);

  // Persist whenever messages / analytics session change
  useEffect(() => {
    if (!hydrated) return;
    if (messages.length === 0 && !sessionId) {
      clearStoredChat();
      return;
    }
    writeStoredChat(messages, sessionId);
  }, [messages, sessionId, hydrated]);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setSessionId(undefined);
    setInput('');
    clearStoredChat();
    // Toggle off first so every click restarts the reset icon animation.
    setResetAnimating(false);
    requestAnimationFrame(() => {
      setResetAnimating(true);
      inputRef.current?.focus();
    });
  }, []);

  // Header (and anything else) can open/close via custom events
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener('ori-open', onOpen);
    window.addEventListener('ori-close', onClose);
    window.addEventListener('ori-toggle', onToggle);
    return () => {
      window.removeEventListener('ori-open', onOpen);
      window.removeEventListener('ori-close', onClose);
      window.removeEventListener('ori-toggle', onToggle);
    };
  }, []);

  // Body reflow + Escape + focus management + header lit sync
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.classList.add('ori-chat-open');
      // --ori-panel-width lives in globals.css (tied to trigger inset); do not override
      window.dispatchEvent(new CustomEvent('ori-state', { detail: { open: true } }));
      // Autofocus only for mouse/trackpad users; touch keyboards can resize the viewport.
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const t = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => window.clearTimeout(t);
    }
    root.classList.remove('ori-chat-open');
    window.dispatchEvent(new CustomEvent('ori-state', { detail: { open: false } }));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = getFocusable(panelRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Restore focus to header Ori trigger when closing
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) {
      document
        .querySelector<HTMLElement>('[data-ori-trigger]')
        ?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('ori-chat-open');
    };
  }, []);

  // React 18: set inert via DOM (not typed on JSX yet)
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (open) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [open]);

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
    <>
      {/* Mobile-only scrim — click outside to close */}
      <div
        className={'ori-scrim' + (open ? ' ori-scrim--open' : '')}
        aria-hidden={!open}
        onClick={close}
      />

      <div
        ref={panelRef}
        id="ori-corner-panel"
        className={'ori-panel' + (open ? ' ori-panel--open' : '')}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-labelledby={titleId}
      >
        <div className="ori-panel__header">
          <h2 id={titleId} className="font-display text-title font-bold text-black">
            Ori
          </h2>
          <div className="ori-panel__header-actions">
            <button
              type="button"
              data-ori-reset
              onClick={resetConversation}
              aria-label="Reset conversation"
              title="Reset conversation"
              className="ori-panel__reset"
            >
              <ResetIcon
                className={
                  'ori-panel__reset-icon' +
                  (resetAnimating ? ' ori-panel__reset-icon--spinning' : '')
                }
              />
            </button>
            <button
              type="button"
              data-ori-close
              onClick={close}
              aria-label="Close Ori chat"
              className="ori-panel__close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div
          ref={listRef}
          className="ori-panel__messages"
          role="log"
          aria-live="polite"
          aria-label="Chat answers"
        >
          {messages.length === 0 && !loading && (
            <p className="font-body text-body text-black/60">
              In a rush? Ask Ori anything.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={m.role + '-' + i}
              className={'mb-3 last:mb-0 ' + (m.role === 'user' ? 'text-black' : 'text-black/75')}
            >
              <p className="mb-1 text-xs uppercase tracking-[0.18em] text-black/60">
                {m.role === 'user' ? 'You' : 'Ori'}
              </p>
              <p className="whitespace-pre-wrap font-body text-body font-normal [overflow-wrap:anywhere]">
                {m.role === 'assistant' ? linkify(m.content) : m.content}
              </p>
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

        <div className="ori-panel__suggestions">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => void ask(chip)}
              disabled={loading}
              className="ori-panel__suggestion"
            >
              <span className="ori-panel__suggestion-dot" aria-hidden />
              <span>{chip}</span>
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="ori-panel__input">
          <label htmlFor="ori-corner-input" className="sr-only">
            Ask Ori anything
          </label>
          <div
            className={
              'hero-mac-field flex items-center bg-white transition-shadow ' +
              (focused ? 'hero-mac-field--focus' : '')
            }
          >
            <div className="relative min-w-0 flex-1">
              <input
                ref={inputRef}
                id="ori-corner-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Ask Ori"
                disabled={loading}
                autoComplete="off"
                className="h-10 w-full bg-transparent px-3 pr-2 font-display text-body font-normal text-black outline-none placeholder:text-black/50 focus:outline-none focus-visible:outline-none disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send question"
              className="m-1 flex h-8 w-8 shrink-0 items-center justify-center border border-black/25 bg-black text-white transition hover:bg-[#B76203] disabled:border-black/10 disabled:bg-black/15 disabled:text-black/35"
            >
              <ArrowIcon />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/**
 * Turns links in Ori's replies into real, tappable links.
 * Handles markdown links [label](url), bare https:// or www. URLs, and emails.
 * Trailing punctuation (like the period ending a sentence) stays outside the link.
 */
const LINK_PATTERN =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|((?:https?:\/\/|www\.)[^\s<]+)|([\w.+-]+@[\w-]+\.[\w.-]+)/g;

function linkify(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    const [whole, mdLabel, mdUrl, bareUrl, email] = match;
    let label = whole;
    let href = '';
    let trailing = '';

    if (mdUrl) {
      label = mdLabel;
      href = mdUrl;
    } else if (bareUrl) {
      const cleaned = bareUrl.replace(/[.,;:!?)\]'"]+$/, '');
      trailing = bareUrl.slice(cleaned.length);
      label = cleaned;
      href = cleaned.startsWith('www.') ? 'https://' + cleaned : cleaned;
    } else if (email) {
      const cleaned = email.replace(/[.]+$/, '');
      trailing = email.slice(cleaned.length);
      label = cleaned;
      href = 'mailto:' + cleaned;
    }

    if (match.index > last) out.push(text.slice(last, match.index));
    const external = !href.startsWith('mailto:');
    out.push(
      <a
        key={match.index}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-[#B76203] underline underline-offset-2 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B76203]"
      >
        {label}
      </a>,
    );
    if (trailing) out.push(trailing);
    last = match.index + whole.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 12a8 8 0 0 1 13.66-5.66M20 4v5h-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M20 12a8 8 0 0 1-13.66 5.66M4 20v-5h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

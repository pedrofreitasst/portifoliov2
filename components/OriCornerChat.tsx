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

/**
 * Swipe gestures (touch only — mouse/trackpad never fire touch events). Tuned for a ~380px / 90vw panel.
 * - Swipe RIGHT on the open panel closes it.
 * - Swipe LEFT anywhere on the page (outside the edge dead zones) while closed drags it open.
 * Shared rules:
 * - LOCK_PX: movement before we decide horizontal vs vertical (vertical => ignore whole touch).
 * - COMMIT_RATIO: drag past this fraction of panel width commits on release.
 * - FLICK_VELOCITY: px/ms in the gesture direction over the last VELOCITY_WINDOW_MS also commits.
 * - SETTLE_FALLBACK_MS: safety net if transitionend never fires (> 280ms CSS transition).
 * Open-only rules:
 * - EDGE: touches starting within max(24px, 6% of viewport width) of either screen edge are left
 *   to the OS/browser back/forward gestures.
 * - PINCH_ZOOM_SCALE: page pinch-zoomed past this => leave horizontal panning to the browser.
 */
const SWIPE_LOCK_PX = 10;
const SWIPE_COMMIT_RATIO = 0.3;
const SWIPE_FLICK_VELOCITY = 0.5;
const SWIPE_VELOCITY_WINDOW_MS = 100;
const SWIPE_SETTLE_FALLBACK_MS = 400;
const SWIPE_EDGE_MIN_PX = 24;
const SWIPE_EDGE_RATIO = 0.06;
const SWIPE_PINCH_ZOOM_SCALE = 1.01;
/** Gestures starting on text fields are left alone (caret moves / text selection). */
const SWIPE_IGNORE_SELECTOR =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])';
/** Swipe-to-open also skips dialogs/modals (e.g. the gallery lightbox) and explicit opt-outs. */
const SWIPE_OPEN_IGNORE_SELECTOR = `${SWIPE_IGNORE_SELECTOR}, [data-no-swipe-open], [role="dialog"], [aria-modal="true"], dialog`;

/** +1 = rightward (close gesture), -1 = leftward (open gesture). */
type SwipeDir = 1 | -1;
type SwipeSample = { x: number; t: number };
type SwipeState = {
  mode: 'pending' | 'drag' | 'ignore';
  startX: number;
  startY: number;
  /** clientX at the moment the horizontal lock engaged; offset is measured from here (no jump). */
  lockX: number;
  width: number;
  /** Distance travelled in the gesture direction, clamped to [0, width]. */
  offset: number;
  samples: SwipeSample[];
};

function startSwipe(t: Touch): SwipeState {
  return {
    mode: 'pending',
    startX: t.clientX,
    startY: t.clientY,
    lockX: 0,
    width: 0,
    offset: 0,
    samples: [],
  };
}

/**
 * Feed one touchmove into a swipe. While undecided, applies the direction lock: only a clearly
 * horizontal move in `dir` becomes a drag; anything else (vertical, wrong way, or the browser
 * already scrolling so the event can't be cancelled) ignores the rest of the touch.
 * Returns the current drag offset once dragging, otherwise null.
 */
function moveSwipe(
  s: SwipeState,
  t: Touch,
  dir: SwipeDir,
  cancelable: boolean,
  measureWidth: () => number,
): number | null {
  if (s.mode === 'ignore') return null;
  if (s.mode === 'pending') {
    const dx = t.clientX - s.startX;
    const dy = t.clientY - s.startY;
    if (Math.abs(dx) < SWIPE_LOCK_PX && Math.abs(dy) < SWIPE_LOCK_PX) return null;
    if (dx * dir > 0 && Math.abs(dx) > Math.abs(dy) && cancelable) {
      s.mode = 'drag';
      s.lockX = t.clientX;
      s.width = measureWidth() || 1;
    } else {
      s.mode = 'ignore';
      return null;
    }
  }
  const now = performance.now();
  s.offset = Math.min(s.width, Math.max(0, (t.clientX - s.lockX) * dir));
  s.samples.push({ x: t.clientX, t: now });
  while (s.samples.length > 2 && now - s.samples[0].t > SWIPE_VELOCITY_WINDOW_MS) {
    s.samples.shift();
  }
  return s.offset;
}

function swipeVelocity(samples: SwipeSample[], now: number): number {
  const recent = samples.filter((p) => now - p.t <= SWIPE_VELOCITY_WINDOW_MS);
  if (recent.length < 2) return 0;
  const a = recent[0];
  const b = recent[recent.length - 1];
  const dt = b.t - a.t;
  return dt > 0 ? (b.x - a.x) / dt : 0;
}

/** On release: far enough (30% of width) or a quick flick in the gesture direction. */
function swipeCommits(s: SwipeState, dir: SwipeDir): boolean {
  const velocity = swipeVelocity(s.samples, performance.now()) * dir;
  return (
    s.offset > s.width * SWIPE_COMMIT_RATIO || (velocity > SWIPE_FLICK_VELOCITY && s.offset > 0)
  );
}

/** Don't fight selection-handle drags after a long-press text selection. */
function hasTextSelection(): boolean {
  const selection = window.getSelection();
  return !!selection && !selection.isCollapsed;
}

/** True if the touch started inside something that scrolls sideways (e.g. gallery strips). */
function inHorizontalScroller(start: Element): boolean {
  for (
    let el: Element | null = start;
    el && el !== document.body && el !== document.documentElement;
    el = el.parentElement
  ) {
    if (el.scrollWidth <= el.clientWidth + 1) continue;
    const overflowX = window.getComputedStyle(el).overflowX;
    if (overflowX === 'auto' || overflowX === 'scroll') return true;
  }
  return false;
}

/** Swipe-to-open guard: everything that should keep its own horizontal touch behaviour. */
function canStartOpenSwipe(e: TouchEvent): boolean {
  if (e.touches.length !== 1) return false;
  const x = e.touches[0].clientX;
  const vw = window.innerWidth;
  const edge = Math.max(SWIPE_EDGE_MIN_PX, vw * SWIPE_EDGE_RATIO);
  if (x < edge || x > vw - edge) return false;
  if ((window.visualViewport?.scale ?? 1) > SWIPE_PINCH_ZOOM_SCALE) return false;
  if (hasTextSelection()) return false;
  // Any open modal anywhere (the Ori panel renders aria-modal="false" while closed).
  if (document.querySelector('[aria-modal="true"], dialog[open]')) return false;
  const target = e.target instanceof Element ? e.target : null;
  if (!target) return false;
  if (target.closest(SWIPE_OPEN_IGNORE_SELECTOR)) return false;
  return !inHorizontalScroller(target);
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
  const scrimRef = useRef<HTMLDivElement>(null);
  /** Close gesture (listeners on the open panel). */
  const swipeRef = useRef<SwipeState | null>(null);
  /** Open gesture (listeners on document while closed). */
  const swipeOpenRef = useRef<SwipeState | null>(null);
  /** A slide-out is animating with inline styles; clear them when it ends. */
  const swipeSettlingRef = useRef(false);
  const swipeSettleTimer = useRef<number | null>(null);
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

  /** Same state path as the header trigger / `ori-open` event. */
  const openPanel = useCallback(() => {
    setOpen(true);
  }, []);

  /** Forget a pending slide-out cleanup without touching styles (a new drag is taking over). */
  const cancelSwipeSettle = useCallback(() => {
    if (swipeSettleTimer.current !== null) {
      window.clearTimeout(swipeSettleTimer.current);
      swipeSettleTimer.current = null;
    }
    swipeSettlingRef.current = false;
  }, []);

  /** Drop every inline style the swipe gestures set, handing control back to globals.css. */
  const resetSwipeStyles = useCallback(() => {
    cancelSwipeSettle();
    const panel = panelRef.current;
    if (panel) {
      panel.style.transition = '';
      panel.style.transform = '';
      panel.style.visibility = '';
    }
    const scrim = scrimRef.current;
    if (scrim) {
      scrim.style.transition = '';
      scrim.style.opacity = '';
    }
  }, [cancelSwipeSettle]);

  /**
   * Slide the panel off to the right from wherever a drag left it, keeping it visible meanwhile
   * (the closed class sets visibility:hidden immediately), then clear the inline styles.
   * Used by swipe-to-close (followed by close()) and by a cancelled swipe-to-open.
   * Under prefers-reduced-motion the CSS transition is none, so this is instant.
   */
  const slideOutPanel = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cancelSwipeSettle();
    swipeSettlingRef.current = true;
    panel.style.transition = '';
    panel.style.visibility = 'visible';
    panel.style.transform = 'translateX(100%)';
    const scrim = scrimRef.current;
    if (scrim) {
      scrim.style.transition = '';
      scrim.style.opacity = '0';
    }
    swipeSettleTimer.current = window.setTimeout(
      resetSwipeStyles,
      reduced ? 0 : SWIPE_SETTLE_FALLBACK_MS,
    );
  }, [cancelSwipeSettle, resetSwipeStyles]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setSessionId(undefined);
    setInput('');
    clearStoredChat();
    // Toggle off first so every click restarts the reset icon animation.
    setResetAnimating(false);
    requestAnimationFrame(() => {
      setResetAnimating(true);
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        inputRef.current?.focus();
      }
    });
  }, []);

  // Header (and anything else) can open/close via custom events
  useEffect(() => {
    const onOpen = () => openPanel();
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
  }, [openPanel]);

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

  useEffect(() => {
    return () => resetSwipeStyles();
  }, [resetSwipeStyles]);

  // Swipe RIGHT to close (touch only — mouse/trackpad never fire touch events).
  // Direction-locked so vertical scrolling in the message list / suggestions is untouched.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    // Opened (by any path, incl. swipe-to-open) or re-opened mid slide-out: start clean.
    // After a swipe-open the inline values equal the --open class values, so no jump.
    resetSwipeStyles();
    const scrim = scrimRef.current;

    const snapBack = () => {
      // Restoring the CSS transition animates from the dragged offset back to translateX(0)
      // (instant under prefers-reduced-motion via the globals.css override).
      panel.style.transition = '';
      panel.style.transform = '';
      if (scrim) {
        scrim.style.transition = '';
        scrim.style.opacity = '';
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        // Second finger (pinch etc.) cancels any drag in progress.
        if (swipeRef.current?.mode === 'drag') snapBack();
        swipeRef.current = null;
        return;
      }
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest(SWIPE_IGNORE_SELECTOR) || hasTextSelection()) {
        swipeRef.current = null;
        return;
      }
      swipeRef.current = startSwipe(e.touches[0]);
    };

    const onTouchMove = (e: TouchEvent) => {
      const s = swipeRef.current;
      const t = e.touches[0];
      if (!s || !t) return;
      const wasPending = s.mode === 'pending';
      const offset = moveSwipe(s, t, 1, e.cancelable, () => panel.offsetWidth);
      if (offset === null) return;
      if (wasPending) {
        panel.style.transition = 'none';
        if (scrim) scrim.style.transition = 'none';
      }
      if (e.cancelable) e.preventDefault();
      // Offset is clamped at 0: can't be dragged left past its open position.
      panel.style.transform = `translateX(${offset}px)`;
      if (scrim) scrim.style.opacity = String(Math.max(0, 1 - offset / s.width));
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length > 0) return; // other fingers still down
      const s = swipeRef.current;
      swipeRef.current = null;
      if (!s || s.mode !== 'drag') return;
      if (swipeCommits(s, 1)) {
        slideOutPanel();
        // Same path as the X button: ori-state event, header lit sync, focus return.
        close();
      } else {
        snapBack();
      }
    };

    const onTouchCancel = () => {
      const s = swipeRef.current;
      swipeRef.current = null;
      if (s?.mode === 'drag') snapBack();
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    // Non-passive so a locked horizontal drag can stop the page/list from scrolling.
    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    panel.addEventListener('touchend', onTouchEnd, { passive: true });
    panel.addEventListener('touchcancel', onTouchCancel, { passive: true });
    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', onTouchEnd);
      panel.removeEventListener('touchcancel', onTouchCancel);
      // Closed some other way mid-drag (Escape, ori-toggle): drop the inline drag styles.
      if (swipeRef.current?.mode === 'drag') resetSwipeStyles();
      swipeRef.current = null;
    };
  }, [open, close, resetSwipeStyles, slideOutPanel]);

  // Swipe LEFT to open (touch only), mirroring swipe-to-close. Listens on document while closed.
  // Edge dead zones, modals, text fields, horizontal scrollers, selections, multi-touch and
  // pinch-zoom are all left alone (see canStartOpenSwipe). No swipe-to-open from the screen edge.
  useEffect(() => {
    if (open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const scrim = scrimRef.current;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        // Second finger cancels a drag in progress.
        if (swipeOpenRef.current?.mode === 'drag') slideOutPanel();
        swipeOpenRef.current = null;
        return;
      }
      swipeOpenRef.current = canStartOpenSwipe(e) ? startSwipe(e.touches[0]) : null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const s = swipeOpenRef.current;
      const t = e.touches[0];
      if (!s || !t) return;
      const wasPending = s.mode === 'pending';
      const offset = moveSwipe(s, t, -1, e.cancelable, () => panel.offsetWidth);
      if (offset === null) return;
      if (wasPending) {
        // Engage: show the logically-closed panel (inline styles, like the slide-out) so it
        // can follow the finger in from the right. Stop any slide-out cleanup still pending.
        cancelSwipeSettle();
        panel.style.transition = 'none';
        panel.style.visibility = 'visible';
        if (scrim) scrim.style.transition = 'none';
      }
      if (e.cancelable) e.preventDefault();
      // translateX goes from the panel width (fully off) toward 0 (fully open).
      panel.style.transform = `translateX(${s.width - offset}px)`;
      if (scrim) scrim.style.opacity = String(Math.min(1, offset / s.width));
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length > 0) return;
      const s = swipeOpenRef.current;
      swipeOpenRef.current = null;
      if (!s || s.mode !== 'drag') return;
      if (swipeCommits(s, -1)) {
        // Finish the slide in (instant under reduced motion), then open through the normal
        // state path: ori-state event, lit header icon, aria-expanded, no touch autofocus.
        // The open effect clears these inline styles; they equal the --open class values.
        panel.style.transition = '';
        panel.style.transform = 'translateX(0)';
        if (scrim) {
          scrim.style.transition = '';
          scrim.style.opacity = '1';
        }
        openPanel();
      } else {
        slideOutPanel();
      }
    };

    const onTouchCancel = () => {
      const s = swipeOpenRef.current;
      swipeOpenRef.current = null;
      if (s?.mode === 'drag') slideOutPanel();
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    // Non-passive only so a locked horizontal drag can stop vertical page scroll; returns
    // immediately for touches that never qualified.
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchCancel, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchCancel);
      // Opened another way (header) or unmounted mid-drag: drop the inline drag styles.
      if (swipeOpenRef.current?.mode === 'drag') resetSwipeStyles();
      swipeOpenRef.current = null;
    };
  }, [open, openPanel, cancelSwipeSettle, resetSwipeStyles, slideOutPanel]);

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
        ref={scrimRef}
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
        onTransitionEnd={(e) => {
          // Swipe slide-out finished: hand styling back to globals.css.
          if (
            swipeSettlingRef.current &&
            e.target === e.currentTarget &&
            e.propertyName === 'transform'
          ) {
            resetSwipeStyles();
          }
        }}
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
        className="hover-lit text-[#B76203] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B76203]"
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

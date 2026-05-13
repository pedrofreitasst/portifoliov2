'use client';

import { useEffect, useRef, useState } from 'react';
import { LOCALES, useT, type Locale } from '@/lib/i18n';

export default function LanguageSelector() {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Selecionar idioma"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-ink-200/60 bg-ink-100/40 px-3 py-1.5 text-xs uppercase tracking-wider text-cream-muted backdrop-blur transition hover:border-ember/60 hover:text-cream"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{current.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 min-w-[120px] overflow-hidden rounded-xl border border-ink-200/60 bg-ink-100/95 py-1 shadow-2xl backdrop-blur-md"
        >
          {LOCALES.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={l.code === locale}
                onClick={() => handleSelect(l.code)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-xs uppercase tracking-wider transition ${
                  l.code === locale
                    ? 'bg-ink-200/60 text-ember'
                    : 'text-cream-muted hover:bg-ink-200/40 hover:text-cream'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useT } from '@/lib/i18n';

const CONTACT = {
  email: 'pedrofreitasst@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pedro-de-freitas-a776711a1',
  github: 'https://github.com/pedrofreitasst',
  behance: 'https://www.behance.net/pedrohfreitas',
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

function ArrowIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export default function Contact() {
  const { t } = useT();
  const [copied, setCopied] = useState(false);
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);

  const copyToClipboard = (text: string) => {
    // Limpa timeout anterior se existir
    if (copiedTimeout) {
      clearTimeout(copiedTimeout);
      setCopiedTimeout(null);
    }

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          const timeout = setTimeout(() => setCopied(false), 2000);
          setCopiedTimeout(timeout);
        })
        .catch((err) => {
          console.error('Falha ao copiar:', err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      const timeout = setTimeout(() => setCopied(false), 2000);
      setCopiedTimeout(timeout);
    } catch (err) {
      console.error('Fallback de cópia falhou:', err);
      // Fallback final: seleciona o texto para o usuário copiar manualmente
      const emailElement = document.getElementById('email-text');
      if (emailElement) {
        const range = document.createRange();
        range.selectNodeContents(emailElement);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne comportamento padrão do link
    copyToClipboard(CONTACT.email);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyToClipboard(CONTACT.email);
    }
  };

  const links = [
    {
      label: t('contact.email_label'),
      value: CONTACT.email,
      href: '#', // Muda de mailto: para #, usamos onClick
      isEmail: true,
    },
    {
      label: t('contact.linkedin_label'),
      value: 'linkedin.com/in/pedro-de-freitas',
      href: CONTACT.linkedin,
      isEmail: false,
    },
    {
      label: t('contact.github_label'),
      value: 'github.com/pedrofreitasst',
      href: CONTACT.github,
      isEmail: false,
    },
    {
      label: t('contact.behance_label'),
      value: 'behance.net/pedrohfreitas',
      href: CONTACT.behance,
      isEmail: false,
    },
  ];

  return (
    <section
      id="contact"
      className="relative w-full border-t border-ink-200/40 bg-ink py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.span
          {...fadeUp}
          className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-cream-dim"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
          {t('contact.eyebrow')}
        </motion.span>
        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="font-serif text-display-sm text-cream"
        >
          {t('contact.title')}
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-cream-muted md:text-lg"
        >
          {t('contact.subtitle')}
        </motion.p>

        <motion.ul
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
          className="mt-16 divide-y divide-ink-200/60 border-y border-ink-200/60"
        >
          {links.map((l, i) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={l.isEmail ? handleEmailClick : undefined}
                onKeyDown={l.isEmail ? handleEmailKeyDown : undefined}
                role={l.isEmail ? 'button' : undefined}
                tabIndex={l.isEmail ? 0 : undefined}
                className="group flex items-center justify-between gap-6 py-6 transition hover:pl-4 md:py-10"
                aria-label={l.isEmail ? `Copiar ${l.label}` : l.label}
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-cream-dim md:text-xs">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-cream-dim">
                      {l.label}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <p
                        id={l.isEmail ? 'email-text' : undefined}
                        className="font-serif text-2xl text-cream transition group-hover:text-ember md:text-4xl"
                      >
                        {l.value}
                      </p>
                      {l.isEmail && (
                        <span className="flex items-center gap-1 text-cream-muted transition group-hover:text-ember">
                          {copied ? (
                            <span className="flex items-center gap-1 text-green-400">
                              <CheckIcon />
                              <span className="text-xs font-mono uppercase tracking-wider">
                                Copiado
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-cream-dim/60">
                              <CopyIcon />
                              <span className="text-xs font-mono uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100">
                                Copiar
                              </span>
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-cream-muted transition group-hover:text-ember">
                  <ArrowIcon />
                </span>
              </a>
            </li>
          ))}
        </motion.ul>

        <p className="mt-16 text-xs uppercase tracking-[0.3em] text-cream-dim">
          © {new Date().getFullYear()} — {t('footer.rights')}
        </p>
      </div>
    </section>
  );
}
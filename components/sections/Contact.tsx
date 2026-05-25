'use client';

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

export default function Contact() {
  const { t } = useT();

  const links = [
    {
      label: t('contact.email_label'),
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    {
      label: t('contact.linkedin_label'),
      value: 'linkedin.com/in/pedro-de-freitas',
      href: CONTACT.linkedin,
    },
    {
      label: t('contact.github_label'),
      value: 'github.com/pedrofreitasst',
      href: CONTACT.github,
    },
    {
      label: t('contact.behance_label'),
      value: 'behance.net/pedrohfreitas',
      href: CONTACT.behance,
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
                className="group flex items-center justify-between gap-6 py-6 transition hover:pl-4 md:py-10"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-cream-dim md:text-xs">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-cream-dim">
                      {l.label}
                    </p>
                    <p className="mt-1 font-serif text-2xl text-cream transition group-hover:text-ember md:text-4xl">
                      {l.value}
                    </p>
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

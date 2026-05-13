'use client';

import { motion } from 'framer-motion';
import { useT } from '@/lib/i18n';

export default function Hero() {
  const { t } = useT();

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen w-full items-center overflow-hidden"
    >
      {/*Imagem de fundo*/}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1777603597147-ce81403f97f6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      <div aria-hidden className="hero-overlay absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-6 pt-32 lg:px-12 lg:pt-40">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-cream-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
            {t('hero.eyebrow')}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
            className="font-serif text-display text-cream"
          >
            <span className="block font-medium">{t('hero.headline_part1')}</span>
            <span className="block italic">{t('hero.headline_part2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
            className="mt-8 max-w-xl text-base leading-relaxed text-cream-muted md:text-lg"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              onClick={scrollTo('contact')}
              className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium text-ink transition hover:bg-ember hover:text-cream"
            >
              {t('hero.cta_primary')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a
              href="#projects"
              onClick={scrollTo('projects')}
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-sm text-cream transition hover:border-cream hover:bg-cream/5"
            >
              {t('hero.cta_secondary')}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-3 text-cream-dim">
          <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <div className="h-10 w-px animate-pulse bg-cream-dim" />
        </div>
      </motion.div>
    </section>
  );
}

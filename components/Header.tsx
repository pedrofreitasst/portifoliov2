'use client';

import { useEffect, useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { useT } from '@/lib/i18n';

export default function Header() {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'border-b border-ink-200/40 bg-ink/70 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        {/* Logo */}
        <a
          href="#hero"
          onClick={scrollTo('hero')}
          className="font-serif text-xl tracking-tight text-cream transition hover:text-ember"
        >
          <span className="italic">Pedro de</span>{' '}
          <span className="font-medium">Freitas</span>
        </a>

        {/* Nav central — desktop */}
        <nav aria-label="Navegação principal" className="hidden items-center gap-10 md:flex">
          <a
            href="#about"
            onClick={scrollTo('about')}
            className="text-sm tracking-wide text-cream-muted transition hover:text-cream"
          >
            {t('nav.about')}
          </a>
          <a
            href="#projects"
            onClick={scrollTo('projects')}
            className="text-sm tracking-wide text-cream-muted transition hover:text-cream"
          >
            {t('nav.projects')}
          </a>
          <a
            href="#contact"
            onClick={scrollTo('contact')}
            className="text-sm tracking-wide text-cream-muted transition hover:text-cream"
          >
            {t('nav.contact')}
          </a>
        </nav>

        {/* Lado direito */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <a
            href="https://wa.me/5521981915373?text=Olá! Vi seu portfólio e gostaria de conversar."
            
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-cream px-5 py-2 text-sm font-medium text-ink transition hover:bg-ember hover:text-cream sm:inline-flex"
          >
            {t('nav.cta')}
          </a>
        </div>
      </div>
    </header>
  );
}

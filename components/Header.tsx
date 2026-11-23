'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CASE_CHAPTERS, useI18n } from '@/lib/i18n';
import FaceMark from './FaceMark';

const languages = ['pt', 'en', 'es', 'zh'] as const;

type NavSwipe = { startX: number; startY: number; lastX: number; lastY: number; startedAt: number; lastAt: number; offset: number; dragging: boolean; opening: boolean };

export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [oriOpen, setOriOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState('');
  const navSwipeRef = useRef<NavSwipe | null>(null);
  const caseSlug = pathname.startsWith('/case/') ? pathname.split('/')[2] : '';
  const chapters = useMemo(() => CASE_CHAPTERS[caseSlug as keyof typeof CASE_CHAPTERS] ?? [], [caseSlug]);
  const isCase = Boolean(caseSlug);

  useEffect(() => {
    const onOriState = (event: Event) => setOriOpen(Boolean((event as CustomEvent<{ open: boolean }>).detail?.open));
    window.addEventListener('ori-state', onOriState);
    return () => window.removeEventListener('ori-state', onOriState);
  }, []);

  useEffect(() => {
    setOpen(window.matchMedia('(min-width: 1024px)').matches);
  }, []);

  useEffect(() => {
    if (!chapters.length) return;
    const sections = chapters.map(([id]) => document.getElementById(id)).filter((item): item is HTMLElement => Boolean(item));
    if (!sections.length) return;
    const update = () => {
      const marker = window.innerHeight * 0.35;
      const active = sections.filter((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= marker && rect.bottom > marker;
      }).at(-1);
      setActiveChapter(active?.id ?? sections[0].id);
    };
    const observer = new IntersectionObserver(update, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 1] });
    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, [chapters]);

  useEffect(() => {
    document.documentElement.classList.toggle('portfolio-nav-open', open);
    return () => document.documentElement.classList.remove('portfolio-nav-open');
  }, [open]);

  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    const drawer = document.getElementById('site-navigation');
    const scrim = document.querySelector<HTMLElement>('.nav-scrim');
    if (!drawer || !scrim) return;

    const resetStyles = () => {
      drawer.style.transition = '';
      drawer.style.transform = '';
      drawer.style.visibility = '';
      scrim.style.transition = '';
      scrim.style.opacity = '';
      scrim.style.pointerEvents = '';
    };
    const settle = (show: boolean, updateState: boolean) => {
      drawer.style.visibility = 'visible';
      drawer.style.transition = 'transform 260ms cubic-bezier(.16, 1, .3, 1)';
      drawer.style.transform = show ? 'translateX(0)' : 'translateX(-102%)';
      scrim.style.transition = 'opacity 180ms ease';
      scrim.style.opacity = show ? '1' : '0';
      scrim.style.pointerEvents = show ? 'auto' : 'none';
      if (updateState) setOpen(show);
      window.setTimeout(resetStyles, 320);
    };
    const onStart = (event: TouchEvent, opening: boolean) => {
      if (event.touches.length !== 1) {
        const active = navSwipeRef.current;
        if (active?.dragging) settle(!active.opening, false);
        navSwipeRef.current = null;
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], [aria-modal="true"]')) return;
      const touch = event.touches[0];
      if (opening && (touch.clientX < 24 || touch.clientX > Math.min(72, window.innerWidth * 0.18))) return;
      navSwipeRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastY: touch.clientY,
        startedAt: performance.now(),
        lastAt: performance.now(),
        offset: 0,
        dragging: false,
        opening,
      };
    };
    const onMove = (event: TouchEvent) => {
      const gesture = navSwipeRef.current;
      const touch = event.touches[0];
      if (!gesture) return;
      if (event.touches.length !== 1) {
        if (gesture.dragging) settle(!gesture.opening, false);
        navSwipeRef.current = null;
        return;
      }
      if (!touch) return;
      const dx = touch.clientX - gesture.startX;
      const dy = touch.clientY - gesture.startY;
      const direction = gesture.opening ? 1 : -1;
      if (!gesture.dragging) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
        if (dx * direction <= 0 || Math.abs(dx) <= Math.abs(dy)) {
          navSwipeRef.current = null;
          return;
        }
        gesture.dragging = true;
        drawer.style.visibility = 'visible';
        drawer.style.transition = 'none';
        scrim.style.transition = 'none';
        scrim.style.pointerEvents = 'auto';
      }
      if (event.cancelable) event.preventDefault();
      const width = drawer.offsetWidth || 290;
      gesture.offset = Math.max(0, Math.min(width, dx * direction));
      gesture.lastX = touch.clientX;
      gesture.lastY = touch.clientY;
      gesture.lastAt = performance.now();
      drawer.style.transform = gesture.opening
        ? `translateX(calc(-102% + ${gesture.offset}px))`
        : `translateX(${-gesture.offset}px)`;
      scrim.style.opacity = String(gesture.opening ? gesture.offset / width : 1 - gesture.offset / width);
    };
    const onEnd = (event: TouchEvent) => {
      if (event.touches.length > 0) return;
      const gesture = navSwipeRef.current;
      navSwipeRef.current = null;
      if (!gesture?.dragging) return;
      const width = drawer.offsetWidth || 290;
      const elapsed = Math.max(1, performance.now() - gesture.startedAt);
      const velocity = (gesture.lastX - gesture.startX) / elapsed * (gesture.opening ? 1 : -1);
      const commit = gesture.offset > width * 0.28 || (gesture.offset > 28 && velocity > 0.5);
      if (commit) {
        settle(gesture.opening, true);
        if (!gesture.opening) window.setTimeout(() => document.getElementById('main')?.focus(), 300);
      } else {
        settle(!gesture.opening, false);
      }
    };
    const onCancel = () => {
      const gesture = navSwipeRef.current;
      navSwipeRef.current = null;
      if (gesture?.dragging) settle(!gesture.opening, false);
    };
    const onDrawerStart = (event: TouchEvent) => onStart(event, false);
    const onDocumentStart = (event: TouchEvent) => onStart(event, true);

    if (open) {
      drawer.addEventListener('touchstart', onDrawerStart, { passive: true });
      drawer.addEventListener('touchmove', onMove, { passive: false });
      drawer.addEventListener('touchend', onEnd, { passive: true });
      drawer.addEventListener('touchcancel', onCancel, { passive: true });
    } else {
      document.addEventListener('touchstart', onDocumentStart, { passive: true });
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd, { passive: true });
      document.addEventListener('touchcancel', onCancel, { passive: true });
    }
    return () => {
      drawer.removeEventListener('touchstart', onDrawerStart);
      document.removeEventListener('touchstart', onDocumentStart);
      drawer.removeEventListener('touchmove', onMove);
      drawer.removeEventListener('touchend', onEnd);
      drawer.removeEventListener('touchcancel', onCancel);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onCancel);
      navSwipeRef.current = null;
    };
  }, [open]);

  const closeAndFocus = () => {
    setOpen(false);
    window.setTimeout(() => document.getElementById('main')?.focus(), 80);
  };
  const openMenu = () => setOpen(true);
  const openOri = () => window.dispatchEvent(new CustomEvent('ori-toggle'));

  const chapterNames = (row: readonly [string, readonly string[]]) => {
    const localeIndex = { en: 0, pt: 1, es: 2, zh: 3 }[locale];
    return row[1][localeIndex];
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header__mobile">
          <button type="button" className="brand-pill__icon" onClick={open ? closeAndFocus : openMenu} aria-label={open ? t('closeMenu') : t('menu')} aria-expanded={open}>
            <MenuIcon />
          </button>
          <Link className="brand-pill__name" href="/">{t('home')}</Link>
        </div>

        <aside id="site-navigation" className={'nav-drawer' + (open ? ' nav-drawer--open' : '')} aria-label={t('menu')}>
          <nav className="nav-drawer__links" aria-label={t('menu')}>
            {isCase ? (
              <>
                <Link href="/#works" className="nav-item nav-item--back">
                  <span aria-hidden="true">←</span>{t('backToWorks')}
                </Link>
                {chapters.map((chapter) => (
                  <a key={chapter[0]} className="nav-item nav-item--chapter" href={`#${chapter[0]}`} aria-current={activeChapter === chapter[0] ? 'location' : undefined}>
                    {chapterNames(chapter)}
                  </a>
                ))}
              </>
            ) : (
              <>
                <Link href="/#works" className="nav-item">{t('work')}</Link>
                <Link href="/playground" className="nav-item">{t('fun')}</Link>
                <Link href="/about" className="nav-item">{t('about')}</Link>
                <a href="https://drive.google.com/drive/folders/1A5duC8TEOw_y8lshPxJMKnpGRfKZoFsi?usp=sharing" target="_blank" rel="noopener noreferrer" className="nav-item">{t('resume')}</a>
              </>
            )}
          </nav>
          <div className="nav-languages" role="group" aria-label={t('language')}>
            {(['pt', 'en', 'es', 'zh'] as const).map((language) => (
              <button
                key={language}
                type="button"
                lang={language === 'zh' ? 'zh-CN' : language}
                aria-pressed={locale === language}
                onClick={() => setLocale(language)}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
        </aside>
        <button type="button" className={'nav-scrim' + (open ? ' nav-scrim--open' : '')} onClick={closeAndFocus} aria-label={t('closeMenu')} tabIndex={open ? 0 : -1} />

        <button
          type="button"
          data-ori-trigger
          className={'ori-header-trigger' + (oriOpen ? ' ori-header-trigger--open' : '')}
          aria-label={oriOpen ? t('closeOri') : t('openOri')}
          aria-expanded={oriOpen}
          aria-controls="ori-corner-panel"
          onClick={openOri}
        >
          <span className="ori-trigger-label">Ori</span>
          <FaceMark src="/ai-stars.svg" className="ori-header-trigger__face h-7 w-7 object-contain" />
        </button>
      </header>
    </>
  );
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
}

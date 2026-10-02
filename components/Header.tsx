'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import FaceMark from './FaceMark';

type NavSection = 'works' | 'about';

export default function Header() {
  const pathname = usePathname();
  const [overDark, setOverDark] = useState(false);
  const [oriOpen, setOriOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavSection | null>(null);

  useEffect(() => {
    // /about is a dark full-page section - pin dark glass while on that route
    if (pathname === '/about') {
      setOverDark(true);
      return;
    }

    const about = document.getElementById('about');
    if (!about) {
      setOverDark(false);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setOverDark(entry.isIntersecting),
      {
        // Header band over About → dark glass (same family as contact bar)
        rootMargin: '-4% 0px -60% 0px',
        threshold: 0,
      },
    );
    io.observe(about);
    return () => io.disconnect();
  }, [pathname]);

  // Scroll-spy active nav (same idea as CaseChapterNav)
  useEffect(() => {
    if (pathname === '/about') {
      setActiveNav('about');
      return;
    }
    if (pathname !== '/') {
      setActiveNav(null);
      return;
    }

    const sections = (['works', 'about'] as const)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) {
      setActiveNav(null);
      return;
    }

    const updateActiveSection = () => {
      const anchor = window.innerHeight * 0.35;
      const current = sections.filter((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= anchor && rect.bottom > anchor;
      });
      if (current.length) {
        setActiveNav(current[current.length - 1].id as NavSection);
        return;
      }
      // Still in hero (above works) → no lit nav item
      if (sections[0].getBoundingClientRect().top > anchor) {
        setActiveNav(null);
        return;
      }
      setActiveNav(sections[sections.length - 1].id as NavSection);
    };

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0, 1],
    });

    sections.forEach((section) => observer.observe(section));
    updateActiveSection();

    return () => observer.disconnect();
  }, [pathname]);

  // Native #contact hash (refresh / other-page link) also pins footer to bottom
  useEffect(() => {
    if (pathname !== '/' && pathname !== '/about') return;
    if (window.location.hash !== '#contact') return;
    const id = window.requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ block: 'end' });
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  // Sync lit state with Ori panel open/close
  useEffect(() => {
    const onState = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      setOriOpen(!!detail?.open);
    };
    window.addEventListener('ori-state', onState);
    // Hydrate from class if panel already open
    setOriOpen(document.documentElement.classList.contains('ori-chat-open'));
    return () => window.removeEventListener('ori-state', onState);
  }, []);

  const goSection = (id: NavSection) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `/#${id}`);
      setActiveNav(id);
    }
  };

  const openOri = () => {
    window.dispatchEvent(new CustomEvent('ori-toggle'));
  };

  const linkTone = overDark ? 'text-white' : 'text-black';

  const navLinkClass = (section: NavSection | null) => {
    const isActive = section !== null && activeNav === section;
    return (
      'bg-transparent transition-colors duration-200 hover:text-[#FF8700] focus-visible:text-[#FF8700] ' +
      (isActive ? 'text-[#FF8700]' : '')
    );
  };

  return (
    <header
      className={
        'site-header fixed inset-x-0 top-0 z-[51] border-b backdrop-blur-[6px] backdrop-saturate-125 transition-[background-color,border-color,color] duration-300 ease-out ' +
        (overDark
          ? // Same glass language as the About contact bar
            'border-white/10 bg-black/20 supports-[backdrop-filter]:bg-black/15'
          : // Thin clear frost - avoid milky white/40 slab
            'border-black/5 bg-white/20 supports-[backdrop-filter]:bg-white/12')
      }
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 lg:px-12">
        <Logo className="[&_img]:h-8 [&_img]:w-8" />
        <nav
          aria-label="Primary"
          className={
            'absolute left-1/2 flex -translate-x-1/2 items-center gap-5 font-display text-nav font-medium uppercase tracking-[0.12em] transition-colors duration-300 sm:gap-7 ' +
            linkTone
          }
        >
          <a
            href="/#works"
            onClick={goSection('works')}
            aria-current={activeNav === 'works' ? 'location' : undefined}
            className={navLinkClass('works')}
          >
            Works
          </a>
          <a
            href="/#about"
            onClick={goSection('about')}
            aria-current={activeNav === 'about' ? 'location' : undefined}
            className={navLinkClass('about')}
          >
            Info
          </a>
          <a href="/resume.pdf" className={navLinkClass(null)}>
            Resume
          </a>
        </nav>
        {/* Spacer keeps logo/nav balance; real trigger is fixed so it never reflows with Ori panel */}
        <span className="ori-header-trigger-slot" aria-hidden />
        <button
          type="button"
          data-ori-trigger
          className={
            'ori-header-trigger' + (oriOpen ? ' ori-header-trigger--open' : '')
          }
          aria-label={oriOpen ? 'Close Ori chat' : 'Open Ori chat'}
          aria-expanded={oriOpen}
          aria-controls="ori-corner-panel"
          onClick={openOri}
        >
          <FaceMark className="ori-header-trigger__face h-8 w-8 object-contain" />
        </button>
      </div>
    </header>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Header() {
  const pathname = usePathname();
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
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

  // Native #contact hash (refresh / other-page link) also pins footer to bottom
  useEffect(() => {
    if (pathname !== '/') return;
    if (window.location.hash !== '#contact') return;
    const id = window.requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ block: 'end' });
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      // #contact is the fused footer inside About — align to viewport bottom
      // so the bar doesn't "float" mid-storm (block:start would pin it to the top).
      const block = id === 'contact' ? 'end' : 'start';
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block });
    }
  };

  const linkTone = overDark ? 'text-white' : 'text-black';

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-40 border-b backdrop-blur-[6px] backdrop-saturate-125 transition-[background-color,border-color,color] duration-300 ease-out ' +
        (overDark
          ? // Same glass language as the About contact bar
            'border-white/10 bg-black/20 supports-[backdrop-filter]:bg-black/15'
          : // Thin clear frost — avoid milky white/40 slab
            'border-black/5 bg-white/20 supports-[backdrop-filter]:bg-white/12')
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 lg:px-12">
        <Logo className="[&_img]:h-8 [&_img]:w-8" />
        <nav
          aria-label="Primary"
          className={
            'flex items-center gap-5 font-display text-nav font-medium tracking-normal transition-colors duration-300 sm:gap-7 ' +
            linkTone
          }
        >
          <a href="/#works" onClick={go('works')} className="link-underline bg-transparent">
            Works
          </a>
          <a href="/#about" onClick={go('about')} className="link-underline bg-transparent">
            Info
          </a>
          <a href="/resume.pdf" className="link-underline bg-transparent">
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
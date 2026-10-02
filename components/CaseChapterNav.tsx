'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';

type Chapter = {
  id: string;
  label: string;
};

type CaseChapterNavProps = {
  chapters: readonly Chapter[];
  /** Accent for active chapter + focus rings. Defaults to SkillsBuild cobalt. */
  accent?: string;
};

export default function CaseChapterNav({
  chapters,
  accent = '#0F62FE',
}: CaseChapterNavProps) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? '');
  const accentStyle = { ['--case-accent' as string]: accent } as CSSProperties;

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return undefined;

    const updateActiveSection = () => {
      const anchor = window.innerHeight * 0.35;
      const current = sections.filter((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= anchor && rect.bottom > anchor;
      });
      const next = current[current.length - 1] ?? sections.find((section) => section.getBoundingClientRect().top > anchor) ?? sections[0];
      setActiveId(next.id);
    };

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0, 1],
    });

    sections.forEach((section) => observer.observe(section));
    updateActiveSection();

    return () => observer.disconnect();
  }, [chapters]);

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    window.history.pushState(null, '', `#${id}`);
    setActiveId(id);
  };

  return (
    <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start" style={accentStyle}>
      <nav aria-label="Case chapters">
        <Link
          href="/#works"
          className="mb-8 block font-display text-meta font-medium uppercase tracking-[0.18em] text-black/65 transition-colors hover:text-[var(--case-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--case-accent)]"
        >
          ← Back to Works
        </Link>
        <ul className="space-y-4 border-l border-black/15 pl-4">
          {chapters.map((chapter) => {
            const isActive = activeId === chapter.id;
            return (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(event) => handleNavigate(event, chapter.id)}
                  className={`group flex items-start gap-2 font-display text-meta font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--case-accent)] ${isActive ? 'text-[var(--case-accent)]' : 'text-black/50 hover:text-black'}`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-[0.32rem] h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${isActive ? 'bg-[var(--case-accent)]' : 'border border-black/35 group-hover:border-black'}`}
                  />
                  <span>{chapter.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

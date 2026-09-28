'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

export type GalleryItem = {
  /** Path under /public. Leave empty to show a placeholder box. */
  src?: string;
  alt: string;
  /** Shown only in the lightbox. */
  caption?: string;
  /** Aspect ratio of the piece, e.g. '4/5', '1/1', '16/9'. */
  ratio?: string;
};

export type GallerySection = {
  title: string;
  period: string;
  description: string;
  items: GalleryItem[];
};

type LightboxState = { section: number; item: number } | null;

function Lightbox({
  sections,
  state,
  onClose,
  onGo,
}: {
  sections: GallerySection[];
  state: NonNullable<LightboxState>;
  onClose: () => void;
  onGo: (delta: number) => void;
}) {
  const item = sections[state.section].items[state.item];
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onGo(-1);
      if (e.key === 'ArrowRight') onGo(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onGo]);

  if (!item?.src) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4 md:p-8"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div
        className="relative flex max-h-[75vh] max-w-[min(92vw,56rem)] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[70vh] w-full overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs natural aspect without layout shift hacks */}
          <img
            src={item.src}
            alt={item.alt}
            className="mx-auto max-h-[70vh] w-auto max-w-full object-contain"
          />
        </div>
        {item.caption && (
          <p className="mt-4 max-w-xl text-center font-body text-sm leading-relaxed text-white/90 md:text-base">
            {item.caption}
          </p>
        )}
      </div>

      <div className="absolute bottom-6 flex gap-3 md:bottom-8">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onGo(-1);
          }}
          aria-label="Previous image"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onGo(1);
          }}
          aria-label="Next image"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function Track({
  section,
  sectionIndex,
  onOpen,
}: {
  section: GallerySection;
  sectionIndex: number;
  onOpen: (itemIndex: number) => void;
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <p className="max-w-2xl px-5 pb-4 font-body text-body text-black/70">{section.description}</p>
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label={`${section.title} pieces`}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-5 pt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black motion-reduce:scroll-auto"
      >
        {section.items.map((item, i) => (
          <li key={i} className="shrink-0 snap-start">
            {item.src ? (
              <button
                type="button"
                onClick={() => onOpen(i)}
                aria-label={`View larger: ${item.alt}`}
                className="group block text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <div
                  className="relative h-56 overflow-hidden bg-[#e5e5e5] transition group-hover:opacity-90 md:h-64"
                  style={{ aspectRatio: item.ratio ?? '4/3' }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 48rem"
                  />
                </div>
              </button>
            ) : (
              <div
                className="relative h-56 overflow-hidden bg-[#e5e5e5] md:h-64"
                style={{ aspectRatio: item.ratio ?? '4/3' }}
              >
                <span className="sr-only">{item.alt}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex justify-end gap-2 px-5 pb-4">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="flex h-9 w-9 items-center justify-center border border-black/20 text-black/70 hover:border-black hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="flex h-9 w-9 items-center justify-center border border-black/20 text-black/70 hover:border-black hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

export default function PersonalGallery({ sections }: { sections: GallerySection[] }) {
  const baseId = useId();
  // First section starts open.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const viewable = useCallback(
    (sectionIndex: number) =>
      sections[sectionIndex].items
        .map((item, i) => (item.src ? i : -1))
        .filter((i) => i >= 0),
    [sections],
  );

  const go = useCallback(
    (delta: number) => {
      setLightbox((curr) => {
        if (!curr) return curr;
        const ids = viewable(curr.section);
        const pos = ids.indexOf(curr.item);
        if (pos < 0) return curr;
        const next = ids[(pos + delta + ids.length) % ids.length];
        return { section: curr.section, item: next };
      });
    },
    [viewable],
  );

  return (
    <>
      <div className="mt-12 space-y-6">
        {sections.map((section, i) => {
          const isOpen = open.has(i);
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;
          return (
            <section key={section.title} className="border border-black/20">
              <h2>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
                >
                  <span className="font-display text-lg font-medium text-black md:text-xl">
                    {section.title}
                    <span className="ml-3 font-body text-meta font-normal text-black/55">
                      {section.period}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-black transition-transform motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>
              </h2>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="border-t border-black/10 pt-4"
              >
                <Track
                  section={section}
                  sectionIndex={i}
                  onOpen={(itemIndex) => setLightbox({ section: i, item: itemIndex })}
                />
              </div>
            </section>
          );
        })}
      </div>

      {lightbox && (
        <Lightbox
          sections={sections}
          state={lightbox}
          onClose={() => setLightbox(null)}
          onGo={go}
        />
      )}
    </>
  );
}

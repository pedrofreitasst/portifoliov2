'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/lib/projects';
import { useT } from '@/lib/i18n';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const { t } = useT();

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-ink-200/60 bg-ink-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t('projects.close')}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/80 text-cream-muted backdrop-blur transition hover:bg-ink hover:text-cream"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {project.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-200">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-6 p-8 md:p-10">
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-ember">
                  {project.tag}
                </span>
                <h2 id="project-modal-title" className="font-serif text-3xl text-cream md:text-4xl">
                  {project.title}
                </h2>
                <p className="text-base leading-relaxed text-cream-muted">
                  {project.summary}
                </p>
              </div>

              {project.description && (
                <div className="space-y-4 text-sm leading-relaxed text-cream-muted">
                  {project.description.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}

              <dl className="grid gap-6 border-t border-ink-200/60 pt-6 sm:grid-cols-3">
                {project.role && (
                  <div>
                    <dt className="mb-1 text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                      {t('projects.role')}
                    </dt>
                    <dd className="text-sm text-cream">{project.role}</dd>
                  </div>
                )}
                {project.stack && (
                  <div>
                    <dt className="mb-1 text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                      {t('projects.stack')}
                    </dt>
                    <dd className="text-sm text-cream">{project.stack.join(', ')}</dd>
                  </div>
                )}
                {project.year && (
                  <div>
                    <dt className="mb-1 text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                      {t('projects.year')}
                    </dt>
                    <dd className="text-sm text-cream">{project.year}</dd>
                  </div>
                )}
              </dl>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ember/40 px-5 py-2.5 text-sm text-ember transition hover:bg-ember hover:text-cream"
                >
                  Visitar projeto
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

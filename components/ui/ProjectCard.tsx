'use client';

import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { useT } from '@/lib/i18n';

interface Props {
  project: Project;
  onOpen: () => void;
}

export default function ProjectCard({ project, onOpen }: Props) {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200/60 bg-ink-100/40 text-left transition hover:border-ember/50 hover:bg-ink-100/70 focus:outline-none focus:ring-2 focus:ring-ember/60"
      aria-label={`Abrir detalhes do projeto ${project.title}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-200">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (

          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-200 via-ink-100 to-ink text-cream-dim">
            <span className="text-xs uppercase tracking-[0.3em]">Em breve</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-30" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-ember">
          {project.tag}
        </span>
        <h3 className="font-serif text-2xl text-cream">{project.title}</h3>
        <p className="text-sm leading-relaxed text-cream-muted line-clamp-3">
          {project.summary}
        </p>
        <span className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cream-muted transition group-hover:text-ember">
          {t('projects.view_details')}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </button>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ui/ProjectCard';
import ProjectModal from '@/components/ui/ProjectModal';
import { projects, type Project } from '@/lib/projects';
import { useT } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

export default function Projects() {
  const { t } = useT();
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative w-full border-t border-ink-200/40 bg-ink py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.span
          {...fadeUp}
          className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-cream-dim"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
          {t('projects.eyebrow')}
        </motion.span>
        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="font-serif text-display-sm text-cream"
        >
          {t('projects.title')}
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-cream-muted"
        >
          {t('projects.subtitle')}
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.25 }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={() => setActive(p)} />
          ))}
        </motion.div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}

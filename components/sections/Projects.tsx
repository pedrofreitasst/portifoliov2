'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ProjectThumb from '@/components/ProjectThumb';
import { useI18n } from '@/lib/i18n';

const PROJECTS = [
  { slug: 'apollo', title: 'Apollo', description: 'apolloDescription', image: '/projects/apollo.png', imageAlt: 'Apollo adaptive screen guide project thumbnail', accent: '#FFD23F' },
  { slug: 'skillsbuild', title: 'IBM SkillsBuild', description: 'skillsDescription', image: '/projects/skillsbuild.png', imageAlt: 'IBM SkillsBuild mobile quiz redesign project thumbnail', accent: '#5BA7F5' },
  { slug: 'chatbot', title: 'Portfolio & Ori', description: 'chatbotDescription', image: '/projects/chatbot.png', imageAlt: 'Portfolio and Ori chatbot project thumbnail', accent: '#EB8E35' },
] as const;

export default function Projects() {
  const { t } = useI18n();
  return (
    <section id="works" className="works-section">
      <div className="works-heading"><h2>{t('selectedWork')}</h2></div>
      <div className="works-list">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.slug} immediate={i === 0} delay={i === 0 ? 0.08 : (i - 1) * 0.04}>
            <article className="project-card" style={{ '--project-accent': project.accent } as React.CSSProperties}>
              <Link href={`/case/${project.slug}`} className="project-card__image-link" aria-label={`${t('readCase')}: ${project.title}`} data-cursor-label={t('readCase')}>
                <ProjectThumb src={project.image} alt={project.imageAlt} priority={i === 0} />
              </Link>
              <div className="project-card__details">
                <div>
                  <Link href={`/case/${project.slug}`} className="project-card__text-link" aria-label={`${t('readCase')}: ${project.title}`} data-cursor-label={t('readCase')}>
                    <h3>{project.title}</h3>
                    <p>{t(project.description)}</p>
                  </Link>
                </div>
                <div className="project-card__actions">
                  <span className="year-pill">{t('year')}</span>
                  <Link className="brutal-button" href={`/case/${project.slug}`}>{t('readCase')} <span aria-hidden="true">→</span></Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

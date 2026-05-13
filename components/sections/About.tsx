'use client';

import { motion } from 'framer-motion';
import SkillBar from '@/components/ui/SkillBar';
import { useT } from '@/lib/i18n';


const skillGroups = [
  {
    key: 'conversational',
    items: [
      { name: 'IBM Watson Assistant', level: 88 },
      { name: 'Figma', level: 80 },
      { name: 'Fluxos Conversacionais', level: 80 },
      { name: 'UX Writing', level: 85 },
    ],
  },
  {
    key: 'ai',
    items: [
      { name: 'Prompt Engineering', level: 90 },
      { name: 'APIs LLMs', level: 82 },
      { name: 'RAG', level: 75 },
      { name: 'Agents', level: 72 },
    ],
  },
  {
    key: 'dev',
    items: [
      { name: 'TypeScript', level: 80 },
      { name: 'React / Next.js', level: 78 },
      { name: 'Node.js', level: 75 },
      { name: 'MongoDB', level: 68 },
    ],
  },
  {
    key: 'languages',
    items: [
      { name: 'Português — Nativo', level: 100 },
      { name: 'Inglês', level: 90 },
      { name: 'Espanhol', level: 70 },
      { name: 'Mandarim — em estudo', level: 30 },
    ],
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

export default function About() {
  const { t } = useT();

  return (
    <section id="about" className="relative w-full bg-ink py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.span
          {...fadeUp}
          className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-cream-dim"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
          {t('about.eyebrow')}
        </motion.span>

        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="max-w-4xl font-serif text-display-sm text-cream"
        >
          {t('about.title')}
        </motion.h2>

        {/* Texto corrido — 3 parágrafos */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="space-y-6 lg:col-span-7"
          >
            <p className="text-base leading-relaxed text-cream-muted md:text-lg">
              {}
              {t('about.paragraph_1')}
            </p>
            <p className="text-base leading-relaxed text-cream-muted md:text-lg">
              {t('about.paragraph_2')}
            </p>
            <p className="text-base leading-relaxed text-cream-muted md:text-lg">
              {t('about.paragraph_3')}
            </p>
          </motion.div>

          {/* Bloco lateral discreto — pode ser usado pra metadata */}
          <motion.aside
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="space-y-6 border-l border-ink-200 pl-6 lg:col-span-4 lg:col-start-9"
          >
            {}
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                {t('about.aside.based_label')}
              </p>
              <p className="text-sm text-cream">{t('about.aside.based_value')}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                {t('about.aside.focus_label')}
              </p>
              <p className="text-sm text-cream">{t('about.aside.focus_value')}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                {t('about.aside.status_label')}
              </p>
              <p className="text-sm text-cream">{t('about.aside.status_value')}</p>
            </div>
          </motion.aside>
        </div>

        {/* Skills */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-24 border-t border-ink-200 pt-16"
        >
          <h3 className="mb-12 text-xs uppercase tracking-[0.35em] text-cream-dim">
            {t('about.skills_title')}
          </h3>

          <div className="grid gap-12 md:grid-cols-2">
            {skillGroups.map((group, groupIdx) => (
              <div key={group.key}>
                <h4 className="mb-6 flex items-baseline gap-3 font-serif text-xl italic text-cream">
                  <span className="text-[10px] font-sans not-italic uppercase tracking-[0.3em] text-ember">
                    0{groupIdx + 1}
                  </span>
                  {t(`about.categories.${group.key}`)}
                </h4>
                <div className="space-y-5">
                  {group.items.map((item, i) => (
                    <SkillBar
                      key={item.name}
                      name={item.name}
                      level={item.level}
                      delay={groupIdx * 100 + i * 80}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

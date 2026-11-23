'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { useI18n } from '@/lib/i18n';

const SKILL_GROUPS = [
  {
    title: 'Product & UX',
    items: ['UX Strategy', 'Research', 'Prototyping', 'User flows'],
  },
  {
    title: 'Conversational & AI',
    items: ['Conversation design', 'Prompt Engineering', 'RAG / Agents'],
  },
  {
    title: 'Design & Build',
    items: ['Figma', 'Next.js / TypeScript', 'Node.js'],
  },
] as const;

const SKILL_GROUP_LABELS: Record<string, Record<'pt' | 'en' | 'es' | 'zh', string>> = {
  'Product & UX': { pt: 'Produto e UX', en: 'Product & UX', es: 'Producto y UX', zh: '产品与 UX' },
  'Conversational & AI': { pt: 'Conversação e IA', en: 'Conversational & AI', es: 'Conversación e IA', zh: '对话与人工智能' },
  'Design & Build': { pt: 'Design e desenvolvimento', en: 'Design & Build', es: 'Diseño y desarrollo', zh: '设计与开发' },
};
const SKILL_LABELS: Record<string, Record<'pt' | 'en' | 'es' | 'zh', string>> = {
  'UX Strategy': { pt: 'Estratégia de UX', en: 'UX Strategy', es: 'Estrategia UX', zh: 'UX 策略' },
  Research: { pt: 'Pesquisa', en: 'Research', es: 'Investigación', zh: '用户研究' },
  Prototyping: { pt: 'Prototipação', en: 'Prototyping', es: 'Prototipado', zh: '原型设计' },
  'User flows': { pt: 'Fluxos de usuário', en: 'User flows', es: 'Flujos de usuario', zh: '用户流程' },
  'Conversation design': { pt: 'Design de conversas', en: 'Conversation design', es: 'Diseño de conversaciones', zh: '对话设计' },
  'Prompt Engineering': { pt: 'Engenharia de prompt', en: 'Prompt Engineering', es: 'Ingeniería de prompts', zh: '提示词工程' },
  'RAG / Agents': { pt: 'RAG / agentes', en: 'RAG / Agents', es: 'RAG / agentes', zh: 'RAG / 智能体' },
  Figma: { pt: 'Figma', en: 'Figma', es: 'Figma', zh: 'Figma' },
  'Next.js / TypeScript': { pt: 'Next.js / TypeScript', en: 'Next.js / TypeScript', es: 'Next.js / TypeScript', zh: 'Next.js / TypeScript' },
  'Node.js': { pt: 'Node.js', en: 'Node.js', es: 'Node.js', zh: 'Node.js' },
};

/**
 * About page content and skills.
 */
export default function About() {
  const { locale, t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on the background image only. Off for prefers-reduced-motion,
  // and the scroll listener is attached only while the section is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the section enters from below, 1 when it leaves at the top.
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const shift = (progress - 0.5) * 2 * rect.height * 0.1; // max 10% of section height
      bg.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const start = () => {
      if (reduce.matches) return;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
    };
    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    observer.observe(section);

    const onMotionChange = () => {
      stop();
      if (reduce.matches) bg.style.transform = '';
      else start();
    };
    reduce.addEventListener('change', onMotionChange);

    return () => {
      observer.disconnect();
      reduce.removeEventListener('change', onMotionChange);
      stop();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section relative isolate flex min-h-[100svh] flex-col overflow-hidden text-black"
    >
      {/* Background: "life.exe" (2016), pre-blurred, faded behind a dark gradient so text keeps AA contrast. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Taller than the section (12% above and below) so the parallax never shows an edge. */}
        <div ref={bgRef} className="absolute inset-x-0 -inset-y-[12%] will-change-transform">
          <Image
            src="/about-bg.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_60%] opacity-70"
          />
        </div>
        <div className="absolute inset-0 bg-[#FFD23F]/90" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-10 pt-24 md:pt-28 lg:px-12">
        <div className="w-full">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
            <Reveal className="lg:col-span-7">
              <p className="mb-4 font-mono text-meta font-bold uppercase tracking-[0.16em] text-black/65">
                {t('aboutHeading')}
              </p>
              <h2 className="font-display text-display-sm font-extrabold text-black md:text-[clamp(2rem,3.75vw,2.75rem)]">
                {t('aboutTitle')}
              </h2>
              <div className="mt-6 space-y-5 font-body text-body font-medium text-black/80 md:mt-8">
                <p>{t('aboutCopy1')}</p>
                <p>{t('aboutCopy2')}</p>
                <p>{t('aboutCopy3')}</p>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.06}>
              <h3 className="font-mono text-meta font-bold uppercase tracking-[0.16em] text-black/70">
                {t('skills')}
              </h3>
              <div className="mt-6 space-y-8">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="font-display text-nav font-bold tracking-normal text-black">
                      {SKILL_GROUP_LABELS[group.title][locale]}
                    </p>
                    <ul className="about-skills mt-3 space-y-2.5 font-body text-body text-black/80">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="border-b border-white/12 pb-2.5 last:border-b-0 last:pb-0"
                        >
                          {SKILL_LABELS[item][locale]}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

    </section>
  );
}

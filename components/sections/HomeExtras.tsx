'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

const copy = {
  en: { fun: 'Experiments and side projects, kept in their own room.', about: 'I came into tech from the outside, on purpose.', card: 'Trained in communications and advertising, I now work across UX, conversational AI and the web. Starting outside tech taught me how it feels when an interface asks too much of a person.', read: 'Read More', playground: 'Open the playground' },
  pt: { fun: 'Experimentos e projetos paralelos, cada um no seu espaço.', about: 'Entrei na tecnologia vindo de fora, de propósito.', card: 'Com formação em comunicação e publicidade, hoje trabalho com UX, IA conversacional e web. Começar fora da tecnologia me ensinou como é quando uma interface exige demais de alguém.', read: 'Ler mais', playground: 'Abrir o playground' },
  es: { fun: 'Experimentos y proyectos paralelos, cada uno en su espacio.', about: 'Llegué al mundo tecnológico desde fuera, a propósito.', card: 'Con formación en comunicación y publicidad, hoy trabajo en UX, IA conversacional y web. Empezar fuera de la tecnología me enseñó cómo se siente cuando una interfaz exige demasiado.', read: 'Leer más', playground: 'Abrir el playground' },
  zh: { fun: '实验与业余项目，各有自己的空间。', about: '我有意从科技行业之外走进科技领域。', card: '我拥有传播与广告背景，如今从事 UX、对话式 AI 与网页设计。行业之外的经历让我理解，当界面对人要求过多时是什么感受。', read: '了解更多', playground: '进入作品集' },
} as const;

export default function HomeExtras() {
  const { locale } = useI18n();
  const text = copy[locale];
  return (
    <>
      <section className="fun-band" aria-labelledby="fun-title">
        <h2 id="fun-title">{locale === 'pt' ? 'Pessoal' : locale === 'zh' ? '个人创作' : locale === 'es' ? 'Personal' : 'Fun'}</h2>
        <p>{text.fun}</p>
        <Link href="/playground" className="fun-band__link" data-cursor-label={text.playground}>{text.playground} <span aria-hidden="true">→</span></Link>
      </section>
      <section className="about-preview" id="about" aria-labelledby="about-preview-title">
        <h2 id="about-preview-title">{text.about}</h2>
        <div className="about-preview__card">
          <p>{text.card}</p>
          <Link href="/about" className="brutal-button" data-cursor-label={text.read}>{text.read} <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}

'use client';

import Reveal from '@/components/Reveal';
import { useI18n } from '@/lib/i18n';
import { useEffect, useState } from 'react';

export default function Hero() {
  const { locale, t } = useI18n();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setCurrentTime(new Date());
    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const clockLocale = { en: 'en-GB', pt: 'pt-BR', es: 'es-ES', zh: 'zh-CN' }[locale];
  const localTime = currentTime
    ? new Intl.DateTimeFormat(clockLocale, { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(currentTime)
    : null;
  return (
    <section id="hero" className="hero-section">
      <div className="hero-inner">
        <Reveal className="hero-copy">
          <p className="hero-location">
            <span>{t('location')}</span>
            {localTime && <><span aria-hidden="true"> • </span><time dateTime={currentTime?.toISOString()} aria-label={`${t('localTime')}: ${localTime} BRT`}>{localTime} BRT</time></>}
          </p>
          <h1 className="hero-title">
            <span className="hero-title__main">{t('headline')}</span>
            <span className="hero-title__aside">{t('heroAside')}</span>
          </h1>
          <p className="hero-description">{t('heroCopy')}</p>
        </Reveal>
      </div>
      <div className="ticker" aria-label="UX design, conversational AI, chatbots, web">
        <div className="ticker__track" aria-hidden="true">
          {Array.from({ length: 10 }, (_, copy) => (
            <span className="ticker__set" key={copy}>
              <span>UX DESIGN</span><i /><span>CONVERSATIONAL AI</span><i /><span>CHATBOTS</span><i /><span>WEB</span><i />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

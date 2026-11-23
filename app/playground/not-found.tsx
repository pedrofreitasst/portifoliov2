'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';

export default function PlaygroundNotFound() {
  const { t } = useI18n();

  return (
    <main id="main" tabIndex={-1} className="playground-404">
      <div className="playground-404__layout">
        <div className="playground-404__message">
          <p className="playground-404__code">404</p>
          <h1>{t('playgroundTitle')}</h1>
          <p>{t('playgroundCopy')}</p>
          <Link className="brutal-button" href="/">{t('backHome')} <span aria-hidden="true">→</span></Link>
        </div>
        <figure className="playground-404__photo-card">
          <a
            className="playground-404__download"
            href="/foto-para-a-viagem.png"
            download="foto-para-a-viagem.png"
            aria-label={t('downloadImage')}
            data-cursor-label={t('downloadImage')}
            data-cursor-arrow="↓"
          >
            <Image
              src="/foto-para-a-viagem.png"
              alt={t('playgroundDogAlt')}
              fill
              sizes="(max-width: 700px) 90vw, 38vw"
              className="playground-404__photo"
            />
          </a>
          <figcaption>{t('playgroundDogCaption')}</figcaption>
          <a className="playground-404__mobile-download" href="/foto-para-a-viagem.png" download="foto-para-a-viagem.png">
            {t('downloadImage')} <span aria-hidden="true">↓</span>
          </a>
        </figure>
      </div>
    </main>
  );
}

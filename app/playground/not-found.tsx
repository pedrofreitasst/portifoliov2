'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function PlaygroundNotFound() {
  const { t } = useI18n();

  return (
    <main id="main" tabIndex={-1} className="playground-404">
      <div>
        <p className="playground-404__code">404</p>
        <h1>{t('playgroundTitle')}</h1>
        <p>{t('playgroundCopy')}</p>
        <Link className="brutal-button" href="/">{t('backHome')} <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}

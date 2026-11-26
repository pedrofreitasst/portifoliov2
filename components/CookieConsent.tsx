'use client';

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

const CONSENT_KEY = 'portfolio-analytics-consent';
const GTM_ID = 'GTM-W4LPLP9W';

type ConsentChoice = 'accepted' | 'rejected';

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    portfolioGtagLoaded?: boolean;
  }
}

function setGoogleConsent(choice: ConsentChoice) {
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  window.gtag = (...args: unknown[]) => dataLayer.push(args);

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });

  if (choice === 'accepted') {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());

    if (!window.portfolioGtagLoaded) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      script.dataset.portfolioAnalytics = 'true';
      document.head.appendChild(script);
      window.portfolioGtagLoaded = true;
    }
  } else if (window.portfolioGtagLoaded) {
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  }
}

export default function CookieConsent() {
  const { t } = useI18n();
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let storedChoice: string | null = null;
    try {
      storedChoice = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      // Keep the choice for this visit if browser storage is unavailable.
    }

    if (storedChoice === 'accepted' || storedChoice === 'rejected') {
      setChoice(storedChoice);
      if (storedChoice === 'accepted') setGoogleConsent('accepted');
    } else {
      setOpen(true);
    }
    setReady(true);

    const openSettings = () => setOpen(true);
    window.addEventListener('open-cookie-settings', openSettings);
    return () => window.removeEventListener('open-cookie-settings', openSettings);
  }, []);

  const saveChoice = useCallback((nextChoice: ConsentChoice) => {
    setChoice(nextChoice);
    setOpen(false);
    try {
      window.localStorage.setItem(CONSENT_KEY, nextChoice);
    } catch {
      // The choice still applies for the current visit.
    }
    setGoogleConsent(nextChoice);
  }, []);

  if (!ready || !open) return null;

  return (
    <aside className="consent-banner" aria-label={t('privacySettings')}>
      <div className="consent-banner__copy">
        <p className="consent-banner__title">{t('consentPrompt')}</p>
        <p className="consent-banner__details">{t('consentDetails')}</p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" className="consent-banner__button consent-banner__button--reject" onClick={() => saveChoice('rejected')}>
          {t('consentReject')}
        </button>
        <button type="button" className="consent-banner__button consent-banner__button--accept" onClick={() => saveChoice('accepted')}>
          {t('consentAccept')}
        </button>
        {choice && (
          <button type="button" className="consent-banner__keep" onClick={() => setOpen(false)}>
            {t('consentClose')}
          </button>
        )}
      </div>
    </aside>
  );
}

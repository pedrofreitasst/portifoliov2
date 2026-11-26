'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

const CONTACT = {
  email: 'pedrofreitasst@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pedro-de-freitas-a776711a1',
  github: 'https://github.com/pedrofreitasst',
  behance: 'https://www.behance.net/pedrohfreitas',
  whatsapp: 'https://wa.me/5521981915373',
  discord: 'https://discord.gg/e3WTpWS5',
  twitter: 'https://x.com/_sanitaurus',
  instagram: 'https://www.instagram.com/pedrodefreitasst/',
};

const linkClass =
  // Sora; 16px below md so all four links stay on one row at 360px and the copyright + links
  // row fits at 640-767px (Sora is wide); 20px (text-nav) from md up.
  'hover-lit bg-transparent p-0 font-body text-[1rem] font-medium leading-[1.4] tracking-normal text-black appearance-none md:text-nav';

/** Standalone footer for case pages — home and /about fuse contact into About. */
export default function Contact() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CONTACT.email).then(done).catch(done);
    } else {
      done();
    }
  };

  return (
    <footer id="contact" className="site-footer relative border-t-2 border-black bg-[#1A1612] text-[#F4EEDB]">
      <div className="site-footer__links">
        <p className="font-body text-[1rem] font-bold leading-[1.4] tracking-normal md:text-nav">
          © {new Date().getFullYear()} - Pedro de Freitas.
        </p>
        <nav aria-label={t('contact')} className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 md:gap-x-8">
          <button type="button" onClick={copyEmail} className={linkClass} aria-live="polite">
            {copied ? t('copied') : t('email')}
          </button>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Linkedin
          </a>
          <a href={CONTACT.behance} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Behance
          </a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Github
          </a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
            WhatsApp
          </a>
          <a href={CONTACT.discord} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Discord
          </a>
          <a href={CONTACT.twitter} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Twitter / X
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Instagram
          </a>
        </nav>
      </div>
      <button
        type="button"
        className="privacy-settings-link"
        onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
      >
        {t('privacySettings')}
      </button>
      <p className="site-footer__headline">{t('footerHeadline')}</p>
      <p className="site-footer__together">{t('footerTogether')}</p>
    </footer>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

const CONTACT = {
  email: 'pedrofreitasst@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pedro-de-freitas-a776711a1',
  github: 'https://github.com/pedrofreitasst',
  behance: 'https://www.behance.net/pedrohfreitas',
};

const linkClass =
  'link-underline bg-transparent p-0 font-display text-nav font-medium tracking-normal text-black appearance-none';

/** Standalone footer for subpages only — home fuses contact into About. */
export default function Contact() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  if (pathname === '/') return null;

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
    <footer id="contact" className="relative border-t border-black/10 bg-white text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-5 lg:px-12">
        <p className="font-display text-nav font-medium tracking-normal">
          © {new Date().getFullYear()} — Pedro de Freitas.
        </p>
        <nav aria-label="Contact" className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8">
          <button type="button" onClick={copyEmail} className={linkClass} aria-live="polite">
            {copied ? 'Copied!' : 'E-mail'}
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
        </nav>
      </div>
    </footer>
  );
}

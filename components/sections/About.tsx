'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';

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

const CONTACT = {
  email: 'pedrofreitasst@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pedro-de-freitas-a776711a1',
  github: 'https://github.com/pedrofreitasst',
  behance: 'https://www.behance.net/pedrohfreitas',
};

const footLink =
  'link-underline bg-transparent p-0 font-display text-nav font-medium tracking-normal text-white appearance-none';

/**
 * Final full-viewport panel: About + Skills + contact/footer fused.
 */
export default function About() {
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
    <section
      id="about"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#08080A] text-white"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-10 pt-24 md:pt-28 lg:px-12">
        <div className="w-full">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
            <Reveal className="lg:col-span-7">
              <p className="mb-4 font-display text-meta font-medium uppercase tracking-[0.22em] text-white/65">
                About
              </p>
              <h2 className="font-display text-display-sm font-bold text-white md:text-[clamp(2.5rem,4.5vw,3.25rem)]">
                The &apos;I&apos; of The Storm
              </h2>
              <div className="mt-6 space-y-5 font-body text-body font-normal text-white/70 md:mt-8">
                <p>
                  Hey there! I&apos;m Pedro, also known as Sani online. I&apos;m a UX/UI Designer
                  with a Social Communications background and nearly 10 years working with
                  international clients. That taught me to find a way through address any need.
                  Whether technological or human.
                </p>
                <p>
                  I&apos;ve always been passionate about art, tech, and people. Discovering UX made me realize
                  they could all live in one place. I&apos;ve been experimenting with code since 2014
                  and making art since 2016, with selected pieces shown in a 2017 college
                  exhibition.
                </p>
                <p>
                  High-pressure work taught me to teach myself whatever the job needs: tools,
                  languages, soft skills. What drives me is figuring out how things work. That put
                  me here: a designer who codes, a coder who designs. We&apos;re multitudes, and
                  I&apos;m proud of that. Who else can say they&apos;re a communicative UX designer
                  who can also do backend?
                </p>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.06}>
              <h3 className="font-display text-meta font-medium uppercase tracking-[0.22em] text-white/65">
                Skills
              </h3>
              <div className="mt-6 space-y-8">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="font-display text-nav font-medium tracking-normal text-white">
                      {group.title}
                    </p>
                    <ul className="mt-3 space-y-2.5 font-body text-body text-white/75">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="border-b border-white/12 pb-2.5 last:border-b-0 last:pb-0"
                        >
                          {item}
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

      <div
        id="contact"
        className="relative z-10 mt-auto border-t border-white/10 bg-black/20 backdrop-blur-[6px]"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-5 lg:px-12">
          <p className="font-display text-nav font-medium tracking-normal text-white/90">
            {'\u00A9'} {new Date().getFullYear()} {'\u2014'} Pedro de Freitas.
          </p>
          <nav
            aria-label="Contact"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8"
          >
            <button type="button" onClick={copyEmail} className={footLink} aria-live="polite">
              {copied ? 'Copied!' : 'E-mail'}
            </button>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={footLink}
            >
              Linkedin
            </a>
            <a
              href={CONTACT.behance}
              target="_blank"
              rel="noopener noreferrer"
              className={footLink}
            >
              Behance
            </a>
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className={footLink}>
              Github
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
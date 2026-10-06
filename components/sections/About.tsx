'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
  // Sora; 16px below md so all four links stay on one row at 360px and the copyright + links
  // row fits at 640-767px (Sora is wide); 20px (text-nav) from md up.
  'hover-lit bg-transparent p-0 font-body text-[1rem] font-medium leading-[1.4] tracking-normal text-white appearance-none md:text-nav';

/**
 * Final full-viewport panel: About + Skills + contact/footer fused.
 */
export default function About() {
  const [copied, setCopied] = useState(false);
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
      ref={sectionRef}
      id="about"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#08080A] text-white"
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-[#08080A]/75 to-[#08080A]/20" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-10 pt-24 md:pt-28 lg:px-12">
        <div className="w-full">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
            <Reveal className="lg:col-span-7">
              <p className="mb-4 font-display text-meta font-medium uppercase tracking-[0.22em] text-white/65">
                About
              </p>
              <h2 className="font-display text-display-sm font-semibold text-white md:text-[clamp(2rem,3.75vw,2.75rem)]">
                The &apos;I&apos; of The Storm
              </h2>
              <div className="mt-6 space-y-5 font-body text-body font-normal text-white/70 md:mt-8">
                <p>
                  Hey there! I&apos;m Pedro, also known as Sani online. I&apos;m a UX/UI Designer
                  with a Social Communications background and nearly 10 years working with
                  international clients. That taught me to find a way to address any need,
                  whether technological or human.
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
          <p className="font-body text-[1rem] font-medium leading-[1.4] tracking-normal text-white/90 md:text-nav">
            {'\u00A9'} {new Date().getFullYear()} - Pedro de Freitas.
          </p>
          <nav
            aria-label="Contact"
            className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 md:gap-x-8"
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
'use client';

import NameRoller from '@/components/NameRoller';
import Reveal from '@/components/Reveal';

export default function Hero() {
  return (
    <section id="hero" className="relative bg-page-paper text-black">
      {/* Desktop: tighter so the first Works card peeks under the fold. Mobile paddings unchanged. */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-12 lg:pb-14 lg:pt-28">
        <Reveal className="max-w-4xl text-left">
          <h1 className="font-display text-display font-semibold text-black">
            You can call me <NameRoller />
          </h1>
          <p className="mt-6 max-w-xl font-body text-body font-normal text-black/70">
            I&apos;m a UX/UI Designer who codes. With 7 years of communications experience, I
            remove friction from your day-to-day without sacrificing aesthetics.
          </p>
          <p className="mt-4 max-w-xl font-body text-body font-normal text-black/70">
            Currently based in Rio de Janeiro, Brazil.
          </p>

          {/* Nova frase com o link do Figma estilizado */}
          <p className="mt-4 max-w-xl font-body text-body font-normal text-black/70">
            Portfolio currently being redesigned and planned in Figma, you can see me work{' '}
            <a 
              href="https://www.figma.com/design/kHdISGpNIHLIU4PAACtfdG/Portfolio-V5?m=auto&t=QEDlBz7D2ENhwkPU-6" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#FF8700' }}
              className="underline underline-offset-4 font-medium hover:opacity-80 transition-opacity"
            >
              here
            </a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
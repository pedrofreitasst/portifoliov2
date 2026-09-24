'use client';

import NameRoller from '@/components/NameRoller';
import HeroChat from '@/components/HeroChat';
import Reveal from '@/components/Reveal';

export default function Hero() {
  return (
    <section id="hero" className="relative bg-white text-black">
      {/* Desktop: tighter so the first Works card peeks under the fold. Mobile paddings unchanged. */}
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 lg:px-12 lg:pb-10 lg:pt-28">
        <Reveal className="max-w-4xl text-left">
          <h1 className="font-display text-display font-bold text-black">
            You can call me <NameRoller />
          </h1>
          <p className="mt-6 max-w-xl font-body text-body font-normal text-black/70">
            I&apos;m a UX/UI Designer who codes. With 10 years of communications experience, I
            remove friction from your day-to-day without sacrificing aesthetics.
          </p>
          <p className="mt-4 max-w-xl font-body text-body font-normal text-black/70">
            Made for you, with love.
          </p>
        </Reveal>

        <Reveal className="mt-16 md:mt-12 lg:mt-10" delay={0.08}>
          <HeroChat />
        </Reveal>
      </div>
    </section>
  );
}
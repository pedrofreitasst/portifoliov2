import Image from 'next/image';
import Link from 'next/link';

/** Chapter accent — warm gold from the Apotheosis system (differs from SkillsBuild cobalt). */
const CHAPTER =
  'font-display text-meta font-medium uppercase tracking-[0.22em] text-[#B08D57]';

export default function CasePage() {
  return (
    <main className="min-h-[70vh] bg-white px-6 pb-24 pt-32 text-black lg:px-12">
      <article className="mx-auto max-w-3xl">
        <p className="font-display text-meta font-medium uppercase tracking-[0.22em] text-black/45">
          Case study
        </p>
        <h1 className="mt-3 font-display text-display-sm font-bold tracking-normal text-black md:text-[clamp(2.25rem,4vw,3rem)]">
          APOTHEOSIS · The Calming Energy Drink
        </h1>
        <p className="mt-4 max-w-2xl font-body text-body font-normal text-black/60">
          Visual identity of a self-contradicting product.
        </p>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-2xl overflow-hidden border border-black/10 bg-[#f7f5f2]">
            <Image
              src="/cases/apotheosis/01-hero.png"
              alt="Apotheosis calming energy drink cans on marble — Passion Fruit, Chamomile, and brand storytelling panels"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 42rem"
              priority
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2850/1853] w-full max-w-2xl overflow-hidden border border-black/10 bg-[#e8e6e3]">
            <Image
              src="/cases/apotheosis/02-wordmark.png"
              alt="Apotheosis wordmark over a linocut hand reaching toward stars"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2850/1853] w-full max-w-2xl overflow-hidden border border-black/10 bg-[#e0e0d8]">
            <Image
              src="/cases/apotheosis/03-typography.png"
              alt="Apotheosis typography system — Zasha for the logo, EB Garamond for body, with a gold-rimmed can mockup"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2400/1560] w-full max-w-2xl overflow-hidden border border-black/10 bg-[#d9d7d2]">
            <Image
              src="/cases/apotheosis/04-color-palette.png"
              alt="Color palette — Chamomile, Hemp Flower, and Passion Fruit swatches with three matching slim cans"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[20/13] w-full max-w-2xl overflow-hidden border border-black/10 bg-[#e8e6e3]">
            <Image
              src="/cases/apotheosis/05-flavor-lineup.jpg"
              alt="Nine-can lineup showing Chamomile, Hemp Flower, and Passion Fruit fronts, sides, and backs"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2400/1566] w-full max-w-2xl overflow-hidden border border-black/10 bg-[#e6dec7]">
            <Image
              src="/cases/apotheosis/06-label-chamomile.png"
              alt="Full Chamomile can label unwrap — classical fresco, nutrition panel, and hand-and-star woodcut"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2400/1566] w-full max-w-2xl overflow-hidden border border-black/10 bg-[#c9d2c7]">
            <Image
              src="/cases/apotheosis/07-label-hemp-flower.png"
              alt="Full Hemp Flower can label unwrap — School of Athens arch, owl mark, and brand copy"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2400/1566] w-full max-w-2xl overflow-hidden border border-black/10 bg-[#e6dec7]">
            <Image
              src="/cases/apotheosis/08-label-passion-fruit.png"
              alt="Full Passion Fruit can label unwrap — Flaming June arch, owl mark, and brand copy"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-md overflow-hidden border border-black/10 bg-[#8b1a1a]">
            <Image
              src="/cases/apotheosis/09-poster-reach-greatness.jpg"
              alt="Campaign poster — marble youth on crimson with Apotheosis wordmark and Reach Greatness"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 28rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2000/2496] w-full max-w-md overflow-hidden border border-black/10 bg-[#2a1a14]">
            <Image
              src="/cases/apotheosis/10-poster-decanted.jpg"
              alt="Campaign poster — marble figure with cornucopia and Decanted for the discerning soul"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 28rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-md overflow-hidden border border-black/10 bg-[#f5f5f0]">
            <Image
              src="/cases/apotheosis/11-poster-reach-godhood.jpg"
              alt="Campaign poster — Poseidon silhouette with Reach Godhood and vertical Apotheosis wordmark"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 28rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-md overflow-hidden border border-black/10 bg-[#8b3a2a]">
            <Image
              src="/cases/apotheosis/12-poster-overstimulated.jpg"
              alt="Campaign poster — marble bust on terracotta with For the overstimulated"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 28rem"
            />
          </div>
        </figure>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[2000/2313] w-full max-w-md overflow-hidden border border-black/10 bg-[#87a8c7]">
            <Image
              src="/cases/apotheosis/13-poster-sky.jpg"
              alt="Campaign poster — marble figure against blue sky with For the overstimulated"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 28rem"
            />
          </div>
        </figure>

        <section className="mt-16 space-y-5 font-body text-body font-normal text-black/70">
          <p>
            Apotheosis is relaxant flavored energy drinks. With handpicked flavors like Chamomile,
            Hemp Flower and Passion Fruit Apotheosis is sold on the visual format of a functional
            and energizing drink.
          </p>
          <p>
            The visual identity avoids the usual vocabulary of the type of drink and adopts
            references to old pharmacy, medieval writing and esoteric treatment. Neoclassic
            paintings replace logos and illustrations. The final result is a brand that sells
            spiritual elevation, not just physical stimuli.
          </p>
          <p>Modern plights require modern solutions.</p>
          <p>Have you ever dreamed of keeping your peace while being productive?</p>
          <p>I present to you work-life balance in a can.</p>
          <p className="font-semibold text-black">Reach Godhood with APOTHEOSIS.</p>
        </section>

        <p className="mt-16 font-body text-body text-black/45">
          <Link href="/#works" className="link-underline bg-transparent text-black/55">
            ← Back to Works
          </Link>
        </p>
      </article>
    </main>
  );
}
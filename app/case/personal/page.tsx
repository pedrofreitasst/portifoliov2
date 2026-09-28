import PersonalGallery, { type GallerySection } from '@/components/PersonalGallery';

// Swap in real captions and descriptions. Images live in /public/cases/personal.
const PLACEHOLDER = 'Short description of this group goes here.';
const IMG = '/cases/personal';

const SECTIONS: GallerySection[] = [
  {
    title: '#Sekitember',
    period: '2026',
    description: 'A community art event for the Marathon player community, organized with the artist collective Bumgie. It is built around five prompt words: Odyssey, Avarice, Loyalty, Anomalous, and Compiler.',
    items: [
      {
        src: `${IMG}/01-sekitember2.webp`,
        alt: 'Neon green arm covered in gold chains holding a blue scanline-rendered axe against a dark starry background',
        caption:
          "“Look at you. Violent little things with ambitions to challenge the stars.” Prompt word: Avarice. (Sept. 2026)",
        ratio: '715/451',
      },
      {
        src: `${IMG}/02-sekitember2.webp`,
        alt: 'Acid-green poster titled Marathon and Sekitember Odyssey, with a blurred glowing figure and the line For those who did not wake, your restless dreams endure',
        caption:
          "“For those who did not wake. Your restless dreams endure.” Prompt word: Odyssey. (Sept. 2026)",
        ratio: '1/1',
      },
    ],
  },
  {
    title: 'Art as Sani',
    period: '2016–2026',
    description: 'Selected early works, mostly explorations driven by my interests and a way of coping with personal situations through the years.',
    items: [
      {
        src: `${IMG}/03-cover.webp`,
        alt: 'Electric blue banner with the name Sanitaurus in green and red type, surrounded by a halftone portrait, glitch graphics and a white 3D sphere',
        caption:
          "I usually change my personal branding depending on what I’m into at the time. When Marathon launched, fusing it with my long-standing one was a natural move. (Mar. 2026)",
        ratio: '3/1',
      },
      {
        src: `${IMG}/04-vhs-fevereiro.webp`,
        alt: 'Worn VHS cover for Lovebite, a Talon Studios fan-made horror tape with a red moon and a glowing-eyed figure',
        caption:
          "The last piece I made for the VHS series. It was part of a larger project, but some priorities in life shifted. It was a return to form after the first piece, Raise Hell. (Feb. 2026)",
        ratio: '1600/1317',
      },
      {
        src: `${IMG}/05-vhs-janeiro.webp`,
        alt: 'Worn green VHS cover for Phantom Pain, showing a severed hand in a glowing jar under a giant red shadow hand',
        caption:
          "I tried something different with this one: more color and a more sci-fi take on horror. (Jan. 2026)",
        ratio: '1600/1319',
      },
      {
        src: `${IMG}/06-vhs-dezembro.webp`,
        alt: 'Worn blue and red VHS cover for Season\u2019s Hauntings, a winter horror tape with pine trees and a blood-red splash',
        caption:
          "For Christmas I wanted to do a winter-themed horror. I still think it’s a bit rough around the edges, as it was my first time using Blender in a piece. (Dec. 2025)",
        ratio: '1600/1313',
      },
      {
        src: `${IMG}/07-posterclean.webp`,
        alt: 'Retro action movie poster titled Raise Hell, with an armored figure in front of a red-lit army',
        caption:
          "The first piece in the VHS series. It started as a poster for the Apex Legends in-game event of the same name. (Oct. 2025)",
        ratio: '1080/1600',
      },
      {
        src: `${IMG}/08-art.webp`,
        alt: 'Black and white poster titled Moving On, two engraved hands passing a pixelated flame, with the line Time to take this seriously',
        caption:
          "During some personal episodes, I started using Angzarr (⍼) as a recurring motif in many pieces. I find the idea of something that exists with no meaning or function, yet still exists, very alluring. (circa 2021)",
        ratio: '879/1200',
      },
      {
        src: `${IMG}/09-life-exe.webp`,
        alt: 'Glitched surreal collage of a marble head crying red, under a retro computer dialog reading Memories are bad for you. Clean cache?, with the text Forgive and Forget',
        caption:
          "One of my personal favorites. Life is about reinventing and improving ourselves, and sometimes, through the destruction of the self, we find a way to a better, new us. (circa 2016)",
        ratio: '531/695',
      },
      {
        src: `${IMG}/10-newgameplus.webp`,
        alt: 'Album-style cover for Sanitaurus, New Game Plus, a faceless pale-haired figure in a purple desert with vertical Japanese text',
        caption:
          "The first piece I made after I started dating my now wife. I’m told you can almost feel the tonal shift in my pieces after this point. (circa 2018)",
        ratio: '862/714',
      },
      {
        src: `${IMG}/11-art.webp`,
        alt: 'Soft pastel illustration of a pale figure whose head is replaced by an Art label, sitting by the sea under a floating whale',
        caption:
          "One of the sillier ones, from a time when I was playing around with a kind of signature, before shifting toward personal branding. (circa 2018)",
        ratio: '1280/1118',
      },
    ],
  },
  {
    title: 'DailyUI Challenges',
    period: '2026',
    description: PLACEHOLDER,
    items: [
      { alt: 'Placeholder', ratio: '4/3' },
      { alt: 'Placeholder', ratio: '4/3' },
      { alt: 'Placeholder', ratio: '4/3' },
    ],
  },
  {
    title: 'Creative Coding and Projects',
    period: '2026',
    description: PLACEHOLDER,
    items: [
      { alt: 'Placeholder', ratio: '16/9' },
      { alt: 'Placeholder', ratio: '1/1' },
      { alt: 'Placeholder', ratio: '16/9' },
    ],
  },
];

// Hidden until there are finished pieces. Remove a title from this list to show it again.
const HIDDEN_SECTIONS = ["DailyUI Challenges", "Creative Coding and Projects"];

export default function CasePage() {
  const visibleSections = SECTIONS.filter((s) => !HIDDEN_SECTIONS.includes(s.title));

  return (
    <main id="main" className="min-h-[70vh] bg-white px-6 pb-24 pt-32 text-black lg:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-display text-meta font-medium uppercase tracking-[0.22em] text-black/65">
          Personal work
        </p>
        <h1 className="mt-3 font-display text-display-sm font-bold tracking-normal text-black md:text-[clamp(2.25rem,4vw,3rem)]">
          Personal Works and Explorations
        </h1>
        <p className="mt-4 max-w-2xl font-body text-body font-normal text-black/60">
          Self-initiated pieces, challenges, and experiments.
        </p>

        <PersonalGallery sections={visibleSections} />
      </div>
    </main>
  );
}

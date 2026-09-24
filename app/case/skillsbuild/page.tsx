import Image from 'next/image';
import Link from 'next/link';

const CHAPTER = 'font-display text-meta font-medium uppercase tracking-[0.22em] text-[#0F62FE]';
const BODY = 'mt-5 space-y-5 font-body text-body font-normal text-black/70';

export default function CasePage() {
  return (
    <main id="main" className="min-h-[70vh] bg-white px-6 pb-24 pt-32 text-black lg:px-12">
      <article className="mx-auto max-w-3xl">
        <p className="font-display text-meta font-medium uppercase tracking-[0.22em] text-black/65">
          Case study
        </p>
        <h1 className="mt-3 font-display text-display-sm font-bold tracking-normal text-black md:text-[clamp(2.25rem,4vw,3rem)]">
          IBM SkillsBuild, a Mobile-First Redesign
        </h1>
        <p className="mt-4 max-w-2xl font-body text-body font-normal text-black/60">
          A UX problem that hid an integrity flaw.
        </p>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-display text-meta font-medium uppercase tracking-[0.18em] text-black/65">
          <li>Role: Independent UX/UI redesign</li>
          <li>Scope: Mobile quiz, 390×844</li>
          <li>Tools: Figma, IBM Plex, Carbon</li>
        </ul>

        <h2 className={`mt-10 ${CHAPTER}`}>At a glance</h2>
        <dl className="mt-4 space-y-4 border-l-2 border-[#0F62FE] pl-5 font-body text-body font-normal text-black/70">
          <div>
            <dt className="font-medium text-black">Problem</dt>
            <dd>
              On mobile, the quiz hides its Submit button below the fold, and multi-answer questions
              have no selection limit, which lets users probe for correct answers.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-black">Decisions</dt>
            <dd>
              An inline &quot;proceed&quot; action on the selected option, a hard selection limit, and
              a closed state system built on IBM&apos;s own design language.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-black">Disclosure</dt>
            <dd>I reported the integrity flaw to IBM before publishing.</dd>
          </div>
        </dl>

        <section className="mt-14">
          <h2 className={CHAPTER}>Context</h2>
          <p className="mt-5 font-body text-body font-normal text-black/70">
            I use IBM SkillsBuild on my phone (Android, Chrome) to earn certifications. Along the way
            I ran into issues ranging from merely annoying to ones that undermine the certification
            itself. This case documents what I found and how I redesigned the most critical screen.
          </p>
          <figure className="mt-8">
            <div className="relative mx-auto aspect-[9/19] w-full max-w-sm overflow-hidden border border-black/10 bg-[#f4f4f4]">
              <Image
                src="/cases/skillsbuild/01-context.png"
                alt="IBM SkillsBuild mobile quiz screen showing a multiple-choice question about risk-sensitive data"
                fill
                className="object-contain object-top"
                sizes="(max-width: 640px) 100vw, 28rem"
                priority
              />
            </div>
          </figure>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>The Problem</h2>
          <div className={BODY}>
            <p>
              The most visible flaw is simple: on the quiz screen, the SUBMIT button sits below the
              mobile browser&apos;s visible area, even in the site&apos;s full-screen mode. There is no
              convenient way to submit an answer. The rest of the experience follows the same
              pattern, with desktop layouts shrunk for mobile without rethinking the hierarchy and
              interactive content that stays illegible in portrait or landscape.
            </p>
            <p>
              The more serious flaw sits in questions that ask for more than one answer: the platform
              doesn&apos;t limit how many options you can select. That lets users extract feedback on
              the correct answers, which compromises the quiz and, by extension, a credential people
              use in hiring. On a platform that teaches Responsible AI, that gap stands out.
            </p>
          </div>
          <figure className="mt-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-black/10 bg-[#f4f4f4]">
              <Image
                src="/cases/skillsbuild/02-problem.png"
                alt="Diagnosis board: three structural mobile problems — cut-off Submit button, layouts overflowing margins, and desktop content forced onto mobile"
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 48rem"
              />
            </div>
          </figure>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Responsible Disclosure</h2>
          <div className={BODY}>
            <p>
              Before publishing, I reported the integrity flaw to IBM SkillsBuild by email. The
              official support channel turned out to be a finding of its own: a Watson chatbot that,
              when it can&apos;t resolve a request, sends you to a new instance of itself, with no path
              to a human. This case focuses on the design fix, not on how to exploit the flaw.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Respecting the system rather than reinventing it</h2>
          <div className={BODY}>
            <p>
              SkillsBuild&apos;s problem is responsive execution, not brand. So the redesign keeps
              IBM&apos;s cobalt palette, the Plex type family, and the structural geometry of the Carbon
              Design System. Redesigning the brand would solve the wrong problem.
            </p>
            <p>
              I started from the most constrained viewport (390×844), where the lack of space forces
              the hierarchy decisions, and built the system to scale up to tablet and desktop without
              parallel variants. I considered a full cobalt background, a nod to Paul Rand&apos;s color
              blocks, but dropped it: a saturated full-screen color locks the design into one use
              case, while a light background with cobalt accents scales. Cobalt now marks function
              only (selection, primary action, progress), and a monospaced face for the answer
              options, borrowed from IBM&apos;s technical manuals, separates data from prose.
            </p>
          </div>
          <figure className="mt-8">
            <div className="relative mx-auto aspect-[9/19] w-full max-w-sm overflow-hidden border border-black/10 bg-[#f4f4f4]">
              <Image
                src="/cases/skillsbuild/03-system.png"
                alt="Redesigned SkillsBuild quiz screen using IBM cobalt accents, Plex typography, and a clear multi-select counter"
                fill
                className="object-contain object-top"
                sizes="(max-width: 640px) 100vw, 24rem"
              />
            </div>
          </figure>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Selection and submission</h2>
          <div className={BODY}>
            <p>
              The original splits choosing an answer and confirming it into two actions, with SUBMIT
              in the footer. On mobile, long questions push that button below the fold, and it puts
              physical distance between the option you just tapped and the action that moves you
              forward.
            </p>
            <p>
              The redesign moves the proceed action into the selected option itself: an arrow
              replaces the &quot;+&quot; symbol on the latest selection, while a counter (1 OF 2
              CHOSEN) tracks progress. This applies Fitts&apos;s Law, which says the time to reach a
              target depends on its distance and size. The next action now sits where the eye and
              thumb already are, at the bottom-right corner of the option.
            </p>
          </div>
          <figure className="mt-8">
            <div className="relative mx-auto aspect-[9/19] w-full max-w-sm overflow-hidden border border-black/10 bg-[#f4f4f4]">
              <Image
                src="/cases/skillsbuild/04-selection.png"
                alt="Quiz option selected with inline proceed affordance and a 1 of 2 chosen counter, replacing a separate Submit button"
                fill
                className="object-contain object-top"
                sizes="(max-width: 640px) 100vw, 24rem"
              />
            </div>
          </figure>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Selection limit as an integrity safeguard</h2>
          <div className={BODY}>
            <p>
              For multi-answer questions, users can&apos;t select more options than requested. Tapping
              another option at the limit triggers brief feedback: the counter pill switches to an
              error state with a micro-animation and a short message, then fades back. To change an
              answer, you deselect one, and the arrow moves to the latest valid selection.
            </p>
            <p>
              This is a forcing function: it prevents the error instead of flagging it afterward.
              Quiz integrity is part of the implicit agreement between platform and learner, and
              allowing the limit to be exceeded, even with a warning, reopens the exploit.
            </p>
          </div>
          <figure className="mt-8">
            <div className="relative mx-auto aspect-[9/19] w-full max-w-sm overflow-hidden border border-black/10 bg-[#f4f4f4]">
              <Image
                src="/cases/skillsbuild/05-limit.png"
                alt="Multi-select quiz at the 2 of 2 limit, with selected options highlighted and an inline next arrow on the latest valid choice"
                fill
                className="object-contain object-top"
                sizes="(max-width: 640px) 100vw, 24rem"
              />
            </div>
          </figure>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>States as a system</h2>
          <div className={BODY}>
            <p>
              The screen has three states: no selection, partial selection, and full selection. Each
              option keeps two fixed anchors, a structural marker at the top left and a reserved slot
              at the right that the arrow fills only when you can move forward. Users know where to
              look for feedback without rescanning the screen.
            </p>
            <p>
              Color works the same way at different scales. The counter pill (0 OF 2, 1 OF 2, 2 OF 2
              CHOSEN) is a small cobalt block, and the selected option is the same blue over a larger
              area. One color language carries meaning at every level, so every change of state is
              predictable and every decision follows the same rules.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Reflection</h2>
          <div className={BODY}>
            <p>
              Out of scope for this case: the tablet and desktop adaptation, an animated prototype of
              the state transitions, and the error-state frame. Each one extends the same visual
              vocabulary.
            </p>
            <p>
              I spent over a decade in communication and graphic design before moving into UX.
              Writing this case showed me the thinking was already there: identify the problem, weigh
              alternatives, discard them for the right reasons, and defend the choice. UX gave me the
              vocabulary to name what I was already doing.
            </p>
          </div>
        </section>

        <p className="mt-16 font-body text-body text-black/65">
          <Link href="/#works" className="link-underline bg-transparent text-black/70">
            ← Back to Works
          </Link>
        </p>
      </article>
    </main>
  );
}

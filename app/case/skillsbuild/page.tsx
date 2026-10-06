import Image from 'next/image';
import Link from 'next/link';

import CaseChapterNav from '../../../components/CaseChapterNav';

const CHAPTER = 'font-display text-meta font-medium uppercase tracking-[0.22em] text-[#0F62FE]';
const BODY = 'mt-5 space-y-5 font-body text-body font-normal text-black/70';

const CHAPTERS = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'context', label: 'Context' },
  { id: 'the-problem', label: 'The problem' },
  { id: 'responsible-disclosure', label: 'Responsible disclosure' },
  { id: 'respect-the-system', label: 'Respect the system' },
  { id: 'selection-submission', label: 'Selection & submission' },
  { id: 'hard-selection-limit', label: 'Hard selection limit' },
  { id: 'states-as-a-system', label: 'States as a system' },
  { id: 'reflection', label: 'Reflection' },
] as const;

export default function CasePage() {
  return (
    <main id="main" className="min-h-[70vh] bg-white px-6 pb-24 pt-32 text-black lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[12rem_minmax(0,48rem)] lg:gap-16">
        <CaseChapterNav chapters={CHAPTERS} />
        <article className="max-w-3xl">
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

        <section id="at-a-glance" className="mt-10 scroll-mt-28">
          <h2 className={CHAPTER}>At a glance</h2>
          <dl className="mt-4 space-y-4 border-l-2 border-[#0F62FE] pl-5 font-body text-body font-normal text-black/70">
          <div>
            <dt className="font-medium text-black">Problem</dt>
            <dd>
              Learners could bypass the quiz, harvest correct answers, and earn a certificate
              without doing the work. The cut-off Submit button made the gap visible; unlimited
              multi-select made it structural.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-black">Decisions</dt>
            <dd>
              Keep IBM&apos;s system rather than invent a new brand; put proceed on the selected
              option; enforce a hard selection limit instead of a soft warning.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-black">Disclosure</dt>
            <dd>I reported the integrity flaw to IBM before publishing.</dd>
          </div>
          </dl>
        </section>

        <section id="context" className="mt-14 scroll-mt-28">
          <h2 className={CHAPTER}>Context</h2>
          <p className="mt-5 font-body text-body font-normal text-black/70">
            I use IBM SkillsBuild on my phone (Android, Chrome) to earn certifications. Along the way
            I found that what looked like a clumsy mobile quiz was also a certification process that
            failed its own integrity. This case documents what I found and how I redesigned the most
            critical screen.
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

        <section id="the-problem" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>The problem</h2>
          <div className={BODY}>
            <p>
              The deeper failure is not layout. On multi-answer questions, the platform does not
              limit how many options you can select. A learner can keep tapping until the feedback
              reveals every correct answer, then submit and move on. That path lets someone harvest
              the quiz, skip the learning, and still walk away with a certificate used in hiring. On
              a platform that teaches Responsible AI, a credential you can earn without doing the
              work is a structural failure of the certification process, not a polish issue.
            </p>
            <p>
              The most visible symptom is simpler: on the quiz screen, the SUBMIT button sits below
              the mobile browser&apos;s visible area, even in the site&apos;s full-screen mode. There
              is no convenient way to confirm an answer. Desktop layouts are shrunk for mobile without
              rethinking hierarchy, and interactive content stays illegible in portrait or landscape.
              That cut-off Submit is what first drew attention. Unlimited multi-select is what turns
              a UX annoyance into an integrity exploit.
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

        <section id="responsible-disclosure" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Responsible disclosure</h2>
          <div className={BODY}>
            <p>
              Before publishing, I reported the integrity flaw to IBM SkillsBuild by email. The
              official support channel turned out to be a finding of its own: a Watson chatbot that,
              when it can&apos;t resolve a request, sends you to a new instance of itself, with no path
              to a human. This case focuses on the design fix, not on how to exploit the flaw.
            </p>
          </div>
        </section>

        <section id="respect-the-system" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Decision: respect the system</h2>
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
              blocks, but chose a light field with cobalt accents instead: a saturated full-screen
              color locks the design into one use case, while light plus accents scales. Cobalt now
              marks function only (selection, primary action, progress), and a monospaced face for
              the answer options, borrowed from IBM&apos;s technical manuals, separates data from prose.
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

        <section id="selection-submission" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Decision: selection &amp; submission</h2>
          <div className={BODY}>
            <p>
              The original splits choosing an answer and confirming it into two actions, with SUBMIT
              in the footer. On mobile, long questions push that button below the fold, and it puts
              physical distance between the option you just tapped and the action that moves you
              forward.
            </p>
            <p>
              I chose an inline proceed affordance on the selected option over keeping a separate
              footer Submit: an arrow replaces the &quot;+&quot; symbol on the latest selection, while a
              counter (1 OF 2 CHOSEN) tracks progress. This applies Fitts&apos;s Law: the time to reach a
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

        <section id="hard-selection-limit" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Decision: hard selection limit</h2>
          <div className={BODY}>
            <p>
              For multi-answer questions, users can&apos;t select more options than requested. Tapping
              another option at the limit triggers brief feedback: the counter pill switches to an
              error state with a micro-animation and a short message, then fades back. To change an
              answer, you deselect one, and the arrow moves to the latest valid selection.
            </p>
            <p>
              I chose a hard limit over a soft warning because a warning still lets the learner
              over-select and read feedback on every option. That reopens the exploit. A forcing
              function prevents the error instead of flagging it afterward. Quiz integrity is part of
              the implicit agreement between platform and learner; allowing the limit to be exceeded,
              even politely, fails that agreement.
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

        <section id="states-as-a-system" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>States as a system</h2>
          <div className={BODY}>
            <p>
              The screen has three states: no selection, partial selection, and full selection. Each
              option keeps two fixed anchors, a structural marker at the top left and a reserved slot
              at the right that the arrow fills only when you can move forward. The counter pill
              (0 OF 2, 1 OF 2, 2 OF 2 CHOSEN) and the selected option share the same cobalt language
              at different scales, so every change of state is predictable.
            </p>
          </div>
        </section>

        <section id="reflection" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Reflection</h2>
          <div className={BODY}>
            <p>
              Out of scope here: tablet and desktop adaptation, an animated prototype of the state
              transitions, and the error-state frame. Each extends the same vocabulary. What the work
              proves is narrower: a mobile UX failure can mask a certification process that no longer
              verifies learning, and the fix has to close the exploit, not only move the Submit
              button.
            </p>
          </div>
        </section>

        <p className="mt-16 font-body text-body text-black/65">
          <Link href="/#works" className="hover-lit bg-transparent text-black/70">
            ← Back to Works
          </Link>
        </p>
        </article>
      </div>
    </main>
  );
}

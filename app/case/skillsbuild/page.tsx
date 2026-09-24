import Image from 'next/image';
import Link from 'next/link';

const CHAPTER = 'font-display text-meta font-medium uppercase tracking-[0.22em] text-[#0F62FE]';

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

        <section className="mt-14">
          <h2 className={CHAPTER}>Context</h2>
          <p className="mt-5 font-body text-body font-normal text-black/70">
            I have been transitioning into the technology sector (focusing on UX/UI, conversational
            design, and AI) for a few months now. To strengthen my technical foundation, I have
            pursued certifications on various platforms, including, most recently, IBM SkillsBuild.
            While using the platform on mobile for day-to-day tasks, I encountered issues ranging
            from merely &quot;annoying&quot; to those that actually compromised the validity of the
            certification itself. This case study documents what I found and how I decided to
            resolve the most critical issue.
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
          <div className="mt-5 space-y-5 font-body text-body font-normal text-black/70">
            <p>
              While using IBM SkillsBuild daily on my mobile phone, I identified three types of
              recurring structural flaws and documented them in my analysis (detailed below). The
              most serious issue is simple yet critical: on the quiz screen, the &quot;SUBMIT&quot;
              button remains below the mobile browser&apos;s visible area, even when using the
              site&apos;s full-screen function. Users literally lack a convenient way to submit their
              answers. Other issues include desktop-oriented layouts scaled for mobile without
              rethinking the hierarchy, and interactive course content (games, simulations) that
              becomes unreadable in portrait mode, a problem that persists even when rotating the
              screen, leaving text nearly illegible.
            </p>
            <p>
              SkillsBuild issues certifications that students use to demonstrate technical
              competence during hiring processes. Functional flaws in assessment workflows go beyond
              mere aesthetic issues; they compromise the educational experience at a critical
              moment, when students need to demonstrate what they have learned, and can lead users
              to abandon the course. On a platform focused on AI Literacy, AI-Enabled Customer
              Service, and Responsible AI, this friction feels particularly jarring.
            </p>
            <p>
              There is also a more serious issue I discovered while taking assessments myself: in
              multiple-choice questions requiring the selection of more than one correct option, the
              platform imposes no limit on the number of selections. This allows users to obtain
              feedback on correct answers in a way that compromises the integrity of the quiz and,
              by extension, the certification itself. It is a system design flaw with real
              implications for the value of the credential, potentially affecting thousands of daily
              users.
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
          <div className="mt-5 space-y-5 font-body text-body font-normal text-black/70">
            <p>
              Before publishing this case study, I communicated my findings, specifically regarding
              the quiz&apos;s integrity, directly to IBM SkillsBuild via email. A prior attempt using
              the official support channel revealed another issue: customer service is handled
              entirely by a Watson chatbot that, when unable to resolve a request, simply redirects
              the user to a new instance of itself, with no documented path to reach a human
              representative.
            </p>
            <p>
              This case study focuses on a design proposal rather than merely exposing flaws. The
              decisions here are based on the principle that functional issues warrant a documented
              solution, not a detailed account of the exploitation method.
            </p>
            <p>
              The starting point for the redesign was treating mobile as the system&apos;s most
              constrained viewport while ensuring alignment with the desktop version. I began by
              considering the smallest available space (390×844), where constraints force essential
              decisions regarding hierarchy, and designed the system to scale up to tablet and
              desktop without requiring parallel variants. I considered using a cobalt blue block as
              the dominant background, visually striking on mobile and resonant with IBM&apos;s
              visual heritage, but ultimately discarded the idea; using a saturated color for the
              full-screen background locks the redesign into a single use case, whereas a light
              background with color accents offers a scalable solution.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Respecting the system rather than reinventing it</h2>
          <div className="mt-5 space-y-5 font-body text-body font-normal text-black/70">
            <p>
              The redesign deliberately retains IBM&apos;s cobalt palette, the Plex typeface family,
              and the structural geometry of the Carbon Design System. The strategic decision: the
              issue with SkillsBuild is a matter of responsive execution. Redesigning the brand would
              mean solving the wrong problem and would discard three decades of IBM&apos;s investment
              in a recognizable visual system.
            </p>
            <p>
              The aesthetic direction draws inspiration from Paul Rand, the designer responsible for
              IBM&apos;s modern identity in the 1950s and 60s. Rand used solid color blocks as a
              structural element rather than merely an aesthetic one; here, cobalt blue appears as a
              functional accent (indicating selection states, primary actions, or progress). The use
              of a monospaced font for answer options references classic IBM technical documentation,
              manuals, blueprints, and terminal interfaces, creating a typographic contrast between
              context (sans-serif, prose) and data (monospace, enumerated options).
            </p>
            <p>
              The visual outcome aligns closely enough with the original that the transition feels
              natural to the user, yet diverges sufficiently to resolve structural issues. It is not
              about reinventing the wheel; it is about solving a problem.
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
          <div className="mt-5 space-y-5 font-body text-body font-normal text-black/70">
            <p>
              The original design separates &quot;selecting an answer&quot; and &quot;submitting an
              answer&quot; into two distinct actions: the choice itself and confirmation via a SUBMIT
              button. On mobile viewports, this creates two issues: the button falls below the fold
              when questions are long, and it introduces physical distance between the object the
              user just tapped (the option) and the action to proceed (the button in the footer).
            </p>
            <p>
              The solution was to integrate the &quot;proceed&quot; action directly into the selected
              element. An arrow replaces the &quot;+&quot; symbol, providing feedback that aligns
              perfectly with the user&apos;s intended flow (e.g., one of two, three of three). This
              directly applies Fitts&apos;s Law: the time required to reach a target is a function of
              distance and size. By reducing the distance the finger must travel to the next action,
              the transition becomes immediate within the natural reading flow, which ends at the
              bottom-right corner of the option.
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
          <div className="mt-5 space-y-5 font-body text-body font-normal text-black/70">
            <p>
              For questions requiring multiple answers, the redesign imposes a strict limit: users
              cannot select more options than requested. Tapping additional, unselected options once
              the limit has been reached triggers transient feedback: the indicator pill shifts to an
              error state accompanied by a micro-animation, displays an error message for a few
              seconds, and then fades back to its neutral state. To change an answer, the user
              deselects an existing option; the &quot;next&quot; arrow automatically shifts to the
              latest valid selection.
            </p>
            <p>
              This acts as a &quot;forcing function&quot;, a constraint that prevents errors from
              occurring rather than merely flagging them after the fact, as quiz integrity is part of
              the implicit agreement between the platform and the user. Allowing the limit to be
              exceeded (even with a warning) creates an opportunity for exploration that compromises
              the validity of the assessment.
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
          <div className="mt-5 space-y-5 font-body text-body font-normal text-black/70">
            <p>
              Redesign operates in three visible states: no selection, partial selection, full
              selection. Each state is defined by a consistent set of visual elements rather than
              arbitrary changes between screens.
            </p>
            <p>
              Each option maintains two geometric anchor points: a structural marker in the upper
              left corner (present in the neutral state) and a reserved area in the right corner
              (occupied by the arrow only in the forward state). This spatial consistency creates
              predictability: the user knows where to look for state feedback without having to
              &quot;rescan&quot; the entire screen. The glyph scale is coordinated to form a visual
              family that is recognizable at different points in the flow.
            </p>
            <p>
              The transition between states also uses the same chromatic vocabulary at different
              scales: the progress indicator pill (0 OF 2 CHOSEN → 1 OF 2 CHOSEN → 2 OF 2 CHOSEN) is
              a small cobalt blue block; the selected option is the same blue applied in a larger
              volume. There is no selection color separate from the instruction color; a single color
              language carries meaning at different hierarchical levels.
            </p>
            <p>
              The result is a closed system: every visual element has a structural function, every
              change in state is predictable, and every decision can be justified based on the same
              rules.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Future Considerations</h2>
          <div className="mt-5 space-y-5 font-body text-body font-normal text-black/70">
            <p>
              This case focuses on three states of a specific screen: the multiple-choice quiz in the
              mobile viewport. Decisions deliberately left out of this scope: the adaptation of the
              system to tablet and desktop (preserving mobile-first principles without becoming
              mobile-only), the animated prototyping of transitions between states via Smart Animate
              (the interaction described here gains additional clarity when demonstrated in motion),
              and the error state frame triggered when trying to exceed the selection limit. Each of
              these is a direct extension of the current system and follows the same visual
              vocabulary, which would only require execution time.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Reflection</h2>
          <div className="mt-5 space-y-5 font-body text-body font-normal text-black/70">
            <p>
              This was the first UX case study that I documented from start to finish. I recently
              made a career transition, and part of the apprehension was exactly this: knowing
              whether I would be able to articulate design decisions in the vocabulary of the area.
              The process answered the question. Identify problem, consider alternatives, discard for
              the right reasons, anticipate counter-arguments, defend choices; This structure of
              thought had already been part of my work in communication and graphic design for over
              a decade. UX gave me the vocabulary to name what I was already doing instinctively.
            </p>
            <p>
              Another thing that became clear: a case study is about demonstrating how you think
              through mockups and arguments; the final frames are evidence, and the argument lives in
              the text. A designer who delivers a beautiful screen without defending decisions
              delivers half the work.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Tools and references</h2>
          <ul className="mt-5 list-none space-y-2 font-body text-body font-normal text-black/70">
            <li>Design and prototyping: Figma.</li>
            <li>Typography: IBM Plex Sans and IBM Plex Mono.</li>
            <li>Palette: IBM cobalt (#0F62FE) and Carbon Design System ash.</li>
            <li>
              Visual inspiration: modern IBM identity (Paul Rand, 50s-60s) and contemporary Carbon
              Design System.
            </li>
            <li>
              Problem documentation: real screenshots captured during daily use of the SkillsBuild
              platform on Android (Chrome mobile).
            </li>
          </ul>
        </section>

        {/* More chapters land here as Pedro sends them */}

        <p className="mt-16 font-body text-body text-black/65">
          <Link href="/#works" className="link-underline bg-transparent text-black/70">
            ← Back to Works
          </Link>
        </p>
      </article>
    </main>
  );
}
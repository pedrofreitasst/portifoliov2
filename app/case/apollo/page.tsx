import Image from 'next/image';
import Link from 'next/link';

import CaseChapterNav from '../../../components/CaseChapterNav';

const ACCENT = 'text-[#1D5FA6]';
const CHAPTER = `font-display text-meta font-medium uppercase tracking-[0.22em] ${ACCENT}`;
const BODY = 'mt-5 space-y-5 font-body text-body font-normal text-black/70';
const LIST = 'list-disc space-y-3 pl-5 marker:text-[#1D5FA6]';
const CAPTION = 'mt-3 font-body text-meta text-black/60';
const STEP = 'font-medium text-black';

const CHAPTERS = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'origin', label: 'Origin' },
  { id: 'the-problem', label: 'The problem' },
  { id: 'research', label: 'Research' },
  { id: 'direction', label: 'Constraints & direction' },
  { id: 'the-core-decision', label: 'Core decision' },
  { id: 'window-system', label: 'Window system' },
  { id: 'the-flow', label: 'The flow' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'assistant-identity', label: 'Assistant identity' },
  { id: 'risks', label: 'What could go wrong' },
  { id: 'own-the-app', label: 'If you own the app' },
  { id: 'validation', label: 'Validation' },
  { id: 'reflection', label: 'Reflection' },
] as const;

type Shot = { src: string; alt: string; ratio?: string };

function Phone({ src, alt, ratio = 'aspect-[9/20]', priority = false }: Shot & { priority?: boolean }) {
  return (
    <div className={`relative mx-auto ${ratio} w-full max-w-[17rem] overflow-hidden border border-black/10 bg-[#f4f4f4]`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain object-top"
        sizes="(max-width: 640px) 50vw, 17rem"
        priority={priority}
      />
    </div>
  );
}

function Pair({ shots, caption }: { shots: Shot[]; caption: string }) {
  return (
    <figure className="mt-8">
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {shots.map((s) => (
          <Phone key={s.src} {...s} />
        ))}
      </div>
      <figcaption className={`${CAPTION} text-center`}>{caption}</figcaption>
    </figure>
  );
}

function Single({ shot, caption, priority = false }: { shot: Shot; caption: string; priority?: boolean }) {
  return (
    <figure className="mt-8">
      <Phone {...shot} priority={priority} />
      <figcaption className={`${CAPTION} text-center`}>{caption}</figcaption>
    </figure>
  );
}

const OB = 'aspect-[804/1748]';

export default function CasePage() {
  return (
    <main id="main" className="min-h-[70vh] bg-white px-6 pb-24 pt-32 text-black lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[12rem_minmax(0,48rem)] lg:gap-16">
        <CaseChapterNav chapters={CHAPTERS} />
        <article className="max-w-3xl">
        <p className="font-display text-meta font-medium uppercase tracking-[0.22em] text-black/65">
          Case study
        </p>
        <h1 className="mt-3 font-display text-display-sm font-semibold tracking-normal text-black md:text-[clamp(1.875rem,3.25vw,2.5rem)]">
          Apollo, an Adaptive Screen Guide
        </h1>
        <p className="mt-4 max-w-2xl font-body text-body font-normal text-black/60">
          An Android accessibility layer for low-literacy and cognitive-load users. It dims,
          spotlights and speaks. It never taps for you.
        </p>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-display text-meta font-medium uppercase tracking-[0.18em] text-black/65">
          <li>Role: Solo, research to interaction design</li>
          <li>Timeline: About 2 weeks</li>
          <li>Tools: Figma, Atkinson Hyperlegible</li>
        </ul>

        <section id="at-a-glance" className="mt-10 scroll-mt-28">
          <h2 className={CHAPTER}>At a glance</h2>
          <dl className="mt-4 space-y-4 border-l-2 border-[#1D5FA6] pl-5 font-body text-body font-normal text-black/70">
            <div>
              <dt className="font-medium text-black">Problem</dt>
              <dd>
                Two older adults who spend their day on short-video apps want to shop alone on their
                phones, but product pages overwhelm them with equal-weight text, urgency cues and
                near-identical choices. They freeze and ask someone else.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-black">Solution</dt>
              <dd>
                A guide layer over any app that scaffolds decisions with voice, spotlight and
                adaptive levels, without rewriting third-party UIs or tapping for the user. Apollo
                is general-purpose and works on any screen. Shopping on TikTok Shop is the test
                case because it is what F and S use most, not the product.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-black">Deliverables</dt>
              <dd>
                Contextual inquiry and insight synthesis; constraints analysis (Android
                accessibility services vs. iOS and Play Store); adaptive scaffolding model (L3 to
                L1); a unified window system; onboarding and an end-to-end guided purchase flow;
                assistant identity and recognition tests; risk and validation plan.
              </dd>
            </div>
          </dl>
        </section>

        <section id="origin" className="mt-14 scroll-mt-28">
          <h2 className={CHAPTER}>Origin</h2>
          <div className={BODY}>
            <p>
              About ten years ago, as a college team project, we designed an accessibility mode for
              people with low digital literacy. The idea was simple: start with a simplified
              interface and gradually transition toward the standard UI, teaching it by use rather
              than by manual.
            </p>
            <p>
              The rest of the team presented it to Google. I could not
              attend. The files, decks and contacts from that period are gone.
            </p>
            <p>
              Years later, in a Thermo Fisher interview, I was asked what structure I would use
              today, and how it would work for users aged 35-50. This case is a from-scratch
              redesign with a decade more experience. It is an origin story, not proof that the
              old project was right.
            </p>
          </div>
        </section>

        <section id="the-problem" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>The problem</h2>
          <div className={BODY}>
            <p>
              F cannot read. S has early-stage Alzheimer&apos;s. Both spend most of the day on
              short-video apps, and both want to shop on their phone alone. Today they ask others.
            </p>
            <p>
              F shops through TikTok Shop, &quot;TV shopping, new generation.&quot; On the product
              page she freezes on open: roughly fifteen tappable elements and ten-plus text blocks
              with equal visual weight. Strikethrough price, a percent-off badge, &quot;Starting
              at,&quot; installments, a flash-offer timer, free delivery with strikethrough,
              delivery dates, rating, sold count, nine variants, Store, Chat, cart, Buy now.
            </p>
            <p>
              Buy now opens a variant sheet: near-identical text-labelled patterns, a sold-out
              option shown only as faded, sizes in text, and a price that changes with size.
            </p>
            <p className="border-l-2 border-[#1D5FA6] pl-5 text-black">
              The job is not &quot;simplify the interface.&quot; It is: what does someone who
              cannot read need to know to decide safely?
            </p>
            <p>Existing screen readers read everything. That adds load; it does not remove it.</p>
          </div>
        </section>

        <section id="research" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Research</h2>
          <div className={BODY}>
            <p>
              Contextual inquiry at home with a notepad. Consent obtained. Screens photographed
              only, not people.
            </p>
            <ul className={LIST}>
              <li>
                F keeps every app she uses on the home screen and feels secure there. She opens and
                exits apps easily but does not recognize the Home button, so when lost she presses
                Back repeatedly.
              </li>
              <li>Both learned by practice, not by instruction.</li>
              <li>
                F wants to learn to do things herself. S says doing things feels heavy and prefers
                others do it: cognitive load, not stubbornness.
              </li>
              <li>
                S feels insecure beyond simple tasks and has caught adware several times, and
                complained about repetitive actions like typing a password on every unlock.
              </li>
              <li>Neither resisted a simpler-looking phone: if they can do what they use, it is fine.</li>
              <li>F usually pays by Pix and asks someone to do it; sometimes by credit card.</li>
            </ul>
            <p>
              <span className={STEP}>Insight:</span> Pix dependency is a seatbelt, friction that
              protects. The problem is not the home screen; it is getting lost inside tasks. Safety
              matters as much as ease, and for S the fear is paying for something different than
              expected.
            </p>
            <p>
              <span className={STEP}>Limitations:</span> two participants, both close to me (desire
              to please), and one leading question. Early signal, not evidence.
            </p>
          </div>
        </section>

        <section id="direction" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Constraints &amp; direction</h2>
          <div className={BODY}>
            <p>
              Android accessibility services can read screen structure, capture the screen for an
              AI model, draw overlays (dim, spotlight, arrows) and act on the user&apos;s behalf.
              They cannot hide or rearrange elements inside third-party apps. iOS does not allow
              this pattern, and Google Play restricts the permission to genuine accessibility
              tools.
            </p>
            <p>
              <span className={STEP}>Decision:</span> a guide layer over any app. It never modifies
              the screen and never taps for the user. It only dims, spotlights and speaks. Anything
              the app shows stays visible; Apollo simply does not talk about it.
            </p>
            <p>
              <span className={STEP}>Two audiences, one product:</span> the people who look for
              tools like this are usually not the people who use them. Onboarding is designed for
              whoever installs Apollo, often a caregiver. The in-use experience is designed for F.
            </p>
            <p>
              Rejected: redesigning TikTok Shop (a concept nobody would ship) and an owned adaptive
              shopping app (the insights would not transfer to the apps people already use).
            </p>
          </div>
        </section>

        <section id="the-core-decision" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Core decision: adaptive scaffolding</h2>
          <div className={BODY}>
            <ul className={LIST}>
              <li><span className={STEP}>L3 Guided:</span> explains each step and spotlights the next tap.</li>
              <li><span className={STEP}>L2 Reminders:</span> action only, light highlight.</li>
              <li><span className={STEP}>L1 Present:</span> docked in the corner; speaks only at confirmation or when stuck.</li>
            </ul>
            <p>
              Apollo steps down after two consecutive purchases without stumbles. Signals of
              struggle are idle time on a screen that needs action, repeated Back, and taps outside
              the lit area. One signal: Apollo offers help without changing anything. Two signals,
              or accepting help: it steps up. The transition works both ways, which also covers
              progressive decline. The thresholds are hypotheses to test.
            </p>
            <p>
              A timer alone would not work: people pause for many reasons, and watching the product
              video is one of them.
            </p>
          </div>
        </section>

        <section id="window-system" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>A unified window system</h2>
          <div className={BODY}>
            <p>Every message from Apollo uses one of two windows, so F only has to learn two shapes.</p>
            <ul className={LIST}>
              <li>
                <span className={STEP}>Answer windows</span> ask something. Big black buttons with
                white text, plus a mic so F can answer by voice. &quot;Not yet&quot; is the exit, so
                there is no X: a small close icon would be one more target to find and one more
                thing to misread.
              </li>
              <li>
                <span className={STEP}>Guide windows</span> tell something, with a single
                &quot;Ok.&quot;
              </li>
              <li>
                <span className={STEP}>No Ok where the app is the target.</span> When the next step
                is the app&apos;s own button (&quot;Tap the lit button to proceed,&quot; &quot;Pick
                one you like,&quot; &quot;Tap here to buy&quot;), the window has no button at all.
                An Ok there would create a second target and could make F think it moves her
                forward.
              </li>
            </ul>
            <p>
              Taps outside the lit area never dismiss anything. They stay purely a struggle
              signal.
            </p>
            <p>
              <span className={STEP}>Labels stay for those who read; F never needs them.</span>{' '}
              Apollo speaks the question and the options, and F can answer with her voice.
              &quot;Yes&quot; carries a check icon and &quot;Not yet&quot; a clock, each always in
              the same position, so the meaning comes from icon, voice and place, not from the
              word. I avoided an X for &quot;Not yet&quot; because it reads as cancel or error in
              the middle of a purchase.
            </p>
            <p>
              <span className={STEP}>Adaptive input.</span> When onboarding flags reading as a
              struggle, the text field is hidden and voice becomes the main action. For profiles
              like S, who type naturally, it stays. Same window, different profile.
            </p>
          </div>
        </section>

        <section id="the-flow" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>The flow</h2>
          <div className={BODY}>
            <p>
              Screens are recreated from real screenshots as a generic storefront, keeping BRL and
              the full original complexity, so the improvement is clearly Apollo&apos;s and not a
              quieter mock.
            </p>
            <p>
              <span className={STEP}>Docked.</span> At rest, the sun sits at the right edge. Its
              size and position follow the HyperOS floating toolbox, a pattern Android users
              already know. It is static to save battery and avoid overstimulation. Motion returns
              only when Apollo offers help, because a static icon went unnoticed in testing.
            </p>
          </div>
          <Pair
            shots={[
              { src: '/cases/apollo/01-docked.webp', alt: 'Generic product page for a Christmas tablecloth, full of prices, badges and variants, with Apollo docked as a small sun at the right edge' },
              { src: '/cases/apollo/02-how-can-i-help.webp', alt: 'Screen dimmed with an Apollo window saying Good morning, F! How can I help? with a mic button' },
            ]}
            caption="Docked, then one tap on the sun: the screen dims and Apollo asks how it can help."
          />
          <div className={BODY}>
            <p>
              <span className={STEP}>Summary.</span> What it is, the price it starts at, free
              delivery and arrival time: &quot;The price starts at R$16,90 with free
              delivery.&quot; Never the strikethrough price, percent off or urgency. The light
              falls on Buy now: &quot;Tap the lit button to proceed.&quot;
            </p>
            <p>
              <span className={STEP}>Pattern.</span> &quot;Pick one you like.&quot; The light sits
              on the patterns, and the photos do the work that the labels cannot.
            </p>
          </div>
          <Pair
            shots={[
              { src: '/cases/apollo/03-summary.webp', alt: 'Apollo summary window describing the tablecloth, price starting at R$16,90, free delivery and 3-5 days arrival, with the Buy now button lit' },
              { src: '/cases/apollo/04-pick-one.webp', alt: 'Variant sheet with pattern photos lit and an Apollo window saying Pick one you like, without a button' },
            ]}
            caption="Guide windows with no Ok: the app's own button or options are the only target."
          />
          <div className={BODY}>
            <p>
              <span className={STEP}>Confirmation, intentional friction.</span> In the real app,
              with a saved card selected, one tap on the order button completes the purchase. There
              is no separate payment screen. So the spoken item and final price, followed by one
              question, are the only safeguard before money moves, and they stay at every level:
              &quot;Green Santa tablecloth, 4 seats. The final price is R$29,90. Ready for
              checkout?&quot; The order card is the only lit thing. &quot;Ready for checkout?&quot;
              replaced &quot;Want to buy it?&quot;: the real question is readiness, not desire, and
              it sounds less like a sales prompt.
            </p>
            <p>
              <span className={STEP}>Tap.</span> &quot;Yes&quot; moves the light onto the
              app&apos;s order button: &quot;Tap here to buy.&quot; F taps it herself.
            </p>
          </div>
          <Pair
            shots={[
              { src: '/cases/apollo/05-confirm.webp', alt: 'Order card lit with an Apollo window stating the item, 4 seats, final price R$29,90, Ready for checkout, with Yes and check icon, Not yet and clock icon, and a mic' },
              { src: '/cases/apollo/06-tap-to-buy.webp', alt: 'Checkout screen dimmed except the app order button, with an Apollo window saying Tap here to buy' },
            ]}
            caption="The spoken price and the question are the seatbelt. The light is help."
          />
          <div className={BODY}>
            <p>
              <span className={STEP}>After.</span> The first screen after the purchase: &quot;Done,
              F! Your item will arrive in the next few days.&quot;
            </p>
            <p>
              As F needs less help, the light and the step-by-step lines fade from L3 to L1, but
              the spoken price and the &quot;ready?&quot; question stay at every level.
            </p>
          </div>
          <Single
            shot={{ src: '/cases/apollo/07-done.webp', alt: 'Order confirmation page with an Apollo guide window saying Done, F! Your item will arrive in the next few days, with an Ok button' }}
            caption="A guide window closes the loop."
          />
          <div className={BODY}>
            <p className={STEP}>Voice and tone</p>
            <ul className={LIST}>
              <li>Respectful and calm: short lines, no diminutives, no over-praise.</li>
              <li>One idea per line.</li>
              <li>Never repeat urgency or discount language.</li>
              <li>Never tap for the user.</li>
            </ul>
          </div>
        </section>

        <section id="onboarding" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Onboarding</h2>
          <div className={BODY}>
            <p>
              The first screen shows the sun rising with &quot;Need help? Call Apollo.&quot; Then
              four short questions, in this order: who needs help (me or someone else), their age,
              their struggles, and consent for the permissions Apollo needs. The struggles answer
              is what drives adaptation, for example hiding the text field when reading is
              selected. Consent explains each permission in one line.
            </p>
          </div>
          <Pair
            shots={[
              { src: '/cases/apollo/08-onboarding-welcome.webp', alt: 'Onboarding welcome with a large sun face and Need help? Call Apollo, Get Started button', ratio: OB },
              { src: '/cases/apollo/09-onboarding-who.webp', alt: 'Onboarding question Who needs help? with options Me and Someone else', ratio: OB },
            ]}
            caption="Written for whoever installs Apollo, often a caregiver."
          />
          <Pair
            shots={[
              { src: '/cases/apollo/10-onboarding-age.webp', alt: 'Onboarding question What is their age? with a vertical list of age ranges', ratio: OB },
              { src: '/cases/apollo/11-onboarding-struggles.webp', alt: 'Onboarding question What are their struggles? with Memory issues, Reading selected, Overstimulation and Other', ratio: OB },
            ]}
            caption="Age, then struggles. Reading selected here hides the text field later."
          />
          <Single
            shot={{ src: '/cases/apollo/12-onboarding-consent.webp', alt: 'Consent screen To help them, Apollo needs your OK, with toggles for reading the screen, showing above other apps and microphone', ratio: OB }}
            caption="Consent, one line per permission. The first toggle is shown on to illustrate the active state."
          />
          <div className={BODY}>
            <p>
              <span className={STEP}>First steps.</span> No text tutorial. Two guide windows:
              Apollo introduces itself and says to tap it to hear the words again, then says it
              will stay on the side of the screen, and settles into the dock.
            </p>
          </div>
          <Pair
            shots={[
              { src: '/cases/apollo/13-first-steps-hello.webp', alt: 'Apollo guide window: Hi, F! I am Apollo, and I am here to help. If you need, tap my words to hear them again. Ok' },
              { src: '/cases/apollo/14-first-steps-side.webp', alt: 'Apollo guide window: I will stay on the side of your screen. Tap me anytime you need help. Ok' },
            ]}
            caption="The assistant introduces itself instead of waiting to be found."
          />
        </section>

        <section id="assistant-identity" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Assistant identity &amp; testing</h2>
          <div className={BODY}>
            <p>
              Concept: light the way. Friendly over clinical; the user is a person, not a problem.
              The sun has black eyes because white eyes on yellow are about 1:1 contrast. A spiky
              starburst edge read like a &quot;SALE&quot; sticker, so the edge became rounded and
              wavy.
            </p>
            <p>
              <span className={STEP}>Test 1, static icon:</span> a small sun on the product page.
              F did not notice it, even with a red box drawn around it and verbal pointing. Help
              must announce itself, not wait to be found.
            </p>
            <p>
              <span className={STEP}>Test 2, preference and recognition:</span> four people over
              60, including F, compared the sun and a navy star, both static. All preferred the sun
              because it felt friendlier. F recognized the sun as a helper only after I gave
              context. Shape and friendliness are not enough; the assistant has to introduce
              itself.
            </p>
            <p>
              <span className={STEP}>Type and panels:</span> the first interface type was a bold
              yellow face, and it read amateur, closer to a game UI than a helper someone trusts
              with a purchase. I switched to Atkinson Hyperlegible, designed by the Braille
              Institute so similar letters (I, l, 1; O, 0) stay distinct for low-vision readers.
              Buttons went from yellow to black with white text, which also unified answer and
              guide windows. Contrast targets follow WCAG: 4.5:1 for text, 3:1 for icons.
            </p>
            <p>
              Sunrise and sunset are the motif: the sun rises when it offers help and sets into the
              corner when F continues alone.
            </p>
          </div>
        </section>

        <section id="risks" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>What could go wrong</h2>
          <div className={BODY}>
            <ul className={LIST}>
              <li><span className={STEP}>Regression or forgetting:</span> levels step both ways; confirmation stays mandatory.</li>
              <li><span className={STEP}>Stigma of a &quot;senior mode&quot;:</span> a guide anyone can use, with a friendly identity.</li>
              <li><span className={STEP}>Wrong payment method selected:</span> Apollo should check the selected method before the confirmation and say so if it is not the card.</li>
              <li><span className={STEP}>Impulse buying with a saved card:</span> mitigated by the spoken confirmation at every level.</li>
              <li><span className={STEP}>Misreading the screen:</span> Apollo should say when it is unsure.</li>
              <li><span className={STEP}>Privacy of screen capture:</span> a real cost of the approach; needs clear consent and scope.</li>
              <li><span className={STEP}>Play Store policy:</span> the permission is for genuine accessibility tools, so design and positioning must stay honest.</li>
            </ul>
          </div>
        </section>

        <section id="own-the-app" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>What if you own the app?</h2>
          <div className={BODY}>
            <p>
              The same principles become a design system: component visibility per level,
              transition rules, and who controls the pace. That answers the &quot;structure&quot;
              question without an overlay. Designing for extremes helps 35-50 users too: a spoken
              price before paying and less noise on the decision path help everyone.
            </p>
          </div>
        </section>

        <section id="validation" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Validation</h2>
          <div className={BODY}>
            <p>
              <span className={STEP}>Tested so far:</span> the two identity tests above, both with
              static icons, and an informal legibility check on an earlier version of the
              confirmation buttons (three people, unanimous for black text on yellow over white on
              amber).
            </p>
            <p>
              <span className={STEP}>Pending:</span> expert review (caregiver + UX designer);
              recognition with motion; the onboarding intro.
            </p>
            <p>
              <span className={STEP}>Hypothesis for a future test:</span> repeated pairing of word,
              icon, voice and position may help F recognize a few key words, like &quot;Yes&quot;
              and &quot;Not yet,&quot; over time. Not a result.
            </p>
            <p className={STEP}>How I would measure it</p>
            <ul className={LIST}>
              <li>Task completion without help</li>
              <li>Help requests per purchase</li>
              <li>Wrong-variant and return rate</li>
              <li>Self-reported confidence</li>
              <li>Level thresholds treated as hypotheses, not fixed rules</li>
            </ul>
            <p>No outcome metrics are claimed yet.</p>
          </div>
        </section>

        <section id="reflection" className="mt-16 scroll-mt-28">
          <h2 className={CHAPTER}>Reflection</h2>
          <div className={BODY}>
            <p>
              What changed in ten years: from simplifying screens to supporting decisions. Friction
              can protect; the Pix seatbelt became a design principle. And design for dignity: a
              calm voice, the user in control of help, never tapping for them, never treating age
              or literacy as a cute problem to solve.
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

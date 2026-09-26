import Image from 'next/image';
import Link from 'next/link';

const CHAPTER = 'font-display text-meta font-medium uppercase tracking-[0.22em] text-[#B76203]';
const BODY = 'mt-5 space-y-5 font-body text-body font-normal text-black/70';
const LIST = 'list-disc space-y-3 pl-5 marker:text-[#B76203]';
const CAPTION = 'mt-3 font-body text-meta text-black/60';

export default function CasePage() {
  return (
    <main id="main" className="min-h-[70vh] bg-white px-6 pb-24 pt-32 text-black lg:px-12">
      <article className="mx-auto max-w-3xl">
        <p className="font-display text-meta font-medium uppercase tracking-[0.22em] text-black/65">
          Case study
        </p>
        <h1 className="mt-3 font-display text-display-sm font-bold tracking-normal text-black md:text-[clamp(2.25rem,4vw,3rem)]">
          Personal Portfolio and Chatbot
        </h1>
        <p className="mt-4 max-w-2xl font-body text-body font-normal text-black/60">
          From a corner bubble to the hero.
        </p>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-display text-meta font-medium uppercase tracking-[0.18em] text-black/65">
          <li>Role: Design &amp; build</li>
          <li>Scope: Portfolio + AI assistant</li>
          <li>Stack: Next.js, Groq, OpenRouter</li>
        </ul>

        <h2 className={`mt-10 ${CHAPTER}`}>At a glance</h2>
        <dl className="mt-4 space-y-4 border-l-2 border-[#B76203] pl-5 font-body text-body font-normal text-black/70">
          <div>
            <dt className="font-medium text-black">Problem</dt>
            <dd>
              Recruiters have about 30 seconds per portfolio. I needed a way for them to get what
              they want (work, skills, contact) without scrolling or reading everything.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-black">Decisions</dt>
            <dd>
              A chatbot named Ori, moved from a corner bubble into a search bar right under the hero,
              with quick-action buttons for common questions and a multi-step AI fallback.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-black">Outcome</dt>
            <dd>
              v1 broke when IBM discontinued Watson. v2 was built to fail gracefully: when the main
              model was discontinued, the backup chain kept Ori answering.
            </dd>
          </div>
        </dl>

        <section className="mt-14">
          <h2 className={CHAPTER}>The Problem</h2>
          <div className={BODY}>
            <p>
              As I was working on my first portfolio in years, one thought kept creeping up on me:
              &ldquo;How do I relay information in a clean and fast way, in the age of low attention
              spans, to people like recruiters who have little to no time in their day?&rdquo;
            </p>
            <p>Then it came to me: a chatbot!</p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>v1.0, Watson&apos;s Corner</h2>
          <div className={BODY}>
            <p>
              During my career transition, I was studying AI applications on IBM SkillsBuild. There I
              came across their chatbot engine, Watson, which led me to the field of conversational
              design, a field that walked hand in hand with the need I had at the time.
            </p>
            <p>The decisions were natural at first:</p>
            <ul className={LIST}>
              <li>
                A little floating button in the corner that would open a chat window, like those
                help-desk bots.
              </li>
              <li>
                It would use Watson&apos;s API, which relies on conversational flows and actions, for
                a more hands-on approach.
              </li>
              <li>
                It needed a backup plan, so I enlisted Anthropic&apos;s Claude API to step in if
                Watson failed for some reason or the user had more open-ended questions.
              </li>
            </ul>
          </div>
          <figure className="mt-8">
            <div className="relative aspect-[1024/505] w-full overflow-hidden border border-black/10 bg-[#f4f4f4]">
              <Image
                src="/cases/chatbot/01-v1-corner.png"
                alt="Previous portfolio hero with a dark photo background and a floating chat button in the bottom-right corner"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 48rem"
                priority
              />
            </div>
            <figcaption className={CAPTION}>
              The little help-desk style bubble was a good first step, even if crude.
            </figcaption>
          </figure>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>What broke</h2>
          <div className={BODY}>
            <p>
              After some time, I realized the chatbot was going straight to its fallback replies.
              Here&apos;s what happened:
            </p>
            <ul className={LIST}>
              <li>
                IBM discontinued the free version of Watson Assistant I was using in favor of its new
                paid watsonx platform, which left me (for reasons I still haven&apos;t figured out)
                with a fully deleted account.
              </li>
              <li>
                Anthropic&apos;s API also had a problem with how the code worked in the live
                environment once Watson was absent.
              </li>
            </ul>
          </div>
          <figure className="mt-8">
            <div className="relative mx-auto aspect-[416/616] w-full max-w-sm overflow-hidden border border-black/10 bg-[#f4f4f4]">
              <Image
                src="/cases/chatbot/03-v1-error.png"
                alt="The old chat window answering a simple Hi with a connection error asking to check the server and API key"
                fill
                className="object-contain object-top"
                sizes="(max-width: 640px) 100vw, 24rem"
              />
            </div>
            <figcaption className={`${CAPTION} text-center`}>
              A simple &ldquo;Hi!&rdquo; was enough to hit the fallback.
            </figcaption>
          </figure>
          <div className={`${BODY} mt-8`}>
            <p>
              I needed a new plan. While studying, I found someone on Twitter who gave me the
              direction I needed in my self-taught journey: Apparicio Junior (or AJ), who lit the way
              forward.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>v2.0, the Hero Chat</h2>
          <div className={BODY}>
            <p>
              &ldquo;Sometimes when you&apos;re too close to something, you can&apos;t see the bigger
              picture.&rdquo; A recruiter told me that once, and it really came to life through the
              videos on Design Circuit&apos;s YouTube channel, hosted by AJ. One phrase stuck with me
              from then on: &ldquo;The recruiter only has 30 seconds to decide if they want to move
              forward with this or close the tab.&rdquo;
            </p>
            <p>With that mindset, the decisions became obvious:</p>
            <ul className={LIST}>
              <li>
                Moving the chatbot from a bubble to a search bar nested right under the hero, so
                visitors can get any info on the go without scrolling through the portfolio.
              </li>
              <li>
                New, sturdier APIs. After a lot of consideration, I chose Groq as the main
                &ldquo;brain&rdquo;, with OpenRouter as a backup. Since both are multi-model
                services, that adds an extra layer of safety against failure.
              </li>
              <li>
                Quick actions: buttons with FAQs under the search bar let visitors get information
                without typing anything themselves.
              </li>
            </ul>
          </div>
          <figure className="mt-8">
            <div className="relative aspect-[1024/605] w-full overflow-hidden border border-black/10 bg-[#f4f4f4]">
              <Image
                src="/cases/chatbot/02-v2-hero.png"
                alt="Current portfolio hero with the Ori chat as a search bar under the intro, reading In a rush? Ask Ori Anything, above four quick-question buttons"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 48rem"
              />
            </div>
            <figcaption className={CAPTION}>
              Making it a search bar was an easy choice: it serves the central idea of fast and easy
              information.
            </figcaption>
          </figure>
          <div className={`${BODY} mt-8`}>
            <p>
              As naturally as these decisions came, so did the name: Ori. In Yoruba tradition, Ori
              is the spiritual, invisible counterpart to the physical head, the core of a
              person&apos;s essence and personality.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={CHAPTER}>Reflection</h2>
          <div className={BODY}>
            <p>
              Even after all this work, things sometimes break, which is exactly why there are now
              multi-step fallbacks for discontinued models and other issues. Like every product, it&apos;s
              never &ldquo;fire and forget&rdquo; but a game of cat and mouse: finding ways to
              implement upgrades and ideas that can come from anywhere.
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

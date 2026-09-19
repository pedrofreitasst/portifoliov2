export default function CasePage() {
  return (
    <main className="min-h-[70vh] bg-white px-6 pb-24 pt-32 text-black lg:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-meta font-medium uppercase tracking-[0.22em] text-black/45">
          Case study
        </p>
        <h1 className="mt-3 font-display text-display-sm font-bold tracking-normal">
          Apotheosis
        </h1>
        <p className="mt-6 font-body text-body text-black/65">
          The on-site case is still being put together. For now, the full branding exploration is up on Behance.
        </p>
        <a
          href="https://www.behance.net/gallery/250671229/Apotheosis-Calming-Energy-Drink"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline mt-8 inline-block font-display text-nav font-medium text-black"
        >
          Open on Behance
        </a>
        <p className="mt-10 font-body text-body text-black/45">
          <a href="/#works" className="link-underline bg-transparent text-black/55">
            ← Back to Works
          </a>
        </p>
      </div>
    </main>
  );
}
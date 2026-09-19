import Link from 'next/link';

const GATES = [
  {
    href: '/work/personal',
    label: 'PERSONAL',
    tone: 'from-[#d8d8d8] via-[#ececec] to-[#cfcfcf]',
  },
  {
    href: '/work/case-studies',
    label: 'CASE STUDIES',
    tone: 'from-[#c9c9c9] via-[#e4e4e4] to-[#bdbdbd]',
  },
] as const;

export default function WorksGate() {
  return (
    <section id="works" className="bg-black py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-2 md:gap-6 lg:px-12">
        {GATES.map((gate) => (
          <Link
            key={gate.href}
            href={gate.href}
            className="group relative block min-h-[280px] overflow-hidden rounded-3xl md:min-h-[420px]"
          >
            <div
              className={
                'absolute inset-0 bg-gradient-to-br ' +
                gate.tone +
                ' transition duration-300 group-hover:scale-[1.02] group-hover:brightness-95'
              }
              aria-hidden
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" aria-hidden />
            <div className="relative flex h-full min-h-[280px] items-end p-8 md:min-h-[420px] md:p-12">
              <h2 className="font-display text-4xl font-bold tracking-tight text-black md:text-6xl">
                {gate.label}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

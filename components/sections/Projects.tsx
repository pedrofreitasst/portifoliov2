import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ProjectThumb from '@/components/ProjectThumb';

const PROJECTS = [
  {
    slug: 'skillsbuild',
    title: 'IBM SkillsBuild',
    description:
      'A mobile-first redesign that uncovered a flaw in the certification process.',
    image: '/projects/skillsbuild.png',
  },
  {
    slug: 'chatbot',
    title: 'Portfolio',
    description:
      'Live hero chat with multi-provider fallback and data analytics. A product demo and case study in one.',
    image: '/projects/chatbot.png',
  },
  {
    slug: 'personal',
    title: 'Personal Work',
    description:
      'Designs, posters, creative coding, personal pieces from now and other eras.',
    image: '/projects/personal.png',
  },
] as const;

export default function Projects() {
  return (
    <section id="works" className="bg-white pb-20 pt-10 text-black md:pb-28 md:pt-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 md:gap-24 lg:px-12">
        {PROJECTS.map((project, i) => (
          <Reveal
            key={project.slug}
            immediate={i === 0}
            delay={i === 0 ? 0.12 : (i - 1) * 0.05}
          >
            <Link href={`/case/${project.slug}`} className="group block">
              <ProjectThumb src={project.image} priority={i === 0} />
              <h3 className="link-underline-group mt-5 font-display text-title font-bold md:text-section">
                {project.title}
              </h3>
              <p className="mt-2 max-w-2xl font-body text-body font-normal text-black/60">
                {project.description}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
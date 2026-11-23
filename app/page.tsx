import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import HomeExtras from '@/components/sections/HomeExtras';

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <Projects />
      <HomeExtras />
    </main>
  );
}

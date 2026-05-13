import Header from '@/components/Header';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import Chatbot from '@/components/Chatbot';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Chatbot />
    </>
  );
}

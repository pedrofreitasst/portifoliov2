import type { Metadata } from 'next';
import About from '@/components/sections/About';

export const metadata: Metadata = {
  title: 'About - Pedro de Freitas',
  description:
    'About Pedro de Freitas — UX/UI Designer who codes. Background, skills, and contact.',
};

export default function AboutPage() {
  return (
    <main id="main">
      <About />
    </main>
  );
}

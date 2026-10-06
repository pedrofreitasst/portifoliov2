import type { Metadata } from 'next';
import { Fraunces, Sora } from 'next/font/google';
import Header from '@/components/Header';
import Contact from '@/components/sections/Contact';
import OriCornerChat from '@/components/OriCornerChat';
import './globals.css';

// Display font: Fraunces variable (wght 100-900 + optical size). The browser picks opsz from the
// font size automatically (font-optical-sizing: auto), so big headings get the display cut.
// SOFT/WONK axes are left out on purpose: unused, and they roughly double the file (~67KB -> ~121KB
// latin woff2). Add 'SOFT', 'WONK' to axes if you want to play with them. Italic not loaded (unused).
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
});

// Body font: Sora variable (wght 100-800).
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pedrodefreitas.vercel.app'),
  title: 'Pedro de Freitas - UX/UI Designer who codes',
  description:
    'Design Engineer portfolio. Conversational UX, interfaces, and front-end - removing friction without sacrificing aesthetics.',
  keywords: [
    'UX/UI Designer',
    'Design Engineer',
    'Conversational UX',
    'Prompt Engineering',
    'Next.js',
    'Pedro Freitas',
  ],
  authors: [{ name: 'Pedro Freitas' }],
  openGraph: {
    title: 'Pedro de Freitas - UX/UI Designer who codes',
    description:
      'Design Engineer portfolio. Conversational UX, interfaces, and front-end.',
    type: 'website',
    locale: 'en_US',
    url: 'https://pedrodefreitas.vercel.app/',
    images: [
      {
        url: '/og-image-v2.png',
        width: 1200,
        height: 630,
        alt: 'Pedro de Freitas portfolio hero: You can call me Sani',
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sora.variable} ${fraunces.className}`}
    >
      <body className={`${sora.className} bg-white text-black antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Contact />
        <OriCornerChat />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Darker_Grotesque, Jost } from 'next/font/google';
import Header from '@/components/Header';
import Contact from '@/components/sections/Contact';
import './globals.css';

const darkerGrotesque = Darker_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pedro de Freitas — UX/UI Designer who codes',
  description:
    'Design Engineer portfolio. Conversational UX, interfaces, and front-end — removing friction without sacrificing aesthetics.',
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
    title: 'Pedro de Freitas — UX/UI Designer who codes',
    description:
      'Design Engineer portfolio. Conversational UX, interfaces, and front-end.',
    type: 'website',
    locale: 'en_US',
    url: 'https://pedrodefreitas.vercel.app/',
    images: ['/og-image.png'],
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
      className={`${darkerGrotesque.variable} ${jost.variable} ${darkerGrotesque.className}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@400;500;700&family=Jost:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${jost.className} bg-white text-black antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Contact />
      </body>
    </html>
  );
}

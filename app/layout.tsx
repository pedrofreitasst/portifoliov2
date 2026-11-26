import type { Metadata } from 'next';
import Script from 'next/script';
import { Bricolage_Grotesque, Fraunces, Space_Mono } from 'next/font/google';
import Header from '@/components/Header';
import SkipLink from '@/components/SkipLink';
import Contact from '@/components/sections/Contact';
import CustomCursor from '@/components/CustomCursor';
import OriCornerChat from '@/components/OriCornerChat';
import { I18nProvider } from '@/lib/i18n';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
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
    <html lang="en" className={`${bricolage.variable} ${fraunces.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        <Script id="google-tag-manager-data-layer" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-W4LPLP9W"
          strategy="afterInteractive"
        />
        <I18nProvider>
          <SkipLink />
          <Header />
          <div className="portfolio-content">
            {children}
            <Contact />
          </div>
          <OriCornerChat />
          <CustomCursor />
        </I18nProvider>
      </body>
    </html>
  );
}

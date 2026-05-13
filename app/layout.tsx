import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'Pedro Freitas — UX Conversacional & AI Engineering',
  description:
    'Portfólio de Pedro Freitas, profissional em transição para UX Designer Conversacional e AI Engineer. Projetos, processo e contato.',
  keywords: [
    'UX Conversacional',
    'AI Engineering',
    'Prompt Engineering',
    'IBM Watson',
    'Pedro Freitas',
    'Portfólio',
  ],
  authors: [{ name: 'Pedro Freitas' }],
  openGraph: {
    title: 'Pedro Freitas — UX Conversacional & AI Engineering',
    description:
      'Portfólio pessoal entre design de conversa e engenharia de IA.',
    type: 'website',
    locale: 'pt_BR',
   
     url: 'https://pedrodefreitas.vercel.app/',
     images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-ink text-cream">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

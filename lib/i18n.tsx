'use client';


import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import ptMessages from '@/messages/pt.json';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';
import zhMessages from '@/messages/zh.json';

export type Locale = 'pt' | 'en' | 'es' | 'zh';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

type Messages = Record<string, any>;

const messagesMap: Record<Locale, Messages> = {
  pt: ptMessages as Messages,
  en: enMessages as Messages,
  es: esMessages as Messages,
  zh: zhMessages as Messages,
};

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNested(obj: Messages, path: string): string | undefined {
  return path.split('.').reduce<any>((acc, part) => (acc ? acc[part] : undefined), obj);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale | null) : null;
    if (stored && messagesMap[stored]) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', l);
    }
  };

  const value = useMemo<LanguageContextValue>(() => {
    const messages = messagesMap[locale] ?? messagesMap.pt;
    const fallback = messagesMap.pt;
    return {
      locale,
      setLocale,
      t: (key: string) => {
        const val = getNested(messages, key) ?? getNested(fallback, key);
        return typeof val === 'string' ? val : key;
      },
    };
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useT must be used within LanguageProvider');
  return ctx;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../services/storage';
import { LangCode } from './translations';
import { t as translate, langs } from './translations';

interface I18nContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'zh-HK',
  setLang: () => {},
  t: (key: string) => key
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('zh-HK');

  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await storage.loadLanguage();
      if (savedLang && ['zh-HK', 'zh-CN', 'en'].includes(savedLang)) {
        setLangState(savedLang as LangCode);
      }
    };
    loadLang();
  }, []);

  const setLang = async (newLang: LangCode) => {
    setLangState(newLang);
    await storage.saveLanguage(newLang);
  };

  const t = (key: string, params: Record<string, string | number> = {}) => {
    return translate(key as any, params, lang);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
export { langs };
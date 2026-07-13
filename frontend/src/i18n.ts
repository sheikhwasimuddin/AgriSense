import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import bnTranslation from './locales/bn.json';
import orTranslation from './locales/or.json';
import urTranslation from './locales/ur.json';
import frTranslation from './locales/fr.json';
import esTranslation from './locales/es.json';
import taTranslation from './locales/ta.json';
import teTranslation from './locales/te.json';

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  bn: { translation: bnTranslation },
  or: { translation: orTranslation },
  ur: { translation: urTranslation },
  fr: { translation: frTranslation },
  es: { translation: esTranslation },
  ta: { translation: taTranslation },
  te: { translation: teTranslation }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';

// Guarded so the module can be imported during build-time prerender (no localStorage in Node).
function getInitialLanguage(): string {
  if (typeof window === 'undefined') return 'es';
  try {
    return window.localStorage.getItem('language') || 'es';
  } catch {
    return 'es';
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: es,
      },
      en: {
        translation: en,
      },
      pt: {
        translation: pt,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;


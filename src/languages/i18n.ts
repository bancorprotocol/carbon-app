import i18n from 'i18next';
import { initReactI18next, Backend, LanguageDetector } from 'libs/translations';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.VITE_DEV_MODE,
  });

export default i18n;

import i18n from 'i18next';
import {
  initReactI18next,
  LanguageDetector,
  ChainedBackend,
  LocalStorageBackend,
  HttpBackend,
} from 'libs/translations';
import { APP_ID, APP_VERSION } from 'services/localeStorage';

const TRANSLATION_VERSION = 'v1';

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Spanish' },
] as const;

type SupportedLanguagesCodes = (typeof SUPPORTED_LANGUAGES)[number]['code'];

type LanguageVersionMapping = {
  [key in SupportedLanguagesCodes]: string;
};

i18n
  .use(ChainedBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    debug: import.meta.env.VITE_DEV_MODE,
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          prefix: `${APP_ID}-${APP_VERSION}-`,
          expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
          defaultVersion: 'v1',
          versions: SUPPORTED_LANGUAGES.reduce((acc, currLang) => {
            acc[currLang.code] = TRANSLATION_VERSION;
            return acc;
          }, {} as LanguageVersionMapping),
        },
        {
          prefix: `${APP_ID}-${APP_VERSION}-`,
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      ],
    },
  });

export default i18n;

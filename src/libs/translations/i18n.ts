import {
  initReactI18next,
  LanguageDetector,
  ChainedBackend,
  HttpBackend,
  LocalStorageBackend,
  i18n,
} from 'libs/translations';
import { APP_ID, APP_VERSION } from 'utils/constants';

const TRANSLATION_VERSION = 'v1.1';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'ge', name: 'German' },
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
    react: {
      useSuspense: true,
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    debug: import.meta.env.VITE_DEV_MODE,
    detection: {
      lookupLocalStorage: `${APP_ID}-${APP_VERSION}-i18nextLng`,
      lookupQuerystring: '', // disable querystring in url
    },
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          prefix: `${APP_ID}-${APP_VERSION}-`,
          expirationTime: 30 * 24 * 60 * 60 * 1000, // 30 days
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
    saveMissing: true,
  });

i18n.on('missingKey', (_, _1, key) => {
  if (import.meta.env.VITE_DEV_MODE) {
    throw new Error(`Missing key ${key}`);
  }
});

export default i18n;

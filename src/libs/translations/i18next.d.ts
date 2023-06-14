import { i18n } from '.';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

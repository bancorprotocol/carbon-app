import { shouldPolyfill as shouldPolyfillNumber } from '@formatjs/intl-numberformat/should-polyfill';
async function polyfill() {
  if (shouldPolyfillNumber('en')) {
    // Load the polyfill 1st BEFORE loading data
    await import('@formatjs/intl-numberformat/polyfill-force');
    await import('@formatjs/intl-numberformat/locale-data/en');
  }
}

polyfill();

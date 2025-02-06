import LZString from 'lz-string';
import { Migration } from './migrateLocalStorage';

export class ManagedLocalStorage<T> {
  readonly keyFormatter = (key: keyof T) => key as string;

  constructor(
    keyFormatter?: (key: keyof T) => string,
    private migrations?: Migration[]
  ) {
    if (keyFormatter) {
      this.keyFormatter = keyFormatter;
    }
  }

  getItem = <K extends keyof T>(key: K): T[K] | undefined => {
    const formattedId = this.keyFormatter(key);
    const value = localStorage.getItem(formattedId);

    if (!value) {
      return;
    }

    const parsedValue = JSON.parse(value);

    if (parsedValue.__IS_COMPRESSED__) {
      try {
        return JSON.parse(LZString.decompress(parsedValue.value));
      } catch (error) {
        console.error('Decompress has failed', error);
        return undefined;
      }
    }

    return parsedValue;
  };

  setItem = <K extends keyof T>(key: K, value: T[K], compress = false) => {
    const formattedId = this.keyFormatter(key);
    let stringValue = JSON.stringify(value);

    if (compress) {
      stringValue = JSON.stringify({
        __IS_COMPRESSED__: true,
        value: LZString.compress(stringValue),
      });
    }

    localStorage.setItem(formattedId, stringValue);

    // Reproduce "storage" event so it run also within the context of the same document
    const event = new StorageEvent('storage', {
      key: formattedId,
      newValue: stringValue,
      // If this become needed in the app we can send oldValue too, but it requires an additional getItem() call
      oldValue: null,
      // eslint-disable-next-line no-restricted-globals
      url: location.href,
    });
    window.dispatchEvent(event);
  };

  removeItem = <K extends keyof T>(key: K) => {
    const formattedId = this.keyFormatter(key);
    localStorage.removeItem(formattedId);
  };

  migrateItems = () => {
    this.migrations?.forEach(({ migrate }) => {
      Object.keys(localStorage).forEach(migrate);
    });
  };
}

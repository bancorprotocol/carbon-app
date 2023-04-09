import LZString from 'lz-string';

export class ManagedLocalStorage<T> {
  private readonly keyFormatter = (key: keyof T) => key as string;

  constructor(keyFormatter?: (key: keyof T) => string) {
    if (keyFormatter) {
      this.keyFormatter = keyFormatter;
    }
  }

  getItem = <K extends keyof T>(key: K, compressed = false): T[K] | undefined => {
    const formattedId = this.keyFormatter(key);
    const value = localStorage.getItem(formattedId);
    if (!value) {
      return;
    }
    const parsedValue = JSON.parse(value);
    return compressed ? LZString.decompress(parsedValue): parsedValue;
  };

  setItem = <K extends keyof T>(key: K, value: T[K],compress=false) => {
    const formattedId = this.keyFormatter(key);
    const stringValue = JSON.stringify(value);

    localStorage.setItem(formattedId, compress ? LZString.compress(stringValue) : stringValue);
  };

  removeItem = <K extends keyof T>(key: K) => {
    const formattedId = this.keyFormatter(key);
    localStorage.removeItem(formattedId);
  };
}

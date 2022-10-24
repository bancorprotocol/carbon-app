export class ManagedLocalStorage<T> {
  private readonly keyFormatter = (key: keyof T) => key as string;

  constructor(keyFormatter?: (key: keyof T) => string) {
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
    return JSON.parse(value);
  };

  setItem = <K extends keyof T>(key: K, value: T[K]) => {
    const formattedId = this.keyFormatter(key);
    const stringValue = JSON.stringify(value);
    localStorage.setItem(formattedId, stringValue);
  };

  removeItem = <K extends keyof T>(key: K) => {
    const formattedId = this.keyFormatter(key);
    localStorage.removeItem(formattedId);
  };
}

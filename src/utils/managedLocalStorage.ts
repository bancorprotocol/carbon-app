export class ManagedLocalStorage<T> {
  private readonly keyFormatter = (key: keyof T) => key as string;

  constructor(keyFormatter?: (key: keyof T) => string) {
    if (keyFormatter) {
      this.keyFormatter = keyFormatter;
    }
  }

  get = <K extends keyof T>(key: K): T[K] | undefined => {
    const formattedId = this.keyFormatter(key);
    const value = localStorage.getItem(formattedId);
    if (!value) {
      return;
    }
    return JSON.parse(value);
  };

  set = <K extends keyof T>(key: K, value: T[K]) => {
    const formattedId = this.keyFormatter(key);
    const stringValue = JSON.stringify(value);
    localStorage.setItem(formattedId, stringValue);
  };

  remove = <K extends keyof T>(key: K) => {
    const formattedId = this.keyFormatter(key);
    localStorage.removeItem(formattedId);
  };
}

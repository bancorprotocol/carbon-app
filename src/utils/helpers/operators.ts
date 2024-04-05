/**
 * Utils function used inside a filter for type safety
 * @example
 * ```typescript
 * const list: (string | undefined)[]
 * // ✅ DO
 * const filtered = list.filter(exist); // filtered is string[]
 * // ⛔ DON'T
 * const filtered = list.filter(v => exist(v)); // filtered is (string | undefined[]
 * ```
 */
export const exist = <T>(v?: T | null): v is T => v !== undefined && v !== null;

export const unique = <T>(values: T[]) => Array.from(new Set(values));
export const mapOver = <K, V, O>(
  map: Map<K, V>,
  cb: (keyvalue: [key: K, value: V]) => O
) => Array.from(map.entries()).map(cb);

/** Check is a value is empty. Mostly used to determine if a value should be in the search params */
export const isEmpty = (value: any) => {
  return (
    value === '' ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && !value.length)
  );
};

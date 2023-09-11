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

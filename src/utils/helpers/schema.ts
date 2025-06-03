export type GroupSchema<T> = {
  [key in keyof T]: TransformSchema<T[key]>;
};
type TransformSchema<T> = (value?: string) => T;

export const identity = (value: string) => value;
export const toBoolean =
  (fallback: boolean = false) =>
  (value: string = '') => {
    return value ? value : fallback;
  };
export const toString =
  (fallback: string = '') =>
  (value: string = '') => {
    return value ? value : fallback;
  };
export const toNumber =
  (fallback: number = 0) =>
  (value: string = '') => {
    return value ? Number(value) : fallback;
  };
export const toArray =
  <T>(fallback: T[] = []) =>
  (value: string = '') => {
    return value ? (value as unknown as T[]) : fallback;
  };
export const toLiteral =
  <T>(literals: T[], fallback: T) =>
  (value: string = '') => {
    return literals.includes(value as any) ? (value as T) : fallback;
  };
export const toDate =
  (fallback?: Date) =>
  (value: string = '') => {
    return value ? value : fallback;
  };
export type SearchParams<T> = Partial<{
  [key in keyof T]: string;
}>;

export const parseSchema = <T>(
  schema: GroupSchema<T>,
  params: SearchParams<T>,
) => {
  const result: Partial<T> = {};
  for (const key in schema) {
    const transform = schema[key];
    result[key] = transform(params[key]);
  }
  return result as T;
};

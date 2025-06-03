type ExcludeIdKey<K> = K extends 'id' ? never : K;

export type IdAndDataType<I, D> = { id: I; data: D };

type ExcludeIdField<T> = {
  [K in ExcludeIdKey<keyof T>]: T[K];
};

type ExtractDataType<U, E> =
  U extends IdAndDataType<E, unknown> ? ExcludeIdField<U> : never;

export type DataTypeById<U, E> =
  U extends IdAndDataType<E, unknown> ? ExtractDataType<U, E>['data'] : never;

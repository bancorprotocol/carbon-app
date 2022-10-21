type ExcludeIdKey<K> = K extends 'id' ? never : K;

type ExcludeIdField<A> = {
  [K in ExcludeIdKey<keyof A>]: A[K];
};

export type IdAndDataType<B, T> = { id: B; data: T };

export type ExtractDataType<U, T> = U extends IdAndDataType<T, unknown>
  ? ExcludeIdField<U>
  : never;

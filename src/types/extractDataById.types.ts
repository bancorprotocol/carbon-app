type ExcludeIdKey<K> = K extends 'id' ? never : K;

type ExcludeIdField<A> = {
  [K in ExcludeIdKey<keyof A>]: A[K];
};

export type IdAndData<B, T> = { id: B; data: T };

export type ExtractDataType<U, T> = U extends IdAndData<T, unknown>
  ? ExcludeIdField<U>
  : never;

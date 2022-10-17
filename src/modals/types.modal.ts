import { ModalType } from 'modals/ModalProvider';

type ModalWalletData = {
  foo: string;
  bar: string;
};

type Modal<A extends ModalType, T> = {
  type: A;
  data: T;
};

export type Modals = Modal<ModalType.WALLET, ModalWalletData>;

type ExcludeTypeKey<K> = K extends 'type' ? never : K;

type ExcludeTypeField<A extends Modals> = {
  [K in ExcludeTypeKey<keyof A>]: A[K];
};

export type ExtractModalData<
  A extends Modals,
  T extends ModalType
> = A extends Modal<T, unknown> ? ExcludeTypeField<A> : never;

import { DataTypeById, IdAndDataType } from 'types/extractDataById.types';

export class ManagedLocalStorage<
  E extends string,
  U extends IdAndDataType<E, unknown>
> {
  private readonly keyFormatter = (id: E) => id as string;

  constructor(keyFormatter?: (id: E) => string) {
    if (keyFormatter) {
      this.keyFormatter = keyFormatter;
    }
  }

  get = <I extends E>(
    id: I
  ): DataTypeById<U, I> extends never
    ? any
    : DataTypeById<U, I> | undefined => {
    const formattedId = this.keyFormatter(id);
    const value = localStorage.getItem(formattedId);
    if (!value) {
      return;
    }
    return JSON.parse(value);
  };

  set = <I extends E>(
    id: I,
    value?: DataTypeById<U, I> extends never ? any : DataTypeById<U, I>
  ) => {
    const formattedId = this.keyFormatter(id);
    if (!value) {
      return localStorage.removeItem(formattedId);
    }
    const stringValue = JSON.stringify(value);
    localStorage.setItem(formattedId, stringValue);
  };
}

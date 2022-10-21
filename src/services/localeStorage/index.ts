import { DataTypeById, IdAndDataType } from 'types/extractDataById.types';

export class LocalStorageService<E, U extends IdAndDataType<E, unknown>> {
  private readonly appId: string;
  private readonly appVersion: string;

  constructor(appId: string, appVersion: string) {
    this.appId = appId;
    this.appVersion = appVersion;
  }

  get = <I extends E>(id: I): DataTypeById<U, I> | undefined => {
    const lsId = [this.appId, this.appVersion, id].join('-');
    const value = localStorage.getItem(lsId);
    if (!value) {
      return;
    }
    return JSON.parse(value);
  };

  set = <I extends E>(id: I, value?: DataTypeById<U, I>) => {
    const lsId = [this.appId, this.appVersion, id].join('-');
    if (!value) {
      return localStorage.removeItem(lsId);
    }
    const stringValue = JSON.stringify(value);
    localStorage.setItem(lsId, stringValue);
  };
}

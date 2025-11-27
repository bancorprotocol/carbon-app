import { Address } from '@ton/core';

export const isTonAddress = (address: string) => {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
};

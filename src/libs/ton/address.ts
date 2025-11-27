import config from 'config';
import { isAddress } from 'ethers';
import { Token } from 'libs/tokens';
import { getTacSDK } from './sdk';

export const getTokenAddress = (token: Token) => {
  if (config.network.name === 'TON' && 'tonAddress' in token) {
    return token.tonAddress as string;
  } else {
    return token.address;
  }
};

// With SDK

export const getEVMTokenAddress = async (tvmTokenAddress: string) => {
  if (isAddress(tvmTokenAddress)) return tvmTokenAddress;
  const { Address } = await import('@ton/core');
  const sdk = await getTacSDK();
  const ton = Address.parse(tvmTokenAddress).toString({ bounceable: true });
  return sdk.getEVMTokenAddress(ton);
};
export const getTVMTokenAddress = async (evmTokenAddress: string) => {
  const { Address } = await import('@ton/core');
  try {
    // If evmTokenAddress is actually a TON address, return it
    Address.parse(evmTokenAddress);
    return evmTokenAddress;
  } catch {
    const sdk = await getTacSDK();
    const tvmAddress = await sdk.getTVMTokenAddress(evmTokenAddress);
    return Address.parse(tvmAddress).toString({ bounceable: true });
  }
};

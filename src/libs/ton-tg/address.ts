import config from 'config';
import { getAddress as getEthersAddress, isAddress } from 'ethers';

import { TacSdk, Network } from '@tonappchain/sdk';
import { Address } from '@ton/core';

export const isTONAddress = (address: string) => {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
};

export const getAddress = (address: string) => {
  if (config.network.name === 'TON') {
    return address;
  } else {
    return getEthersAddress(address);
  }
};

// With SDK

let sdk: Promise<TacSdk>;
export const getTacSDK = async () => {
  if (!sdk) {
    sdk = TacSdk.create({
      network: Network.MAINNET,
    });
  }
  return sdk;
};

export const getEVMTokenAddress = async (tvmTokenAddress: string) => {
  if (isAddress(tvmTokenAddress)) return tvmTokenAddress;
  const sdk = await getTacSDK();
  return sdk.getEVMTokenAddress(tvmTokenAddress);
};
export const getTVMTokenAddress = async (evmTokenAddress: string) => {
  if (isTONAddress(evmTokenAddress)) return evmTokenAddress;
  const sdk = await getTacSDK();
  return sdk.getTVMTokenAddress(evmTokenAddress);
};

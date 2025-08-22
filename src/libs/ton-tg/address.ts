import config from 'config';
import { getAddress as getEthersAddress, isAddress } from 'ethers';

import { TacSdk, Network } from '@tonappchain/sdk';
import { Address } from '@ton/core';
import { Token } from 'libs/tokens';

export const isTONAddress = (address: string) => {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
};

export const isNetworkAddress = (address: string) => {
  if (config.network.name === 'TON') {
    return isTONAddress(address);
  } else {
    return isAddress(address);
  }
};

export const getNetworkAddress = (address: string) => {
  if (config.network.name === 'TON') {
    return Address.parse(address).toString({ bounceable: true });
  } else {
    return getEthersAddress(address);
  }
};

export const getTokenAddress = (token: Token) => {
  if (config.network.name === 'TON' && 'tonAddress' in token) {
    return token.tonAddress;
  } else {
    return token.address;
  }
};

// With SDK

let sdk: Promise<TacSdk>;
export const getTacSDK = async () => {
  if (!sdk) {
    sdk = TacSdk.create({
      network: Network.TESTNET,
    });
  }
  return sdk;
};

export const getEVMTokenAddress = async (tvmTokenAddress: string) => {
  if (isAddress(tvmTokenAddress)) return tvmTokenAddress;
  const sdk = await getTacSDK();
  const ton = Address.parse(tvmTokenAddress).toString({ bounceable: true });
  return sdk.getEVMTokenAddress(ton);
};
export const getTVMTokenAddress = async (evmTokenAddress: string) => {
  if (isTONAddress(evmTokenAddress)) return evmTokenAddress;
  const sdk = await getTacSDK();
  return sdk.getTVMTokenAddress(evmTokenAddress);
};

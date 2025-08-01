import config from 'config';
import { getAddress as getEthersAddress } from 'ethers';

import { TacSdk, Network } from '@tonappchain/sdk';

export const getAddress = (address: string) => {
  if (config.network.name === 'TON') {
    return address;
  } else {
    return getEthersAddress(address);
  }
};

// With SDK

let sdk: Promise<TacSdk>;
const getSDK = async () => {
  if (!sdk) {
    sdk = TacSdk.create({
      network: Network.TESTNET,
    });
  }
  return sdk;
};

export const getEVMTokenAddress = async (tvmTokenAddress: string) => {
  const sdk = await getSDK();
  return sdk.getEVMTokenAddress(tvmTokenAddress);
};

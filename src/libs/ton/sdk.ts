import { type TacSdk } from '@tonappchain/sdk';
import config from 'config';

// TODO: Use tonApi as reference because we want to test testnet on preview
// Use mode === 'development' instead before merging
const isTestnet = config.tonApi?.includes('testnet');

let sdk: Promise<TacSdk>;
export const getTacSDK = async () => {
  if (!sdk) {
    const { TacSdk, Network } = await import('@tonappchain/sdk');
    const network = isTestnet ? Network.TESTNET : Network.MAINNET;
    sdk = TacSdk.create({ network });
  }
  return sdk;
};

import config from 'config';
import { Token } from 'libs/tokens';
import { getEVMTokenAddress } from './address';
import { isAddress } from 'ethers';

export interface TonToken extends Token {
  tacAddress: string;
}

const tacToTonMap = new Map<string, string>();
const tonToTacMap = new Map<string, string>();

export const isEvmAddress = (value: string): boolean => {
  return isAddress(value);
};

/** Get the TAC address if the network is TON, else return the address as it */
export const getEvmAddress = async (address: string) => {
  if (config.network.name !== 'TON') return address;
  if (isEvmAddress(address)) return address;
  if (!tonToTacMap.has(address)) {
    const evmAddress = await getEVMTokenAddress(address);
    tonToTacMap.set(address, evmAddress);
    tacToTonMap.set(evmAddress, address);
  }
  return tonToTacMap.get(address)!;
};

export const setTonTokenMap = (tokens: TonToken[]) => {
  if (config.network.name !== 'TON') return;
  for (const token of tokens) {
    tacToTonMap.set(token.tacAddress, token.address);
    tonToTacMap.set(token.address, token.tacAddress);
  }
};

/** Check if address is a known TON address */
export const isKnownTonAddress = (address: string) => {
  return tonToTacMap.has(address);
};

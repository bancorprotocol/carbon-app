import config from 'config';
import { Token } from 'libs/tokens';
import { getEVMTokenAddress } from './address';
import { isAddress } from 'ethers';
import { lsService } from 'services/localeStorage';

export interface TonToken extends Token {
  tonAddress: string;
}

// TODO: move this into context if possible
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
    tacToTonMap.set(token.address, token.tonAddress);
    tonToTacMap.set(token.tonAddress, token.address);
  }
};

export const initTonAddresses = (tacToTon: Record<string, string>) => {
  for (const [tac, ton] of Object.entries(tacToTon)) {
    tacToTonMap.set(tac, ton);
    tonToTacMap.set(ton, tac);
  }
};

export const setTonAddress = (tacAddress: string, tonAddress: string) => {
  tacToTonMap.set(tacAddress, tonAddress);
  tonToTacMap.set(tonAddress, tacAddress);
  lsService.setItem(
    'tacToTonAddress',
    Object.fromEntries(tacToTonMap.entries()),
  );
};

/** Check if address is a known TON address */
export const isKnownTonAddress = (address: string) => {
  return tonToTacMap.has(address);
};

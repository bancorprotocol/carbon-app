import config from 'config';
import { Token } from 'libs/tokens';
import { getEVMTokenAddress, getTVMTokenAddress } from './address';
import { isAddress } from 'ethers';
import { lsService } from 'services/localeStorage';
import { useCallback, useEffect, useState } from 'react';

export interface TonToken extends Token {
  tonAddress: string;
}

export const isEvmAddress = (value: string): boolean => isAddress(value);
export const useTonTokenMapping = () => {
  const [tonToTac, setTonToTac] = useState<Record<string, string>>({});
  const [tacToTon, setTacToTon] = useState<Record<string, string>>(
    lsService.getItem('tacToTonAddress') || {},
  );

  useEffect(() => {
    if (Object.values(tacToTon).length) {
      lsService.setItem('tacToTonAddress', tacToTon);
      setTonToTac((current) => {
        const copy = structuredClone(current);
        for (const [tac, ton] of Object.entries(tacToTon)) {
          copy[ton] ||= tac;
        }
        return copy;
      });
    }
  }, [tacToTon]);

  /** Get the TAC address if the network is TON, else return the address as it */
  const getEvmAddress = useCallback(
    async (address: string) => {
      if (config.network.name !== 'TON') return address;
      if (isEvmAddress(address)) return address;
      if (!tonToTac[address]) {
        const evmAddress = await getEVMTokenAddress(address);
        setTacToTon((current) => {
          const copy = structuredClone(current);
          copy[evmAddress] ||= address;
          return copy;
        });
      }
      return tonToTac[address];
    },
    [tonToTac],
  );

  const getTVMAddress = useCallback(
    async (address: string) => {
      if (!tacToTon[address]) {
        const tvmAddress = await getTVMTokenAddress(address);
        setTacToTon((current) => {
          const copy = structuredClone(current);
          copy[address] ||= tvmAddress;
          return copy;
        });
      }
      return tacToTon[address];
    },
    [tacToTon],
  );

  const setTonTokens = useCallback((tokens: TonToken[]) => {
    if (config.network.name !== 'TON') return;
    setTacToTon((current) => {
      const copy = structuredClone(current);
      for (const token of tokens) {
        copy[token.address] ||= token.tonAddress;
      }
      return copy;
    });
  }, []);

  const setTonAddress = useCallback(
    (tacAddress: string, tonAddress: string) => {
      setTacToTon((current) => {
        const copy = structuredClone(current);
        copy[tacAddress] ||= tonAddress;
        return copy;
      });
    },
    [],
  );

  return { getTVMAddress, getEvmAddress, setTonTokens, setTonAddress };
};

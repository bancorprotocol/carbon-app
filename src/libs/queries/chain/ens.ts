import { useQuery } from '@tanstack/react-query';
import { useWeb3 } from 'libs/web3';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';
import { utils } from 'ethers';

export const useGetEnsFromAddress = (address: string) => {
  const { provider } = useWeb3();

  return useQuery(
    QueryKey.ensFromAddress(address),
    async () => {
      if (!provider) {
        throw new Error('useGetEnsFromAddress no provider provided');
      }
      if (utils.isAddress(address.toLowerCase())) {
        // Already checks reverse resolution
        return await provider.lookupAddress(address);
      }
      return '';
    },
    {
      enabled: !!address && !!provider,
      staleTime: ONE_DAY_IN_MS,
    }
  );
};

export const useGetAddressFromEns = (ens: string) => {
  const { provider } = useWeb3();

  return useQuery(
    QueryKey.ensToAddress(ens),
    async () => {
      if (!provider) {
        throw new Error('useGetAddressFromEns no provider provided');
      }
      if (isValidEnsName(ens)) {
        return provider.resolveName(ens);
      }
      return '';
    },
    {
      enabled: !!ens && !!provider,
      staleTime: ONE_DAY_IN_MS,
    }
  );
};

let ensRegex: RegExp;
try {
  // Support emojis
  ensRegex = new RegExp(/[\w\p{RGI_Emoji}]+\.\w+/, 'v');
} catch (err) {
  // If no support, fallback to "any string with at least one dot and no whitespace"
  ensRegex = new RegExp(/^[^ ]*\.[^ ]*$/);
}

export const isValidEnsName = (ens?: string) => !!ens && ensRegex.test(ens);

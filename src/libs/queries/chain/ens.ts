import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';
import { utils } from 'ethers';
import { useEthersProvider } from 'libs/web3/useEthersProvider';

export const useGetEnsFromAddress = (address: string) => {
  const provider = useEthersProvider();

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
  const provider = useEthersProvider();

  return useQuery(
    QueryKey.ensToAddress(ens),
    async () => {
      if (!provider) {
        throw new Error('useGetAddressFromEns no provider provided');
      }
      if (isValidEnsName(ens)) {
        return await provider.resolveName(ens);
      }
      return '';
    },
    {
      enabled: !!ens && !!provider,
      staleTime: ONE_DAY_IN_MS,
    }
  );
};

export const isValidEnsName = (ens: string | undefined) => {
  const ensFormatRegex = /[\w\p{RGI_Emoji}]+\.\w+/v;
  return !!ens && ens.match(ensFormatRegex);
};

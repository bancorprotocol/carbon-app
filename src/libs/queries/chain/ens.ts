import { useQuery } from '@tanstack/react-query';
import { useWagmi } from 'libs/wagmi';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';
import { utils } from 'ethers';
import { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';

export const useGetEnsFromAddress = (address: string) => {
  const { provider } = useWagmi();

  return useQuery({
    queryKey: QueryKey.ensFromAddress(address),
    queryFn: async () => {
      if (!provider) {
        throw new Error('useGetEnsFromAddress no provider provided');
      }
      if (utils.isAddress(address.toLowerCase())) {
        const ensAddr = (await provider.getNetwork()).ensAddress;
        if (ensAddr) {
          // Already checks reverse resolution
          return await provider.lookupAddress(address);
        }
      }
      return '';
    },
    enabled: !!provider,
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useGetAddressFromEns = (ens: string) => {
  const { provider } = useWagmi();

  return useQuery({
    queryKey: QueryKey.ensToAddress(ens),
    queryFn: async () => {
      if (!provider) {
        throw new Error('useGetAddressFromEns no provider provided');
      }
      if (isValidEnsName(ens)) {
        return provider.resolveName(ens);
      }
      return '';
    },
    enabled: !!provider,
    staleTime: ONE_DAY_IN_MS,
  });
};

let ensRegex: RegExp;
try {
  // Support emojis
  ensRegex = new RegExp(/[\w\p{RGI_Emoji}]+\.\w+/v, 'v');
} catch {
  // If no support, fallback to "any string with at least one dot and no whitespace"
  ensRegex = new RegExp(/^[^ ]*\.[^ ]*$/);
}

export const isValidEnsName = (ens?: string) => !!ens && ensRegex.test(ens);

export const getEnsAddressIfAny = async (
  provider: Web3Provider | StaticJsonRpcProvider | undefined,
  value: string,
): Promise<string> => {
  if (!provider) return value;
  try {
    if (isValidEnsName(value)) {
      const address = await provider?.resolveName(value);
      return address || value;
    }
  } catch (err) {
    console.error(err);
    return value; // return initial value if provider doesn't support ens
  }
  return value;
};

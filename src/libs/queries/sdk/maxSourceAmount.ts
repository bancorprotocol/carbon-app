import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { getSDK } from 'libs/sdk';

export const useGetMaxSourceAmountByPair = (base?: string, quote?: string) => {
  return useQuery({
    queryKey: QueryKey.tradeMaxSourceAmount([base!, quote!]),
    queryFn: async () => {
      const sdk = await getSDK();
      return sdk.getMaxSourceAmountByPair(base!, quote!);
    },
    enabled: !!base && !!quote,
    staleTime: ONE_DAY_IN_MS,
  });
};

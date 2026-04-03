import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { openocean } from 'services/openocean';
import { useTokens } from 'hooks/useTokens';
import config from 'config';
import { getSDK } from 'libs/sdk';

export const useGetTradeLiquidity = (base?: string, quote?: string) => {
  const { getTokenById } = useTokens();

  return useQuery({
    queryKey: QueryKey.tradeLiquidity([base!, quote!]),
    queryFn: async () => {
      if (config.ui.useOpenocean) {
        const baseToken = getTokenById(base);
        if (!baseToken) return '';
        const gasPrice = await openocean.gasPrice();
        // Try to trade one token. Since liquidity is only checking if > 0 it should be fine.
        const res = await openocean.quote({
          amountDecimals: (10 ** baseToken.decimals).toString(),
          inTokenAddress: base!,
          outTokenAddress: quote!,
          gasPriceDecimals: gasPrice.toString(),
        });
        return res.outAmount;
      } else {
        const sdk = await getSDK();
        return sdk.getLiquidityByPair(base!, quote!);
      }
    },
    enabled: !!base && !!quote,
    staleTime: ONE_DAY_IN_MS,
  });
};

import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useCarbonInit } from 'libs/sdk/context';
import { carbonSDK } from 'libs/sdk';
import { openocean } from 'services/openocean';
import { useTokens } from 'hooks/useTokens';
import { parseUnits } from 'ethers';
import config from 'config';

export const useGetTradeLiquidity = (base?: string, quote?: string) => {
  const dexQuery = useDexAggregatorTrade(base, quote);
  const sdkQuery = useSDKTrade(base, quote);
  return config.ui.useDexAggregator ? dexQuery : sdkQuery;
};

const useDexAggregatorTrade = (base?: string, quote?: string) => {
  const { getTokenById } = useTokens();
  return useQuery({
    queryKey: QueryKey.tradeDexAggregatorLiquidity([base!, quote!]),
    queryFn: async () => {
      const baseToken = getTokenById(base);
      if (!baseToken) return '';
      // Try to trade one token. Since liquidity is only checking if > 0 it should be fine.
      const res = await openocean.quote({
        chainId: config.network.chainId,
        amount: parseUnits('1', baseToken.decimals).toString(),
        sourceToken: base!,
        targetToken: quote!,
        slippage: 100,
        tradeBySource: true,
      });
      if (!res.tradeFound) return '';
      return res.targetAmount;
    },
    enabled: !!base && !!quote && config.ui.useDexAggregator,
    staleTime: ONE_DAY_IN_MS,
    refetchOnWindowFocus: false,
  });
};

const useSDKTrade = (base?: string, quote?: string) => {
  const { isInitialized } = useCarbonInit();
  return useQuery({
    queryKey: QueryKey.tradeSDKLiquidity([base!, quote!]),
    queryFn: () => carbonSDK.getLiquidityByPair(base!, quote!),
    enabled: !!base && !!quote && isInitialized && !config.ui.useDexAggregator,
    staleTime: ONE_DAY_IN_MS,
    refetchOnWindowFocus: false,
  });
};

import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { carbonSDK } from 'libs/sdk';
import BigNumber from 'bignumber.js';
import { TWO_SECONDS_IN_MS } from 'utils/time';
import { useCarbonSDK } from 'hooks/useCarbonSDK';

type Props = {
  sourceToken: string;
  targetToken: string;
  input: string;
  isTradeBySource: boolean;
  enabled?: boolean;
};

export const useGetTradeData = ({
  isTradeBySource,
  input,
  sourceToken,
  targetToken,
  enabled,
}: Props) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery(
    QueryKey.tradeData(sourceToken, targetToken, isTradeBySource, input),
    async () => {
      const hasInvalidInput =
        input === '' || isNaN(Number(input)) || new BigNumber(input).isZero();

      if (hasInvalidInput) {
        return {
          totalSourceAmount: '',
          totalTargetAmount: '',
          tradeActions: [],
          effectiveRate: '',
        };
      }

      const data = await carbonSDK.getTradeData(
        sourceToken,
        targetToken,
        input,
        !isTradeBySource
      );
      console.log('get trade data result: ', data);

      return data;
    },
    {
      enabled: !!enabled && isInitialized && input !== '...',
      cacheTime: 0,
      retry: 1,
      refetchInterval: TWO_SECONDS_IN_MS,
    }
  );
};

import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { sdk, useCarbonSDK } from 'libs/sdk';
import BigNumber from 'bignumber.js';

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
          totalInput: '',
          totalOutput: '',
          tradeActions: [],
          effectiveRate: '',
        };
      }

      const data = await sdk.getTradeData(
        sourceToken,
        targetToken,
        input,
        !isTradeBySource
      );
      console.log('get trade data result: ', data);

      return {
        ...data,
        totalInput: data.totalInput,
        totalOutput: data.totalOutput,
      };
    },
    {
      enabled: !!enabled && isInitialized,
      cacheTime: 0,
      retry: 1,
      staleTime: 0,
    }
  );
};

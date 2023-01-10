import { useQuery } from '@tanstack/react-query';
import { wait } from 'utils/helpers';
import { QueryKey } from 'libs/queries';
import { useCarbonSDK } from 'libs/sdk';

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
      if (input === '' || input === '0') {
        return { input: '', output: '' };
      }
      await wait(1000);
      if (isTradeBySource) {
        // const data = sdk.trade(
        //   sourceToken,
        //   targetToken,
        //   BigNumber.from(input),
        //   !isTradeBySource,
        //   () => false
        // );
        return {
          input: (Number(input) * 0.99).toString(),
          output: (Number(input) * 2).toString(),
        };
      } else {
        return {
          input: (Number(input) / 0.99).toString(),
          output: (Number(input) / 2).toString(),
        };
      }
    },
    { enabled, cacheTime: 0, retry: 1, staleTime: 0 }
  );
};

import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { sdk, useCarbonSDK } from 'libs/sdk';
import { BigNumber } from 'ethers';
import { useTokens } from 'libs/tokens';
import { expandToken } from 'utils/tokens';

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
  const { tokens, getTokenById } = useTokens();

  return useQuery(
    QueryKey.tradeData(sourceToken, targetToken, isTradeBySource, input),
    async () => {
      if (input === '' || input === '0') {
        return { totalInput: '', totalOutput: '', tradeActions: [] };
      }
      const srcTKN = getTokenById(sourceToken);
      return await sdk.trade(
        sourceToken,
        targetToken,
        // TODO who handles the decimal places?
        BigNumber.from(expandToken(input, srcTKN?.decimals || 18)),
        !isTradeBySource
      );
    },
    {
      enabled: !!enabled && !!tokens.length && isInitialized,
      cacheTime: 0,
      retry: 1,
      staleTime: 0,
    }
  );
};

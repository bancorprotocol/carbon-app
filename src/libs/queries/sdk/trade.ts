import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { Action, TradeActionBNStr } from 'libs/sdk';
import { MatchActionBNStr } from '@bancor/carbon-sdk';
import { carbonSDK } from 'libs/sdk';

type GetTradeDataResult = {
  tradeActions: TradeActionBNStr[];
  actionsTokenRes: Action[];
  totalSourceAmount: string;
  totalTargetAmount: string;
  effectiveRate: string;
  actionsWei: MatchActionBNStr[];
};

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
  const { isInitialized } = useCarbonInit();

  return useQuery<GetTradeDataResult>(
    QueryKey.tradeData([sourceToken, targetToken], isTradeBySource, input),
    async () => {
      const hasInvalidInput =
        new SafeDecimal(input).isNaN() || new SafeDecimal(input).isZero();

      if (hasInvalidInput) {
        return {
          totalSourceAmount: '',
          totalTargetAmount: '',
          tradeActions: [],
          actionsTokenRes: [],
          effectiveRate: '',
          actionsWei: [],
        };
      }

      return carbonSDK.getTradeData(
        sourceToken,
        targetToken,
        input,
        !isTradeBySource
      );
    },
    {
      enabled: !!enabled && isInitialized && input !== '...',
      cacheTime: 0,
      retry: 1,
    }
  );
};

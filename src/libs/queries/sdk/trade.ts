import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { Action, TradeActionBNStr } from 'libs/sdk';
import { MatchActionBNStr, PopulatedTransaction } from '@bancor/carbon-sdk';
import { carbonSDK } from 'libs/sdk';
import { useWagmi } from 'libs/wagmi';

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

export interface TradeParams {
  sourceAddress: string;
  targetAddress: string;
  tradeActions: TradeActionBNStr[];
  isTradeBySource: boolean;
  sourceInput: string;
  targetInput: string;
  deadline: string;
  calcDeadline: (value: string) => string;
  calcMaxInput: (amount: string) => string;
  calcMinReturn: (amount: string) => string;
}

export const useTradeQuery = () => {
  const { signer } = useWagmi();

  return useMutation({
    mutationFn: async ({
      isTradeBySource,
      sourceAddress,
      targetAddress,
      tradeActions,
      deadline,
      sourceInput,
      targetInput,
      calcDeadline,
      calcMinReturn,
      calcMaxInput,
    }: TradeParams) => {
      let unsignedTx: PopulatedTransaction;
      if (isTradeBySource) {
        unsignedTx = await carbonSDK.composeTradeBySourceTransaction(
          sourceAddress,
          targetAddress,
          tradeActions,
          calcDeadline(deadline),
          calcMinReturn(targetInput)
        );
      } else {
        unsignedTx = await carbonSDK.composeTradeByTargetTransaction(
          sourceAddress,
          targetAddress,
          tradeActions,
          calcDeadline(deadline),
          calcMaxInput(sourceInput)
        );
      }
      return await signer!.sendTransaction(unsignedTx);
    },
  });
};

export const useGetTradeData = ({
  isTradeBySource,
  input,
  sourceToken,
  targetToken,
  enabled,
}: Props) => {
  const { isInitialized } = useCarbonInit();

  return useQuery<GetTradeDataResult>({
    queryKey: QueryKey.tradeData(
      [sourceToken, targetToken],
      isTradeBySource,
      input
    ),

    queryFn: async () => {
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
    enabled: !!enabled && isInitialized && input !== '...',
    gcTime: 0,
    retry: 1,
  });
};

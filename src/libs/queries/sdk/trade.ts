import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { useCarbonInit } from 'libs/sdk/context';
import { Action, TradeActionBNStr } from 'libs/sdk';
import { MatchActionBNStr, PopulatedTransaction } from '@bancor/carbon-sdk';
import { carbonSDK } from 'libs/sdk';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';
import config from 'config';

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
  const { sendTransaction } = useWagmi();
  const { getTokenById } = useTokens();

  return useMutation({
    mutationFn: async (params: TradeParams) => {
      const { calcDeadline, calcMinReturn, calcMaxInput } = params;

      let unsignedTx: PopulatedTransaction;
      let baseAmount: string;
      if (params.isTradeBySource) {
        unsignedTx = await carbonSDK.composeTradeBySourceTransaction(
          params.sourceAddress,
          params.targetAddress,
          params.tradeActions,
          calcDeadline(params.deadline),
          calcMinReturn(params.targetInput),
        );
        baseAmount = params.sourceInput;
      } else {
        unsignedTx = await carbonSDK.composeTradeByTargetTransaction(
          params.sourceAddress,
          params.targetAddress,
          params.tradeActions,
          calcDeadline(params.deadline),
          calcMaxInput(params.sourceInput),
        );
        baseAmount = calcMaxInput(params.sourceInput);
      }
      const source = getTokenById(params.sourceAddress);
      const powerDecimal = new SafeDecimal(10).pow(source!.decimals);
      const amount = new SafeDecimal(baseAmount).mul(powerDecimal).toFixed(0);
      unsignedTx.customData = {
        spender: config.addresses.carbon.carbonController,
        assets: [
          {
            address: params.sourceAddress,
            rawAmount: amount,
          },
        ],
      };
      return sendTransaction(unsignedTx);
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
      input,
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
        !isTradeBySource,
      );
    },
    enabled: !!enabled && isInitialized && input !== '...',
    gcTime: 0,
    retry: 1,
  });
};

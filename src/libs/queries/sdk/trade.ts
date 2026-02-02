import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { useCarbonInit } from 'libs/sdk/context';
import { Action, TradeActionBNStr } from 'libs/sdk';
import { MatchActionBNStr, PopulatedTransaction } from '@bancor/carbon-sdk';
import { carbonSDK } from 'libs/sdk';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';
import { dexAggregator, QuoteMetadata } from 'services/dex-aggregator';
import { useStore } from 'store';
import { Token } from 'libs/tokens';
import { formatUnits, parseUnits } from 'ethers';
import { useModal } from 'hooks/useModal';
import { useGetApproval } from 'hooks/useApproval';
import config from 'config';

interface GetTradeDataResult {
  tradeActions: TradeActionBNStr[];
  actionsTokenRes: Action[];
  totalSourceAmount: string;
  totalTargetAmount: string;
  effectiveRate: string;
  actionsWei: MatchActionBNStr[];
  path?: QuoteMetadata[];
  quoteId?: string;
}

type Props = {
  sourceToken: Token;
  targetToken: Token;
  input: string;
  isTradeBySource: boolean;
  enabled: boolean;
};

export interface TradeParams {
  quoteId?: string;
  source: Token;
  target: Token;
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
  const { sendTransaction, user } = useWagmi();
  const { getTokenById } = useTokens();
  const { openModal } = useModal();
  const getApproval = useGetApproval();
  const {
    trade: { settings },
  } = useStore();
  return useMutation({
    mutationFn: async (params: TradeParams) => {
      const { calcDeadline, calcMinReturn, calcMaxInput } = params;

      if (config.ui.useDexAggregator) {
        if (!user) throw new Error('User not connected');
        if (!params.quoteId) throw new Error('No quoteId provided');
        const amountDecimals = toDecimal(params.sourceInput, params.source);
        const customData = {
          showApproval: true,
          spender: config.addresses.carbon.aggregator!,
          assets: [
            {
              address: params.source.address,
              rawAmount: amountDecimals,
            },
          ],
        };
        // If config supports EIP7702 we want to force approval
        // the backend requires approval to happen before
        if (config.ui.useEIP7702) {
          const { approvalTokens } = await getApproval(user, [customData]);
          if (approvalTokens.length) {
            await new Promise<void>((res) => {
              openModal('txConfirm', {
                approvalTokens,
                onConfirm: () => res(),
              });
            });
            // prevent showing approval modal multiple time
            customData.showApproval = false;
          }
        }
        const amount = params.isTradeBySource
          ? toDecimal(params.sourceInput, params.source)
          : toDecimal(params.targetInput, params.target);
        const result = await dexAggregator.swap({
          chainId: config.network.chainId,
          recipient: user,
          sourceToken: params.source.address,
          targetToken: params.target.address,
          tradeBySource: params.isTradeBySource,
          amount: amount,
          slippage: new SafeDecimal(settings.slippage).mul(100).toNumber(),
          quoteId: params.quoteId,
        });
        if (!result.validated) throw new Error('Swap failed');
        const unsignedTx = result.tx;
        console.log(result.tx);
        unsignedTx.customData = customData;
        return sendTransaction(unsignedTx);
      } else {
        let unsignedTx: PopulatedTransaction;
        let baseAmount: string;
        if (params.isTradeBySource) {
          unsignedTx = await carbonSDK.composeTradeBySourceTransaction(
            params.source.address,
            params.target.address,
            params.tradeActions,
            calcDeadline(params.deadline),
            calcMinReturn(params.targetInput),
          );
          baseAmount = params.sourceInput;
        } else {
          unsignedTx = await carbonSDK.composeTradeByTargetTransaction(
            params.source.address,
            params.target.address,
            params.tradeActions,
            calcDeadline(params.deadline),
            calcMaxInput(params.sourceInput),
          );
          baseAmount = calcMaxInput(params.sourceInput);
        }
        const source = getTokenById(params.source.address);
        const powerDecimal = new SafeDecimal(10).pow(source!.decimals);
        const amount = new SafeDecimal(baseAmount).mul(powerDecimal).toFixed(0);
        unsignedTx.customData = {
          spender: config.addresses.carbon.carbonController,
          assets: [
            {
              address: params.source.address,
              rawAmount: amount,
            },
          ],
        };
        return sendTransaction(unsignedTx);
      }
    },
  });
};

const fromDecimal = (amount: string, token: Token) => {
  return formatUnits(amount, token.decimals);
};
const toDecimal = (amount: string, token: Token) => {
  return parseUnits(amount, token.decimals).toString();
};

export const useGetTradeData = (props: Props) => {
  const dexValue = useDexAggregatorData({
    ...props,
    enabled: props.enabled && !!config.ui.useDexAggregator,
  });
  const sdkValue = useDexAggregatorData({
    ...props,
    enabled: props.enabled && !config.ui.useDexAggregator,
  });
  return config.ui.useDexAggregator ? dexValue : sdkValue;
};

export const useDexAggregatorData = ({
  isTradeBySource,
  input,
  sourceToken,
  targetToken,
  enabled,
}: Props) => {
  const { trade } = useStore();

  return useQuery<GetTradeDataResult>({
    queryKey: QueryKey.dexAggregatorTradeData(
      [sourceToken.address, targetToken.address],
      isTradeBySource,
      input,
      trade.settings.slippage,
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

      const inputToken = isTradeBySource ? sourceToken : targetToken;
      const res = await dexAggregator.quote({
        chainId: config.network.chainId,
        sourceToken: sourceToken.address,
        targetToken: targetToken.address,
        amount: parseUnits(input, inputToken.decimals).toString(),
        tradeBySource: isTradeBySource,
        slippage: new SafeDecimal(trade.settings.slippage).mul(100).toNumber(),
      });
      // TODO: manage
      if (!res.tradeFound) throw new Error('Trade not found');
      const totalSourceAmount = fromDecimal(res.sourceAmount, sourceToken);
      const totalTargetAmount = fromDecimal(res.targetAmount, targetToken);
      const rate = new SafeDecimal(totalTargetAmount).div(totalSourceAmount);
      return {
        totalSourceAmount,
        totalTargetAmount,
        tradeActions: [],
        actionsTokenRes: [],
        effectiveRate: rate.toString(),
        actionsWei: [],
        path: res.metadata,
        quoteId: res.id,
      };
    },
    enabled: !!enabled,
    gcTime: 0,
    retry: 1,
  });
};

export const useSDKTradeData = ({
  isTradeBySource,
  input,
  sourceToken,
  targetToken,
  enabled,
}: Props) => {
  const { isInitialized } = useCarbonInit();

  return useQuery<GetTradeDataResult>({
    queryKey: QueryKey.sdkTradeData(
      [sourceToken.address, targetToken.address],
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
        sourceToken.address,
        targetToken.address,
        input,
        !isTradeBySource,
      );
    },
    enabled: !!enabled && isInitialized,
    gcTime: 0,
    retry: 1,
  });
};

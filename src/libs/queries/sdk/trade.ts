import { QueryKey, useGetAllStrategies } from 'libs/queries';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { SafeDecimal } from 'libs/safedecimal';
import { Action, carbonSDK, TradeActionBNStr } from 'libs/sdk';
import { MatchActionBNStr, PopulatedTransaction } from '@bancor/carbon-sdk';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';
import { dexAggregator, QuoteMetadata } from 'services/dex-aggregator';
import { useStore } from 'store';
import { Token } from 'libs/tokens';
import { formatUnits, parseUnits } from 'ethers';
import { useModal } from 'hooks/useModal';
import { useGetApprovalTokens } from 'hooks/useApproval';
import { useBatchTransaction } from 'libs/wagmi/batch-transaction';
import config from 'config';
import { useCarbonController } from 'hooks/useContract';

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
  // enabled: boolean;
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
  const { trade } = useStore();
  const { canBatchTransactions } = useBatchTransaction();
  const getApproval = useGetApprovalTokens();

  return useMutation({
    mutationFn: async (params: TradeParams) => {
      const { calcDeadline, calcMinReturn, calcMaxInput } = params;

      if (config.ui.useDexAggregator) {
        if (!user) throw new Error('User not connected');
        if (!params.quoteId) throw new Error('No quoteId provided');
        const amountDecimals = toDecimal(params.sourceInput, params.source);
        const customData = {
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
        const canBatch = await canBatchTransactions(user);
        if (canBatch) {
          const approvalTokens = await getApproval(user, [customData]);
          if (approvalTokens.length) {
            await new Promise<void>((res, rej) => {
              openModal('txConfirm', {
                approvalTokens,
                onConfirm: () => res(),
                onClose: () => rej(),
              });
            });
          }
        }
        const slippage = trade.settings.slippage;
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
          slippage: new SafeDecimal(slippage).mul(100).toNumber(),
          quoteId: params.quoteId,
        });
        if (!result.validated) throw new Error('Swap failed');
        const unsignedTx = result.tx;
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
        const source = getTokenById(params.source.address)!;
        unsignedTx.customData = {
          spender: config.addresses.carbon.carbonController,
          assets: [
            {
              address: params.source.address,
              rawAmount: toDecimal(baseAmount, source),
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
  const dexValue = useDexAggregatorData(props);
  const sdkValue = useSDKTradeData(props);
  return config.ui.useDexAggregator ? dexValue : sdkValue;
};

export const useDexAggregatorData = ({
  isTradeBySource,
  input,
  sourceToken,
  targetToken,
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
    placeholderData: keepPreviousData,
    enabled: !!config.ui.useDexAggregator,
    gcTime: 0,
    retry: 1,
  });
};

export const useSDKTradeData = ({
  isTradeBySource,
  input,
  sourceToken,
  targetToken,
}: Props) => {
  const { data: strategies } = useGetAllStrategies({
    enabled: !config.ui.useDexAggregator,
  });
  const { data: controller } = useCarbonController();

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
      const tradingFeePPM = await controller!.read.pairTradingFeePPM(
        sourceToken.address,
        targetToken.address,
      );
      return carbonSDK.getTradeData({
        amount: input,
        strategies: strategies!.map((s) => s.encoded).filter((e) => !!e),
        tradeByTargetAmount: !isTradeBySource,
        sourceToken: sourceToken.address,
        sourceDecimals: sourceToken.decimals,
        targetToken: targetToken.address,
        targetDecimals: targetToken.decimals,
        tradingFeePPM: Number(tradingFeePPM),
      });
    },
    enabled: !!strategies && !!controller && !config.ui.useDexAggregator,
    gcTime: 0,
    retry: 1,
  });
};

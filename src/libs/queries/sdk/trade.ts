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
import { openocean, OpenOceanSwapPath } from 'utils/openocean';
import { useStore } from 'store';
import { Token } from 'libs/tokens';
import { BigNumber } from '@bancor/carbon-sdk/utils';

interface GetTradeDataResult {
  tradeActions: TradeActionBNStr[];
  actionsTokenRes: Action[];
  totalSourceAmount: string;
  totalTargetAmount: string;
  effectiveRate: string;
  actionsWei: MatchActionBNStr[];
  path?: OpenOceanSwapPath;
}

type Props = {
  sourceToken: Token;
  targetToken: Token;
  input: string;
  isTradeBySource: boolean;
  enabled?: boolean;
};

export interface TradeParams {
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
  const { sendTransaction } = useWagmi();
  const { getTokenById } = useTokens();
  const {
    trade: { settings },
  } = useStore();
  return useMutation({
    mutationFn: async (params: TradeParams) => {
      const { calcDeadline, calcMinReturn, calcMaxInput, isTradeBySource } =
        params;

      if (config.ui.useOpenocean) {
        const inToken = isTradeBySource ? params.source : params.target;
        const outToken = isTradeBySource ? params.target : params.source;
        const amount = isTradeBySource
          ? params.sourceInput
          : params.targetInput;
        const gasPriceDecimals = await openocean.gasPrice();
        const tx = await openocean.swap({
          inTokenAddress: inToken.address,
          outTokenAddress: outToken.address,
          amountDecimals: toDecimal(amount, inToken),
          gasPriceDecimals: gasPriceDecimals.toString(),
          slippage: Number(settings.slippage),
        });
        const { value, gasPrice, to, estimatedGas } = tx;
        return sendTransaction({
          to,
          gasPrice: BigNumber.from(gasPrice),
          value: BigNumber.from(value),
          gasLimit: BigNumber.from(estimatedGas),
        });
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
        const assets = [
          {
            address: params.source.address,
            rawAmount: amount,
          },
        ];
        unsignedTx.customData = { assets };
        return sendTransaction(unsignedTx);
      }
    },
  });
};

const fromDecimal = (amount: string, token: Token) => {
  const decimals = new SafeDecimal(10).pow(token.decimals);
  const inDecimals = new SafeDecimal(amount).div(decimals);
  return inDecimals.toString();
};
const toDecimal = (amount: string, token: Token) => {
  const decimals = new SafeDecimal(10).pow(token.decimals);
  const inDecimals = new SafeDecimal(amount).mul(decimals);
  return inDecimals.toString();
};

export const useGetTradeData = ({
  isTradeBySource,
  input,
  sourceToken,
  targetToken,
  enabled,
}: Props) => {
  const { isInitialized } = useCarbonInit();
  const { trade } = useStore();

  return useQuery<GetTradeDataResult>({
    queryKey: QueryKey.tradeData(
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

      if (config.ui.useOpenocean) {
        const inToken = isTradeBySource ? sourceToken : targetToken;
        const outToken = isTradeBySource ? targetToken : sourceToken;
        const gasPriceDecimals = await openocean.gasPrice();
        const params = {
          amountDecimals: toDecimal(input, inToken),
          inTokenAddress: inToken.address,
          outTokenAddress: outToken.address,
          slippage: Number(trade.settings.slippage),
          gasPriceDecimals: gasPriceDecimals.toString(),
        };
        const res = isTradeBySource
          ? await openocean.quote(params)
          : await openocean.reverseQuote(params);
        const sourceAmount = isTradeBySource ? res.inAmount : res.outAmount;
        const targetAmount = isTradeBySource ? res.outAmount : res.inAmount;
        return {
          totalSourceAmount: fromDecimal(sourceAmount, sourceToken),
          totalTargetAmount: fromDecimal(targetAmount, targetToken),
          tradeActions: [],
          actionsTokenRes: [],
          effectiveRate: '',
          actionsWei: [],
          path: res.path,
        };
      } else {
        return carbonSDK.getTradeData(
          sourceToken.address,
          targetToken.address,
          input,
          !isTradeBySource,
        );
      }
    },
    enabled: !!enabled && isInitialized && input !== '...',
    gcTime: 0,
    retry: 1,
  });
};

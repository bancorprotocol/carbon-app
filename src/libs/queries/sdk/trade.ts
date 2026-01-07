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
import { TransactionRequest } from 'ethers';

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
  const { sendTransaction, user } = useWagmi();
  const { getTokenById } = useTokens();
  const {
    trade: { settings },
  } = useStore();
  const { signer } = useWagmi();
  return useMutation({
    mutationFn: async (params: TradeParams) => {
      const { calcDeadline, calcMinReturn, calcMaxInput } = params;

      if (config.ui.useOpenocean) {
        const gasPrice = await openocean.gasPrice();
        const tx = await openocean.swap({
          account: user,
          inTokenAddress: params.source.address,
          outTokenAddress: params.target.address,
          amountDecimals: toDecimal(params.sourceInput, params.source),
          gasPriceDecimals: gasPrice.toString(),
          slippage: Number(settings.slippage),
          // Overriden in the backend on production
          referrer: config.addresses.carbon.vault,
          referrerFee: '0.25',
        });
        const unsignedTx: TransactionRequest = {
          from: tx.from,
          to: tx.to,
          value: BigInt(tx.value),
          data: tx.data,
        };
        const estimateGas = await signer?.estimateGas(unsignedTx);
        if (estimateGas) {
          const limit = new SafeDecimal(estimateGas?.toString())
            .mul(1.1)
            .round()
            .toString();
          unsignedTx.gasLimit = BigInt(limit);
        }
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
        const gasPrice = await openocean.gasPrice();
        const params = {
          amountDecimals: toDecimal(input, inToken),
          inTokenAddress: inToken.address,
          outTokenAddress: outToken.address,
          slippage: Number(trade.settings.slippage),
          gasPriceDecimals: gasPrice.toString(),
        };
        const res = isTradeBySource
          ? await openocean.quote(params)
          : await openocean.reverseQuote(params);
        const sourceAmount = isTradeBySource ? res.inAmount : res.outAmount;
        const targetAmount = isTradeBySource ? res.outAmount : res.inAmount;
        const totalSourceAmount = fromDecimal(sourceAmount, sourceToken);
        const totalTargetAmount = fromDecimal(targetAmount, targetToken);
        const rate = new SafeDecimal(totalTargetAmount).div(totalSourceAmount);
        return {
          totalSourceAmount,
          totalTargetAmount,
          tradeActions: [],
          actionsTokenRes: [],
          effectiveRate: rate.toString(),
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
    enabled: !!enabled && isInitialized,
    gcTime: 0,
    retry: 1,
  });
};

import { CartList } from 'components/cart/CartList';
import { EmptyCart } from 'components/cart/EmptyCart';
import { clearCart, useStrategyCart } from 'components/cart/utils';
import { Button } from 'components/common/button';
import { useWagmi } from 'libs/wagmi';
import { FormEvent, useMemo, useState } from 'react';
import { ApprovalToken } from 'hooks/useApproval';
import { QueryKey, useGetTokenBalances, useQueryClient } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { carbonSDK } from 'libs/sdk';
import { useNavigate } from '@tanstack/react-router';
import { useNotifications } from 'hooks/useNotifications';
import { AnyCartStrategy } from 'components/strategies/common/types';
import { isGradientStrategy } from 'components/strategies/common/utils';
import { useRestrictedCountry } from 'hooks/useRestrictedCountry';
import { useBatchTransaction } from 'libs/wagmi/batch-transaction';
import { TransactionRequest, parseUnits } from 'ethers';
import config from 'config';
import { createGradientStrategyParams } from 'components/strategies/common/gradient/utils.sdk';
import {
  BatchCreateBuySellStrategy,
  BatchCreateGradientStrategy,
} from '@bancor/carbon-sdk/strategy-management';

const batcher = config.addresses.carbon.batcher;
const router = config.addresses.carbon.router;
const getApproveTokens = (strategies: AnyCartStrategy[]) => {
  if (!batcher) throw new Error('Batcher address not provided');
  const tokens: Record<string, Token> = {};
  const amount: Record<string, SafeDecimal> = {};
  for (const strategy of strategies) {
    const base = strategy.base.address;
    const quote = strategy.quote.address;
    tokens[base] ||= strategy.base;
    amount[base] ||= new SafeDecimal(0);
    amount[base] = amount[base].add(strategy.sell.budget);
    tokens[quote] ||= strategy.quote;
    amount[quote] ||= new SafeDecimal(0);
    amount[quote] = amount[quote].add(strategy.buy.budget);
  }
  return Object.values(tokens)
    .map((token) => ({
      ...token,
      spender: batcher,
      amount: amount[token.address].toString(),
    }))
    .filter((token) => new SafeDecimal(token.amount).gt(0));
};

const useHasInsufficientFunds = (approvalTokens: ApprovalToken[]) => {
  const tokens = approvalTokens.map((t) => ({
    address: t.address,
    decimals: t.decimals,
  }));
  const balances = useGetTokenBalances(tokens);
  const isPending = balances.some((query) => query.isPending);
  const isInsufficient = balances.some((query, i) => {
    if (!query.data) return false;
    return new SafeDecimal(query.data).lt(approvalTokens[i].amount);
  });
  return { isPending, isInsufficient };
};

export const CartPage = () => {
  const strategies = useStrategyCart();
  const { user, sendTransaction } = useWagmi();
  const { dispatchNotification } = useNotifications();
  const { checkRestriction } = useRestrictedCountry();
  const { canBatchTransactions } = useBatchTransaction();
  const cache = useQueryClient();

  const nav = useNavigate({ from: '/cart' });
  const [confirmation, setConfirmation] = useState(false);
  const [processing, setProcessing] = useState(false);

  const approvalTokens = useMemo(() => {
    return getApproveTokens(strategies);
  }, [strategies]);

  const funds = useHasInsufficientFunds(approvalTokens);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.querySelector('.error-message')) return;
    const warnings = form.querySelector('.warning-message');
    if (warnings) {
      const approve = form.querySelector<HTMLInputElement>('#approve-warnings');
      if (approve && !approve.checked) return;
    }

    const checked = await checkRestriction();
    if (!checked) return;

    const create = async () => {
      setConfirmation(true);
      try {
        if (!user) throw new Error('User not found');
        const canBatch = await canBatchTransactions(user);
        const getRawAmount = (token: Token, amount: string) => {
          return parseUnits(amount, token.decimals).toString();
        };
        const totalAssets = () => {
          const amounts: Record<string, bigint> = {};
          for (const strategy of strategies) {
            const { base, quote, buy, sell } = strategy;
            const baseToken = strategy.base.address;
            const quoteToken = strategy.quote.address;

            amounts[baseToken] ||= BigInt(0);
            const sellAmount = parseUnits(sell.budget, base.decimals);
            amounts[baseToken] = amounts[baseToken] + sellAmount;

            amounts[quoteToken] ||= BigInt(0);
            const buyAmount = parseUnits(buy.budget, quote.decimals);
            amounts[quoteToken] = amounts[quoteToken] + buyAmount;
          }
          return Object.entries(amounts).map(([address, amount]) => ({
            address,
            rawAmount: amount.toString(),
          }));
        };
        const tokens = new Set<string>();
        const txs: TransactionRequest[] = [];
        if (canBatch) {
          for (const strategy of strategies) {
            const { base, quote } = strategy;
            const assets = [
              {
                address: base.address,
                rawAmount: getRawAmount(base, strategy.sell.budget),
              },
              {
                address: quote.address,
                rawAmount: getRawAmount(quote, strategy.buy.budget),
              },
            ];
            if (isGradientStrategy(strategy)) {
              const params = createGradientStrategyParams(strategy);
              const unsignedTx = await carbonSDK.createGradientStrategy(
                ...params,
              );
              unsignedTx.customData = {
                spender: config.addresses.carbon.carbonController,
                assets: assets,
              };
              txs.push(unsignedTx);
            } else {
              const { base, quote, buy, sell } = strategy;
              const unsignedTx = await carbonSDK.createBuySellStrategy(
                base.address,
                quote.address,
                buy.min,
                buy.marginalPrice || buy.max,
                buy.max,
                buy.budget,
                sell.min,
                sell.marginalPrice || sell.min,
                sell.max,
                sell.budget,
              );
              unsignedTx.customData = {
                spender: config.addresses.carbon.carbonController,
                assets: assets,
              };
              txs.push(unsignedTx);
            }
            tokens.add(base.address);
            tokens.add(quote.address);
          }
        } else if (router) {
          const regular: BatchCreateBuySellStrategy[] = [];
          const gradient: BatchCreateGradientStrategy[] = [];
          for (const strategy of strategies) {
            if (isGradientStrategy(strategy)) {
              const params = createGradientStrategyParams(strategy);
              gradient.push({
                baseToken: params[0],
                quoteToken: params[1],
                buyInitialPrice: params[2],
                buyFinalPrice: params[3],
                buyBudget: params[4],
                buyTradingStartTime: params[5],
                buyTradingEndTime: params[6],
                buyGradientType: params[7],
                sellInitialPrice: params[8],
                sellFinalPrice: params[9],
                sellBudget: params[10],
                sellTradingStartTime: params[11],
                sellTradingEndTime: params[12],
                sellGradientType: params[13],
              });
            } else {
              const { base, quote, buy, sell } = strategy;
              regular.push({
                baseToken: base.address,
                quoteToken: quote.address,
                buyPriceLow: buy.min,
                buyPriceMarginal: buy.marginalPrice || buy.max,
                buyPriceHigh: buy.max,
                buyBudget: buy.budget,
                sellPriceLow: sell.min,
                sellPriceMarginal: sell.marginalPrice || sell.min,
                sellPriceHigh: sell.max,
                sellBudget: sell.budget,
              });
            }
            tokens.add(strategy.base.address);
            tokens.add(strategy.quote.address);
          }
          const unsignedTx = await carbonSDK.routerCreateStrategies(
            regular,
            gradient,
            { gasLimit: 10000000000000n },
          );
          unsignedTx.customData = {
            spender: router,
            assets: totalAssets(),
          };
          txs.push(unsignedTx);
        } else {
          const regular: BatchCreateBuySellStrategy[] = [];
          for (const strategy of strategies) {
            if (isGradientStrategy(strategy)) continue;
            const { base, quote, buy, sell } = strategy;
            regular.push({
              baseToken: base.address,
              quoteToken: quote.address,
              buyPriceLow: buy.min,
              buyPriceMarginal: buy.marginalPrice || buy.max,
              buyPriceHigh: buy.max,
              buyBudget: buy.budget,
              sellPriceLow: sell.min,
              sellPriceMarginal: sell.marginalPrice || sell.min,
              sellPriceHigh: sell.max,
              sellBudget: sell.budget,
            });
            tokens.add(base.address);
            tokens.add(quote.address);
          }
          const unsignedTx =
            await carbonSDK.batchCreateBuySellStrategies(regular);

          unsignedTx.customData = {
            spender: batcher,
            assets: totalAssets(),
          };
          txs.push(unsignedTx);
        }
        const tx = await sendTransaction(txs);
        setConfirmation(false);
        setProcessing(true);
        dispatchNotification('createBatchStrategy', { txHash: tx.hash });
        await tx.wait();
        setConfirmation(false);
        setProcessing(false);
        clearCart(user!);
        nav({ to: '/portfolio/strategies' });
        setTimeout(() => {
          cache.invalidateQueries({
            queryKey: QueryKey.strategyAll(),
          });

          for (const token of tokens) {
            cache.invalidateQueries({
              queryKey: QueryKey.balance(user!, token),
            });
          }
        }, 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setConfirmation(false);
        setProcessing(false);
      }
    };

    create();
  };

  if (!strategies.length) {
    return (
      <section className="px-content pb-30 xl:px-50 mx-auto grid max-w-[1920px] grow content-start gap-16 pt-20">
        <EmptyCart />
      </section>
    );
  }

  return (
    <form
      className="form px-content pb-30 xl:px-50 mx-auto grid max-w-[1920px] grow content-start gap-16 pt-20"
      onSubmit={submit}
    >
      <h1 className="text-18 flex items-center gap-8">
        Create Multiple Strategies
      </h1>
      <CartList strategies={strategies} />
      {funds.isInsufficient && (
        <Warning
          className="place-self-center p-20"
          message="Insufficient budget to create all strategies"
          isError
        />
      )}
      {!funds.isInsufficient && (
        <div className="grid place-items-center gap-20 p-20">
          <label
            htmlFor="approve-warnings"
            className="approve-warnings surface rounded-lg text-14 font-medium flex items-center p-16 py-8 gap-8 place-self-center text-main-0/60"
          >
            <input
              id="approve-warnings"
              type="checkbox"
              name="approval"
              className="size-18 shrink-0"
              data-testid="approve-warnings"
            />
            I accept any applicable warning(s) and understand fee on transfer
            (tax) or rebasing tokens are not supported
          </label>
        </div>
      )}
      <Button
        type="submit"
        disabled={!user || funds.isPending}
        loading={confirmation || processing}
        loadingChildren={
          confirmation ? 'Waiting for Confirmation' : 'Processing'
        }
        variant="success"
        className="mt-10 place-self-center"
      >
        Sign {strategies.length} Strategies
      </Button>
    </form>
  );
};

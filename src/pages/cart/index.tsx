import { CartList } from 'components/cart/CartList';
import { EmptyCart } from 'components/cart/EmptyCart';
import { clearCart, useStrategyCart } from 'components/cart/utils';
import { Button } from 'components/common/button';
import { useWagmi } from 'libs/wagmi';
import { cn } from 'utils/helpers';
import { FormEvent, useMemo, useState } from 'react';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { QueryKey, useGetTokenBalances, useQueryClient } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useModal } from 'hooks/useModal';
import { carbonSDK } from 'libs/sdk';
import { useNavigate } from '@tanstack/react-router';
import { useNotifications } from 'hooks/useNotifications';
import { AnyCartStrategy } from 'components/strategies/common/types';
import { isGradientStrategy } from 'components/strategies/common/utils';
import { useRestrictedCountry } from 'hooks/useRestrictedCountry';
import { useBatchTransaction } from 'libs/wagmi/batch-transaction';
import { TransactionRequest } from 'ethers';
import style from 'components/strategies/common/form.module.css';
import config from 'config';

const batcher = config.addresses.carbon.batcher;
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
  const { openModal } = useModal();
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

  const approval = useApproval(approvalTokens);
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
          return new SafeDecimal(amount).mul(10 ** token.decimals);
        };
        const tokens = new Set<string>();
        const txs: TransactionRequest[] = [];
        if (canBatch) {
          for (const strategy of strategies) {
            if (isGradientStrategy(strategy)) continue;
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
              assets: [
                {
                  address: base.address,
                  rawAmount: getRawAmount(base, sell.budget),
                },
                {
                  address: quote.address,
                  rawAmount: getRawAmount(quote, buy.budget),
                },
              ],
            };
            txs.push(unsignedTx);
            tokens.add(base.address);
            tokens.add(quote.address);
          }
        } else {
          // TODO: support gradient
          const params: Parameters<
            typeof carbonSDK.batchCreateBuySellStrategies
          >[0] = [];
          for (const strategy of strategies) {
            if (isGradientStrategy(strategy)) continue;
            const { base, quote, buy, sell } = strategy;
            params.push({
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
            await carbonSDK.batchCreateBuySellStrategies(params);

          const amounts: Record<string, SafeDecimal> = {};
          for (const strategy of strategies) {
            const base = strategy.base.address;
            const quote = strategy.quote.address;
            amounts[base] ||= new SafeDecimal(0);
            const sellAmount = getRawAmount(
              strategy.base,
              strategy.sell.budget,
            );
            amounts[base] = amounts[base].add(sellAmount);

            amounts[quote] ||= new SafeDecimal(0);
            const buyAmount = getRawAmount(strategy.quote, strategy.buy.budget);
            amounts[quote] = amounts[quote].add(buyAmount);
          }
          unsignedTx.customData = {
            spender: batcher,
            assets: Object.entries(amounts).map(([address, amount]) => ({
              address,
              rawAmount: amount.toString(),
            })),
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
        cache.invalidateQueries({
          queryKey: QueryKey.strategiesByUser(user),
        });

        for (const token of tokens) {
          cache.invalidateQueries({
            queryKey: QueryKey.balance(user!, token),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setConfirmation(false);
        setProcessing(false);
      }
    };

    if (approval.approvalRequired) {
      return openModal('txConfirm', {
        approvalTokens,
        onConfirm: create,
        buttonLabel: 'Create all Strategies',
      });
    } else {
      create();
    }
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
      className={cn(
        'px-content pb-30 xl:px-50 mx-auto grid max-w-[1920px] grow content-start gap-16 pt-20',
        style.form,
      )}
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
            className={cn(
              style.approveWarnings,
              'surface rounded-lg text-14 font-medium flex items-center p-16 py-8 gap-8 place-self-center text-white/60',
            )}
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
        disabled={!user || approval.isPending || funds.isPending}
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

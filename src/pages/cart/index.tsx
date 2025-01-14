import { CartList } from 'components/cart/CartList';
import { EmptyCart } from 'components/cart/EmptyCart';
import { useStrategyCart } from 'components/cart/utils';
import { Button } from 'components/common/button';
import { useWagmi } from 'libs/wagmi';
import { cn } from 'utils/helpers';
import { FormEvent, useMemo, useState } from 'react';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { CartStrategy, useGetTokenBalances } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useModal } from 'hooks/useModal';
import { carbonSDK } from 'libs/sdk';
import { useNavigate } from '@tanstack/react-router';
import { lsService } from 'services/localeStorage';
import style from 'components/strategies/common/form.module.css';
import config from 'config';

const spenderAddress = config.addresses.carbon.carbonController;
const getApproveTokens = (strategies: CartStrategy[]) => {
  const tokens: Record<string, Token> = {};
  const amount: Record<string, SafeDecimal> = {};
  for (const strategy of strategies) {
    const base = strategy.base.address;
    const quote = strategy.quote.address;
    tokens[base] ||= strategy.base;
    amount[base] ||= new SafeDecimal(0);
    amount[base] = amount[base].add(strategy.order1.balance);
    tokens[quote] ||= strategy.quote;
    amount[quote] ||= new SafeDecimal(0);
    amount[quote] = amount[quote].add(strategy.order0.balance);
  }
  return Object.values(tokens).map((token) => ({
    ...token,
    spender: spenderAddress,
    amount: amount[token.address].toString(),
  }));
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
  const { user, signer } = useWagmi();
  const { openModal } = useModal();
  const nav = useNavigate({ from: '/cart' });
  const [pending, setPending] = useState(false);

  const approvalTokens = useMemo(() => {
    return getApproveTokens(strategies);
  }, [strategies]);

  const approval = useApproval(approvalTokens);
  const funds = useHasInsufficientFunds(approvalTokens);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!!form.querySelector('.error-message')) return;
    const warnings = form.querySelector('.warning-message');
    if (warnings) {
      const approve = form.querySelector<HTMLInputElement>('#approve-warnings');
      if (approve && !approve.checked) return;
    }

    const create = async () => {
      setPending(true);
      try {
        const params = strategies.map(({ base, quote, order0, order1 }) => ({
          baseToken: base.address,
          quoteToken: quote.address,
          buyPriceLow: order0.startRate,
          buyPriceMarginal: order0.marginalRate || order0.endRate,
          buyPriceHigh: order0.endRate,
          buyBudget: order0.balance,
          sellPriceLow: order1.startRate,
          sellPriceMarginal: order1.marginalRate || order1.startRate,
          sellPriceHigh: order1.endRate,
          sellBudget: order1.balance,
        }));
        const unsignedTx = await carbonSDK.batchCreateBuySellStrategies(params);
        await signer!.sendTransaction(unsignedTx);
        lsService.setItem('cart', []);
        nav({ to: '/' });
      } finally {
        setPending(false);
      }
    };

    if (approval.approvalRequired) {
      return openModal('txConfirm', {
        approvalTokens,
        onConfirm: create,
        buttonLabel: 'Create Strategy',
        context: 'createStrategy',
      });
    } else {
      create();
    }
  };

  if (!strategies.length) {
    return (
      <section className="px-content pb-30 xl:px-50 mx-auto grid max-w-[1280px] flex-grow content-start gap-16 pt-20">
        <h1 className="text-18 flex items-center gap-8">
          Create multiple strategies
        </h1>
        <EmptyCart />
      </section>
    );
  }

  return (
    <form
      className={cn(
        'px-content pb-30 xl:px-50 mx-auto grid max-w-[1280px] flex-grow content-start gap-16 pt-20',
        style.form
      )}
      onSubmit={submit}
    >
      <h1 className="text-18 flex items-center gap-8">
        Create multiple strategies
      </h1>
      <CartList strategies={strategies} />
      {funds.isInsufficient && (
        <Warning
          className="place-self-center"
          message="Insufficient budget to create all strategies"
          isError
        />
      )}
      <label
        htmlFor="approve-warnings"
        className={cn(
          style.approveWarnings,
          'text-14 font-weight-500 flex items-center gap-8 place-self-center p-20 text-white/60'
        )}
      >
        <input
          id="approve-warnings"
          type="checkbox"
          name="approval"
          className="size-18"
          data-testid="approve-warnings"
        />
        I've reviewed the warning(s) but choose to proceed
      </label>
      <Button
        type="submit"
        disabled={!user || approval.isPending || funds.isPending || pending}
        variant="success"
        className="place-self-center"
      >
        Sign all strategies
      </Button>
    </form>
  );
};

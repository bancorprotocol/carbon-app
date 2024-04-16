import { FC, useEffect, useId } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { OverlappingStrategyProps } from './CreateOverlappingStrategy';
import { SafeDecimal } from 'libs/safedecimal';
import {
  isMinAboveMarket,
  isMaxBelowMarket,
  isOverlappingBudgetTooSmall,
} from 'components/strategies/overlapping/utils';
import { BudgetInput } from 'components/strategies/common/BudgetInput';
import { isValidRange } from 'components/strategies/utils';
import { OverlappingSmallBudget } from 'components/strategies/overlapping/OverlappingSmallBudget';

interface Props extends OverlappingStrategyProps {
  marketPrice: number;
  anchoredOrder: 'buy' | 'sell';
  setAnchoredOrder: (value: 'buy' | 'sell') => any;
  setBuyBudget: (sellBudget: string, min: string, max: string) => any;
  setSellBudget: (buyBudget: string, min: string, max: string) => any;
}

export const CreateOverlappingStrategyBudget: FC<Props> = (props) => {
  const {
    base,
    quote,
    order0,
    order1,
    token0BalanceQuery,
    token1BalanceQuery,
    setAnchoredOrder,
    setBuyBudget,
    setSellBudget,
  } = props;
  const minAboveMarket = isMinAboveMarket(order0);
  const maxBelowMarket = isMaxBelowMarket(order1);
  const validPrice = isValidRange(order0.min, order1.max);
  const budgetTooSmall = isOverlappingBudgetTooSmall(order0, order1);
  const buyBudgetId = useId();
  const sellBudgetId = useId();

  const checkInsufficientBalance = (balance: string, order: OrderCreate) => {
    if (new SafeDecimal(balance).lt(order.budget)) {
      order.setBudgetError('Insufficient balance');
    } else {
      order.setBudgetError('');
    }
  };

  // Check for error when buy budget changes
  useEffect(() => {
    const balance = token1BalanceQuery.data ?? '0';
    checkInsufficientBalance(balance, order0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.budget, token1BalanceQuery.data]);

  // Check for error when sell budget changes
  useEffect(() => {
    const balance = token0BalanceQuery.data ?? '0';
    checkInsufficientBalance(balance, order1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.budget, token0BalanceQuery.data]);

  const onBuyBudgetChange = (value: string) => {
    order0.setBudget(value);
    setAnchoredOrder('buy');
    setSellBudget(value, order0.min, order1.max);
  };
  const onSellBudgetChange = (value: string) => {
    order1.setBudget(value);
    setAnchoredOrder('sell');
    setBuyBudget(value, order0.min, order1.max);
  };

  if (!quote || !base) return <></>;
  return (
    <>
      <BudgetInput
        action="deposit"
        id={buyBudgetId}
        token={quote}
        value={order0.budget}
        max={token1BalanceQuery.data ?? '0'}
        onChange={onBuyBudgetChange}
        disabled={minAboveMarket || !validPrice}
        data-testid="input-budget-quote"
        errors={order0.budgetError}
      />
      {minAboveMarket && <Explanation base={base} buy />}
      <BudgetInput
        action="deposit"
        id={sellBudgetId}
        token={base}
        value={order1.budget}
        max={token0BalanceQuery.data ?? '0'}
        onChange={onSellBudgetChange}
        disabled={maxBelowMarket || !validPrice}
        data-testid="input-budget-base"
        errors={order1.budgetError}
      />
      {maxBelowMarket && <Explanation base={base} />}
      {budgetTooSmall && (
        <OverlappingSmallBudget
          base={base}
          quote={quote}
          buyBudget={order0.budget}
          htmlFor={`${buyBudgetId} ${sellBudgetId}`}
        />
      )}
      {!minAboveMarket && !maxBelowMarket && (
        <p className="text-12 text-white/60">
          The required 2nd budget will be calculated to maintain overlapping
          dynamics.&nbsp;
          <a
            href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"
            target="_blank"
            className="inline-flex items-center gap-4 text-12 font-weight-500 text-primary"
            rel="noreferrer"
          >
            Learn More
            <IconLink className="h-12 w-12" />
          </a>
        </p>
      )}
    </>
  );
};

const Explanation: FC<{ base?: Token; buy?: boolean }> = ({ base, buy }) => {
  return (
    <p className="text-12 text-white/60">
      The market price is outside the ranges you set for&nbsp;
      {buy ? 'buying' : 'selling'}&nbsp;
      {base?.symbol}. Budget for buying {base?.symbol} is not required.&nbsp;
      <a
        href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"
        target="_blank"
        className="inline-flex items-center gap-4 text-12 font-weight-500 text-primary"
        rel="noreferrer"
      >
        Learn More
        <IconLink className="h-12 w-12" />
      </a>
    </p>
  );
};

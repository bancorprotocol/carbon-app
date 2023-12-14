import { FC, useEffect } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from '../useOrder';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { OverlappingStrategyProps } from './CreateOverlappingStrategy';
import { SafeDecimal } from 'libs/safedecimal';
import { isMinAboveMarket, isMaxBelowMarket } from '../../overlapping/utils';
import { BudgetInput } from 'components/strategies/common/BudgetInput';

interface Props extends OverlappingStrategyProps {
  marketPrice: number;
  anchoredOrder: 'buy' | 'sell';
  setAnchoderOrder: (value: 'buy' | 'sell') => any;
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
    setAnchoderOrder,
    setBuyBudget,
    setSellBudget,
  } = props;
  const minAboveMarket = isMinAboveMarket(order0, quote);
  const maxBelowMarket = isMaxBelowMarket(order1, quote);

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
    setAnchoderOrder('buy');
    setSellBudget(value, order0.min, order1.max);
  };
  const onSellBudgetChange = (value: string) => {
    order1.setBudget(value);
    setAnchoderOrder('sell');
    setBuyBudget(value, order0.min, order1.max);
  };

  if (!quote || !base) return <></>;
  return (
    <>
      <BudgetInput
        token={quote}
        order={order0}
        query={token1BalanceQuery}
        onChange={onBuyBudgetChange}
        disabled={minAboveMarket}
        data-testid="input-budget-quote"
      />
      {minAboveMarket && <Explaination base={base} buy />}
      <BudgetInput
        token={base}
        order={order1}
        query={token0BalanceQuery}
        onChange={onSellBudgetChange}
        disabled={maxBelowMarket}
        data-testid="input-budget-base"
      />
      {maxBelowMarket && <Explaination base={base} />}
      {!minAboveMarket && !maxBelowMarket && (
        <p className="text-12 text-white/60">
          The required 2nd budget will be calculated to maintain overlapping
          dynamics.&nbsp;
          <a
            href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"
            target="_blank"
            className="inline-flex items-center gap-4 text-12 font-weight-500 text-green"
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

const Explaination: FC<{ base?: Token; buy?: boolean }> = ({ base, buy }) => {
  return (
    <p className="text-12 text-white/60">
      The market price is outside the ranges you set for&nbsp;
      {buy ? 'buying' : 'selling'}&nbsp;
      {base?.symbol}. Budget for buying {base?.symbol} is not required.&nbsp;
      <a
        href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"
        target="_blank"
        className="inline-flex items-center gap-4 text-12 font-weight-500 text-green"
        rel="noreferrer"
      >
        Learn More
        <IconLink className="h-12 w-12" />
      </a>
    </p>
  );
};

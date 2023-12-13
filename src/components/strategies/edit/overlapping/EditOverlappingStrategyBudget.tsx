import { FC, useEffect, useState } from 'react';
import { Token } from 'libs/tokens';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { SafeDecimal } from 'libs/safedecimal';
import { isMinAboveMarket, isMaxBelowMarket } from '../../overlapping/utils';
import { BudgetInput } from 'components/strategies/common/BudgetInput';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import { WithdrawAllocatedBudget } from 'components/strategies/common/AllocatedBudget';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { BudgetWarning, BudgetWarnings } from './BudgetWarning';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
  marketPrice: number;
  anchoredOrder: 'buy' | 'sell';
  setAnchoderOrder: (value: 'buy' | 'sell') => any;
  setBuyBudget: (sellBudget: string, min: string, max: string) => any;
  setSellBudget: (buyBudget: string, min: string, max: string) => any;
}

export const EditOverlappingStrategyBudget: FC<Props> = (props) => {
  const {
    strategy,
    order0,
    order1,
    setAnchoderOrder,
    setBuyBudget,
    setSellBudget,
  } = props;
  const { quote, base } = strategy;
  const minAboveMarket = isMinAboveMarket(order0, quote);
  const maxBelowMarket = isMaxBelowMarket(order1, quote);
  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);
  const [warning, setWarning] = useState<BudgetWarnings | ''>('');

  useEffect(() => {
    // TODO set the warning here based on previous state
    // const [previous, current] = warning.split('->');
    // const next = getWarning(order0, order1, quote);
    // setWarning(`${current}->${next}`);
  }, [order0.min, order0.marginalPrice, order1.max, order1.marginalPrice]);

  const checkInsufficientBalance = (balance: string, order: OrderCreate) => {
    if (new SafeDecimal(balance).lt(order.budget)) {
      order.setBudgetError('Insufficient balance');
    } else {
      order.setBudgetError('');
    }
  };

  // Check for error when buy budget changes
  useEffect(() => {
    const balance = tokenBaseBalanceQuery.data ?? '0';
    checkInsufficientBalance(balance, order0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.budget, tokenBaseBalanceQuery.data]);

  // Check for error when sell budget changes
  useEffect(() => {
    const balance = tokenQuoteBalanceQuery.data ?? '0';
    checkInsufficientBalance(balance, order1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.budget, tokenQuoteBalanceQuery.data]);

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
  if (warning) return <BudgetWarning warning={warning} />;
  return (
    <>
      <BudgetInput
        token={quote}
        query={tokenQuoteBalanceQuery}
        order={order0}
        onChange={onBuyBudgetChange}
        disabled={minAboveMarket}
      >
        <WithdrawAllocatedBudget
          token={quote}
          order={order0}
          currentBudget={strategy.order0.balance}
          setBudget={onBuyBudgetChange}
          disabled={minAboveMarket}
          buy
        />
      </BudgetInput>
      <BudgetInput
        token={base}
        query={tokenBaseBalanceQuery}
        order={order1}
        onChange={onSellBudgetChange}
        disabled={maxBelowMarket}
      >
        <WithdrawAllocatedBudget
          token={base}
          order={order1}
          currentBudget={strategy.order1.balance}
          disabled={maxBelowMarket}
          setBudget={onSellBudgetChange}
        />
      </BudgetInput>
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

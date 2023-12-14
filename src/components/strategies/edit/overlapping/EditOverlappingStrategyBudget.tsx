import { FC, useEffect, useState } from 'react';
import { Token } from 'libs/tokens';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconArrowDown } from 'assets/icons/arrowDown.svg';
import { SafeDecimal } from 'libs/safedecimal';
import { isMinAboveMarket, isMaxBelowMarket } from '../../overlapping/utils';
import { BudgetInput } from 'components/strategies/common/BudgetInput';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import { WithdrawAllocatedBudget } from 'components/strategies/common/AllocatedBudget';
import { OrderCreate } from 'components/strategies/create/useOrder';
import {
  BudgetWarning,
  BudgetState,
  hasBudgetWarning,
  splitBudgetState,
} from './BudgetWarning';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { prettifyNumber } from 'utils/helpers';

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

const balanceChange = (oldBalance: string, newBudget: string) => {
  if (!oldBalance || !newBudget) return;
  if (new SafeDecimal(oldBalance).eq(newBudget)) return;
  return new SafeDecimal(newBudget).minus(oldBalance);
};

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

  const quoteBalanceChange = balanceChange(
    strategy.order0.balance,
    order0.budget
  );
  const baseBalanceChange = balanceChange(
    strategy.order1.balance,
    order1.budget
  );

  const getPosition = () => {
    if (minAboveMarket) return 'above';
    if (maxBelowMarket) return 'below';
    return 'within';
  };

  const initialState = `${getPosition()}->${getPosition()}` as const;
  const [budgetState, setBudgetState] = useState<BudgetState>(initialState);

  useEffect(() => {
    const [_, current] = splitBudgetState(budgetState);
    const next = getPosition();
    setBudgetState(`${current}->${next}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.marginalPrice, order1.marginalPrice]);

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
  if (hasBudgetWarning(budgetState)) {
    return (
      <BudgetWarning
        base={base}
        state={budgetState}
        setState={setBudgetState}
      />
    );
  }
  return (
    <article className="flex w-full flex-col gap-20 rounded-10 bg-silver p-20">
      <header className="flex items-center gap-8 ">
        <h3 className="flex-1 text-18 font-weight-500">Edit Budget</h3>
        <Tooltip element="Indicate the budget you would like to allocate to the strategy. Note that in order to maintain the overlapping behavior, the 2nd budget indication will be calculated using the prices, spread and budget values." />
      </header>
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
        <BudgetMessage token={quote} change={quoteBalanceChange} />
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
        <BudgetMessage token={base} change={baseBalanceChange} />
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
    </article>
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

const BudgetMessage: FC<{ token: Token; change?: SafeDecimal }> = (props) => {
  const { change, token } = props;
  if (!change || change.eq(0)) return <></>;
  if (change.gt(0)) {
    return (
      <div className="flex items-center gap-8">
        <IconArrowDown className="h-16 w-16 rotate-180 text-green" />
        <p className="text-12 font-weight-400 text-white/60">
          You will deposit&nbsp;
          <b className="text-green">
            {prettifyNumber(change)} {token.symbol}
          </b>
          &nbsp;to your wallet balance
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-8">
        <IconArrowDown className="h-16 w-16 text-red" />
        <p className="text-12 font-weight-400 text-white/60">
          You will withdraw&nbsp;
          <b className="text-red">
            {prettifyNumber(change.abs())} {token.symbol}
          </b>
          &nbsp;to your wallet balance
        </p>
      </div>
    );
  }
};

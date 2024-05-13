import { FC, useEffect, useId, useState } from 'react';
import { Token } from 'libs/tokens';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconArrowDown } from 'assets/icons/arrowDown.svg';
import { SafeDecimal } from 'libs/safedecimal';
import {
  isMinAboveMarket,
  isMaxBelowMarket,
  isOverlappingBudgetTooSmall,
} from '../../overlapping/utils';
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
import { OverlappingSmallBudget } from 'components/strategies/overlapping/OverlappingSmallBudget';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
  marketPrice: string;
  anchoredOrder: 'buy' | 'sell';
  setAnchoredOrder: (value: 'buy' | 'sell') => any;
  setBuyBudget: (sellBudget: string, min: string, max: string) => any;
  setSellBudget: (buyBudget: string, min: string, max: string) => any;
  setOverlappingError: (error: string) => void;
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
    marketPrice,
    setAnchoredOrder,
    setBuyBudget,
    setSellBudget,
    setOverlappingError,
  } = props;
  const { quote, base } = strategy;
  const minAboveMarket = isMinAboveMarket(order0);
  const maxBelowMarket = isMaxBelowMarket(order1);
  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);
  const budgetTooSmall = isOverlappingBudgetTooSmall(order0, order1);
  const buyBudgetId = useId();
  const sellBudgetId = useId();

  // We need to use external market price for the initial state in case of dust
  const disableBuy =
    minAboveMarket || new SafeDecimal(order0.min).gt(marketPrice);
  const disableSell =
    maxBelowMarket || new SafeDecimal(order1.max).lt(marketPrice);

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
    return 'around';
  };

  const getInitialState = (): BudgetState => {
    if (minAboveMarket && new SafeDecimal(strategy.order0.balance).gt(0)) {
      return 'dust->above';
    }
    if (maxBelowMarket && new SafeDecimal(strategy.order1.balance).gt(0)) {
      return 'dust->below';
    }
    return `${getPosition()}->${getPosition()}` as const;
  };

  const [budgetState, setBudgetState] = useState(getInitialState());

  // Set error on one of the order to disabled CTA
  useEffect(() => {
    const [prev, current] = splitBudgetState(budgetState);
    if (prev !== current) setOverlappingError('need validation');
    else setOverlappingError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetState]);

  useEffect(() => {
    const [prev] = splitBudgetState(budgetState);
    const next = getPosition();
    setBudgetState(`${prev}->${next}`);
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
    setAnchoredOrder('buy');
    setSellBudget(value, order0.min, order1.max);
  };
  const onSellBudgetChange = (value: string) => {
    order1.setBudget(value);
    setAnchoredOrder('sell');
    setBuyBudget(value, order0.min, order1.max);
  };

  if (!quote || !base) return <></>;
  if (hasBudgetWarning(budgetState)) {
    return (
      <BudgetWarning
        base={base}
        quote={quote}
        state={budgetState}
        setState={setBudgetState}
      />
    );
  }
  return (
    <article className="rounded-10 bg-background-900 flex w-full flex-col gap-20 p-20">
      <header className="flex items-center gap-8 ">
        <h3 className="text-18 font-weight-500 flex-1">Edit Budget</h3>
        <Tooltip element="Indicate the budget you would like to allocate to the strategy. Note that in order to maintain the overlapping behavior, the 2nd budget indication will be calculated using the prices, spread and budget values." />
      </header>
      <BudgetInput
        id={sellBudgetId}
        title="Sell Budget"
        titleTooltip={`The amount of ${base.symbol} tokens you would like to sell.`}
        token={base}
        query={tokenBaseBalanceQuery}
        value={order1.budget}
        error={order1.budgetError}
        onChange={onSellBudgetChange}
        disabled={disableSell}
      >
        <WithdrawAllocatedBudget
          token={base}
          order={order1}
          currentBudget={strategy.order1.balance}
          disabled={disableSell}
          setBudget={onSellBudgetChange}
        />
        <BudgetMessage token={base} change={baseBalanceChange} />
      </BudgetInput>
      {maxBelowMarket && <Explanation base={base} />}
      <BudgetInput
        id={buyBudgetId}
        title="Buy Budget"
        titleTooltip={`The amount of ${quote.symbol} tokens you would like to use in order to buy ${base.symbol}.`}
        token={quote}
        query={tokenQuoteBalanceQuery}
        value={order0.budget}
        error={order0.budgetError}
        onChange={onBuyBudgetChange}
        disabled={disableBuy}
      >
        <WithdrawAllocatedBudget
          token={quote}
          order={order0}
          currentBudget={strategy.order0.balance}
          setBudget={onBuyBudgetChange}
          disabled={disableBuy}
          buy
        />
        <BudgetMessage token={quote} change={quoteBalanceChange} />
      </BudgetInput>

      {!minAboveMarket && !maxBelowMarket && (
        <p className="text-12 text-white/60">
          The required 2nd budget will be calculated to maintain overlapping
          dynamics.&nbsp;
          <a
            href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"
            target="_blank"
            className="text-12 font-weight-500 text-primary inline-flex items-center gap-4"
            rel="noreferrer"
          >
            Learn More
            <IconLink className="size-12" />
          </a>
        </p>
      )}
      {budgetTooSmall && (
        <OverlappingSmallBudget
          base={base}
          quote={quote}
          buyBudget={order0.budget}
          htmlFor={`${buyBudgetId} ${sellBudgetId}`}
        />
      )}
    </article>
  );
};

const Explanation: FC<{ base?: Token; buy?: boolean }> = ({ base, buy }) => {
  return (
    <p className="text-12 text-white/60">
      The market price is outside the ranges you set for&nbsp;
      {buy ? 'buying' : 'selling'}&nbsp;
      {base?.symbol}. Budget for {buy ? 'buying' : 'selling'} {base?.symbol} is
      not required.&nbsp;
      <a
        href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"
        target="_blank"
        className="text-12 font-weight-500 text-primary inline-flex items-center gap-4"
        rel="noreferrer"
      >
        Learn More
        <IconLink className="size-12" />
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
        <IconArrowDown className="text-primary size-16 rotate-180" />
        <p className="text-12 font-weight-400 text-white/60">
          You will deposit&nbsp;
          <b className="text-primary">
            {prettifyNumber(change)} {token.symbol}
          </b>
          &nbsp;to your wallet balance
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-8">
        <IconArrowDown className="text-error size-16" />
        <p className="text-12 font-weight-400 text-white/60">
          You will withdraw&nbsp;
          <b className="text-error">
            {prettifyNumber(change.abs())} {token.symbol}
          </b>
          &nbsp;to your wallet balance
        </p>
      </div>
    );
  }
};

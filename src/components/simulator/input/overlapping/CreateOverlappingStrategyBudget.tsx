import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { OverlappingStrategyProps } from './CreateOverlappingStrategy';
import { SafeDecimal } from 'libs/safedecimal';

import { BudgetInput } from 'components/strategies/common/BudgetInput';
import { isValidRange } from 'components/strategies/utils';

interface Props extends OverlappingStrategyProps {
  marketPrice: number;
  anchoredOrder: 'buy' | 'sell';
  setAnchoredOrder: (value: 'buy' | 'sell') => any;
  setBuyBudget: (sellBudget: string, min: string, max: string) => any;
  setSellBudget: (buyBudget: string, min: string, max: string) => any;
}

export const CreateOverlappingStrategyBudget: FC<Props> = (props) => {
  const { state, dispatch, setAnchoredOrder, setBuyBudget, setSellBudget } =
    props;
  const { baseToken: base, quoteToken: quote } = state;
  // TODO reenable this for create strategy
  // const minAboveMarket = isMinAboveMarket(order0);
  // const maxBelowMarket = isMaxBelowMarket(order1);
  const validPrice = isValidRange(state.buy.min, state.sell.max);
  // TODO reenable this for create strategy
  // const budgetTooSmall = isOverlappingBudgetTooSmall(order0, order1);
  const buyBudgetId = useId();
  const sellBudgetId = useId();

  const checkInsufficientBalance = (balance: string, order: OrderCreate) => {
    if (new SafeDecimal(balance).lt(order.budget)) {
      order.setBudgetError('Insufficient balance');
    } else {
      order.setBudgetError('');
    }
  };

  // TODO reenable this for create strategy
  // // Check for error when buy budget changes
  // useEffect(() => {
  //   const balance = token1BalanceQuery.data ?? '0';
  //   checkInsufficientBalance(balance, order0);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [order0.budget, token1BalanceQuery.data]);
  //
  // // Check for error when sell budget changes
  // useEffect(() => {
  //   const balance = token0BalanceQuery.data ?? '0';
  //   checkInsufficientBalance(balance, order1);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [order1.budget, token0BalanceQuery.data]);

  const onBuyBudgetChange = (value: string) => {
    dispatch('buyBudget', value);
    setAnchoredOrder('buy');
    setSellBudget(value, state.buy.min, state.sell.max);
  };
  const onSellBudgetChange = (value: string) => {
    dispatch('sellBudget', value);
    setAnchoredOrder('sell');
    setBuyBudget(value, state.buy.min, state.sell.max);
  };

  if (!quote || !base) return <></>;
  return (
    <>
      <BudgetInput
        id={buyBudgetId}
        token={quote}
        budgetValue={state.buy.budget}
        budgetError={state.buy.budgetError}
        onChange={onBuyBudgetChange}
        // disabled={minAboveMarket || !validPrice}
        disabled={!validPrice}
        data-testid="input-budget-quote"
      />
      {/*TODO reenable for create*/}
      {/*{minAboveMarket && <Explanation base={base} buy />}*/}
      <BudgetInput
        id={sellBudgetId}
        token={base}
        budgetValue={state.sell.budget}
        budgetError={state.sell.budgetError}
        onChange={onSellBudgetChange}
        // disabled={maxBelowMarket || !validPrice}
        disabled={!validPrice}
        data-testid="input-budget-base"
      />
      {/*TODO reenable for create*/}
      {/*{maxBelowMarket && <Explanation base={base} />}*/}
      {/*{budgetTooSmall && (*/}
      {/*  <OverlappingSmallBudget*/}
      {/*    base={base}*/}
      {/*    quote={quote}*/}
      {/*    buyBudget={state.buy.budget}*/}
      {/*    htmlFor={`${buyBudgetId} ${sellBudgetId}`}*/}
      {/*  />*/}
      {/*)}*/}
      {/*{!minAboveMarket && !maxBelowMarket && (*/}
      {/*  <p className="text-12 text-white/60">*/}
      {/*    The required 2nd budget will be calculated to maintain overlapping*/}
      {/*    dynamics.&nbsp;*/}
      {/*    <a*/}
      {/*      href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"*/}
      {/*      target="_blank"*/}
      {/*      className="inline-flex items-center gap-4 text-12 font-weight-500 text-primary"*/}
      {/*      rel="noreferrer"*/}
      {/*    >*/}
      {/*      Learn More*/}
      {/*      <IconLink className="h-12 w-12" />*/}
      {/*    </a>*/}
      {/*  </p>*/}
      {/*)}*/}
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

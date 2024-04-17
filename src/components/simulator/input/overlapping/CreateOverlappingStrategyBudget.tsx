import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { OverlappingSmallBudget } from 'components/strategies/overlapping/OverlappingSmallBudget';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
  isOverlappingBudgetTooSmall,
} from 'components/strategies/overlapping/utils';
import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { OverlappingStrategyProps } from './CreateOverlappingStrategy';

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
  const { baseToken: base, quoteToken: quote, buy, sell } = state;
  const buyBudgetId = useId();
  const sellBudgetId = useId();

  if (
    !buy.min ||
    !sell.max ||
    !props.spread ||
    !props.marketPrice ||
    !quote ||
    !base
  )
    return <></>;

  const prices = calculateOverlappingPrices(
    buy.min,
    sell.max,
    props.marketPrice.toString(),
    props.spread.toString()
  );

  const buyOrder = {
    min: buy.min || '0',
    marginalPrice: prices.buyPriceMarginal || '0',
  };
  const sellOrder = {
    max: sell.max || '0',
    marginalPrice: prices.sellPriceMarginal || '0',
  };
  const minAboveMarket = isMinAboveMarket(buyOrder);
  const maxBelowMarket = isMaxBelowMarket(sellOrder);
  const validPrice = isValidRange(buy.min, sell.max);
  const budgetTooSmall = isOverlappingBudgetTooSmall(
    { ...buyOrder, budget: buy.budget },
    { ...sellOrder, budget: sell.budget }
  );

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

  return (
    <>
      <BudgetInput
        id={sellBudgetId}
        title="Sell Budget"
        titleTooltip={`The amount of ${base.symbol} tokens you would like to sell.`}
        token={base}
        value={state.sell.budget}
        errors={state.sell.budgetError}
        onChange={onSellBudgetChange}
        disabled={maxBelowMarket || !validPrice}
        data-testid="input-budget-base"
      />
      {maxBelowMarket && <Explanation base={base} />}

      <BudgetInput
        id={buyBudgetId}
        title="Buy Budget"
        titleTooltip={`The amount of ${quote.symbol} tokens you would like to use in order to buy ${base.symbol}.`}
        token={quote}
        value={state.buy.budget}
        errors={state.buy.budgetError}
        onChange={onBuyBudgetChange}
        disabled={minAboveMarket || !validPrice}
        data-testid="input-budget-quote"
      />
      {minAboveMarket && <Explanation base={base} buy />}
      {budgetTooSmall && (
        <OverlappingSmallBudget
          base={base}
          quote={quote}
          buyBudget={state.buy.budget}
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
            className="text-12 font-weight-500 text-primary inline-flex items-center gap-4"
            rel="noreferrer"
          >
            Learn More
            <IconLink className="size-12" />
          </a>
        </p>
      )}
    </>
  );
};

const Explanation: FC<{ base?: Token; buy?: boolean }> = ({ base, buy }) => {
  return (
    <p className="text-12 text-white/60">
      The first price in the selected time frame is outside the ranges you've
      set for&nbsp;
      {buy ? 'buying' : 'selling'}&nbsp;
      {base?.symbol}. Therefore, budget for {buy ? 'buying' : 'selling'}{' '}
      {base?.symbol} is not required.&nbsp;
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

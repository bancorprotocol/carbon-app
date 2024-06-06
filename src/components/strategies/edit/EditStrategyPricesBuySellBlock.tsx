import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { LimitRangeSection } from 'components/strategies/create/BuySellBlock/LimitRangeSection';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { EditStrategyAllocatedBudget } from './EditStrategyAllocatedBudget';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { BuySellHeader } from 'components/strategies/create/BuySellBlock/Header';

type EditStrategyPricesBuySellBlockProps = {
  base: Token;
  quote: Token;
  order: OrderCreate;
  initialBudget: string;
  buy?: boolean;
  type: EditTypes;
  isOrdersOverlap: boolean;
  isOrdersReversed: boolean;
};

export const EditStrategyPricesBuySellBlock: FC<
  EditStrategyPricesBuySellBlockProps
> = ({
  base,
  quote,
  buy,
  order,
  initialBudget,
  type,
  isOrdersOverlap,
  isOrdersReversed,
}) => {
  const titleId = useId();

  const isEmptyOrder = !Number(initialBudget);

  const headProps = { order, base, buy };

  const sectionProps = {
    base,
    quote,
    buy,
    order,
    isOrdersOverlap,
    isOrdersReversed,
    inputTitle: (
      <>
        <span className="text-white/80">Set {buy ? 'Buy' : 'Sell'} Price</span>
        <span className="text-white/60">
          ({quote.symbol} per 1 {base.symbol})
        </span>
      </>
    ),
    isEmptyOrder,
  };

  const budgetProps = {
    order,
    initialBudget,
    base,
    quote,
    max: type === 'withdraw' ? initialBudget : '',
    buy,
    type,
  };

  return (
    <article
      aria-labelledby={titleId}
      className={`rounded-6 bg-background-900 text-12 flex w-full flex-col gap-20 border-l-2 p-20 ${
        buy
          ? 'border-buy/50 focus-within:border-buy'
          : 'border-sell/50 focus-within:border-sell'
      }`}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      <BuySellHeader {...headProps}>
        <h2 id={titleId} className="text-18 flex items-center gap-6">
          {buy ? 'Buy' : 'Sell'} {buy ? 'Low' : 'High'} {base.symbol}
        </h2>
      </BuySellHeader>
      <LimitRangeSection {...sectionProps} />
      <EditStrategyAllocatedBudget {...budgetProps} />
      <FullOutcome
        price={order.price}
        min={order.min}
        max={order.max}
        budget={order.budget}
        buy={buy}
        base={base}
        quote={quote}
      />
    </article>
  );
};

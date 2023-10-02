import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { LimitRangeSection } from 'components/strategies/create/BuySellBlock/LimitRangeSection';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { EditTypes } from './EditStrategyMain';
import { EditStrategyAllocatedBudget } from './EditStrategyAllocatedBudget';
import { FullOutcome } from '../FullOutcome';
import { BuySellHeader } from '../create/BuySellBlock/Header';

type EditStrategyPricesBuySellBlockProps = {
  base: Token;
  quote: Token;
  order: OrderCreate;
  balance?: string;
  buy?: boolean;
  type: EditTypes;
  isOrdersOverlap: boolean;
};

export const EditStrategyPricesBuySellBlock: FC<
  EditStrategyPricesBuySellBlockProps
> = ({ base, quote, balance, buy, order, type, isOrdersOverlap }) => {
  const titleId = useId();

  const headProps = { order, base, buy };

  const sectionProps = {
    base,
    quote,
    balance,
    buy,
    order,
    isOrdersOverlap,
    isEdit: true,
    inputTitle: (
      <>
        <span className="text-white/80">Set {buy ? 'Buy' : 'Sell'} Price</span>
        <span className="text-white/60">
          ({quote.symbol} per 1 {base.symbol})
        </span>
      </>
    ),
  };

  const budgetProps = {
    order,
    base,
    quote,
    balance,
    buy,
    type,
  };

  return (
    <section
      aria-labelledby={titleId}
      className={`bg-secondary flex w-full flex-col gap-20 rounded-6 border-l-2 p-20 text-12 ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
    >
      <BuySellHeader {...headProps}>
        <h3 id={titleId} className="flex items-center gap-6 text-18">
          {buy ? 'Buy' : 'Sell'} {buy ? 'Low' : 'High'} {base.symbol}
        </h3>
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
    </section>
  );
};

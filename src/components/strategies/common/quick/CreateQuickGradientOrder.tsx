import { FC, useMemo, ReactNode, useId } from 'react';
import { QuickGradientOrderBlock } from '../types';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import { GradientPriceRange } from '../gradient/GradientPriceRange';
import { InputBudget } from '../InputBudget';
import { useGetTokenBalance } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { quickGradientPriceWarning } from '../gradient/utils';
import { OrderTitle } from '../OrderTitle';
import { QuickGradientDateRange } from './QuickGradientDateRange';

interface Props {
  order: QuickGradientOrderBlock;
  setOrder: (order: Partial<QuickGradientOrderBlock>) => any;
  priceWarning?: ReactNode;
  action?: ReactNode;
}

export const CreateQuickGradientOrder: FC<Props> = (props) => {
  const { order, setOrder } = props;
  const { base, quote } = useStrategyFormCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const budgetId = useId();
  const titleId = useId();
  const budgetToken = order.direction === 'buy' ? quote : base;
  const balance = useGetTokenBalance(budgetToken);

  const insufficientBalance = (() => {
    if (!balance.data) return;
    if (new SafeDecimal(balance.data).gte(order.budget || '0')) return;
    return 'Insufficient balance';
  })();

  const priceWarning = useMemo(() => {
    if (props.priceWarning) return;
    return quickGradientPriceWarning(order.direction, order, base, marketPrice);
  }, [base, marketPrice, order, props.priceWarning]);

  return (
    <article className="grid gap-16" aria-labelledby={titleId}>
      <header className="flex items-center justify-between gap-8">
        <OrderTitle direction={order.direction} titleId={titleId} base={base} />
        {props.action}
      </header>
      <div role="group" className="grid gap-8">
        <h3 className="text-14 font-medium flex items-center gap-6 capitalize text-main-0/60">
          Duration
        </h3>
        <QuickGradientDateRange
          deltaTime={order.deltaTime}
          setDeltaTime={(deltaTime) => setOrder({ deltaTime })}
        />
      </div>
      <div role="group" className="grid gap-8">
        <h3 className="text-14 font-medium flex items-center gap-6 capitalize text-main-0/60">
          Set {order.direction} Price
        </h3>
        <GradientPriceRange
          base={base}
          quote={quote}
          start={order.startPrice}
          end={order.endPrice}
          setStart={(startPrice) => setOrder({ startPrice })}
          setEnd={(endPrice) => setOrder({ endPrice })}
          direction={order.direction}
        />
        {props.priceWarning}
        {priceWarning && <Warning message={priceWarning} />}
      </div>
      <div className="grid gap-8">
        <label
          htmlFor={budgetId}
          className="text-14 font-medium capitalize text-main-0/60"
        >
          Set {order.direction} Budget
        </label>
        <InputBudget
          editType="deposit"
          id={budgetId}
          token={order.direction === 'buy' ? quote : base}
          value={order.budget}
          onChange={(budget) => setOrder({ budget })}
          max={balance.data || '0'}
          maxIsLoading={balance.isPending}
          error={insufficientBalance}
          data-testid="input-budget"
        />
      </div>
    </article>
  );
};

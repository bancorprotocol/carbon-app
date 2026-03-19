import { FC, useMemo, ReactNode, useId, useState, useEffect } from 'react';
import { QuickGradientOrderBlock } from '../types';
import { useTradeCtx } from 'components/trade/context';
import { GradientPriceRange } from '../gradient/GradientPriceRange';
import { InputBudget } from '../InputBudget';
import { useGetTokenBalance } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { quickGradientPriceWarning } from '../gradient/utils';
import { formatQuickTime } from './utils';
import { OrderTitle } from '../OrderTitle';

interface Props {
  order: QuickGradientOrderBlock;
  setOrder: (order: Partial<QuickGradientOrderBlock>) => any;
  priceWarning?: ReactNode;
  action?: ReactNode;
}

export const CreateQuickGradientOrder: FC<Props> = (props) => {
  const { order, setOrder } = props;
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const [localDelta, setLocalDelta] = useState(order.deltaTime);
  const budgetId = useId();
  const endTimeId = useId();
  const titleId = useId();
  const budgetToken = order.direction === 'buy' ? quote : base;
  const balance = useGetTokenBalance(budgetToken);

  useEffect(() => {
    setLocalDelta(order.deltaTime);
  }, [order.deltaTime]);

  const insufficientBalance = (() => {
    if (!balance.data) return;
    if (new SafeDecimal(balance.data).gte(order.budget || '0')) return;
    return 'Insufficient balance';
  })();

  const dateError = useMemo(() => {
    const delta = Number(localDelta);
    if (delta < 1) return 'End time should be above 1min';
    if (delta > 60) return 'End time should be below 60min';
  }, [localDelta]);

  const priceWarning = useMemo(() => {
    if (dateError) return;
    return quickGradientPriceWarning(order.direction, order, base, marketPrice);
  }, [base, dateError, marketPrice, order]);

  const setDeltaTime = (value: string | number) => {
    if (!value) return setLocalDelta('');
    const time = new SafeDecimal(value);
    if (time.lt(1) || time.gt(60)) {
      setLocalDelta(time.toString());
    } else {
      setOrder({ deltaTime: value.toString() });
      setLocalDelta(value.toString());
    }
  };

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
        <div className="text-12 font-medium flex gap-8 text-nowrap text-main-0/60">
          <div className="input-container rounded-s-2xl rounded-e-md flex flex-1 items-center gap-8 px-16 py-8">
            <span>Start Time</span>
            <span>On Execution</span>
          </div>
          <div className="input-container rounded-s-md rounded-e-2xl  flex flex-1 items-center gap-4">
            <label htmlFor={endTimeId}>End Time</label>
            <button
              type="button"
              className="text-success text-16 disabled:text-main-0/60"
              disabled={order.deltaTime === '1'}
              onClick={() => setDeltaTime(Number(order.deltaTime) - 1)}
            >
              -
            </button>
            <input
              id={endTimeId}
              className="invalid:text-error w-[2ch] bg-transparent text-center text-main-0 focus-visible:outline-hidden"
              value={localDelta}
              onChange={(e) => setDeltaTime(e.currentTarget.value)}
              type="number"
              min="1"
              max="60"
              step="1"
              autoComplete="off"
            />
            <span className="text-main-0">min</span>
            <span className="text-10 text-main-0">
              ({formatQuickTime(order.deltaTime)})
            </span>
            <button
              type="button"
              className="text-success text-16 disabled:text-main-0/60"
              disabled={order.deltaTime === '60'}
              onClick={() => setDeltaTime(Number(order.deltaTime) + 1)}
            >
              +
            </button>
          </div>
        </div>
        {dateError && <Warning message={dateError} isError />}
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
        {!props.priceWarning && priceWarning && (
          <Warning message={priceWarning} />
        )}
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

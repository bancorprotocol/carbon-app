import { FC, useCallback, useMemo, ReactNode, useId } from 'react';
import { GradientOrderBlock } from '../types';
import {
  RangeDate,
  GradientDateRange,
} from 'components/strategies/common/gradient/GradientDateRange';
import { useTradeCtx } from 'components/trade/context';
import { GradientPriceRange } from './GradientPriceRange';
import { InputBudget } from '../InputBudget';
import { useGetTokenBalance } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { fromUnixUTC, toUnixUTCDay } from 'components/simulator/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { addDays, addYears, endOfDay, startOfDay } from 'date-fns';
import { gradientDateWarning, gradientPriceWarning } from './utils';
import { GradientFullOutcome } from './GradientFullOutcome';

interface Props {
  order: GradientOrderBlock;
  setOrder: (order: Partial<GradientOrderBlock>) => any;
  priceWarning?: ReactNode;
}

export const CreateGradientOrder: FC<Props> = (props) => {
  const { order, setOrder } = props;
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const budgetToken = order.direction === 'buy' ? quote : base;
  const balance = useGetTokenBalance(budgetToken);
  const budgetId = useId();

  const setRange = useCallback(
    (range: RangeDate) => {
      if (!range.start || !range.end) return;
      setOrder({
        startDate: toUnixUTCDay(range.start),
        endDate: toUnixUTCDay(range.end),
      });
    },
    [setOrder],
  );

  const insufficientBalance = (() => {
    if (!balance.data) return;
    if (new SafeDecimal(balance.data).gte(order.budget || '0')) return;
    return 'Insufficient balance';
  })();

  const dateError = useMemo(() => {
    const end = endOfDay(fromUnixUTC(order.endDate));
    if (new Date() > end) {
      // @todo(gradient)
      return '';
    }
  }, [order.endDate]);

  const dateWarning = useMemo(() => gradientDateWarning(order), [order]);

  const priceWarning = useMemo(() => {
    if (dateError) return;
    return gradientPriceWarning(order.direction, order, base, marketPrice);
  }, [base, dateError, marketPrice, order]);

  return (
    <div className="grid gap-16">
      <div role="group" className="grid gap-8">
        <h3 className="text-14 font-medium flex items-center gap-6 capitalize text-main-0/60">
          Duration
        </h3>
        <GradientDateRange
          defaultStart={addDays(startOfDay(new Date()), 1)}
          defaultEnd={addDays(startOfDay(new Date()), 7)}
          start={fromUnixUTC(order.startDate)}
          end={fromUnixUTC(order.endDate)}
          onConfirm={setRange}
          options={{
            disabled: { after: addYears(new Date(), 1) },
          }}
          required
        />
        {dateError && <Warning message={dateError} isError />}
        {!dateError && dateWarning && <Warning message={dateWarning} />}
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
      <div role="group" className="grid gap-8">
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
      <GradientFullOutcome base={base} quote={quote} order={order} />
    </div>
  );
};

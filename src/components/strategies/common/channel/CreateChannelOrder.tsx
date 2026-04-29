import { FC, useId } from 'react';
import { GradientOrderBlock } from '../types';
import { GradientPriceRange } from '../gradient/GradientPriceRange';
import { useStrategyFormCtx } from '../StrategyFormContext';
import { useGetTokenBalance } from 'libs/queries';
import { InputBudget } from '../InputBudget';
import { GradientFullOutcome } from '../gradient/GradientFullOutcome';
import { SafeDecimal } from 'libs/safedecimal';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Token } from 'libs/tokens';
import { OrderTitle } from '../OrderTitle';
import KeyboardArrowDownIcon from 'assets/icons/keyboard_arrow_down.svg?react';

const deltaTypes = ['percent', 'token'] as const;
export type DeltaType = (typeof deltaTypes)[number];
export interface DeltaChannel {
  value: string;
  type: DeltaType;
}

interface Props {
  delta: DeltaChannel;
  setDelta: (delta: Partial<DeltaChannel>) => any;
  order: GradientOrderBlock;
  setOrder: (order: Partial<GradientOrderBlock>) => any;
}

const getType = (deltaType: DeltaType, base: Token) => {
  if (deltaType === 'percent') return '%';
  return base.symbol;
};

export const ChannelOrder: FC<Props> = ({
  delta,
  setDelta,
  order,
  setOrder,
}) => {
  const { base, quote } = useStrategyFormCtx();
  const budgetToken = order.direction === 'buy' ? quote : base;

  const balance = useGetTokenBalance(budgetToken);
  const budgetId = useId();
  const titleId = useId();
  const deltaId = useId();

  const insufficientBalance = (() => {
    if (!balance.data) return;
    if (new SafeDecimal(balance.data).gte(order.budget || '0')) return;
    return 'Insufficient balance';
  })();

  return (
    <article className="grid gap-16" aria-labelledby={titleId}>
      <header className="flex items-center justify-between gap-8">
        <OrderTitle direction={order.direction} titleId={titleId} base={base} />
      </header>
      <div role="group" className="grid gap-8">
        <hgroup className="grid gap-4">
          <h3 className="text-14 font-medium flex items-center gap-6 capitalize text-main-0/60">
            Delta
          </h3>
          <p className="text-12 text-main-0/80">
            Prices will be calculated automatically base on the delta below.
          </p>
        </hgroup>
        <div className="input-container flex items-center gap-8 rounded-2xl p-0">
          <DropdownMenu
            className="grid gap-8 min-w-[150px] p-8"
            button={(attr) => (
              <button
                className="flex items-center gap-8 px-16 py-8 rounded-s-2xl hover:bg-main-900/40"
                type="button"
                {...attr}
              >
                {getType(delta.type, base)}
                <KeyboardArrowDownIcon className="size-24" />
              </button>
            )}
          >
            {deltaTypes.map((type) => (
              <button
                key={type}
                className="rounded-sm py-8 px-16 hover:bg-main-900/40 aria-checked:bg-main-900/60"
                role="menuitem"
                aria-checked={delta.type === type}
                onClick={() => setDelta({ type })}
              >
                {getType(type, base)}
              </button>
            ))}
          </DropdownMenu>
          <hr className="w-1 h-full border border-main-500/80" />
          <label
            className="text-12 text-main-0/60 font-weight-500"
            htmlFor={deltaId}
          >
            Delta
          </label>
          <input
            className="flex-1 rounded-e-2xl px-16 py-8 text-end outline-none"
            type="number"
            id={deltaId}
            value={delta.value}
            onChange={(e) => setDelta({ value: e.target.value ?? undefined })}
          />
        </div>
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
          disabled
        />
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
    </article>
  );
};

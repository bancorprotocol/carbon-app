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
import { ChannelDelta, DeltaType, deltaTypes, toDelta } from './utils';

interface Props {
  delta: string;
  type: DeltaType;
  setDelta: (next: Partial<ChannelDelta>) => any;
  sell: GradientOrderBlock;
  buy: GradientOrderBlock;
  setBuy: (order: Partial<GradientOrderBlock>) => any;
}

const getType = (deltaType: DeltaType, quote: Token) => {
  if (deltaType === 'percent') return '%';
  return quote.symbol;
};

export const ChannelOrder: FC<Props> = (props) => {
  const { delta, type, sell, buy, setBuy, setDelta } = props;
  const { base, quote } = useStrategyFormCtx();
  const budgetToken = buy.direction === 'buy' ? quote : base;

  const balance = useGetTokenBalance(budgetToken);
  const budgetId = useId();
  const titleId = useId();
  const deltaId = useId();

  const insufficientBalance = (() => {
    if (!balance.data) return;
    if (new SafeDecimal(balance.data).gte(buy.budget || '0')) return;
    return 'Insufficient balance';
  })();

  const setDeltaType = (deltaType: DeltaType) => {
    const delta = toDelta(deltaType, buy.startPrice, sell.startPrice);
    setDelta({ deltaPrice: delta, deltaType });
  };

  return (
    <article className="grid gap-16" aria-labelledby={titleId}>
      <header className="flex items-center justify-between gap-8">
        <OrderTitle direction={buy.direction} titleId={titleId} base={base} />
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
                {getType(type, quote)}
                <KeyboardArrowDownIcon className="size-24" />
              </button>
            )}
          >
            {deltaTypes.map((deltaType) => (
              <button
                key={deltaType}
                className="rounded-sm py-8 px-16 hover:bg-main-900/40 aria-checked:bg-main-900/60"
                role="menuitem"
                aria-checked={deltaType === type}
                onClick={() => setDeltaType(deltaType)}
              >
                {getType(deltaType, quote)}
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
            value={delta}
            step="any"
            min="0"
            onChange={(e) => setDelta({ deltaPrice: e.target.value })}
          />
        </div>
      </div>
      <div role="group" className="grid gap-8">
        <h3 className="text-14 font-medium flex items-center gap-6 capitalize text-main-0/60">
          Set {buy.direction} Price
        </h3>
        <GradientPriceRange
          base={base}
          quote={quote}
          direction={buy.direction}
          start={buy.startPrice}
          end={buy.endPrice}
          // This is not triggered in disable mode.
          setStart={() => undefined}
          setEnd={() => undefined}
          disabled
        />
      </div>
      <div role="group" className="grid gap-8">
        <label
          htmlFor={budgetId}
          className="text-14 font-medium capitalize text-main-0/60"
        >
          Set {buy.direction} Budget
        </label>
        <InputBudget
          editType="deposit"
          id={budgetId}
          token={buy.direction === 'buy' ? quote : base}
          value={buy.budget}
          onChange={(budget) => setBuy({ budget })}
          max={balance.data || '0'}
          maxIsLoading={balance.isPending}
          error={insufficientBalance}
          data-testid="input-budget"
        />
      </div>
      <GradientFullOutcome base={base} quote={quote} order={buy} />
    </article>
  );
};

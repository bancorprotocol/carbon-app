import { FC, ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { cn } from 'utils/helpers';
import { OrderBlock } from 'components/strategies/common/types';

interface Props {
  children: ReactNode;
  order: OrderBlock;
  base: Token;
  buy?: boolean;
  setOrder: (value: Partial<OrderBlock>) => void;
}

export const OrderHeader: FC<Props> = (props) => {
  const { order, buy, children, base, setOrder } = props;
  const isRange = order.settings === 'range';
  const setLimit = () => {
    if (!isRange) return;
    setOrder({ settings: 'limit', min: '', max: '' });
  };
  const setRange = () => {
    if (isRange) return;
    setOrder({ settings: 'range', min: '', max: '' });
  };
  return (
    <header className="flex items-center justify-between">
      {children}
      <div className="text-14 flex items-center gap-10">
        <div className="flex items-center rounded-[100px] bg-black p-2">
          <button
            type="button"
            tabIndex={!isRange ? -1 : 0}
            onClick={setLimit}
            className={cn(
              'rounded-40 font-weight-500',
              !isRange ? 'bg-background-900' : 'text-white/60',
              'px-10 py-4'
            )}
            data-testid="tab-limit"
          >
            Limit
          </button>
          <button
            type="button"
            tabIndex={isRange ? -1 : 0}
            onClick={setRange}
            className={cn(
              'rounded-40 font-weight-500',
              isRange ? 'bg-background-900' : 'text-white/60',
              'px-10 py-4'
            )}
            data-testid="tab-range"
          >
            Range
          </button>
        </div>
        <Tooltip
          sendEventOnMount={{ buy }}
          iconClassName="text-white/60"
          element={
            <>
              This section will define the order details in which you are
              willing to {buy ? 'buy' : 'sell'} {base.symbol} at.
              <br />
              <b>Limit</b> will allow you to define a specific price point to{' '}
              {buy ? 'buy' : 'sell'} the token at.
              <br />
              <b>Range</b> will allow you to define a range of prices to{' '}
              {buy ? 'buy' : 'sell'} the token at.
            </>
          }
        />
      </div>
    </header>
  );
};

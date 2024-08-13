import { FC, ReactNode } from 'react';
import { Token } from 'libs/tokens';
import { cn } from 'utils/helpers';
import { OrderBlock } from 'components/strategies/common/types';
import { StrategySettings } from 'libs/routing';

interface Props {
  children?: ReactNode;
  order: OrderBlock;
  base: Token;
  buy?: boolean;
  setSettings: (value: StrategySettings) => void;
}

export const OrderHeader: FC<Props> = (props) => {
  const { order, children, setSettings } = props;
  const isRange = order.settings === 'range';
  const setLimit = () => {
    if (!isRange) return;
    setSettings('limit');
  };
  const setRange = () => {
    if (isRange) return;
    setSettings('range');
  };
  return (
    <header className="flex items-center justify-between">
      {children}
      <div className="text-14 flex items-center rounded-full bg-black p-2">
        <button
          type="button"
          tabIndex={!isRange ? -1 : 0}
          onClick={setLimit}
          className={cn(
            'rounded-40 font-weight-500',
            !isRange
              ? 'bg-background-800'
              : 'text-white/60 hover:text-white/80',
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
            isRange
              ? 'bg-background-800'
              : 'text-white/60  hover:text-white/80',
            'px-10 py-4'
          )}
          data-testid="tab-range"
        >
          Range
        </button>
      </div>
    </header>
  );
};

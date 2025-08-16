import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';
import { FC, ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { cn } from 'utils/helpers';

interface Props {
  children: ReactNode;
  order: StrategyInputOrder;
  dispatch: StrategyInputDispatch;
  base: Token;
  isBuy?: boolean;
}

export const BuySellHeader: FC<Props> = (props) => {
  const { order, isBuy, children, base, dispatch } = props;
  const { isRange } = order;

  const type = isBuy ? 'buy' : 'sell';

  const setLimit = () => {
    if (!isRange) return;
    dispatch(`${type}IsRange`, false);

    const value = isBuy ? order.max : order.min;
    const attr = isBuy ? 'Min' : 'Max';
    dispatch(`${type}${attr}`, value);
  };
  const setRange = () => {
    if (isRange) return;
    dispatch(`${type}IsRange`, true);

    const attr = isBuy ? 'Min' : 'Max';
    const multiplier = isBuy ? 0.9 : 1.1;
    dispatch(`${type}${attr}`, (Number(order.min) * multiplier).toString());
  };

  return (
    <header className="flex items-center justify-between">
      {children}
      <div className="text-14 flex items-center gap-10">
        <div className="flex items-center rounded-[100px] bg-black-gradient p-2">
          <button
            type="button"
            tabIndex={!isRange ? -1 : 0}
            onClick={setLimit}
            className={cn(
              'rounded-full font-medium',
              !isRange
                ? 'bg-black-gradient'
                : 'text-white/60 hover:text-white/80',
              'px-10 py-4',
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
              'rounded-full font-medium',
              isRange
                ? 'bg-black-gradient'
                : 'text-white/60 hover:text-white/80',
              'px-10 py-4',
            )}
            data-testid="tab-range"
          >
            Range
          </button>
        </div>
        <Tooltip
          iconClassName="text-white/60"
          element={
            <p>
              This section will define the order details in which you are
              willing to {isBuy ? 'buy' : 'sell'} {base.symbol} at.
              <br />
              <b>Limit</b> will allow you to define a specific price point to{' '}
              {isBuy ? 'buy' : 'sell'} the token at.
              <br />
              <b>Range</b> will allow you to define a range of prices to{' '}
              {isBuy ? 'buy' : 'sell'} the token at.
            </p>
          }
        />
      </div>
    </header>
  );
};

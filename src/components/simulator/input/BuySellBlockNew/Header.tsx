import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';
import { FC, ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';

interface Props {
  children: ReactNode;
  order: StrategyInputOrder;
  dispatch: StrategyInputDispatch;
  base: Token;
  buy?: boolean;
}

export const BuySellHeader: FC<Props> = (props) => {
  const { order, buy, children, base, dispatch } = props;
  const { isRange } = order;

  const type = buy ? 'buy' : 'sell';

  const setLimit = () => {
    if (!isRange) return;
    dispatch(`${type}IsRange`, false);

    const value = buy ? order.max : order.min;
    const attr = buy ? 'Min' : 'Max';
    dispatch(`${type}${attr}`, value);
  };
  const setRange = () => {
    if (isRange) return;
    dispatch(`${type}IsRange`, true);

    const attr = buy ? 'Min' : 'Max';
    const multiplier = buy ? 0.9 : 1.1;
    dispatch(`${type}${attr}`, (Number(order.min) * multiplier).toString());
  };

  return (
    <header className="flex items-center justify-between">
      {children}
      <div className="flex items-center gap-10 text-14">
        <div className="bg-body flex items-center rounded-[100px] p-2">
          <button
            type="button"
            tabIndex={!isRange ? -1 : 0}
            onClick={setLimit}
            className={`rounded-40 font-weight-500 ${
              !isRange ? 'bg-silver' : 'text-secondary'
            } px-10 py-4`}
            data-testid="tab-limit"
          >
            Limit
          </button>
          <button
            type="button"
            tabIndex={isRange ? -1 : 0}
            onClick={setRange}
            className={`rounded-40 font-weight-500 ${
              isRange ? 'bg-silver' : 'text-secondary'
            } px-10 py-4`}
            data-testid="tab-range"
          >
            Range
          </button>
        </div>
        <Tooltip
          sendEventOnMount={{ buy }}
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

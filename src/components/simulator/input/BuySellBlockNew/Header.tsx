import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';
import { FC, ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';

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
        <RadioGroup>
          <Radio
            checked={!isRange}
            onChange={setLimit}
            className="py-2"
            data-testid="tab-limit"
          >
            Limit
          </Radio>
          <Radio
            checked={isRange}
            onChange={setRange}
            className="py-2"
            data-testid="tab-range"
          >
            Range
          </Radio>
        </RadioGroup>
        <Tooltip
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
        >
          <IconTooltip className="size-18 text-white/60" />
        </Tooltip>
      </div>
    </header>
  );
};

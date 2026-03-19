import { FC, useId } from 'react';
import { OrderBlock } from 'components/strategies/common/types';
import { StrategySettings } from 'libs/routing';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import IconTooltip from 'assets/icons/tooltip.svg?react';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { OrderTitle, OrderTitleProps } from './OrderTitle';

interface Props extends OrderTitleProps {
  order: OrderBlock;
  setSettings?: (value: StrategySettings) => any;
}

export const OrderHeader: FC<Props> = (props) => {
  const { order, direction, base, setSettings } = props;
  const settingName = useId();
  const isBuy = direction === 'buy';
  return (
    <header className="grid xs:flex items-center gap-8">
      <OrderTitle {...props} />
      {setSettings && (
        <div className="flex gap-8 items-center">
          <RadioGroup
            aria-label="Change strategy settings"
            className="max-xs:flex-1 grid grid-flow-col text-center"
          >
            <Radio
              name={settingName}
              checked={order.settings !== 'range'}
              onChange={() => setSettings('limit')}
              data-testid="tab-limit"
              className="px-8 py-2"
            >
              Limit
            </Radio>
            <Radio
              name={settingName}
              checked={order.settings === 'range'}
              onChange={() => setSettings('range')}
              data-testid="tab-range"
              className="px-8 py-2"
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
            <IconTooltip className="size-18 text-main-0/60" />
          </Tooltip>
        </div>
      )}
    </header>
  );
};

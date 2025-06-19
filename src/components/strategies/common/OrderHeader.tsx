import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { OrderBlock } from 'components/strategies/common/types';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { LogoImager } from 'components/common/imager/Imager';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';

interface Props {
  titleId: string;
  order: OrderBlock;
  base: Token;
  direction: StrategyDirection;
  setSettings?: (value: StrategySettings) => any;
}

export const OrderHeader: FC<Props> = (props) => {
  const { titleId, order, direction, base, setSettings } = props;
  const settingName = useId();
  const tooltipText = `This section will define the order details in which you are willing to ${direction} ${base.symbol} at.`;
  const isBuy = direction === 'buy';
  return (
    <header className="flex items-center gap-10">
      <h2 className="text-18 me-auto flex items-center gap-8" id={titleId}>
        <Tooltip element={tooltipText}>
          <span>{isBuy ? 'Buy Low' : 'Sell High'}</span>
        </Tooltip>
        <LogoImager alt="Token" src={base.logoURI} className="size-18" />
        <span>{base.symbol}</span>
      </h2>
      {setSettings && (
        <RadioGroup aria-label="Change strategy settings">
          <Radio
            name={settingName}
            checked={order.settings !== 'range'}
            onChange={() => setSettings('limit')}
            data-testid="tab-limit"
          >
            Limit
          </Radio>
          <Radio
            name={settingName}
            checked={order.settings === 'range'}
            onChange={() => setSettings('range')}
            data-testid="tab-range"
          >
            Range
          </Radio>
        </RadioGroup>
      )}
      <Tooltip
        iconClassName="text-white/60"
        element={
          <p>
            This section will define the order details in which you are willing
            to {isBuy ? 'buy' : 'sell'} {base.symbol} at.
            <br />
            <b>Limit</b> will allow you to define a specific price point to{' '}
            {isBuy ? 'buy' : 'sell'} the token at.
            <br />
            <b>Range</b> will allow you to define a range of prices to{' '}
            {isBuy ? 'buy' : 'sell'} the token at.
          </p>
        }
      />
    </header>
  );
};

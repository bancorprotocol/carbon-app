import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { InputLimit } from 'components/strategies/common/InputLimit';
import { InputRange } from 'components/strategies/common/InputRange';
import {
  PriceLabelLimit,
  PriceLegendRange,
} from 'components/strategies/common/PriceLabel';
import { OrderBlock } from './types';
import { StrategyDirection } from 'libs/routing';

type Props = {
  base: Token;
  quote: Token;
  order: OrderBlock;
  direction: StrategyDirection;
  error?: string;
  warnings?: (string | undefined)[];
  setMin: (value: string) => void;
  setMax: (value: string) => void;
  setPrice: (value: string) => void;
};

export const LimitRangeOrder: FC<Props> = ({
  base,
  quote,
  order,
  direction,
  error,
  warnings,
  setMin,
  setMax,
  setPrice,
}) => {
  const inputId = useId();

  if (order.settings === 'range') {
    return (
      <div role="group" className="grid gap-8">
        <PriceLegendRange direction={direction} base={base} quote={quote} />
        <InputRange
          base={base}
          quote={quote}
          min={order.min}
          setMin={setMin}
          max={order.max}
          setMax={setMax}
          isBuy={direction === 'buy'}
          error={error}
          warnings={warnings}
          required
        />
      </div>
    );
  } else {
    return (
      <div className="grid gap-8">
        <PriceLabelLimit
          direction={direction}
          base={base}
          quote={quote}
          inputId={inputId}
        />
        <InputLimit
          id={inputId}
          base={base}
          quote={quote}
          price={order.min}
          setPrice={setPrice}
          isBuy={direction === 'buy'}
          error={error}
          warnings={warnings}
          required
        />
      </div>
    );
  }
};

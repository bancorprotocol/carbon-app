import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';
import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { InputLimit } from 'components/strategies/common/InputLimit';
import { InputRange } from 'components/strategies/common/InputRange';
import {
  PriceLabelLimit,
  PriceLegendRange,
} from 'components/strategies/common/PriceLabel';

type Props = {
  base: Token;
  quote: Token;
  order: StrategyInputOrder;
  dispatch: StrategyInputDispatch;
  isBuy?: boolean;
  isOrdersOverlap: boolean;
  isOrdersReversed: boolean;
};

export const LimitRangeSection: FC<Props> = ({
  base,
  quote,
  order,
  dispatch,
  isBuy = false,
  isOrdersOverlap,
  isOrdersReversed,
}) => {
  const { isRange } = order;
  const direction = isBuy ? 'buy' : 'sell';
  const inputId = useId();

  const getWarnings = () => {
    const warnings = [];
    if (isOrdersOverlap && !isOrdersReversed) {
      warnings.push('Notice: your Buy and Sell orders overlap');
    }
    return warnings;
  };

  if (isRange) {
    return (
      <fieldset>
        <PriceLegendRange direction={direction} base={base} quote={quote} />
        <InputRange
          quote={quote}
          base={base}
          min={order.min}
          setMin={(value) => dispatch(`${direction}Min`, value)}
          max={order.max}
          setMax={(value) => dispatch(`${direction}Max`, value)}
          isBuy={isBuy}
          warnings={getWarnings()}
        />
      </fieldset>
    );
  } else {
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
        setPrice={(value) => {
          dispatch(`${direction}Min`, value);
          dispatch(`${direction}Max`, value);
        }}
        isBuy={isBuy}
        warnings={getWarnings()}
      />
    </div>;
    return;
  }
};

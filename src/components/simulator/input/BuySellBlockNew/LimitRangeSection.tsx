import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';
import { FC, ReactNode } from 'react';
import { Token } from 'libs/tokens';
import { InputLimit } from 'components/strategies/common/InputLimit';
import { InputRange } from 'components/strategies/common/InputRange';

type Props = {
  base: Token;
  quote: Token;
  order: StrategyInputOrder;
  dispatch: StrategyInputDispatch;
  inputTitle: ReactNode | string;
  buy?: boolean;
  isOrdersOverlap: boolean;
  isOrdersReversed: boolean;
};

export const LimitRangeSection: FC<Props> = ({
  base,
  quote,
  order,
  dispatch,
  inputTitle,
  buy = false,
  isOrdersOverlap,
  isOrdersReversed,
}) => {
  const { isRange } = order;
  const type = buy ? 'buy' : 'sell';

  const getWarnings = () => {
    const warnings = [];
    if (isOrdersOverlap && !isOrdersReversed) {
      warnings.push('Notice: your Buy and Sell orders overlap');
    }
    return warnings;
  };

  return (
    <fieldset className="flex flex-col gap-8">
      <legend className="text-14 font-weight-500 mb-11 flex items-center gap-6">
        {inputTitle}
      </legend>
      {isRange ? (
        <InputRange
          quote={quote}
          base={base}
          min={order.min}
          setMin={(value) => dispatch(`${type}Min`, value)}
          max={order.max}
          setMax={(value) => dispatch(`${type}Max`, value)}
          buy={buy}
          warnings={getWarnings()}
        />
      ) : (
        <InputLimit
          base={base}
          quote={quote}
          price={order.min}
          setPrice={(value) => {
            dispatch(`${type}Min`, value);
            dispatch(`${type}Max`, value);
          }}
          buy={buy}
          warnings={getWarnings()}
        />
      )}
    </fieldset>
  );
};

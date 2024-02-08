import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';
import { FC, ReactNode, useCallback } from 'react';
import { Token } from 'libs/tokens';
import { InputLimit } from 'components/strategies/create/BuySellBlock/InputLimit';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { useMarketIndication } from 'components/strategies/marketPriceIndication/useMarketIndication';

type Props = {
  base: Token;
  quote: Token;
  order: StrategyInputOrder;
  dispatch: StrategyInputDispatch;
  inputTitle: ReactNode | string;
  buy?: boolean;
  isOrdersOverlap: boolean;
  isEdit?: boolean;
  ignoreMarketPriceWarning?: boolean;
};

export const LimitRangeSection: FC<Props> = ({
  base,
  quote,
  order,
  dispatch,
  inputTitle,
  buy = false,
  isOrdersOverlap,
  isEdit,
  ignoreMarketPriceWarning,
}) => {
  const { isRange } = order;
  const { marketPricePercentage, isOrderAboveOrBelowMarketPrice } =
    useMarketIndication({
      base,
      quote,
      order: { ...order, price: order.min },
      buy,
    });

  const overlappingOrdersPricesMessage =
    'Notice: your Buy and Sell orders overlap';

  const warningMarketPriceMessage = buy
    ? `Notice: you offer to buy ${base.symbol} above current market price`
    : `Notice: you offer to sell ${base.symbol} below current market price`;

  const type = buy ? 'buy' : 'sell';

  const setPriceError = useCallback(
    (value: string) => {
      dispatch(`${type}PriceError`, value);
    },
    [dispatch, type]
  );

  return (
    <fieldset className="flex flex-col gap-8">
      <legend className="mb-11 flex items-center gap-6 text-14 font-weight-500">
        {inputTitle}
      </legend>
      {isRange ? (
        <InputRange
          min={order.min}
          setMin={(value) => dispatch(`${type}Min`, value)}
          max={order.max}
          setMax={(value) => dispatch(`${type}Max`, value)}
          error={order.priceError}
          setRangeError={setPriceError}
          quote={quote}
          base={base}
          buy={buy}
          marketPricePercentages={marketPricePercentage}
        />
      ) : (
        <InputLimit
          token={quote}
          price={order.min}
          setPrice={(value) => {
            dispatch(`${type}Min`, value);
            dispatch(`${type}Max`, value);
          }}
          error={isEdit ? undefined : order.priceError}
          setPriceError={setPriceError}
          buy={buy}
          marketPricePercentage={marketPricePercentage}
        />
      )}
      {isOrdersOverlap && !buy && (
        <WarningMessageWithIcon message={overlappingOrdersPricesMessage} />
      )}
      {isOrderAboveOrBelowMarketPrice && !ignoreMarketPriceWarning && (
        <WarningMessageWithIcon message={warningMarketPriceMessage} />
      )}
    </fieldset>
  );
};

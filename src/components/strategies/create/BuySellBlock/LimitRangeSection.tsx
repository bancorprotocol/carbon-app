import { FC, ReactNode } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { InputLimit } from 'components/strategies/create/BuySellBlock/InputLimit';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { useMarketIndication } from 'components/strategies/marketPriceIndication/useMarketIndication';

type Props = {
  base: Token;
  quote: Token;
  order: OrderCreate;
  inputTitle: ReactNode | string;
  buy?: boolean;
  isOrdersOverlap: boolean;
  isEdit?: boolean;
};

export const LimitRangeSection: FC<Props> = ({
  base,
  quote,
  order,
  inputTitle,
  buy = false,
  isOrdersOverlap,
  isEdit,
}) => {
  const { isRange } = order;
  const { marketPricePercentage, isOrderAboveOrBelowMarketPrice } =
    useMarketIndication({ base, quote, order, buy });

  const overlappingOrdersPricesMessage =
    'Notice: your Buy and Sell orders overlap';

  const warningMarketPriceMessage = buy
    ? `Notice: you offer to buy ${base.symbol} above current market price`
    : `Notice: you offer to sell ${base.symbol} below current market price`;

  return (
    <fieldset className="flex flex-col gap-8">
      <legend className="mb-11 flex items-center gap-6 text-14 font-weight-500">
        {inputTitle}
      </legend>
      {isRange ? (
        <InputRange
          min={order.min}
          setMin={order.setMin}
          max={order.max}
          setMax={order.setMax}
          error={order.rangeError}
          setRangeError={order.setRangeError}
          quote={quote}
          base={base}
          buy={buy}
          marketPricePercentages={marketPricePercentage}
        />
      ) : (
        <InputLimit
          token={quote}
          price={order.price}
          setPrice={order.setPrice}
          error={isEdit ? undefined : order.priceError}
          setPriceError={order.setPriceError}
          buy={buy}
          marketPricePercentage={marketPricePercentage}
        />
      )}
      {isOrdersOverlap && !buy && (
        <WarningMessageWithIcon message={overlappingOrdersPricesMessage} />
      )}
      {isOrderAboveOrBelowMarketPrice && (
        <WarningMessageWithIcon message={warningMarketPriceMessage} />
      )}
    </fieldset>
  );
};

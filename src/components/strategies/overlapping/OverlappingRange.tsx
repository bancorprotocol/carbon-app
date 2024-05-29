import { FC, useEffect, useState } from 'react';
import { OrderCreate } from '../create/useOrder';
import { InputRange } from '../create/BuySellBlock/InputRange';
import { Token } from 'libs/tokens';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { useUserMarketPrice } from '../UserMarketPrice';
import { marketPricePercent } from '../marketPriceIndication/useMarketIndication';
import { SafeDecimal } from 'libs/safedecimal';
import { formatNumber } from 'utils/helpers';

interface Props {
  base: Token;
  quote: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  spread: number;
  setMin: (value: string) => void;
  setMax: (value: string) => void;
}

const getPriceWarnings = (isOutOfMarket: boolean): string[] => {
  if (!isOutOfMarket) return [];
  return [
    'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.',
  ];
};

export const OverlappingRange: FC<Props> = (props) => {
  const { base, quote, order0, order1, spread } = props;
  const [warnings, setWarnings] = useState<string[]>([]);
  const marketPrice = useUserMarketPrice({ base, quote });
  const marketPricePercentage = {
    min: marketPricePercent(order0.min, marketPrice),
    max: marketPricePercent(order1.max, marketPrice),
    price: new SafeDecimal(0),
  };

  useEffect(() => {
    if (!marketPrice) return;
    const prices = calculateOverlappingPrices(
      formatNumber(order0.min || '0'),
      formatNumber(order1.max || '0'),
      marketPrice.toString(),
      spread.toString()
    );
    const minAboveMarket = isMinAboveMarket({
      min: prices.buyPriceLow,
      marginalPrice: prices.buyPriceMarginal,
    });
    const maxBelowMarket = isMaxBelowMarket({
      max: prices.sellPriceHigh,
      marginalPrice: prices.sellPriceMarginal,
    });
    setWarnings(getPriceWarnings(minAboveMarket || maxBelowMarket));
  }, [marketPrice, order0.min, order1.max, spread]);

  return (
    <InputRange
      base={base}
      quote={quote}
      min={order0.min}
      max={order1.max}
      setMin={props.setMin}
      setMax={props.setMax}
      minLabel="Min Buy Price"
      maxLabel="Max Sell Price"
      error={order0.rangeError}
      setRangeError={order0.setRangeError}
      warnings={warnings}
      marketPricePercentages={marketPricePercentage}
      isOverlapping
    />
  );
};

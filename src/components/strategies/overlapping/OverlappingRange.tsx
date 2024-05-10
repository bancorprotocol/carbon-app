import { FC } from 'react';
import { OrderCreate } from '../create/useOrder';
import { InputRange } from '../create/BuySellBlock/InputRange';
import { Token } from 'libs/tokens';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';

interface Props {
  base: Token;
  quote: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  spread: number;
  setMin: (value: string) => void;
  setMax: (value: string) => void;
  marketPricePercentage: MarketPricePercentage;
}

const getPriceWarnings = (isOutOfMarket: boolean): string[] => {
  if (!isOutOfMarket) return [];
  return [
    'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.',
  ];
};

export const OverlappingRange: FC<Props> = (props) => {
  const { base, quote, order0, order1, spread, marketPricePercentage } = props;
  const marketPrice = useMarketPrice({ base, quote });

  const prices = calculateOverlappingPrices(
    order0.min || '0',
    order1.max || '0',
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
  const priceWarnings = getPriceWarnings(minAboveMarket || maxBelowMarket);

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
      warnings={priceWarnings}
      marketPricePercentages={marketPricePercentage}
    />
  );
};

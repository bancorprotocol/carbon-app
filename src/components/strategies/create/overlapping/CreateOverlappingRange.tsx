import { FC, useEffect } from 'react';
import { OrderCreate } from '../useOrder';
import { InputRange } from '../BuySellBlock/InputRange';
import { Token } from 'libs/tokens';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication';
import {
  getMaxBuyMin,
  getMinSellMax,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';

interface Props {
  base: Token;
  quote: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  marketPricePercentage: MarketPricePercentage;
  spreadPPM: number;
}

const getPriceWarnings = (isOutOfMarket: boolean): string[] => {
  if (!isOutOfMarket) return [];
  return [
    'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.',
  ];
};

export const CreateOverlappingRange: FC<Props> = (props) => {
  const { base, quote, order0, order1, spreadPPM, marketPricePercentage } =
    props;
  const minAboveMarket = isMinAboveMarket(order0, quote);
  const maxBelowMarket = isMaxBelowMarket(order1, quote);

  const priceWarnings = getPriceWarnings(minAboveMarket || maxBelowMarket);

  // Update sell.max on buy.min change if needed
  useEffect(() => {
    const timeout = setTimeout(() => {
      const buyMin = Number(order0.min);
      const minSellMax = getMinSellMax(buyMin, spreadPPM);
      if (minSellMax > Number(order1.max)) order1.setMax(minSellMax.toString());
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min, order1.setMax]);

  // Update buy.min on sell.max change if needed
  useEffect(() => {
    const timeout = setTimeout(() => {
      const sellMax = Number(order1.max);
      const maxBuyMin = getMaxBuyMin(sellMax, spreadPPM);
      if (maxBuyMin < Number(order0.min)) order0.setMin(maxBuyMin.toString());
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max, order0.setMin]);

  return (
    <InputRange
      base={base}
      quote={quote}
      min={order0.min}
      max={order1.max}
      setMin={order0.setMin}
      setMax={order1.setMax}
      minLabel="Min Buy Price"
      maxLabel="Max Sell Price"
      setRangeError={order0.setRangeError} // Should not happen as we force price
      warnings={priceWarnings}
      marketPricePercentages={marketPricePercentage}
    />
  );
};

import { FC } from 'react';
import { OrderCreate } from '../useOrder';
import { InputRange } from '../BuySellBlock/InputRange';
import { Token } from 'libs/tokens';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication';
import {
  getMaxBuyMin,
  getMinSellMax,
} from 'components/strategies/overlapping/utils';

interface Props {
  base: Token;
  quote: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  marketPricePercentage: MarketPricePercentage;
  spreadPPM: number;
}

const getPriceWarnings = ({ min, max }: MarketPricePercentage): string[] => {
  const aboveOrBelowMarket = min.gt(0) || max.lt(0);
  if (!aboveOrBelowMarket) return [];
  return [
    'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.',
  ];
};

export const CreateOverlappingRange: FC<Props> = (props) => {
  const { base, quote, order0, order1, spreadPPM, marketPricePercentage } =
    props;
  const priceWarnings = getPriceWarnings(marketPricePercentage);

  const setBuyMin = (value: string) => {
    order0.setMin(value);
    const buyMin = Number(value);
    const minSellMax = getMinSellMax(buyMin, spreadPPM);
    if (minSellMax > Number(order1.max)) order1.setMax(minSellMax.toString());
  };
  const setSellMax = (value: string) => {
    order1.setMax(value);
    const sellMax = Number(value);
    const maxBuyMin = getMaxBuyMin(sellMax, spreadPPM);
    if (maxBuyMin < Number(order0.min)) order0.setMin(maxBuyMin.toString());
  };

  return (
    <InputRange
      base={base}
      quote={quote}
      min={order0.min}
      max={order1.max}
      setMin={setBuyMin}
      setMax={setSellMax}
      minLabel="Min Buy Price"
      maxLabel="Max Sell Price"
      setRangeError={order0.setRangeError} // Should not happen as we force price
      warnings={priceWarnings}
      marketPricePercentages={marketPricePercentage}
    />
  );
};

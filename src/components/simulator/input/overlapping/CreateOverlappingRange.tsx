import { FC } from 'react';
import { InputRange } from '../../../strategies/create/BuySellBlock/InputRange';
import { Token } from 'libs/tokens';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication';

interface Props {
  base: Token;
  quote: Token;
  min: string;
  max: string;
  error?: string;
  setError: (value: string) => void;
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

export const CreateOverlappingRange: FC<Props> = (props) => {
  const { base, quote, min, max, marketPricePercentage, error, setError } =
    props;
  // TODO - reenable when used in create strategy
  // const minAboveMarket = isMinAboveMarket(order0);
  // const maxBelowMarket = isMaxBelowMarket(order1);
  // const priceWarnings = getPriceWarnings(minAboveMarket || maxBelowMarket);

  return (
    <InputRange
      base={base}
      quote={quote}
      // min={order0.min}
      // max={order1.max}
      min={min}
      max={max}
      setMin={props.setMin}
      setMax={props.setMax}
      minLabel="Min Buy Price"
      maxLabel="Max Sell Price"
      error={error}
      setRangeError={setError}
      // warnings={priceWarnings}
      // marketPricePercentages={marketPricePercentage}
    />
  );
};

import { Token } from 'libs/tokens';
import { FC } from 'react';
import { MarketPricePercent } from './MarketPricePercent';
import { marketPricePercent } from './useMarketPercent';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useStrategyMarketPrice } from '../UserMarketPrice';

interface Props {
  base: Token;
  quote: Token;
  price: string;
  ignoreMarketPriceWarning?: boolean;
  isBuy?: boolean;
}
export const MarketPriceIndication: FC<Props> = (props) => {
  const { base, quote, price, ignoreMarketPriceWarning, isBuy } = props;
  const { marketPrice } = useStrategyMarketPrice({ base, quote });
  const marketPercent = marketPricePercent(price, marketPrice);
  const { getFiatAsString, selectedFiatCurrency } = useFiatCurrency(quote);
  const fiatAsString = getFiatAsString(price);

  if (!marketPrice)
    return (
      <span className="text-12 text-white/60">
        {selectedFiatCurrency} value unavailable
      </span>
    );

  return (
    <p className="flex flex-wrap items-center gap-8">
      <span className="text-12 break-all text-white/60">{fiatAsString}</span>
      <MarketPricePercent
        ignoreMarketPriceWarning={ignoreMarketPriceWarning}
        marketPricePercentage={marketPercent}
        isBuy={isBuy}
      />
    </p>
  );
};

import { useMarketPrice } from 'hooks/useMarketPrice';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { MarketPricePercent } from './MarketPricePercent';
import { marketPricePercent } from './useMarketPercent';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

interface Props {
  base: Token;
  quote: Token;
  price: string;
  ignoreMarketPriceWarning?: boolean;
  buy?: boolean;
  isRange?: boolean;
}
export const MarketPriceIndication: FC<Props> = (props) => {
  const { base, quote, price, ignoreMarketPriceWarning, buy, isRange } = props;
  const { marketPrice } = useMarketPrice({ base, quote });
  const marketPercent = marketPricePercent(price, marketPrice);
  const { getFiatAsString } = useFiatCurrency(quote);
  const fiatAsString = getFiatAsString(price);
  if (!marketPrice) return;
  return (
    <p className="flex flex-wrap items-center gap-8">
      <span className="text-12 break-all text-white/60">{fiatAsString}</span>
      <MarketPricePercent
        ignoreMarketPriceWarning={ignoreMarketPriceWarning}
        marketPricePercentage={marketPercent}
        buy={buy}
        isRange={isRange}
      />
    </p>
  );
};

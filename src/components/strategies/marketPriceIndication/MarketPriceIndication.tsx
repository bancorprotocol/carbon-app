import { useMarketPrice } from 'hooks/useMarketPrice';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { MarketPricePercent } from './MarketPricePercent';
import { marketPricePercent } from './useMarketPercent';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useSearch } from '@tanstack/react-router';

interface Props {
  base: Token;
  quote: Token;
  price: string;
  ignoreMarketPriceWarning?: boolean;
  buy?: boolean;
}
export const MarketPriceIndication: FC<Props> = (props) => {
  const { base, quote, price, ignoreMarketPriceWarning, buy } = props;
  const search = useSearch({ strict: false }) as { marketPrice?: string };
  const query = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? query.marketPrice;
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
        buy={buy}
      />
    </p>
  );
};

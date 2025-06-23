import { useSearch } from '@tanstack/react-router';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { Token } from 'libs/tokens';

interface MarketPriceProps {
  base?: Token;
  quote?: Token;
}
/** Use external market price or user price */
export const useStrategyMarketPrice = ({ base, quote }: MarketPriceProps) => {
  const search = useSearch({ strict: false });
  const query = useMarketPrice({ base, quote });
  return {
    marketPrice: search.marketPrice || query.marketPrice?.toString(),
    isPending: !search.marketPrice && query.isPending,
  };
};

import { useSearch, useMatchRoute, TradeSearch } from 'libs/routing';
import { useTokens } from 'hooks/useTokens';

export const useTradeTokens = () => {
  const match = useMatchRoute();
  const isTradePage = match({
    to: '/trade',
    fuzzy: true,
  });
  const { getTokenById } = useTokens();
  const search: TradeSearch = useSearch({ strict: false });

  const baseToken = getTokenById(search.base);
  const quoteToken = getTokenById(search.quote);

  const isTokenError =
    (search.base && !baseToken) || (search.base && !quoteToken);

  return {
    isTradePage,
    baseToken,
    quoteToken,
    isTokenError,
  };
};

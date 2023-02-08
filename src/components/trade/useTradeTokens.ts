import { MakeGenerics, PathNames, useSearch, useLocation } from 'libs/routing';
import { useTokens } from 'hooks/useTokens';

type MyLocationGenerics = MakeGenerics<{
  Search: {
    base: string;
    quote: string;
  };
}>;

export const useTradeTokens = () => {
  const location = useLocation<MyLocationGenerics>();
  const isTradePage = location.current.pathname === PathNames.trade;
  const { getTokenById } = useTokens();
  const search = useSearch<MyLocationGenerics>();

  const baseToken = getTokenById(search.base!);
  const quoteToken = getTokenById(search.quote!);

  const isTokenError =
    (search.base && !baseToken) || (search.base && !quoteToken);

  return {
    isTradePage,
    baseToken,
    quoteToken,
    isTokenError,
  };
};

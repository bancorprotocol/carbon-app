import {
  MakeGenerics,
  PathNames,
  useSearch,
  useLocation,
  useNavigate,
} from 'libs/routing';
import { useTokens } from 'hooks/useTokens';

export type MyLocationGenerics = MakeGenerics<{
  Search: {
    base: string;
    quote: string;
  };
}>;

export const useTradeTokens = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const location = useLocation<MyLocationGenerics>();
  const isTradePage = location.current.pathname === PathNames.trade;
  const { getTokenById } = useTokens();
  const search = useSearch<MyLocationGenerics>();

  const baseToken = getTokenById(search.base!);
  const quoteToken = getTokenById(search.quote!);

  const goToPair = (base: string, quote: string) =>
    navigate({ to: PathNames.trade, search: { base, quote }, replace: true });

  const isTokenError =
    (search.base && !baseToken) || (search.base && !quoteToken);

  return {
    isTradePage,
    baseToken,
    quoteToken,
    isTokenError,
    goToPair,
  };
};

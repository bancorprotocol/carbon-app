import {
  MakeGenerics,
  PathNames,
  useSearch,
  useNavigate,
  useLocation,
} from 'libs/routing';
import { useTokens } from 'libs/tokens';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useModal } from 'libs/modals';
import { useGetTradePairsData } from 'libs/queries/chain/pairs';
import { useMemo } from 'react';

type MyLocationGenerics = MakeGenerics<{
  Search: {
    base: string;
    quote: string;
  };
}>;

export const useTrade = () => {
  const { openModal } = useModal();

  const location = useLocation<MyLocationGenerics>();
  const navigate = useNavigate<MyLocationGenerics>();
  const isTradePage = location.current.pathname === PathNames.trade;
  const { getTokenById } = useTokens();
  const search = useSearch<MyLocationGenerics>();

  const pairsQuery = useGetTradePairsData();

  const baseToken = getTokenById(search.base!);
  const quoteToken = getTokenById(search.quote!);

  const isTokenError =
    (search.base && !baseToken) || (search.base && !quoteToken);

  const onTradePairSelect = (tradePair: TradePair) => {
    navigate({
      to: PathNames.trade,
      search: {
        base: tradePair.baseToken.address,
        quote: tradePair.quoteToken.address,
      },
    });
  };

  const tradePairs = useMemo<TradePair[]>(() => {
    if (!pairsQuery.data) return [];
    return pairsQuery.data;
  }, [pairsQuery.data]);

  const openTradePairList = () => {
    openModal('tradeTokenList', { onClick: onTradePairSelect, tradePairs });
  };

  return {
    isTradePage,
    baseToken,
    quoteToken,
    tradePairs,
    openTradePairList,
    isTokenError,
    isLoading: pairsQuery.isLoading,
  };
};

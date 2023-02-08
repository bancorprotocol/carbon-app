import { MakeGenerics, PathNames, useSearch, useNavigate } from 'libs/routing';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useModal } from 'hooks/useModal';
import { useGetTradePairsData } from 'libs/queries/sdk/pairs';
import { useMemo } from 'react';

type MyLocationGenerics = MakeGenerics<{
  Search: {
    base: string;
    quote: string;
  };
}>;

export const useTradePairs = () => {
  const { openModal } = useModal();

  const navigate = useNavigate<MyLocationGenerics>();
  const search = useSearch<MyLocationGenerics>();

  const pairsQuery = useGetTradePairsData();

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

  const isTradePairError = !tradePairs.some(
    (item) =>
      item.baseToken.address.toLowerCase() === search.base?.toLowerCase() &&
      item.quoteToken.address.toLowerCase() === search.quote?.toLowerCase()
  );

  const openTradePairList = () => {
    openModal('tradeTokenList', { onClick: onTradePairSelect });
  };

  return {
    tradePairs,
    openTradePairList,
    isLoading: pairsQuery.isLoading,
    isError: pairsQuery.isError,
    isTradePairError,
  };
};

import { useSearch, useNavigate, TradeSearch } from 'libs/routing';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useModal } from 'hooks/useModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { useWagmi } from 'libs/wagmi';
import { toPairSlug } from 'utils/pairSearch';
import { usePairs } from 'hooks/usePairs';
import config from 'config';

export const useTradePairs = () => {
  const { user } = useWagmi();
  const { openModal } = useModal();

  const navigate = useNavigate();
  const search: TradeSearch = useSearch({ strict: false });

  const pairs = usePairs();

  const onTradePairSelect = (tradePair: TradePair) => {
    navigate({
      to: '/trade/disposable',
      search: {
        base: tradePair.baseToken.address,
        quote: tradePair.quoteToken.address,
      },
    });
  };

  const getTradePair = useCallback(
    (base: string, quote: string) => {
      const key = toPairSlug({ address: base }, { address: quote });
      return pairs.map.get(key);
    },
    [pairs.map],
  );

  const tradePairsPopular = useMemo(() => {
    return config.popularPairs
      .map(([base, quote]) => getTradePair(base, quote))
      .filter((p) => !!p) as TradePair[];
  }, [getTradePair]);

  const [favoritePairs, _setFavoritePairs] = useState<TradePair[]>(
    lsService.getItem(`favoriteTradePairs-${user}`) || [],
  );

  useEffect(() => {
    if (user) {
      _setFavoritePairs(lsService.getItem(`favoriteTradePairs-${user}`) || []);
    }
  }, [user]);

  const addFavoritePair = useCallback(
    (pair: TradePair) => {
      _setFavoritePairs((prev) => {
        const newValue = [...prev, pair];
        lsService.setItem(`favoriteTradePairs-${user}`, newValue);
        return newValue;
      });
    },
    [user],
  );

  const removeFavoritePair = useCallback(
    (pair: TradePair) => {
      _setFavoritePairs((prev) => {
        const newValue = prev.filter(
          (p) =>
            p.baseToken.address.toLowerCase() !==
              pair.baseToken.address.toLowerCase() ||
            p.quoteToken.address.toLowerCase() !==
              pair.quoteToken.address.toLowerCase(),
        );
        lsService.setItem(`favoriteTradePairs-${user}`, newValue);
        return newValue;
      });
    },
    [user],
  );

  const isTradePairError = !Array.from(pairs.map.values()).some(
    (item) =>
      item.baseToken.address.toLowerCase() === search.base?.toLowerCase() &&
      item.quoteToken.address.toLowerCase() === search.quote?.toLowerCase(),
  );

  const openTradePairList = () => {
    openModal('tradeTokenList', { onClick: onTradePairSelect });
  };

  return {
    openTradePairList,
    isPending: pairs.isPending,
    isError: pairs.isError,
    isTradePairError,
    tradePairsPopular,
    favoritePairs,
    addFavoritePair,
    removeFavoritePair,
  };
};

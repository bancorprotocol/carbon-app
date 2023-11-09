import { PathNames, useSearch, useNavigate } from 'libs/routing';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useModal } from 'hooks/useModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { useWeb3 } from 'libs/web3';
import { toPairKey } from 'utils/pairSearch';
import { usePairs } from 'hooks/usePairs';
import { MyLocationSearch } from './useTradeTokens';

export const useTradePairs = () => {
  const { user } = useWeb3();
  const { openModal } = useModal();

  const navigate = useNavigate();
  const search: MyLocationSearch = useSearch({ strict: false });

  const pairs = usePairs();

  const onTradePairSelect = (tradePair: TradePair) => {
    navigate({
      to: PathNames.trade,
      search: {
        base: tradePair.baseToken.address,
        quote: tradePair.quoteToken.address,
      },
    });
  };

  const getTradePair = useCallback(
    (base: string, quote: string) => {
      const key = toPairKey(base, quote);
      return pairs.map.get(key);
    },
    [pairs.map]
  );

  const tradePairsPopular = useMemo(() => {
    return popularPairs
      .map(([base, quote]) => getTradePair(base, quote))
      .filter((p) => !!p) as TradePair[];
  }, [getTradePair]);

  const [favoritePairs, _setFavoritePairs] = useState<TradePair[]>(
    lsService.getItem(`favoriteTradePairs-${user}`) || []
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
    [user]
  );

  const removeFavoritePair = useCallback(
    (pair: TradePair) => {
      _setFavoritePairs((prev) => {
        const newValue = prev.filter(
          (p) =>
            p.baseToken.address.toLowerCase() !==
              pair.baseToken.address.toLowerCase() ||
            p.quoteToken.address.toLowerCase() !==
              pair.quoteToken.address.toLowerCase()
        );
        lsService.setItem(`favoriteTradePairs-${user}`, newValue);
        return newValue;
      });
    },
    [user]
  );

  const isTradePairError = !Array.from(pairs.map.values()).some(
    (item) =>
      item.baseToken.address.toLowerCase() === search.base?.toLowerCase() &&
      item.quoteToken.address.toLowerCase() === search.quote?.toLowerCase()
  );

  const openTradePairList = () => {
    openModal('tradeTokenList', { onClick: onTradePairSelect });
  };

  return {
    openTradePairList,
    isLoading: pairs.isLoading,
    isError: pairs.isError,
    isTradePairError,
    tradePairsPopular,
    favoritePairs,
    addFavoritePair,
    removeFavoritePair,
  };
};

const popularPairs: string[][] = [
  ['ETH', 'USDC'],
  ['ETH', 'USDT'],
  ['ETH', 'DAI'],
  ['ETH', 'WBTC'],
  ['BNT', 'USDC'],
  ['BNT', 'USDT'],
  ['BNT', 'DAI'],
  ['BNT', 'ETH'],
  ['BNT', 'WBTC'],
  ['WBTC', 'USDC'],
  ['WBTC', 'USDT'],
  ['WBTC', 'DAI'],
  ['WBTC', 'ETH'],
  ['USDT', 'USDC'],
  ['USDC', 'USDT'],
  ['USDT', 'DAI'],
  ['USDC', 'DAI'],
  ['DAI', 'USDC'],
  ['DAI', 'USDT'],
  ['SHIB', 'USDT'],
  ['SHIB', 'USDC'],
  ['SHIB', 'DAI'],
  ['SHIB', 'ETH'],
];

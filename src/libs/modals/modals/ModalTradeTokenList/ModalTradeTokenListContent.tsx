import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ReactComponent as IconStar } from 'assets/icons/star.svg';
import { buildPairKey } from 'utils/helpers';
import { lsService } from 'services/localeStorage';

const categories = ['popular', 'favorites', 'all'] as const;
export type TradePairCategory = (typeof categories)[number];

type Props = {
  tradePairs: { [k in TradePairCategory]: TradePair[] };
  handleSelect: (tradePair: TradePair) => void;
  onAddFavorite: (tradePair: TradePair) => void;
  onRemoveFavorite: (tradePair: TradePair) => void;

  search: string;
};

export const ModalTradeTokenListContent: FC<Props> = ({
  tradePairs,
  handleSelect,
  search,
  onRemoveFavorite,
  onAddFavorite,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [selectedList, _setSelectedList] = useState<TradePairCategory>(
    lsService.getItem('tradePairsCategory') || 'popular'
  );

  const setSelectedList = (category: TradePairCategory) => {
    _setSelectedList(category);
    lsService.setItem('tradePairsCategory', category);
  };

  const tradePairs2 = !!search ? tradePairs.all : tradePairs[selectedList];

  const rowVirtualizer = useVirtualizer({
    count: tradePairs2.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  useEffect(() => {
    if (parentRef.current) parentRef.current.scrollTop = 0;
    if (!!search) setSelectedList('all');
  }, [search]);

  const favoritesMap = useMemo(
    () => new Set(tradePairs.favorites.map((pair) => buildPairKey(pair))),
    [tradePairs.favorites]
  );

  const isFavorite = useCallback(
    (tradePair: TradePair) => favoritesMap.has(buildPairKey(tradePair)),
    [favoritesMap]
  );

  return (
    <div>
      <div className={'my-20 grid w-full grid-cols-4'}>
        {categories.map((category, i) => (
          <button
            key={category}
            className={`flex items-end justify-start capitalize ${
              category === selectedList ? 'font-weight-500' : 'text-secondary'
            } ${i > 0 ? 'justify-center' : ''}`}
            onClick={() => setSelectedList(category)}
          >
            {category}
          </button>
        ))}

        <div className="text-secondary flex items-end justify-end">
          {tradePairs2.length} Pairs
        </div>
      </div>

      <div
        ref={parentRef}
        style={{
          height: `390px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const tradePair = tradePairs2[virtualRow.index];
            console.log(
              `jan asd ${selectedList}-${virtualRow.key}-${tradePair.baseToken.address}-${tradePair.quoteToken.address}`
            );
            return (
              <div
                key={`${selectedList}-${virtualRow.key}-${tradePair.baseToken.address}-${tradePair.quoteToken.address}`}
                data-index={virtualRow.index}
                className={'flex w-full items-center justify-between'}
                style={{
                  position: 'absolute',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <button
                  onClick={() => handleSelect(tradePair)}
                  className={'flex items-center space-x-10 pl-10'}
                >
                  <TokensOverlap
                    tokens={[tradePair.baseToken, tradePair.quoteToken]}
                  />
                  <span className={'font-weight-500'}>
                    {tradePair.baseToken.symbol} / {tradePair.quoteToken.symbol}
                  </span>
                </button>
                <button
                  onClick={() =>
                    isFavorite(tradePair)
                      ? onRemoveFavorite(tradePair)
                      : onAddFavorite(tradePair)
                  }
                >
                  <IconStar
                    className={`${
                      isFavorite(tradePair)
                        ? 'text-yellow-500/60'
                        : 'text-white/20'
                    } w-30 transition hover:text-yellow-500`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

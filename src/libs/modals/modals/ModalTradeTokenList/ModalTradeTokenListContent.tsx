import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ReactComponent as IconStar } from 'assets/icons/star.svg';
import { buildPairKey } from 'utils/helpers';
import { lsService } from 'services/localeStorage';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';

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

  const suspiciousTokenTooltipMsg =
    'This token is not part of any known token list. Always conduct your own research before trading.';

  return (
    <div>
      <div className={'my-20 grid w-full grid-cols-3'}>
        {categories.map((category, i) => (
          <button
            key={category}
            className={`flex items-end justify-start capitalize transition hover:text-white ${
              category === selectedList ? 'font-weight-500' : 'text-secondary'
            } ${i > 0 ? 'justify-center' : ''}`}
            onClick={() => setSelectedList(category)}
          >
            {`${category} (${tradePairs[category].length})`}
          </button>
        ))}
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
                  <span className={'flex font-weight-500'}>
                    {tradePair.baseToken.symbol}
                    {tradePair.baseToken.isSuspicious && (
                      <WarningWithTooltip
                        className="ml-5"
                        tooltipContent={suspiciousTokenTooltipMsg}
                      />
                    )}
                    <span className={'px-5 text-white/60'}>/</span>
                    {tradePair.quoteToken.symbol}
                    {tradePair.quoteToken.isSuspicious && (
                      <WarningWithTooltip
                        className="ml-5"
                        tooltipContent={suspiciousTokenTooltipMsg}
                      />
                    )}
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
                    } hover:text-yellow-500 w-30 transition`}
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

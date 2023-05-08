import { Imager } from 'components/common/imager/Imager';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Token } from 'libs/tokens';
import { useVirtualizer } from '@tanstack/react-virtual';
import { lsService } from 'services/localeStorage';
import { ReactComponent as IconStar } from 'assets/icons/star.svg';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { CategoryButtonWithCounter } from 'libs/modals/modals/common/CategoryButtonWithCounter';

const categories = ['popular', 'favorites', 'all'] as const;
export type ChooseTokenCategory = (typeof categories)[number];

type Props = {
  tokens: { [k in ChooseTokenCategory]: Token[] };
  onSelect: (token: Token) => void;
  search: string;
  onAddFavorite: (token: Token) => void;
  onRemoveFavorite: (token: Token) => void;
};

export const ModalTokenListContent: FC<Props> = ({
  tokens,
  onSelect,
  search,
  onAddFavorite,
  onRemoveFavorite,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [selectedList, _setSelectedList] = useState<ChooseTokenCategory>(
    lsService.getItem('chooseTokenCategory') || 'popular'
  );
  const _tokens = !!search ? tokens.all : tokens[selectedList];

  const setSelectedList = (category: ChooseTokenCategory) => {
    _setSelectedList(category);
    lsService.setItem('chooseTokenCategory', category);
  };

  const rowVirtualizer = useVirtualizer({
    count: _tokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,
    overscan: 10,
  });

  useEffect(() => {
    if (parentRef.current) parentRef.current.scrollTop = 0;
    if (!!search) setSelectedList('all');
  }, [search]);

  const favoritesMap = useMemo(
    () => new Set(tokens.favorites.map((token) => token.address)),
    [tokens.favorites]
  );

  const isFavorite = useCallback(
    (token: Token) => favoritesMap.has(token.address),
    [favoritesMap]
  );
  const suspiciousTokenTooltipMsg =
    'This token is not part of any known token list. Always conduct your own research before trading.';

  return (
    <div>
      <div className={'my-20 grid w-full grid-cols-3'}>
        {categories.map((category, i) => (
          <CategoryButtonWithCounter
            key={category}
            category={category}
            numOfItemsInCategory={tokens[category].length}
            isActive={category === selectedList}
            setSelectedList={setSelectedList}
            categoryIndex={i}
          />
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
            const token = _tokens[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                className={'w-full'}
                style={{
                  position: 'absolute',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex">
                  <button
                    onClick={() => onSelect(token)}
                    className="flex w-full items-center"
                    style={{ height: `${virtualRow.size}px` }}
                  >
                    <Imager
                      src={token.logoURI}
                      alt={`${token.symbol} Token`}
                      className="h-32 w-32 !rounded-full"
                    />
                    <div className="ml-15 grid justify-items-start">
                      <div className="flex">
                        {token.symbol}
                        {token.isSuspicious && (
                          <WarningWithTooltip
                            className="ml-5"
                            tooltipContent={suspiciousTokenTooltipMsg}
                          />
                        )}
                      </div>
                      <div className="text-secondary text-12">
                        {
                          // TODO: add tailwind line camp
                          token.name ?? token.symbol
                        }
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      isFavorite(token)
                        ? onRemoveFavorite(token)
                        : onAddFavorite(token)
                    }
                  >
                    <IconStar
                      className={`${
                        isFavorite(token)
                          ? 'text-yellow-500/60'
                          : 'text-white/20'
                      } hover:text-yellow-500 w-30 transition`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

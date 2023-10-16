import { LogoImager } from 'components/common/imager/Imager';
import {
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Token } from 'libs/tokens';
import { useVirtualizer } from '@tanstack/react-virtual';
import { lsService } from 'services/localeStorage';
import { ReactComponent as IconStar } from 'assets/icons/star.svg';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { CategoryWithCounter } from 'libs/modals/modals/common/CategoryWithCounter';

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
    estimateSize: () => 55,
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

  const selectCatergory = (e: FormEvent<HTMLFieldSetElement>) => {
    if (e.target instanceof HTMLInputElement) {
      setSelectedList(e.target.value as ChooseTokenCategory);
    }
  };

  return (
    <>
      <fieldset
        aria-label="Filter tokens"
        className="grid grid-cols-3 px-4"
        onChange={selectCatergory}
      >
        {categories.map((category) => (
          <CategoryWithCounter
            key={category}
            category={category}
            numOfItemsInCategory={tokens[category].length}
            isActive={category === selectedList}
          />
        ))}
      </fieldset>
      <div ref={parentRef} className="h-[70vh] overflow-auto p-8">
        <ul
          className="relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((row) => {
            const token = _tokens[row.index];
            const style = {
              height: `${row.size}px`,
              transform: `translateY(${row.start}px)`,
            } as const;
            return (
              <li
                key={token.address}
                className="absolute inset-0 flex items-center justify-between rounded-12 hover:bg-black"
                style={style}
              >
                <button
                  onClick={() => onSelect(token)}
                  className="flex flex-1 items-center gap-10 p-8"
                  data-testid={`select-token-${token.symbol}`}
                >
                  <LogoImager
                    src={token.logoURI}
                    alt={`${token.symbol} Token`}
                    className="h-32 w-32"
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
                    <div className="text-secondary max-w-full truncate text-12">
                      {token.name ?? token.symbol}
                    </div>
                  </div>
                </button>
                <button
                  className="p-8"
                  onClick={() =>
                    isFavorite(token)
                      ? onRemoveFavorite(token)
                      : onAddFavorite(token)
                  }
                >
                  <IconStar
                    className={`${
                      isFavorite(token)
                        ? 'fill-green text-green'
                        : 'text-white/40'
                    } w-20 transition hover:fill-white/80 hover:text-white/80`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

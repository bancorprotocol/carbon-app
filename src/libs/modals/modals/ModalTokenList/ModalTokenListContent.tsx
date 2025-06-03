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
import { CategoryWithCounter } from 'libs/modals/modals/common/CategoryWithCounter';
import { ModalTokenListDuplicateWarning } from 'libs/modals/modals/ModalTokenList/ModalTokenListDuplicateWarning';
import { SuspiciousToken } from 'components/common/DisplayPair';

const categories = ['popular', 'favorites', 'all'] as const;
export type ChooseTokenCategory = (typeof categories)[number];

type Props = {
  tokens: { [k in ChooseTokenCategory]: Token[] };
  duplicateSymbols: string[];
  onSelect: (token: Token) => void;
  search: string;
  onAddFavorite: (token: Token) => void;
  onRemoveFavorite: (token: Token) => void;
};

export const ModalTokenListContent: FC<Props> = ({
  tokens,
  duplicateSymbols,
  onSelect,
  search,
  onAddFavorite,
  onRemoveFavorite,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [selectedList, _setSelectedList] = useState<ChooseTokenCategory>(
    lsService.getItem('chooseTokenCategory') || 'popular',
  );
  const _tokens = search ? tokens.all : tokens[selectedList];

  const setSelectedList = (category: ChooseTokenCategory) => {
    _setSelectedList(category);
    lsService.setItem('chooseTokenCategory', category);
  };

  const rowVirtualizer = useVirtualizer({
    count: _tokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  useEffect(() => {
    if (parentRef.current) parentRef.current.scrollTop = 0;
    if (search) setSelectedList('all');
  }, [search]);

  const favoritesMap = useMemo(
    () => new Set(tokens.favorites.map((token) => token.address)),
    [tokens.favorites],
  );

  const isFavorite = useCallback(
    (token: Token) => favoritesMap.has(token.address),
    [favoritesMap],
  );

  const selectCategory = (e: FormEvent<HTMLFieldSetElement>) => {
    if (e.target instanceof HTMLInputElement) {
      setSelectedList(e.target.value as ChooseTokenCategory);
    }
  };

  return (
    <>
      <fieldset
        aria-label="Filter tokens"
        className="grid grid-cols-3 px-4"
        onChange={selectCategory}
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
                className="rounded-12 absolute inset-0 flex items-center justify-between hover:bg-black"
                style={style}
              >
                <button
                  onClick={() => onSelect(token)}
                  className="flex flex-1 items-center gap-10 p-8"
                  data-testid={`select-token-${token.address}`}
                >
                  <LogoImager
                    src={token.logoURI}
                    alt={`${token.symbol} Token`}
                    className="size-32"
                  />
                  <div className="ml-15 grid justify-items-start">
                    <div className="flex gap-4">
                      {token.isSuspicious && <SuspiciousToken />}
                      {token.symbol}
                    </div>
                    <div className="text-12 max-w-full truncate text-white/60">
                      {token.name ?? token.symbol}
                    </div>
                    {duplicateSymbols.includes(token.symbol) && (
                      <ModalTokenListDuplicateWarning token={token} />
                    )}
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
                        ? 'fill-primary text-primary'
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

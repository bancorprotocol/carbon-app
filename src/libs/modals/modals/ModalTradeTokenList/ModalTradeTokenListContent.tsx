import { PairLogoName } from 'components/common/PairLogoName';
import {
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { ReactComponent as IconStar } from 'assets/icons/star.svg';
import { buildPairKey, cn } from 'utils/helpers';
import { lsService } from 'services/localeStorage';
import { CategoryWithCounter } from 'libs/modals/modals/common/CategoryWithCounter';
import { ChooseTokenCategory } from '../ModalTokenList/ModalTokenListContent';
import { useVirtualizer } from '@tanstack/react-virtual';

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
  const pairs = !!search ? tradePairs.all : tradePairs[selectedList];

  const rowVirtualizer = useVirtualizer({
    count: pairs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 55,
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
            numOfItemsInCategory={tradePairs[category].length}
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
            const tradePair = pairs[row.index];
            const { baseToken: base, quoteToken: quote } = tradePair;
            const pairKey = `${base.symbol}_${quote.symbol}`;
            const style = {
              height: `${row.size}px`,
              transform: `translateY(${row.start}px)`,
            } as const;
            return (
              <li
                key={`${selectedList}-${pairKey}`}
                className="absolute inset-0 flex items-center justify-between rounded-12 hover:bg-black"
                style={style}
              >
                <button
                  className="flex flex-1 items-center gap-10 p-8"
                  onClick={() => handleSelect(tradePair)}
                  data-testid={`select-${pairKey}`}
                >
                  <PairLogoName pair={tradePair} />
                </button>
                <button
                  className="p-8"
                  onClick={() =>
                    isFavorite(tradePair)
                      ? onRemoveFavorite(tradePair)
                      : onAddFavorite(tradePair)
                  }
                >
                  <IconStar
                    className={cn(
                      'w-20 transition hover:fill-white/80 hover:text-white/80',
                      isFavorite(tradePair)
                        ? 'fill-green text-green'
                        : 'text-white/40'
                    )}
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

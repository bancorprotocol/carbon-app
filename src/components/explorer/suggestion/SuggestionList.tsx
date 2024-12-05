import { Dispatch, FC, SetStateAction } from 'react';
import { PairLogoName } from 'components/common/PairLogoName';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useNavigate } from '@tanstack/react-router';
import { toPairSlug } from 'utils/pairSearch';
import { cn } from 'utils/helpers';
import { useVirtualizer } from '@tanstack/react-virtual';
import style from './index.module.css';

interface Props {
  listboxId: string;
  filteredPairs: TradePair[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SuggestionList: FC<Props> = (props) => {
  const { listboxId, filteredPairs, setOpen } = props;
  const nav = useNavigate();
  const click = (params: { type: 'token-pair'; slug: string }) => {
    setOpen(false);
    nav({ to: '/explore/$type/$slug', params });
  };

  const rowVirtualizer = useVirtualizer({
    count: filteredPairs.length,
    getScrollElement: () => document.querySelector(`.${style.dialog}`),
    estimateSize: () => 50,
    overscan: 10,
  });

  return (
    <div
      role="listbox"
      id={listboxId}
      className={cn(style.listbox, 'relative')}
      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
    >
      {rowVirtualizer.getVirtualItems().map((row) => {
        const pair = filteredPairs[row.index];
        const slug = toPairSlug(pair.baseToken, pair.quoteToken);
        const params = { type: 'token-pair' as const, slug };
        const style = {
          height: `${row.size}px`,
          transform: `translateY(${row.start}px)`,
        } as const;
        return (
          <button
            key={slug}
            type="button"
            role="option"
            style={style}
            onMouseDown={(e) => e.preventDefault()} // prevent blur on click
            onClick={() => click(params)}
            className="px-30 absolute flex w-full cursor-pointer items-center gap-10 py-10 hover:bg-white/20 aria-selected:bg-white/10"
            aria-selected="false"
            aria-setsize={filteredPairs.length}
          >
            <PairLogoName pair={pair} />
          </button>
        );
      })}
    </div>
  );
};

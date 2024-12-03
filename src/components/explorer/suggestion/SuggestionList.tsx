import { Dispatch, FC, SetStateAction } from 'react';
import { PairLogoName } from 'components/common/PairLogoName';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useNavigate } from '@tanstack/react-router';
import { fromPairSearch, toPairSlug } from 'utils/pairSearch';
import style from './index.module.css';
import { cn } from 'utils/helpers';

interface Props {
  listboxId: string;
  filteredPairs: TradePair[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SuggestionList: FC<Props> = (props) => {
  const nav = useNavigate();
  const click = (params: { type: 'token-pair'; slug: string }) => {
    props.setOpen(false);
    nav({ to: '/explore/$type/$slug', params });
  };
  return (
    <div
      role="listbox"
      id={props.listboxId}
      className={cn(style.listbox, 'grid')}
    >
      {props.filteredPairs.map((pair) => {
        const slug = toPairSlug(pair.baseToken, pair.quoteToken);
        const search = fromPairSearch(
          `${pair.baseToken.symbol} ${pair.quoteToken.symbol}`
        );
        const params = { type: 'token-pair' as const, slug };
        return (
          <button
            key={slug}
            type="button"
            role="option"
            onMouseDown={(e) => e.preventDefault()} // prevent blur on click
            onClick={() => click(params)}
            className="px-30 flex cursor-pointer items-center space-x-10 py-10 hover:bg-white/20 aria-selected:bg-white/10"
            aria-selected="false"
            data-slug={slug}
            data-name={search}
          >
            <PairLogoName pair={pair} />
          </button>
        );
      })}
    </div>
  );
};

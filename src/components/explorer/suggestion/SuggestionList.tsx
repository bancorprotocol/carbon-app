import { Dispatch, FC, SetStateAction } from 'react';
import { suggestionClasses } from './utils';
import { PairLogoName } from 'components/common/PairLogoName';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useNavigate } from '@tanstack/react-router';

interface Props {
  listboxId: string;
  filteredSlugs: Set<string>;
  pairEntries: [string, TradePair][];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SuggestionList: FC<Props> = (props) => {
  const nav = useNavigate();
  const click = (params: { type: 'token-pair'; slug: string }) => {
    props.setOpen(false);
    nav({ to: '/explore/$type/$slug', params });
  };

  return (
    <div role="listbox" id={props.listboxId} className={suggestionClasses}>
      <h3 className="text-14 font-weight-500 mb-8 ml-20 text-white/60">
        {props.filteredSlugs.size} Results
      </h3>
      {props.pairEntries.map(([slug, pair]) => {
        return (
          <button
            key={slug}
            type="button"
            role="option"
            onMouseDown={(e) => e.preventDefault()} // prevent blur on click
            onClick={() => click({ type: 'token-pair' as const, slug })}
            className="px-30 flex cursor-pointer items-center gap-10 py-10 hover:bg-white/20 aria-selected:bg-white/10 [&[hidden]]:hidden"
            aria-selected="false"
            hidden={!props.filteredSlugs.has(slug)}
          >
            <PairLogoName pair={pair} />
          </button>
        );
      })}
    </div>
  );
};

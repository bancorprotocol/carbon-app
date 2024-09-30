import { Dispatch, FC, SetStateAction } from 'react';
import { suggestionClasses } from './utils';
import { PairLogoName } from 'components/common/PairLogoName';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { Link } from '@tanstack/react-router';
import { toPairSlug } from 'utils/pairSearch';

interface Props {
  listboxId: string;
  filteredPairs: TradePair[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SuggestionList: FC<Props> = (props) => {
  return (
    <div role="listbox" id={props.listboxId} className={suggestionClasses}>
      <h3 className="text-14 font-weight-500 mb-8 ml-20 text-white/60">
        {props.filteredPairs.length} Results
      </h3>
      {props.filteredPairs.map((pair) => {
        const slug = toPairSlug(pair.baseToken, pair.quoteToken);
        const params = { type: 'token-pair' as const, slug };
        return (
          <Link
            key={slug}
            onMouseDown={(e) => e.preventDefault()} // prevent blur on click
            onClick={() => props.setOpen(false)}
            role="option"
            className="px-30 flex cursor-pointer items-center space-x-10 py-10  hover:bg-white/20 aria-selected:bg-white/10"
            to="/explore/$type/$slug"
            params={params}
          >
            <PairLogoName pair={pair} />
          </Link>
        );
      })}
    </div>
  );
};

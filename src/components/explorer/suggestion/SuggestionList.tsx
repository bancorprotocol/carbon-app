import { Dispatch, FC, SetStateAction } from 'react';
import { suggestionClasses } from './utils';
import { cn } from 'utils/helpers';
import { PairLogoName } from 'components/common/PairLogoName';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { Link } from '@tanstack/react-router';
import { toPairSlug } from 'utils/pairSearch';
import styles from './suggestion.module.css';

interface Props {
  listboxId: string;
  filteredPairs: TradePair[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SuggestionList: FC<Props> = (props) => {
  return (
    <div role="listbox" id={props.listboxId} className={suggestionClasses}>
      <h3 className="text-secondary ml-20 mb-8 font-weight-500">
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
            className={cn(
              styles.option,
              'flex cursor-pointer items-center space-x-10 px-30 py-10 hover:bg-white/20'
            )}
            to="/explore/$type/$slug"
            params={params}
            search={{}}
          >
            <PairLogoName pair={pair} />
          </Link>
        );
      })}
    </div>
  );
};

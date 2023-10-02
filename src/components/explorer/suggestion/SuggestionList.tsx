import { Dispatch, FC, SetStateAction } from 'react';
import { suggestionClasses } from './utils';
import { cn } from 'utils/helpers';
import { PairLogoName } from 'components/common/PairLogoName';
import styles from './suggestion.module.css';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';

interface Props {
  listboxId: string;
  filteredPairs: TradePair[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SuggestionList: FC<Props> = (props) => {
  const select = (name: string) => {
    const selector = `input[aria-controls="${props.listboxId}"]`;
    const input = document.querySelector<HTMLInputElement>(selector);
    if (!input) return;
    input.value = name;
    input.form?.requestSubmit();
    props.setOpen(false);
  };

  return (
    <ul
      role="listbox"
      id={props.listboxId}
      className={suggestionClasses}
      tabIndex={-1}
    >
      <h3 className="text-secondary ml-20 mb-8 font-weight-500">
        {props.filteredPairs.length} Results
      </h3>
      {props.filteredPairs.map((pair, i) => {
        const slug = `${pair.baseToken.symbol}-${pair.quoteToken.symbol}`;
        const name = `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`;
        return (
          <li
            role="option"
            aria-selected={i === 0}
            key={slug.toLowerCase()}
            onMouseDown={(e) => e.preventDefault()} // prevent blur on click
            onClick={() => select(name)}
            className={cn(
              styles.option,
              'flex cursor-pointer items-center space-x-10 px-30 py-10 hover:bg-white/20'
            )}
          >
            <PairLogoName pair={pair} />
          </li>
        );
      })}
    </ul>
  );
};

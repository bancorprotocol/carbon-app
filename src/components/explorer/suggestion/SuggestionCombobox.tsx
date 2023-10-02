import {
  Dispatch,
  FC,
  KeyboardEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getSelectedOption,
  selectFirstOption,
  selectLastOption,
  selectNextSibling,
  selectPreviousSibling,
} from './utils';
import { ExplorerSearchInputContainer } from '../ExplorerSearchInputContainer';
import { SuggestionList } from './SuggestionList';
import { SuggestionEmpty } from './SuggestionEmpty';
import { searchPairTrade } from 'utils/pairSearch';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';

interface Props {
  nameMap: Map<string, string>;
  pairMap: Map<string, TradePair>;
  search: string;
  setSearch: Dispatch<string>;
}

export const SuggestionCombobox: FC<Props> = (props) => {
  const { pairMap, nameMap, search, setSearch } = props;
  const listboxId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const filteredPairs = useMemo(() => {
    return searchPairTrade(pairMap, nameMap, search);
  }, [pairMap, nameMap, search]);

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && e.key === 'Escape') {
      (e.target as HTMLInputElement).value = '';
      return setSearch('');
    }
    if (!open) return setOpen(true);

    if (e.key === 'Enter') return getSelectedOption(root.current)?.click();
    if (e.key === 'Escape') return setOpen(false);

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Home') selectFirstOption(root.current);
    if (e.key === 'End') selectLastOption(root.current);
    if (e.key === 'ArrowDown') selectNextSibling(root.current);
    if (e.key === 'ArrowUp') selectPreviousSibling(root.current);
  };

  const suggestionListProps = {
    setOpen,
    listboxId,
    filteredPairs,
  };

  return (
    <ExplorerSearchInputContainer
      containerRef={root}
      search={search}
      role="combobox"
      autoComplete="off"
      aria-controls={listboxId}
      aria-autocomplete="both"
      aria-expanded={open}
      value={search}
      placeholder="Search by token pair"
      aria-label="Search by token pair"
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={onKeyDownHandler}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      {open && !filteredPairs.length && <SuggestionEmpty />}
      {open && !!filteredPairs.length && (
        <SuggestionList {...suggestionListProps} />
      )}
    </ExplorerSearchInputContainer>
  );
};

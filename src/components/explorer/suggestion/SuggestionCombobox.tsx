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
  selectCurrentOption,
  selectFirstOption,
  selectLastOption,
  selectNextSibling,
  selectPreviousSibling,
} from './utils';
import { ExplorerSearchInputContainer } from '../ExplorerSearchInputContainer';
import { SuggestionList } from './SuggestionList';
import { SuggestionEmpty } from './SuggestionEmpty';
import { fromPairSearch, searchPairTrade, toPairSlug } from 'utils/pairSearch';
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

    if (e.key === 'Escape') return setOpen(false);
    if (e.key === 'Enter') return selectCurrentOption(root.current);

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Home') selectFirstOption(root.current);
    if (e.key === 'End') selectLastOption(root.current);
    if (e.key === 'ArrowDown') selectNextSibling(root.current);
    if (e.key === 'ArrowUp') selectPreviousSibling(root.current);
  };

  const suggestionListProps = useMemo(
    () => ({
      setOpen,
      listboxId,
      pairEntries: Array.from(pairMap.entries()).sort((a, b) => {
        return a[1].baseToken.symbol.localeCompare(b[1].baseToken.symbol);
      }),
      filteredSlugs: new Set(
        filteredPairs.map((pair) => toPairSlug(pair.baseToken, pair.quoteToken))
      ),
      open: open && !!filteredPairs.length,
    }),
    [filteredPairs, listboxId, pairMap, open]
  );

  const change = (value: string) => {
    const slug = fromPairSearch(value);
    const listbox = document.getElementById(listboxId) as HTMLElement;
    for (const child of listbox!.children) {
      if (!(child as HTMLElement).dataset.slug) continue;
      const show = (child as HTMLElement).dataset.slug!.includes(slug);
      if (!show) child.setAttribute('hidden', 'true');
      else child.removeAttribute('hidden');
    }
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
      defaultValue={search}
      placeholder="Search by token pair"
      aria-label="Search by token pair"
      // onInput={(e) => change(e.currentTarget.value)}
      // onKeyDown={onKeyDownHandler}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      {open && !filteredPairs.length && <SuggestionEmpty />}
      <SuggestionList {...suggestionListProps} />
    </ExplorerSearchInputContainer>
  );
};

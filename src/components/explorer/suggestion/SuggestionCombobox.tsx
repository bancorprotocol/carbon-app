import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import {
  selectCurrentOption,
  selectFirstOption,
  selectLastOption,
  selectNextSibling,
  selectPreviousSibling,
  suggestionClasses,
} from './utils';
import { ReactComponent as IconClose } from 'assets/icons/times.svg';
import { SuggestionList } from './SuggestionList';
import { SuggestionEmpty } from './SuggestionEmpty';
import { searchPairTrade, toPairName } from 'utils/pairSearch';
import { useParams } from '@tanstack/react-router';
import { usePairs } from 'hooks/usePairs';
import { cn } from 'utils/helpers';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import style from './index.module.css';

const displaySlug = (slug: string, pairMap: Map<string, TradePair>) => {
  const pair = pairMap.get(slug);
  if (!pair) return '';
  return toPairName(pair.baseToken, pair.quoteToken);
};

export const SuggestionCombobox = () => {
  const { map: pairMap, names: namesMap } = usePairs();
  const listboxId = useId();
  const inputId = useId();
  const root = useRef<HTMLDivElement>(null);
  const params = useParams({ from: '/explore/$type/$slug' });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(displaySlug(params.slug, pairMap));

  useEffect(() => {
    setSearch(displaySlug(params.slug, pairMap));
  }, [pairMap, params.slug, setSearch]);

  const filteredPairs = searchPairTrade(pairMap, namesMap, search);

  const keydownHandler = (e: KeyboardEvent) => {
    if (open && e.key === 'Escape') {
      (e.target as HTMLInputElement).value = '';
      return setOpen(false);
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

  const suggestionListProps = {
    setOpen,
    listboxId,
    filteredPairs,
  };

  return (
    <div ref={root} className={cn('flex flex-grow', style.rootSearch)}>
      <input
        id={inputId}
        name="search"
        type="search"
        className={cn(
          'w-full flex-grow bg-transparent outline-none',
          style.inputSearch
        )}
        role="combobox"
        autoComplete="off"
        aria-controls={listboxId}
        aria-autocomplete="both"
        aria-expanded={open}
        placeholder="Search by token pair"
        aria-label="Search by token pair"
        value={search}
        onInput={(e) => setSearch(e.currentTarget.value)}
        onKeyDown={keydownHandler}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
      />
      <button type="reset" aria-label="Clear">
        <IconClose className="w-12" />
      </button>
      <div role="dialog" className={cn(suggestionClasses, style.dialog)}>
        <h3 className="text-14 font-weight-500 mb-8 ml-20 text-white/60">
          {filteredPairs.length} Results
        </h3>
        <SuggestionList {...suggestionListProps} />
        <SuggestionEmpty />
      </div>
    </div>
  );
};

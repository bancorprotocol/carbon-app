import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
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
import { ReactComponent as IconClose } from 'assets/icons/times.svg';
import { SuggestionList } from './SuggestionList';
import { SuggestionEmpty } from './SuggestionEmpty';
import { searchPairTrade, toPairName } from 'utils/pairSearch';
import { useParams } from '@tanstack/react-router';
import { usePairs } from 'hooks/usePairs';
import { cn } from 'utils/helpers';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { Token } from 'libs/tokens';
import style from './index.module.css';
import { useTokens } from 'hooks/useTokens';

const displaySlug = (
  slug: string,
  pairMap: Map<string, TradePair>,
  tokensMap: Map<string, Token>
) => {
  if (slug.split('_').length === 1) {
    return tokensMap.get(slug)?.symbol ?? '';
  } else {
    const pair = pairMap.get(slug);
    if (!pair) return '';
    return toPairName(pair.baseToken, pair.quoteToken);
  }
};

const includeToken = ({ address, symbol }: Token, search: string) => {
  return (
    address.toLowerCase().includes(search) ||
    symbol.toLowerCase().includes(search)
  );
};

const tabs = {
  token: 'Tokens',
  pair: 'Pairs',
};
type FocusTab = keyof typeof tabs;
export const SuggestionCombobox = () => {
  const { tokensMap } = useTokens();
  const { map: pairMap, names: namesMap } = usePairs();
  const listboxId = useId();
  const inputId = useId();
  const root = useRef<HTMLDivElement>(null);
  const params = useParams({ from: '/explore/$type/$slug' });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(
    displaySlug(params.slug, pairMap, tokensMap)
  );
  const [focusTab, setFocusTab] = useState<FocusTab>('token');

  useEffect(() => {
    setSearch(displaySlug(params.slug, pairMap, tokensMap));
  }, [tokensMap, pairMap, params.slug, setSearch]);

  const filteredPairs = searchPairTrade(pairMap, namesMap, search);
  const filteredTokens = useMemo(() => {
    const tokens: Record<string, Token> = {};
    const value = search.toLowerCase();
    for (const { baseToken: base, quoteToken: quote } of pairMap.values()) {
      if (includeToken(base, value)) tokens[base.address] ||= base;
      if (includeToken(quote, value)) tokens[quote.address] ||= quote;
    }
    return Object.values(tokens);
  }, [pairMap, search]);

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

  const changeTab = (e: ChangeEvent<HTMLInputElement>, tab: FocusTab) => {
    if (!e.target.checked) return;
    setFocusTab(tab as FocusTab);
    const el = document.getElementById(`filtered-${tab}-list`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const suggestionListProps = {
    setOpen,
    listboxId,
    filteredPairs,
    filteredTokens,
  };

  const filters = {
    token: filteredTokens,
    pair: filteredPairs,
  };

  useEffect(() => {
    if (!open) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          const tab = (entry.target as HTMLElement).dataset.tab;
          if (tab) setFocusTab(tab as FocusTab);
        }
      }
    });
    for (const tab in tabs) {
      const el = document.getElementById(`filtered-${tab}-list`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [open, filteredTokens.length, filteredPairs.length]);

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
      <button type="reset" aria-label="Clear" onClick={() => setSearch('')}>
        <IconClose className="w-12" />
      </button>
      <div
        role="dialog"
        className={cn(
          'rounded-10 bg-background-800 absolute left-0 top-[100%] z-30 mt-10 flex max-h-[300px] w-full flex-col overflow-hidden md:mt-20',
          style.dialog
        )}
      >
        <div
          role="radiogroup"
          className="bg-background-800 flex gap-8 border-b border-white/60 px-16 py-8"
        >
          {Object.entries(tabs).map(([tab, label]) => (
            <div key={tab} className="relative">
              <input
                id={`filtered-${tab}-radio`}
                type="radio"
                checked={focusTab === tab}
                onMouseDown={(e) => e.preventDefault()}
                onChange={(e) => changeTab(e, tab as FocusTab)}
                className="peer invisible absolute"
              />
              <label
                htmlFor={`filtered-${tab}-radio`}
                className="text-14 bg-background-700 rounded-full px-8 py-4 peer-checked:bg-black"
                onMouseDown={(e) => e.preventDefault()}
              >
                {filters[tab as FocusTab].length} {label}
              </label>
            </div>
          ))}
        </div>
        <SuggestionList {...suggestionListProps} />
        <SuggestionEmpty />
      </div>
    </div>
  );
};

import {
  ChangeEvent,
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

  const changeTab = (e: ChangeEvent<HTMLInputElement>, tab: FocusTab) => {
    if (!e.target.checked) return;
    setFocusTab(tab as FocusTab);
    const el = document.getElementById(`filtered-${tab}-list`);
    const y = window.scrollY;
    const x = window.scrollX;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // scrollIntoView move all scroll container, we need to reset main scroll to prevent double scrolling
    window.scroll(x, y);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    setOpen(true);
    setSearch(e.currentTarget.value);
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

  useEffect(() => {
    if (!open) return;
    const listbox = document.getElementById(listboxId);
    const keydownHandler = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        (e.target as HTMLInputElement).value = '';
        return setOpen(false);
      }
      if (!open) return setOpen(true);

      if (e.key === 'Escape') return setOpen(false);
      if (e.key === 'Enter') return selectCurrentOption(listbox);

      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Home') selectFirstOption(listbox);
      if (e.key === 'End') selectLastOption(listbox);
      if (e.key === 'ArrowDown') selectNextSibling(listbox);
      if (e.key === 'ArrowUp') selectPreviousSibling(listbox);
    };
    const handleSoftExit = (e: MouseEvent) => {
      if (!root.current || !(e.target instanceof Element)) return;
      if (!root.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('mousedown', handleSoftExit);
    return () => {
      document.removeEventListener('mousedown', handleSoftExit);
      document.removeEventListener('keydown', keydownHandler);
    };
  });

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
        placeholder="Search by token or token pair"
        aria-label="Search by token or token pair"
        value={search}
        onInput={onInput}
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
        <header className="flex gap-8 border-b border-white/40 p-12">
          <div
            role="radiogroup"
            className="text-14 font-weight-500 flex items-center rounded-full bg-black p-2"
          >
            {Object.entries(tabs).map(([tab, label]) => (
              <div key={tab} className="relative">
                <input
                  id={`filtered-${tab}-radio`}
                  type="radio"
                  checked={focusTab === tab}
                  onMouseDown={(e) => e.preventDefault()}
                  onChange={(e) => changeTab(e, tab as FocusTab)}
                  className="peer absolute opacity-0"
                  tabIndex={focusTab === tab ? 0 : -1}
                />
                <label
                  htmlFor={`filtered-${tab}-radio`}
                  className="peer-checked:bg-background-800 inline-flex cursor-pointer items-center gap-4 rounded-full px-8 py-4 outline-1 peer-focus-visible:outline"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {label}
                  <span className="bg-background-900 text-10 rounded-full px-8 py-4">
                    {filters[tab as FocusTab].length}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </header>
        <SuggestionList {...suggestionListProps} />
        <SuggestionEmpty />
        <footer className="text-14 flex items-center justify-between border-t border-white/40 px-16 py-8">
          <p className="flex items-center gap-8">
            <kbd className="rounded-8 border-2 border-white/10 px-8">↑</kbd>
            <kbd className="rounded-8 border-2 border-white/10 px-8">↓</kbd>
            <span className="text-white/80">Navigate</span>
          </p>
          <p className="flex items-center gap-8">
            <kbd className="rounded-8 border-2 border-white/10 px-8">ESC</kbd>
            <span className="text-white/80">Exit</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

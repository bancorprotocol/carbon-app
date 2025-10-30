import {
  ChangeEvent,
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
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
import { ReactComponent as IconClose } from 'assets/icons/times.svg';
import { SuggestionList } from './SuggestionList';
import { SuggestionEmpty } from './SuggestionEmpty';
import { searchPairTrade, searchTokens } from 'utils/pairSearch';
import { useSearch } from '@tanstack/react-router';
import { usePairs } from 'hooks/usePairs';
import { cn } from 'utils/helpers';
import { useEnsName } from 'wagmi';
import { getAddress } from 'ethers';
import style from './index.module.css';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';

interface Props {
  url: '/explore' | '/portfolio';
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const tryEthAddress = (slug: string) => {
  try {
    return getAddress(slug) as `0x${string}`;
  } catch {
    return;
  }
};

const tabs = {
  token: 'Tokens',
  pair: 'Pairs',
};
type FocusTab = keyof typeof tabs;
export const LocalSuggestionCombobox: FC<Props> = (props) => {
  const { url, open, setOpen, search, setSearch } = props;
  const { map: pairMap, names: namesMap, isPending } = usePairs();
  const listboxId = useId();
  const inputId = useId();
  const root = useRef<HTMLDivElement>(null);
  const params = useSearch({ from: url });
  const ensName = useEnsName({
    address: tryEthAddress(params.search || ''),
  });

  const [focusTab, setFocusTab] = useState<FocusTab>('token');

  useEffect(() => {
    if (ensName.data) setSearch(ensName.data);
  }, [ensName.data, setSearch]);

  const loading = useMemo(() => {
    return isPending && params.search;
  }, [isPending, params.search]);

  const filteredPairs = useMemo(
    () => searchPairTrade(pairMap, namesMap, search),
    [namesMap, pairMap, search],
  );
  const filteredTokens = useMemo(() => {
    return searchTokens(pairMap, search);
  }, [pairMap, search]);

  const changeTab = (tab: FocusTab) => {
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
    url,
    setOpen,
    listboxId,
    filteredPairs,
    filteredTokens,
    isPending,
  };

  const filters = {
    token: filteredTokens,
    pair: filteredPairs,
  };

  useEffect(() => {
    if (open) return;
    const selector = '[role="option"][aria-selected="true"]';
    const listbox = document.getElementById(listboxId)!;
    const selected = listbox.querySelector<HTMLElement>(selector);
    selected?.setAttribute('aria-selected', 'false');
  }, [open, listboxId]);

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
      if (e.key === 'Enter') {
        const option = getSelectedOption(listbox);
        if (option) e.preventDefault();
        return option?.click();
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, listboxId]);

  return (
    <div ref={root} className={cn('flex grow', style.rootSearch)}>
      <input
        id={inputId}
        name="search"
        type="search"
        className={cn('grow bg-transparent outline-hidden', style.inputSearch, {
          'animate-pulse': loading,
        })}
        role="combobox"
        autoComplete="off"
        aria-controls={listboxId}
        aria-autocomplete="both"
        aria-expanded={open}
        placeholder={
          loading ? 'Loading tokens' : 'Search by Token / Pair / Wallet Address'
        }
        aria-label="Search by Token / Pair / Wallet Address"
        value={loading ? '' : search}
        onInput={onInput}
        onFocus={() => setOpen(true)}
      />
      <button type="reset" aria-label="Clear" onClick={() => setSearch('')}>
        <IconClose className="size-12 opacity-60" />
      </button>
      <div
        role="dialog"
        className={cn(
          'rounded-lg bg-main-600/80 backdrop-blur-sm absolute left-0 top-full z-30 mt-10 flex max-h-[400px] w-full flex-col overflow-hidden sm:max-h-[600px] md:mt-20',
          style.dialog,
        )}
      >
        <header className="flex gap-8 border-b border-white/40 p-12">
          <RadioGroup>
            {Object.entries(tabs).map(([tab, label]) => (
              <Radio
                key={tab}
                checked={focusTab === tab}
                onChange={() => changeTab(tab as FocusTab)}
                className="flex items-center gap-8"
              >
                {label}
                <span className="bg-main-600 text-10 rounded-full px-8 py-4">
                  {filters[tab as FocusTab].length}
                </span>
              </Radio>
            ))}
          </RadioGroup>
        </header>
        <SuggestionList {...suggestionListProps} />
        <SuggestionEmpty search={search} />
      </div>
    </div>
  );
};

export const SuggestionCombobox = memo(
  LocalSuggestionCombobox,
  (prev, next) => prev.open === next.open && prev.search === next.search,
);

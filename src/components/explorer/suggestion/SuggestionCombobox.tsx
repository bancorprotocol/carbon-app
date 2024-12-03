import { useCallback, useEffect, useId, useRef, useState } from 'react';
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
import { fromPairSearch, sortPairNodes, toPairName } from 'utils/pairSearch';
import { useParams } from '@tanstack/react-router';
import { usePairs } from 'hooks/usePairs';
import { cn } from 'utils/helpers';
import { includesGasToken, isDifferentGasToken } from 'utils/tokens';
import style from './index.module.css';

const includesPair = (searchSlug: string, slug: string, name: string) => {
  if (
    isDifferentGasToken &&
    !includesGasToken(searchSlug) &&
    includesGasToken(slug)
  )
    return false;
  return slug.includes(searchSlug) || name.includes(searchSlug);
};

export const SuggestionCombobox = () => {
  const { map: pairMap } = usePairs();
  const listboxId = useId();
  const inputId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const params = useParams({ from: '/explore/$type/$slug' });

  const change = useCallback(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const searchSlug = fromPairSearch(input.value);
    let amount = 0;
    const listbox = document.getElementById(listboxId) as HTMLElement;
    const options = Array.from(listbox.children) as HTMLElement[];
    const nodes: { slug: string; name: string; node: HTMLElement }[] = [];
    if (!searchSlug) {
      // Clear state if no value
      amount = options.length;
      for (let i = 0; i < options.length; i++) {
        options[i].removeAttribute('hidden');
        options[i].dataset.order = i.toString();
        options[i].style.removeProperty('order');
      }
    } else {
      // Filter & order options
      for (const option of options) {
        if (option.role !== 'option') continue;
        const slug = option.dataset.slug;
        const name = fromPairSearch(option.textContent ?? '');
        if (!slug) continue;
        if (includesPair(searchSlug, slug, name)) {
          amount++;
          nodes.push({ slug, name, node: option });
          option.removeAttribute('hidden');
        } else {
          option.setAttribute('hidden', 'true');
          option.setAttribute('aria-selected', 'false');
        }
      }
      sortPairNodes(nodes, searchSlug).forEach(({ node }, i) => {
        node.dataset.order = i.toString();
        node.style.setProperty('order', i.toString());
      });
    }
    const pairAmount = document.getElementById('filtered-pairs-amount');
    if (pairAmount) pairAmount.textContent = amount.toString();
  }, [inputId, listboxId]);

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const pair = pairMap.get(params.slug);
    if (!pair) return;
    input.value = toPairName(pair.baseToken, pair.quoteToken);
    change();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, inputId, change]);

  /** Addlistener (19ms) is much more performant than React onInput (92ms) */
  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;

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

    input?.addEventListener('keydown', keydownHandler);
    return () => input?.removeEventListener('keydown', keydownHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputId, listboxId, open]);

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input?.addEventListener('input', change);
    return () => input?.removeEventListener('input', change);
  }, [change, inputId]);

  const suggestionListProps = {
    setOpen,
    listboxId,
    filteredPairs: Array.from(pairMap.values()),
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
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
      />
      <button
        type="reset"
        aria-label="Clear"
        onClick={() => setTimeout(change, 100)}
      >
        <IconClose className="w-12" />
      </button>
      <div className={cn(suggestionClasses, style.dialog)}>
        <h3 className="text-14 font-weight-500 mb-8 ml-20 text-white/60">
          <span id="filtered-pairs-amount">{pairMap.size}</span> Results
        </h3>
        <SuggestionList {...suggestionListProps} />
        <SuggestionEmpty />
      </div>
    </div>
  );
};

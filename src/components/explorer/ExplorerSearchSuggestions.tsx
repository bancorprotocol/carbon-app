import { PairLogoName } from 'components/common/PairLogoName';
import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import {
  Dispatch,
  FC,
  KeyboardEvent,
  memo,
  SetStateAction,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconClose } from 'assets/icons/times.svg';
import styles from './explorer.module.css';

interface Props extends Omit<ExplorerSearchProps, 'type'> {}

function isOption(el?: Element | null): el is HTMLElement {
  return el instanceof HTMLElement && el.getAttribute('role') === 'option';
}

function getSelectedOption(root: HTMLElement | null) {
  const selector = '[role="option"][aria-selected="true"]';
  return root?.querySelector<HTMLElement>(selector);
}

function selectOption(element?: HTMLElement | null) {
  if (!element) return;
  element.setAttribute('aria-selected', 'true');
  element.scrollIntoView({ block: 'nearest' });
}

function selectFirstOption(root: HTMLElement | null) {
  getSelectedOption(root)?.setAttribute('aria-selected', 'false');
  const selector = '[role="option"]:first-of-type';
  const firstOption = root?.querySelector<HTMLElement>(selector);
  selectOption(firstOption);
}

function selectLastOption(root: HTMLElement | null) {
  getSelectedOption(root)?.setAttribute('aria-selected', 'false');
  const selector = '[role="option"]:last-of-type';
  const lastOption = root?.querySelector<HTMLElement>(selector);
  selectOption(lastOption);
}

function selectNextSibling(root: HTMLElement | null) {
  const selected = getSelectedOption(root);
  if (!selected) return selectFirstOption(root);
  const next = selected.nextElementSibling;
  if (!isOption(next)) return selectFirstOption(root);
  selected.setAttribute('aria-selected', 'false');
  selectOption(next);
}

function selectPreviousSibling(root: HTMLElement | null) {
  const selected = getSelectedOption(root);
  if (!selected) return selectLastOption(root);
  const previous = selected.previousElementSibling;
  if (!isOption(previous)) return selectLastOption(root);
  selected.setAttribute('aria-selected', 'false');
  selectOption(previous);
}


const ExplorerSearchSuggestions: FC<Props> = (props) => {
  const listboxId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  function onKeyDownHandler(e: KeyboardEvent<HTMLInputElement>) {
    if (!open && e.key === 'Escape') {
      (e.target as HTMLInputElement).value = '';
      return props.setSearch('');
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
  }

  const suggestionListProps = {
    setOpen,
    listboxId,
    filteredPairs: props.filteredPairs,
  };

  return (
    <div ref={root} className={styles.inputContainer}>
      <input
        name="search"
        type="search"
        role="combobox"
        autoComplete="off"
        aria-controls={listboxId}
        aria-autocomplete="both"
        aria-expanded={open}
        defaultValue={props.search}
        placeholder="Search by token pair"
        aria-label="Search by token pair"
        className={styles.searchInput}
        onChange={(e) => props.setSearch(e.target.value)}
        onKeyDown={onKeyDownHandler}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
      />
      {!!props.search && (
        <button type="reset" aria-label="Clear">
          <IconClose className="w-12" />
        </button>
      )}
      {open && !props.filteredPairs.length && <EmptySuggestion />}
      {open && !!props.filteredPairs.length && (
        <SuggestionList {...suggestionListProps} />
      )}
    </div>
  );
};

const EmptySuggestion: FC = () => {
  const emptyId = useId();
  return (
    <article aria-labelledby={emptyId} className={cn(styles.popup, 'px-30')}>
      <h3 id={emptyId} className={'font-weight-500'}>
        We couldn't find any strategies
      </h3>
      <div className={'text-secondary'}>
        Please make sure your search input is correct or try searching by a
        different token pair
      </div>
    </article>
  );
};

interface SuggestionListProps
  extends Pick<ExplorerSearchProps, 'filteredPairs'> {
  listboxId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const SuggestionList: FC<SuggestionListProps> = (props) => {
  function select(name: string) {
    const selector = `input[aria-controls="${props.listboxId}"]`;
    const input = document.querySelector<HTMLInputElement>(selector);
    if (!input) return;
    input.value = name;
    input.form?.requestSubmit();
    props.setOpen(false);
  }

  return (
    <ul
      role="listbox"
      id={props.listboxId}
      className={styles.popup}
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
            className={styles.option}
          >
            <PairLogoName pair={pair} />
          </li>
        );
      })}
    </ul>
  );
};

export default memo(ExplorerSearchSuggestions);

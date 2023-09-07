import { FC, KeyboardEvent, useId, useRef, useState } from 'react';
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
import { ExplorerSearchProps } from '../ExplorerSearch';

interface Props extends Omit<ExplorerSearchProps, 'type'> {}

export const SuggestionCombobox: FC<Props> = (props) => {
  const listboxId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
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
  };

  const suggestionListProps = {
    setOpen,
    listboxId,
    filteredPairs: props.filteredPairs,
  };

  return (
    <ExplorerSearchInputContainer
      containerRef={root}
      search={props.search}
      role="combobox"
      autoComplete="off"
      aria-controls={listboxId}
      aria-autocomplete="both"
      aria-expanded={open}
      defaultValue={props.search}
      placeholder="Search by token pair"
      aria-label="Search by token pair"
      onChange={(e) => props.setSearch(e.target.value)}
      onKeyDown={onKeyDownHandler}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      {open && !props.filteredPairs.length && <SuggestionEmpty />}
      {open && !!props.filteredPairs.length && (
        <SuggestionList {...suggestionListProps} />
      )}
    </ExplorerSearchInputContainer>
  );
};

import {
  useState,
  createContext,
  ReactNode,
  FC,
  useId,
  useContext,
  KeyboardEvent,
  Children,
  useEffect,
} from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { cn } from 'utils/helpers';
import style from './index.module.css';
import { replaceSpecialCharacters } from 'utils/pairSearch';

interface ComboboxCtx {
  name: string;
  form?: string;
  selected: string[];
}

const ComboboxContext = createContext<ComboboxCtx>({
  name: '',
  selected: [],
});

interface ComboboxProps {
  form?: string;
  name: string;
  value: string[];
  /** Icon in the button */
  icon: ReactNode;
  /** Label displayed in the button */
  label: ReactNode;
  /** Label used for the input used to filter the options */
  filterLabel: string;
  options: ReactNode;
  onChange?: (value: string[]) => any;
}

export const Combobox: FC<ComboboxProps> = (props) => {
  const { name, value: selected = [], form } = props;
  const rootId = useId();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [empty, setEmpty] = useState(false);
  // Get properties to calculate positioning
  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom',
    open: open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 16 })],
  });

  // Default transition provides a fade in on enter
  const { isMounted, styles: transition } = useTransitionStyles(context);

  // Generate props to manage reference button & floating element
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input?.value) return;
    filter(input.value);
  }, [inputId, selected]);

  const filter = (value: string) => {
    const lcValue = value.toLowerCase();
    const options = document.querySelectorAll(`.${style.option}`)!;
    let empty = true;
    for (const option of options) {
      const lcOption = (option.textContent ?? '').toLowerCase();
      if (
        lcOption.includes(lcValue) ||
        replaceSpecialCharacters(lcOption).includes(lcValue)
      ) {
        empty = false;
        option.classList.remove(style.hidden);
      } else {
        option.classList.add(style.hidden);
        if (option.classList.contains(style.selected)) setEmpty(true);
      }
    }
    setEmpty(empty);
  };

  const onChange = () => {
    if (!props.onChange) return;
    const selector = 'input[type="checkbox"]:checked';
    const root = document.getElementById(rootId)!;
    const checkboxes = root.querySelectorAll<HTMLInputElement>(selector);
    const values = Array.from(checkboxes).map((checkbox) => checkbox.value);
    props.onChange(values);
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (document.activeElement as HTMLElement).click();
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const root = document.getElementById(rootId)!;
      const getList = (selector: string) =>
        Array.from(root.querySelectorAll<HTMLInputElement>(selector));
      const focus = (el: HTMLInputElement) => {
        el.tabIndex = 0;
        el.focus();
      };
      const current = document.activeElement as HTMLInputElement;
      const checkedSelector = `.${style.option}.${style.selected} input`;
      const unCheckedSelector = `.${style.option}:not(.${style.selected}):not(.${style.hidden}) input`;
      const checked = getList(checkedSelector);
      const unchecked = getList(unCheckedSelector);
      const first = checked.at(0) || unchecked[0];
      const last = unchecked.at(-1) || checked.at(-1)!;

      checked.forEach((checkbox) => (checkbox.tabIndex = -1));
      unchecked.forEach((checkbox) => (checkbox.tabIndex = -1));

      if (e.key === 'Home') return focus(first);
      if (e.key === 'End') return focus(last);

      // checkbox are not sorted in the DOM but with CSS to improve perf, next checkbox is not always the next sibling
      if (current.checked) {
        const index = checked.indexOf(current);
        if (e.key === 'ArrowDown') {
          if (index === checked.length - 1) focus(unchecked[0] || checked[0]);
          else focus(checked[index + 1]);
        } else {
          if (index === 0) focus(last);
          else focus(checked[index - 1]);
        }
      } else {
        const index = unchecked.indexOf(current);
        if (e.key === 'ArrowDown') {
          if (index === unchecked.length - 1) focus(first);
          else focus(unchecked[index + 1]);
        } else {
          if (index === 0) focus(checked.at(-1) || unchecked.at(-1)!);
          else focus(unchecked[index - 1]);
        }
      }
    }
  };

  const reset = () => {
    const selector = 'input[type="checkbox"]:checked';
    const root = document.getElementById(rootId)!;
    const checkboxes = root.querySelectorAll<HTMLInputElement>(selector);
    // Use click to trigger change event
    checkboxes.forEach((checkbox) => checkbox.click());
  };

  const { icon, label, options, filterLabel } = props;

  const optionSize = Children.count(options);
  const ctx = {
    name,
    form,
    selected,
  };

  return (
    <ComboboxContext.Provider value={ctx}>
      <button
        {...getReferenceProps({ ref: refs.setReference })}
        type="button"
        className={cn(
          'text-12 flex items-center gap-8 rounded-full border-2 px-12 py-8',
          'hover:bg-background-800',
          selected.length
            ? 'active:border-white-80 border-white/60'
            : 'border-background-800 hover:border-background-700 active:border-background-600',
        )}
        aria-controls={rootId}
      >
        {icon}
        <span className="text-white/60">{label}</span>
        <IconChevron
          className={cn('size-12 text-white/60 transition-transform', {
            'rotate-180': open,
          })}
        />
      </button>
      <FloatingPortal>
        {isMounted && open && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, ...transition }}
              {...getFloatingProps()}
              id={rootId}
              className="bg-background-800 z-50 flex flex-col gap-8 rounded p-16"
              onChange={onChange}
            >
              <div className="flex gap-8 rounded bg-black p-10 focus-within:outline-1">
                <IconSearch className="w-14 self-center" />
                <input
                  id={inputId}
                  type="search"
                  className="text-14 border-none bg-transparent outline-none"
                  aria-label={filterLabel}
                  placeholder={filterLabel}
                  onChange={(e) => filter(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={reset}
                className="bg-background-900 text-12 font-weight-500 rounded p-10"
              >
                Reset Filter
              </button>
              <div
                role="listbox"
                className="flex max-h-[200px] min-w-[200px] flex-col gap-8 overflow-auto p-4"
                onKeyDown={onKeydown}
              >
                {options}
                {empty && <Empty />}
                <hr
                  className={cn('-order-1 border-white/60', {
                    hidden: !selected.length || optionSize === selected.length,
                  })}
                />
              </div>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </ComboboxContext.Provider>
  );
};

interface OptionProps {
  value: string;
  className?: string;
  children: ReactNode;
}
export const Option: FC<OptionProps> = (props) => {
  const { value, children, className } = props;
  const { name, selected, form } = useContext(ComboboxContext);
  const checked = selected.includes(value);
  const id = useId();
  return (
    <div
      className={cn('flex items-center gap-8 px-4', style.option, {
        [style.selected]: checked,
      })}
    >
      <input
        id={id}
        form={form}
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={checked}
        className="size-14"
        tabIndex={checked ? 1 : 0}
      />
      <label htmlFor={id} className={cn('flex items-center gap-8', className)}>
        {children}
      </label>
    </div>
  );
};

const Empty = () => {
  return (
    <output className="flex max-w-[200px] flex-col items-center p-16">
      <div className="mb-16 grid place-items-center rounded-full bg-white/40 p-8">
        <IconSearch className="size-16 self-center" />
      </div>
      <h3 className="text-14 font-weight-500 mb-8">Nothing found</h3>
      <p className="text-12 text-center text-white/80">
        Unfortunately we couldn't find what you're looking for.
      </p>
    </output>
  );
};

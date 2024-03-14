import {
  useState,
  createContext,
  ReactNode,
  FC,
  useId,
  useContext,
  ChangeEvent,
} from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
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
  const [open, setOpen] = useState(false);
  const [empty, setEmpty] = useState(false);
  // const [filter, setFilter] = useState('');
  // Get properties to calculate positioning
  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom',
    open: open,
    onOpenChange: setOpen,
    middleware: [offset(16), flip(), shift()],
  });

  // Default transition provides a fade in on enter
  const { isMounted, styles: transition } = useTransitionStyles(context);

  // Generate props to manage reference button & floating element
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const options = document.querySelectorAll(`.${style.option}`)!;
    let empty = true;
    for (const option of options) {
      if (option.textContent?.toLowerCase().includes(value)) {
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

  const reset = () => {
    const selector = 'input[type="checkbox"]:checked';
    const root = document.getElementById(rootId)!;
    const checkboxes = root.querySelectorAll<HTMLInputElement>(selector);
    // Use click to trigger change event
    checkboxes.forEach((checkbox) => checkbox.click());
  };

  const { icon, label, options, filterLabel } = props;

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
          'flex items-center gap-4 rounded-full border-2 border-background-800 bg-background-900 px-12 py-8',
          'hover:border-background-700 hover:bg-background-800',
          'active:border-background-600'
        )}
      >
        {icon}
        <span className="text-12 text-white/60">{label}</span>
        <IconChevron
          className={cn('w-14 text-white/60 transition-transform', {
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
              className="flex flex-col gap-8 rounded bg-background-800 p-16"
              onChange={onChange}
            >
              <div className="flex gap-8 rounded bg-black p-10 focus-within:outline-1">
                <IconSearch className="w-14 self-center" />
                <input
                  type="search"
                  className="border-none bg-transparent text-14 outline-none"
                  aria-label={filterLabel}
                  placeholder={filterLabel}
                  onChange={filter}
                />
              </div>
              <button
                type="button"
                onClick={reset}
                className="rounded rounded bg-background-900 p-10 text-12 font-weight-500"
              >
                Reset Filter
              </button>
              <div
                role="listbox"
                className="flex max-h-[200px] min-w-[200px] flex-col gap-8 overflow-auto"
              >
                {options}
                {empty && <Empty />}
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
  children: ReactNode;
}
export const Option: FC<OptionProps> = (props) => {
  const { value, children } = props;
  const { name, selected, form } = useContext(ComboboxContext);
  const checked = selected.includes(value);
  const id = useId();
  return (
    <div
      className={cn('flex items-center gap-8', style.option, {
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
        className="h-14 w-14"
      />
      <label htmlFor={id} className="flex items-center gap-8">
        {children}
      </label>
    </div>
  );
};

const Empty = () => {
  return (
    <output className="flex max-w-[200px] flex-col items-center p-16">
      <div className="mb-16 grid place-items-center rounded-full bg-white/40 p-8">
        <IconSearch className="h-16 w-16 self-center" />
      </div>
      <h3 className="mb-8 text-14 font-weight-500">Nothing found</h3>
      <p className="text-center text-12 text-white/80">
        Unfortunately we couldn't find what you're looking for.
      </p>
    </output>
  );
};

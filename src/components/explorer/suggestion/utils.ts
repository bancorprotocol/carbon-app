export const suggestionClasses =
  'absolute left-0 top-[100%] z-30 mt-10 max-h-[300px] w-full overflow-hidden overflow-y-auto rounded-10 bg-emphasis py-10 md:mt-20';

const isOption = (el?: Element | null): el is HTMLElement => {
  return el instanceof HTMLElement && el.getAttribute('role') === 'option';
};

export const getSelectedOption = (root: HTMLElement | null) => {
  const selector = '[role="option"][aria-selected="true"]';
  return root?.querySelector<HTMLElement>(selector);
};

export const selectOption = (element?: HTMLElement | null) => {
  if (!element) return;
  element.setAttribute('aria-selected', 'true');
  element.scrollIntoView({ block: 'nearest' });
};

export const selectFirstOption = (root: HTMLElement | null) => {
  getSelectedOption(root)?.setAttribute('aria-selected', 'false');
  const selector = '[role="option"]:first-of-type';
  const firstOption = root?.querySelector<HTMLElement>(selector);
  selectOption(firstOption);
};

export const selectLastOption = (root: HTMLElement | null) => {
  getSelectedOption(root)?.setAttribute('aria-selected', 'false');
  const selector = '[role="option"]:last-of-type';
  const lastOption = root?.querySelector<HTMLElement>(selector);
  selectOption(lastOption);
};

export const selectNextSibling = (root: HTMLElement | null) => {
  const selected = getSelectedOption(root);
  if (!selected) return selectFirstOption(root);
  const next = selected.nextElementSibling;
  if (!isOption(next)) return selectFirstOption(root);
  selected.setAttribute('aria-selected', 'false');
  selectOption(next);
};

export const selectPreviousSibling = (root: HTMLElement | null) => {
  const selected = getSelectedOption(root);
  if (!selected) return selectLastOption(root);
  const previous = selected.previousElementSibling;
  if (!isOption(previous)) return selectLastOption(root);
  selected.setAttribute('aria-selected', 'false');
  selectOption(previous);
};

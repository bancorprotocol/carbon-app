export const suggestionClasses =
  'absolute left-0 top-[100%] z-30 mt-10 max-h-[300px] w-full overflow-hidden overflow-y-auto rounded-10 bg-background-800 py-10 md:mt-20 grid';

const getOptionsInOrder = (root: HTMLElement | null) => {
  const selector = '[role="option"]:not([hidden])';
  const options = root?.querySelectorAll<HTMLElement>(selector);
  return Array.from(options ?? []).sort((a, b) => {
    return Number(a.dataset.order) - Number(b.dataset.order);
  });
};

export const selectCurrentOption = (root: HTMLElement | null) => {
  const option = getSelectedOption(root) || getFirstOption(root);
  option?.click();
};

export const getSelectedOption = (root: HTMLElement | null) => {
  const selector = '[role="option"][aria-selected="true"]';
  return root?.querySelector<HTMLElement>(selector);
};

export const getFirstOption = (root: HTMLElement | null) => {
  getSelectedOption(root)?.setAttribute('aria-selected', 'false');
  return getOptionsInOrder(root)[0];
};

export const selectOption = (element?: HTMLElement | null) => {
  if (!element) return;
  element.setAttribute('aria-selected', 'true');
  element.scrollIntoView({ block: 'nearest' });
};

export const selectFirstOption = (root: HTMLElement | null) => {
  const firstOption = getFirstOption(root);
  selectOption(firstOption);
};

export const selectLastOption = (root: HTMLElement | null) => {
  getSelectedOption(root)?.setAttribute('aria-selected', 'false');
  selectOption(getOptionsInOrder(root).at(-1));
};

export const selectNextSibling = (root: HTMLElement | null) => {
  const selected = getSelectedOption(root);
  if (!selected) return selectFirstOption(root);
  const options = getOptionsInOrder(root);
  for (let i = 0; i < options.length; i++) {
    if (options[i] === selected) {
      selected.setAttribute('aria-selected', 'false');
      if (options[i + 1]) selectOption(options[i + 1]);
      else selectFirstOption(root);
      break;
    }
  }
};

export const selectPreviousSibling = (root: HTMLElement | null) => {
  const selected = getSelectedOption(root);
  if (!selected) return selectLastOption(root);
  const options = getOptionsInOrder(root);
  for (let i = options.length; i > 0; i--) {
    if (options[i] === selected) {
      selected.setAttribute('aria-selected', 'false');
      if (options[i - 1]) selectOption(options[i - 1]);
      else selectFirstOption(root);
      break;
    }
  }
};

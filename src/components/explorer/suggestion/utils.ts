const getOptions = (root: HTMLElement | null) => {
  return root?.querySelectorAll<HTMLElement>('button') ?? [];
};

export const getSelectedOption = (root: HTMLElement | null) => {
  const selector = 'button[aria-selected="true"]';
  return root?.querySelector<HTMLElement>(selector);
};

export const getFirstOption = (root: HTMLElement | null) => {
  getSelectedOption(root)?.setAttribute('aria-selected', 'false');
  const selector = 'button:first-of-type';
  return root?.querySelector<HTMLElement>(selector);
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
  const options = getOptions(root);
  selectOption(options[options.length - 1]);
};

export const selectNextSibling = (root: HTMLElement | null) => {
  const options = getOptions(root);
  const selected = getSelectedOption(root);
  if (!selected) return selectOption(options[0]);
  selected.setAttribute('aria-selected', 'false');
  for (let i = 0; i < options.length; i++) {
    if (options[i] === selected) {
      return selectOption(options[i + 1] || options[0]);
    }
  }
};

export const selectPreviousSibling = (root: HTMLElement | null) => {
  const options = getOptions(root);
  const selected = getSelectedOption(root);
  if (!selected) return selectOption(options[options.length - 1]);
  selected.setAttribute('aria-selected', 'false');
  for (let i = 0; i < options.length; i++) {
    if (options[i] === selected) {
      return selectOption(options[i - 1] || options[options.length - 1]);
    }
  }
};

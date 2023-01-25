import { usePopper, Modifier } from 'react-popper';
import * as PopperJS from '@popperjs/core';

export const useTooltip = <Modifiers>(
  baseRef: HTMLDivElement | null,
  tooltipRef: HTMLDivElement | null,
  options?: Omit<Partial<PopperJS.Options>, 'modifiers'> & {
    createPopper?: typeof PopperJS.createPopper;
    modifiers?: ReadonlyArray<Modifier<Modifiers>>;
  }
) => {
  return usePopper(baseRef, tooltipRef, options);
};

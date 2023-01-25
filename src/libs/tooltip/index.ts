import { useRef } from 'react';
import { usePopper, Modifier } from 'react-popper';
import * as PopperJS from '@popperjs/core';

export const useTooltip = <Modifiers>(
  options?: Omit<Partial<PopperJS.Options>, 'modifiers'> & {
    createPopper?: typeof PopperJS.createPopper;
    modifiers?: ReadonlyArray<Modifier<Modifiers>>;
  }
) => {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const popper = usePopper(itemRef.current, tooltipRef.current, options);

  return {
    itemRef,
    tooltipRef,
    ...popper,
  };
};

import { Dispatch, FC, MouseEvent, ReactNode, useId, useState } from 'react';
import {
  Placement,
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
import { cn } from 'utils/helpers';

export interface MenuTriggerAttributes {
  onClick: (e: MouseEvent) => void;
}

type Props = {
  button: (attr: MenuTriggerAttributes) => ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: Dispatch<boolean>;
  className?: string;
  placement?: Placement;
  offset?: number;
};

export const DropdownMenu: FC<Props> = ({
  children,
  button,
  isOpen,
  setIsOpen,
  placement,
  className = '',
  offset: offsetValue = 8,
}) => {
  const tooltipId = useId();
  const outsideState = setIsOpen !== undefined && isOpen !== undefined;

  const [open, setOpen] = useState(false);

  const menuOpen = (outsideState && isOpen) || (!outsideState && open);

  const { refs, floatingStyles, context } = useFloating({
    placement: placement ?? 'bottom',
    open: menuOpen,
    onOpenChange: outsideState ? setIsOpen : setOpen,
    middleware: [offset(offsetValue), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transition } = useTransitionStyles(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  return (
    // TODO: See how to pass ref to button without breaking UI
    // by passing ref to button we can focus back on it after close
    <div className="relative" ref={refs.setReference}>
      {button(getReferenceProps() as any)}
      <FloatingPortal>
        {isMounted && menuOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              id={tooltipId}
              ref={refs.setFloating}
              className={cn(
                `w-fit min-w-[200px] rounded border border-b-lightGrey shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-emphasis`,
                className
              )}
              style={{ ...floatingStyles, ...transition }}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </div>
  );
};

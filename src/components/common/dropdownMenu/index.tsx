import {
  Dispatch,
  FC,
  MouseEvent,
  ReactNode,
  createContext,
  useContext,
  useId,
  useState,
} from 'react';
import {
  Placement,
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
  autoUpdate,
  Strategy as FloatingStrategy,
  FloatingFocusManagerProps,
} from '@floating-ui/react';
import { cn } from 'utils/helpers';

export interface MenuButtonProps {
  onClick: (e: MouseEvent) => void;
}

interface Props {
  button: (attr: MenuButtonProps) => ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: Dispatch<boolean>;
  className?: string;
  placement?: Placement;
  offset?: number;
  strategy?: FloatingStrategy;
  initialFocus?: FloatingFocusManagerProps['initialFocus'];
}

interface MenuCtx {
  setMenuOpen: Dispatch<boolean>;
}

const MenuContext = createContext<MenuCtx>({
  setMenuOpen: () => undefined,
});
export const useMenuCtx = () => useContext(MenuContext);

export const DropdownMenu: FC<Props> = ({
  children,
  button,
  isOpen,
  setIsOpen,
  placement,
  strategy = 'absolute',
  className = '',
  offset: offsetValue = 8,
  initialFocus,
}) => {
  const tooltipId = useId();

  // Open can be managed by the parent or inside this component
  const [open, setOpen] = useState(false);
  const outsideState = setIsOpen !== undefined && isOpen !== undefined;
  const menuOpen = (outsideState && isOpen) || (!outsideState && open);

  // Get properties to calculate positioning
  const { refs, floatingStyles, context } = useFloating({
    placement: placement ?? 'bottom',
    strategy: strategy,
    open: menuOpen,
    onOpenChange: outsideState ? setIsOpen : setOpen,
    middleware: [offset(offsetValue), flip(), shift()],
    whileElementsMounted: strategy === 'fixed' ? autoUpdate : undefined,
  });

  // Default transition provides a fadein on enter
  const { isMounted, styles: transition } = useTransitionStyles(context);

  // Generate props to manage reference button & floating element
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  const buttonProps = getReferenceProps({ ref: refs.setReference }) as any;

  return (
    <MenuContext.Provider value={{ setMenuOpen: setOpen }}>
      {button(buttonProps)}
      <FloatingPortal>
        {isMounted && menuOpen && (
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={initialFocus}
          >
            <div
              id={tooltipId}
              ref={refs.setFloating}
              className={cn(
                // z-index is above header/footer
                'bg-background-800 z-50 min-w-[200px] rounded shadow-lg backdrop-blur-2xl',
                className,
              )}
              style={{ ...floatingStyles, ...transition }}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </MenuContext.Provider>
  );
};

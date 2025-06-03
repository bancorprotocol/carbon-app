import {
  FC,
  HTMLProps,
  ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
  useContext,
  useState,
  createContext,
} from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  safePolygon,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';
import { cn } from 'utils/helpers';

interface FloatTooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useFloatTooltip({
  initialOpen = false,
  placement = 'top',
}: FloatTooltipOptions = {}) {
  const [open, setOpen] = useState(initialOpen);

  const data = useFloating({
    placement,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  const context = data.context;

  const hover = useHover(context, { handleClose: safePolygon() });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return {
    open,
    setOpen,
    ...interactions,
    ...data,
  };
}

type ContextType = ReturnType<typeof useFloatTooltip> | null;

const FloatTooltipContext = createContext<ContextType>(null);

export const useFloatTooltipContext = () => {
  const context = useContext(FloatTooltipContext);

  if (context == null) {
    const msg = 'FloatTooltip components must be wrapped in <FloatTooltip />';
    throw new Error(msg);
  }

  return context;
};

interface FloatTooltipProps extends FloatTooltipOptions {
  children: ReactNode;
}
export const FloatTooltip: FC<FloatTooltipProps> = ({
  children,
  ...options
}) => {
  const FloatTooltip = useFloatTooltip(options);
  return (
    <FloatTooltipContext.Provider value={FloatTooltip}>
      {children}
    </FloatTooltipContext.Provider>
  );
};

export const FloatTooltipTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement>
>(function FloatTooltipTrigger({ children, ...props }, propRef) {
  const context = useFloatTooltipContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  if (!isValidElement(children)) {
    throw new Error('Child of TootipTrigger should be a valid element');
  }
  const allProps =
    typeof children.props === 'object'
      ? { ...props, ...children.props }
      : props;
  return cloneElement(
    children,
    context.getReferenceProps({ ref, ...allProps }),
  );
});

export const FloatTooltipContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function FloatTooltipContent({ style, ...props }, propRef) {
  const context = useFloatTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open) return null;

  return (
    <FloatingPortal>
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        {...context.getFloatingProps(props)}
        className={cn('bg-background-800 rounded p-16', props.className)}
      />
    </FloatingPortal>
  );
});

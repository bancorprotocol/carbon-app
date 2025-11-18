import {
  cloneElement,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
} from 'react';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { cn } from 'utils/helpers';
import {
  autoPlacement,
  computePosition,
  flip,
  offset,
  Placement,
} from '@floating-ui/core';
import { platform } from '@floating-ui/dom';

interface Props {
  element: ReactNode;
  placement?: Placement;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Tooltip: FC<Props> = ({
  element,
  className = '',
  disabled = false,
  placement,
  children = <IconTooltip className="size-18" />,
}) => {
  const anchorId = useId();
  const popoverId = useId();

  useEffect(() => {
    // TODO: remove once Popover API is widely available
    import('@oddbird/popover-polyfill/fn').then((res) => {
      if (res.isSupported()) return;
      res.apply();
    });
  }, []);

  const showTooltip = useCallback(async () => {
    const anchor = document.getElementById(anchorId);
    const popover = document.getElementById(popoverId);
    if (!popover || !anchor) return;
    await new Promise((res) => setTimeout(res, 400));
    if (!anchor.matches(':hover')) return;
    popover.showPopover();
    const { x, y } = await computePosition(anchor, popover, {
      platform,
      placement: placement ?? 'bottom',
      strategy: 'fixed',
      middleware: [offset(6), placement ? flip() : autoPlacement()],
    });
    popover.style.setProperty('left', `${x}px`);
    popover.style.setProperty('top', `${y}px`);
    popover.animate(
      [
        { opacity: 0, transform: 'scale(0.8)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      {
        fill: 'forwards',
        easing: `cubic-bezier(0, 0.55, 0.45, 1)`, // ease-out
        duration: 150,
      },
    );
  }, [anchorId, placement, popoverId]);

  const hideTooltip = useCallback(() => {
    const popover = document.getElementById(popoverId);
    setTimeout(async () => {
      if (!popover || popover.matches(':hover')) return;
      const animation = popover.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.8)' },
        ],
        {
          fill: 'forwards',
          easing: `cubic-bezier(0.55, 0, 1, 0.45)`, // ease-in
          duration: 150,
        },
      );
      await animation.finished;
      popover.hidePopover();
    }, 50);
  }, [popoverId]);

  const target = useMemo(() => {
    const nodes = Array.isArray(children) ? children : [children];
    return nodes.map((node, i) => {
      return cloneElement(node, {
        id: anchorId,
        key: `anchor-${i}`,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
      });
    });
  }, [anchorId, children, hideTooltip, showTooltip]);

  if (disabled) {
    return children;
  }

  return (
    <>
      {target}
      <span
        id={popoverId}
        key="tooltip"
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={hideTooltip}
        className={cn(
          'bg-main-600/40 text-14 rounded-2xl px-24 py-16 text-white backdrop-blur-2xl max-w-350',
          className,
        )}
        popover="manual"
      >
        {element}
      </span>
    </>
  );
};

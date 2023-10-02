import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Breakpoint, useBreakpoints } from 'hooks/useBreakpoints';
import {
  FC,
  Fragment,
  memo,
  ReactElement,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { Strategy } from 'libs/queries';
import { m } from 'libs/motion';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

const getItemsPerRow = (breakpoint: Breakpoint) => {
  switch (breakpoint) {
    case 'sm':
      return 1;
    case 'md':
      return 2;
    default:
      return 3;
  }
};

type Props = {
  strategies: Strategy[];
  isLoading: boolean;
  emptyElement: ReactElement;
  isExplorer?: boolean;
};

export const _StrategyContent: FC<Props> = ({
  strategies,
  isExplorer,
  isLoading,
  emptyElement,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const parentOffsetRef = useRef(0);

  const { currentBreakpoint } = useBreakpoints();

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const rows = useMemo(() => {
    const itemsPerRow = getItemsPerRow(currentBreakpoint);
    const arr = strategies ?? [];
    const result: Strategy[][] = [];
    for (let i = 0; i < arr.length; i += itemsPerRow) {
      result.push(arr.slice(i, i + itemsPerRow));
    }
    return result;
  }, [currentBreakpoint, strategies]);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    scrollMargin: parentOffsetRef.current,
    estimateSize: () => 600,
    // overscan: 3,
  });

  const items = rowVirtualizer.getVirtualItems();

  if (isLoading) {
    return (
      <m.div
        key="loading"
        className="flex flex-grow items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="h-80">
          <CarbonLogoLoading />
        </div>
      </m.div>
    );
  }

  if (!strategies?.length) return emptyElement;

  return (
    <div
      ref={parentRef}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      <ul
        data-testid="strategy-list"
        className="grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:gap-25"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${
            items[0].start - rowVirtualizer.options.scrollMargin
          }px)`,
        }}
      >
        {items.map((virtualRow) => (
          <Fragment key={virtualRow.key}>
            {rows[virtualRow.index].map((s) => (
              <StrategyBlock key={s.id} strategy={s} isExplorer={isExplorer} />
            ))}
          </Fragment>
        ))}
        {!isExplorer && <StrategyBlockCreate />}
      </ul>
    </div>
  );
};

export const StrategyContent = memo(
  _StrategyContent,
  (prev, next) =>
    prev.isLoading === next.isLoading &&
    JSON.stringify(prev.strategies) === JSON.stringify(next.strategies)
);

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Breakpoint, useBreakpoints } from 'hooks/useBreakpoints';
import {
  FC,
  Fragment,
  memo,
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { Strategy } from 'libs/queries';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useStore } from 'store';
import { m } from 'libs/motion';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { getCompareFunctionBySortType } from './utils';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { toPairName, toPairSlug } from 'utils/pairSearch';

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
  strategies?: Strategy[];
  isLoading?: boolean;
  isExplorer?: boolean;
  emptyElement: ReactNode;
};

export const _StrategyContent: FC<Props> = ({
  strategies,
  isExplorer,
  isLoading,
  emptyElement,
}) => {
  const {
    strategies: { search, sort, filter },
  } = useStore();
  const compareFunction = getCompareFunctionBySortType(sort);
  const searchSlug = toPairSlug(search);
  const filteredStrategies = useMemo(() => {
    const filtered = strategies?.filter((strategy) => {
      if (filter === 'active' && strategy.status !== 'active') {
        return false;
      }
      if (filter === 'inactive' && strategy.status === 'active') {
        return false;
      }
      if (!searchSlug) return true;
      const name = toPairName(strategy.base, strategy.quote);
      return toPairSlug(name).includes(searchSlug);
    });
    return filtered?.sort(compareFunction);
  }, [searchSlug, strategies, filter, compareFunction]);

  const parentRef = useRef<HTMLDivElement>(null);
  const parentOffsetRef = useRef(0);

  const { currentBreakpoint } = useBreakpoints();

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const rows = useMemo(() => {
    const itemsPerRow = getItemsPerRow(currentBreakpoint);
    const arr = filteredStrategies ?? [];
    const result: Strategy[][] = [];
    for (let i = 0; i < arr.length; i += itemsPerRow) {
      result.push(arr.slice(i, i + itemsPerRow));
    }
    return result;
  }, [currentBreakpoint, filteredStrategies]);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    scrollMargin: parentOffsetRef.current,
    estimateSize: () => 600,
    // overscan: 3,
  });

  const items = rowVirtualizer.getVirtualItems();

  if (strategies && strategies.length === 0 && !isExplorer)
    return <StrategyCreateFirst />;

  return (
    <>
      {!filteredStrategies || filteredStrategies.length === 0 || isLoading ? (
        <>
          {isLoading ? (
            <m.div
              key={'loading'}
              className={'flex flex-grow items-center justify-center'}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={'h-80'}>
                <CarbonLogoLoading />
              </div>
            </m.div>
          ) : (
            emptyElement
          )}
        </>
      ) : (
        <div
          ref={parentRef}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <ul
            data-testid="strategies-list"
            className={
              'grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:gap-25'
            }
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
                  <StrategyBlock
                    key={s.id}
                    strategy={s}
                    isExplorer={isExplorer}
                  />
                ))}
              </Fragment>
            ))}
            {!isExplorer && <StrategyBlockCreate />}
          </ul>
        </div>
      )}
    </>
  );
};

export const StrategyContent = memo(
  _StrategyContent,
  (prev, next) =>
    prev.isLoading === next.isLoading &&
    JSON.stringify(prev.strategies) === JSON.stringify(next.strategies)
);

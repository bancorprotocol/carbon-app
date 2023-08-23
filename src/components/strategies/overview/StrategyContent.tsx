import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Breakpoint, useBreakpoints } from 'hooks/useBreakpoints';
import { FC, Fragment, memo, useLayoutEffect, useMemo, useRef } from 'react';
import { Strategy, StrategyStatus } from 'libs/queries';
import { StrategyFilter } from 'components/strategies/overview/StrategyFilterSort';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useStore } from 'store';
import { StrategyNotFound } from './StrategyNotFound';
import { m } from 'libs/motion';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { getCompareFunctionBySortType } from './utils';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useTranslation } from 'libs/translations';

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
};

export const _StrategyContent: FC<Props> = ({
  strategies,
  isExplorer,
  isLoading,
}) => {
  const {
    strategies: { search, sort, filter },
  } = useStore();
  const compareFunction = getCompareFunctionBySortType(sort);
  const { t } = useTranslation();
  const filteredStrategies = useMemo(() => {
    const searchLC = search.toLowerCase();

    const filtered = strategies?.filter(
      (strategy) =>
        (strategy.base.symbol.toLowerCase().includes(searchLC) ||
          strategy.quote.symbol.toLowerCase().includes(searchLC)) &&
        (filter === StrategyFilter.All ||
          (filter === StrategyFilter.Active &&
            strategy.status === StrategyStatus.Active) ||
          (filter === StrategyFilter.Inactive &&
            strategy.status !== StrategyStatus.Active))
    );

    return filtered?.sort((a, b) => {
      return compareFunction(a, b);
    });
  }, [search, strategies, filter, compareFunction]);

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
    if (result[result.length - 1]?.length === itemsPerRow) {
      result.push([]);
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

  if (strategies && strategies.length === 0) return <StrategyCreateFirst />;

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
            <StrategyNotFound />
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
          <div
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
            <StrategyBlockCreate
              title={
                t('pages.strategyOverview.card.actionButtons.actionButton2') ||
                ''
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export const StrategyContent = memo(
  _StrategyContent,
  (prevProps, nextProps) =>
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.strategies?.length === nextProps.strategies?.length
);

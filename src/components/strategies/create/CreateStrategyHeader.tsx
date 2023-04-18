import { useLocation } from 'libs/routing';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { useMemo } from 'react';
import { items } from 'components/strategies/create/variants';
import { m } from 'libs/motion';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { carbonEvents } from 'services/events';

export const CreateStrategyHeader = ({
  showGraph,
  showOrders,
  setShowGraph,
  strategyDirection,
}: UseStrategyCreateReturn) => {
  const {
    history: { back },
  } = useLocation();

  const title = useMemo(() => {
    if (!showOrders) {
      return 'Create Strategy';
    }
    switch (strategyDirection) {
      case undefined:
        return 'Set Prices';
      default:
        return 'Set Price';
    }
  }, [showOrders, strategyDirection]);

  return (
    <m.div
      variants={items}
      key={'createStrategyHeader'}
      className={`flex w-full flex-row justify-between ${
        showGraph ? '' : 'md:w-[440px]'
      }`}
    >
      <div className="flex items-center gap-16 text-24">
        <button
          onClick={() => back()}
          className="h-40 w-40 rounded-full bg-emphasis"
        >
          <IconChevron className="mx-auto w-14 rotate-90" />
        </button>
        {title}
      </div>
      {!showGraph && showOrders && (
        <button
          onClick={() => {
            carbonEvents.strategy.strategyChartOpen(undefined);
            setShowGraph(true);
          }}
          className="h-40 w-40 self-end rounded-full bg-emphasis"
        >
          <IconCandles className="mx-auto w-14" />
        </button>
      )}
    </m.div>
  );
};

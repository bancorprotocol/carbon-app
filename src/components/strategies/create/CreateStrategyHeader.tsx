import { useMemo } from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { useRouter } from 'libs/routing';
import { items } from 'components/strategies/create/variants';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { ForwardArrow } from 'components/common/forwardArrow';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { cn } from 'utils/helpers';

export const CreateStrategyHeader = ({
  showGraph,
  showOrders,
  setShowGraph,
  strategyDirection,
}: UseStrategyCreateReturn) => {
  const { history } = useRouter();
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
    <m.header
      variants={items}
      key="createStrategyHeader"
      className={cn(
        'flex w-full items-center gap-16',
        showGraph ? '' : 'md:w-[440px]'
      )}
    >
      <button
        onClick={() => history.back()}
        className="grid h-40 w-40 place-items-center rounded-full bg-emphasis"
      >
        <ForwardArrow className="h-18 w-18 rotate-180" />
      </button>
      <h1 className="flex-1 text-24 font-weight-500">{title}</h1>
      {!showGraph && showOrders && (
        <button
          onClick={() => {
            carbonEvents.strategy.strategyChartOpen(undefined);
            setShowGraph(true);
          }}
          className="grid h-40 w-40 place-items-center rounded-full bg-emphasis"
        >
          <IconCandles className="h-18 w-18" />
        </button>
      )}
    </m.header>
  );
};

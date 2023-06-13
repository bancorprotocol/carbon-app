import { useLocation } from 'libs/routing';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { useMemo } from 'react';
import { items } from 'components/strategies/create/variants';
import { m } from 'libs/motion';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { carbonEvents } from 'services/events';
import { useTranslation } from 'libs/translations';

export const CreateStrategyHeader = ({
  showGraph,
  showOrders,
  setShowGraph,
  strategyDirection,
}: UseStrategyCreateReturn) => {
  const { t } = useTranslation();
  const {
    history: { back },
  } = useLocation();

  const title = useMemo(() => {
    if (!showOrders) {
      return t('pages.strategyCreate.step1.title');
    }
    switch (strategyDirection) {
      case undefined:
        return t('pages.strategyCreate.step2.title', { count: 2 });
      default:
        return t('pages.strategyCreate.step2.title', { count: 1 });
    }
  }, [showOrders, strategyDirection, t]);

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

import { m } from 'libs/motion';
import { items } from './variants';
import { Button } from 'components/common/button';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { carbonEvents } from 'services/events';

import { FC } from 'react';
import { UseStrategyCreateReturn } from 'components/strategies/create';

type Props = Pick<
  UseStrategyCreateReturn,
  'base' | 'quote' | 'showGraph' | 'setShowGraph'
>;
export const CreateStrategyGraph: FC<Props> = ({
  base,
  quote,
  showGraph,
  setShowGraph,
}) => {
  return (
    <div
      className={`flex flex-col ${showGraph ? 'flex-1' : 'absolute right-20'}`}
    >
      <m.div
        variants={items}
        key="createStrategyGraph"
        className="flex h-[550px] flex-col rounded-10 bg-silver p-20 pb-40 md:sticky md:top-80"
      >
        <div className="flex items-center justify-between">
          <h2 className="mb-20 font-weight-500">Price Chart</h2>
          <Button
            className="mb-20 self-end"
            variant="secondary"
            size="md"
            onClick={() => {
              carbonEvents.strategy.strategyChartClose(undefined);
              setShowGraph(false);
            }}
          >
            <div className="flex items-center justify-center">
              <IconX className="w-10 md:mr-12" />
              <span className="hidden md:block">Close Chart</span>
            </div>
          </Button>
        </div>
        <TradingviewChart base={base} quote={quote} />
      </m.div>
    </div>
  );
};

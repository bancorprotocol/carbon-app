import { FC } from 'react';
import { items } from './variants';
import { Button } from 'components/common/button';
import { TradingviewChart } from 'components/tradingviewChart';
import { carbonEvents } from 'services/events';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import {
  AnimatedGraph,
  CloseChartLabelContainer,
  CreateStrategyGraphContainer,
  GraphTitle,
  CloseIcon,
  CloseChart,
} from './CreateStrategyGraph.styles';

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
    <CreateStrategyGraphContainer showGraph={showGraph}>
      <AnimatedGraph variants={items} key="createStrategyGraph">
        <div className="flex items-center justify-between">
          <GraphTitle>Price Chart</GraphTitle>
          <Button
            className={`mb-20 self-end`}
            variant="secondary"
            size={'md'}
            onClick={() => {
              carbonEvents.strategy.strategyChartClose(undefined);
              setShowGraph(false);
            }}
          >
            <CloseChartLabelContainer>
              <CloseIcon />
              <CloseChart />
            </CloseChartLabelContainer>
          </Button>
        </div>
        <TradingviewChart base={base} quote={quote} />
      </AnimatedGraph>
    </CreateStrategyGraphContainer>
  );
};

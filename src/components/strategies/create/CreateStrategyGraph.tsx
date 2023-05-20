import { FC } from 'react';
import { items } from './variants';
import { Button } from 'components/common/button';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { carbonEvents } from 'services/events';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import {
  AnimatedGraphContainer,
  CloseChartButton,
  CreateStrategyGraphContainer,
  GraphTitle,
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
      <AnimatedGraphContainer variants={items} key="createStrategyGraph">
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
            <CloseChartButton>
              <IconX className={'w-10 md:mr-12'} />
              <span className="hidden md:block">Close Chart</span>
            </CloseChartButton>
          </Button>
        </div>
        <TradingviewChart base={base} quote={quote} />
      </AnimatedGraphContainer>
    </CreateStrategyGraphContainer>
  );
};

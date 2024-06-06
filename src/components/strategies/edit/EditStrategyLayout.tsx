import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { CreateStrategyGraph } from '../create/CreateStrategyGraph';
import { EditStrategyBudgetContent } from './EditStrategyBudgetContent';
import { EditStrategyPricesContent } from './EditStrategyPricesContent';
import { Strategy } from 'libs/queries';
import { TradingviewChart } from 'components/tradingviewChart';

interface EditStrategyLayoutProps {
  type: EditTypes;
  strategy: Strategy;
  showGraph: boolean;
  setShowGraph: (value: boolean) => void;
}

export const EditStrategyLayout = ({
  strategy,
  type,
  showGraph,
  setShowGraph,
}: EditStrategyLayoutProps) => {
  const { base, quote } = strategy;

  return (
    <div className="flex w-full flex-col gap-20 md:flex-row-reverse md:justify-center">
      {showGraph && (
        <CreateStrategyGraph setShowGraph={setShowGraph}>
          <TradingviewChart base={base} quote={quote} />
        </CreateStrategyGraph>
      )}
      {type === 'deposit' || type === 'withdraw' ? (
        <EditStrategyBudgetContent {...{ strategy, type }} />
      ) : (
        <EditStrategyPricesContent {...{ strategy, type }} />
      )}
    </div>
  );
};

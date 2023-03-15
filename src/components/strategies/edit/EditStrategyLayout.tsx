import { EditTypes } from './EditStrategyMain';
import { CreateStrategyGraph } from '../create/CreateStrategyGraph';
import { EditStrategyBudgetContent } from './EditStrategyBudgetContent';
import { EditStrategyPricesContent } from './EditStrategyPricesContent';
import { Strategy } from 'libs/queries';

type EditStrategyLayoutProps = {
  type: EditTypes;
  strategy: Strategy;
  showGraph: boolean;
  setShowGraph: (value: boolean) => void;
};

export const EditStrategyLayout = ({
  strategy,
  type,
  showGraph,
  setShowGraph,
}: EditStrategyLayoutProps) => {
  const { token0, token1 } = strategy;

  return (
    <div className="flex w-full flex-col gap-20 md:flex-row-reverse md:justify-center">
      <div
        className={`flex flex-col ${
          showGraph ? 'flex-1' : 'absolute right-20'
        }`}
      >
        {showGraph && (
          <CreateStrategyGraph {...{ token0, token1, setShowGraph }} />
        )}
      </div>
      {type === 'deposit' || type === 'withdraw' ? (
        <EditStrategyBudgetContent {...{ strategy, type }} />
      ) : (
        <EditStrategyPricesContent {...{ strategy, type }} />
      )}
    </div>
  );
};

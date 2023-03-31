import { EditTypes } from './EditStrategyMain';
import { CreateStrategyGraph } from '../create/CreateStrategyGraph';
import { EditStrategyBudgetContent } from './EditStrategyBudgetContent';
import { EditStrategyPricesContent } from './EditStrategyPricesContent';
import { Strategy } from 'libs/queries';
import { UseStrategyCreateReturn } from '../create';

type EditStrategyLayoutProps = {
  type: EditTypes;
  strategy: Strategy;
} & Pick<UseStrategyCreateReturn, 'showGraph' | 'setShowGraph'>;

export const EditStrategyLayout = ({
  strategy,
  type,
  showGraph,
  setShowGraph,
}: EditStrategyLayoutProps) => {
  const { base, quote } = strategy;

  return (
    <div className="flex w-full flex-col gap-20 md:flex-row-reverse md:justify-center">
      <div
        className={`flex flex-col ${
          showGraph ? 'flex-1' : 'absolute right-20'
        }`}
      >
        {showGraph && (
          <CreateStrategyGraph {...{ base, quote, showGraph, setShowGraph }} />
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

import { m } from 'libs/motion';
import { list } from './variants';
import { useCreateStrategy } from './useCreateStrategy';
import { CreateStrategyHeader } from './CreateStrategyHeader';
import { CreateStrategyGraph } from 'components/strategies/create/CreateStrategyGraph';
import { CreateStrategyTokenSelection } from 'components/strategies/create/CreateStrategyTokenSelection';
import { CreateStrategyTypeMenu } from 'components/strategies/create/createStrategyContent/CreateStrategyTypeMenu';
import { CreateStrategyOrders } from 'components/strategies/create/CreateStrategyOrders';

export const CreateStrategyMain = () => {
  const createStrategy = useCreateStrategy();
  const {
    showGraph,
    showTokenSelection,
    showOrders,
    setShowGraph,
    isDuplicate,
  } = createStrategy;

  return (
    <m.div
      className={`flex flex-col items-center space-y-20 p-20 ${
        showGraph ? 'justify-between' : 'justify-center'
      }`}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <CreateStrategyHeader {...createStrategy} />

      <div className="flex w-full flex-col gap-20 md:flex-row-reverse md:justify-center">
        <CreateStrategyGraph {...createStrategy} />

        <div className="w-full space-y-20 md:w-[440px]">
          <CreateStrategyTokenSelection {...createStrategy} />
          <CreateStrategyTypeMenu {...createStrategy} />
          <CreateStrategyOrders {...createStrategy} />
        </div>
      </div>
    </m.div>
  );
};

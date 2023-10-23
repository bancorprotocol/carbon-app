import { useCreateStrategy } from 'components/strategies/create/useCreateStrategy';
import { AnimatePresence } from 'framer-motion';
import { m } from 'libs/motion';
import { list } from 'components/strategies/create/variants';
import { CreateStrategyHeader } from 'components/strategies/create/CreateStrategyHeader';
import { CreateStrategyGraph } from 'components/strategies/create/CreateStrategyGraph';
import { CreateStrategyTokenSelection } from 'components/strategies/create/CreateStrategyTokenSelection';
import { CreateStrategyTypeMenu } from 'components/strategies/create/CreateStrategyTypeMenu';
import { CreateStrategyOrders } from 'components/strategies/create/CreateStrategyOrders';

export const CreateStrategyPage = () => {
  const createStrategy = useCreateStrategy();
  const { showGraph, showTokenSelection, showTypeMenu, showOrders } =
    createStrategy;

  return (
    <AnimatePresence mode="sync">
      <m.div
        className={`flex flex-col items-center gap-20 p-20 ${
          showGraph ? 'justify-between' : 'justify-center'
        }`}
        variants={list}
        initial="hidden"
        animate="visible"
      >
        <CreateStrategyHeader {...createStrategy} />

        <div className="flex w-full flex-col gap-20 md:flex-row-reverse md:justify-center">
          {showGraph && <CreateStrategyGraph {...createStrategy} />}

          {!showOrders && (
            <div className="flex flex-col gap-20 md:w-[440px]">
              {showTokenSelection && (
                <CreateStrategyTokenSelection {...createStrategy} />
              )}
              {showTypeMenu && <CreateStrategyTypeMenu {...createStrategy} />}
            </div>
          )}

          {showOrders && <CreateStrategyOrders {...createStrategy} />}
        </div>
      </m.div>
    </AnimatePresence>
  );
};

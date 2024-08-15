import { AnimatePresence } from 'framer-motion';
import { m } from 'libs/motion';
import { items, list } from 'components/strategies/common/variants';
import { CreateStrategyTokenSelection } from 'components/strategies/create/CreateStrategyTokenSelection';
import { CreateStrategyOption } from 'components/strategies/create/CreateStrategyOption';
import { useRouter } from '@tanstack/react-router';
import { usePersistLastPair } from './usePersistLastPair';
import { BackButton } from 'components/common/BackButton';

const url = '/strategies/create';
export const CreateStrategyTokenPage = () => {
  const { history } = useRouter();
  const { base, quote } = usePersistLastPair(url);

  return (
    <AnimatePresence mode="sync">
      <m.div
        className="flex flex-col gap-20 p-20 md:w-[480px] md:justify-self-center"
        variants={list}
        initial="hidden"
        animate="visible"
      >
        <m.header
          variants={items}
          key="createStrategyHeader"
          className="flex items-center gap-16"
        >
          <BackButton onClick={() => history.back()} />
          <h1 className="text-24 font-weight-500 flex-1">Create Strategy</h1>
        </m.header>
        <CreateStrategyTokenSelection base={base} quote={quote} />
        {base && quote && <CreateStrategyOption base={base} quote={quote} />}
      </m.div>
    </AnimatePresence>
  );
};

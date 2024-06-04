import { AnimatePresence } from 'framer-motion';
import { m } from 'libs/motion';
import { items, list } from 'components/strategies/create/variants';
import { CreateStrategyTokenSelection } from 'components/strategies/create/CreateStrategyTokenSelection';
import { CreateStrategyOption } from 'components/strategies/create/CreateStrategyOption';
import { useRouter, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { useTokens } from 'hooks/useTokens';

export const CreateStrategyTokenPage = () => {
  const { history } = useRouter();
  const { getTokenById } = useTokens();
  const search = useSearch({ from: '/strategies/create' });
  const base = getTokenById(search.base);
  const quote = getTokenById(search.quote);
  return (
    <AnimatePresence mode="sync">
      <m.div
        className="flex flex-col gap-20 justify-self-center md:w-[440px]"
        variants={list}
        initial="hidden"
        animate="visible"
      >
        <m.header
          variants={items}
          key="createStrategyHeader"
          className="flex items-center gap-16"
        >
          <button
            onClick={() => history.back()}
            className="bg-background-800 grid size-40 place-items-center rounded-full"
          >
            <ForwardArrow className="size-18 rotate-180" />
          </button>
          <h1 className="text-24 font-weight-500 flex-1">Create Strategy</h1>
        </m.header>
        <CreateStrategyTokenSelection base={base} quote={quote} />
        {base && quote && <CreateStrategyOption base={base} quote={quote} />}
      </m.div>
    </AnimatePresence>
  );
};

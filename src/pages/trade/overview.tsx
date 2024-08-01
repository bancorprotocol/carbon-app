import { Outlet } from '@tanstack/react-router';
import { StrategyContent } from 'components/strategies/overview';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { StrategyNotFound } from 'components/strategies/overview/StrategyNotFound';
import { useStrategyCtx } from 'hooks/useStrategies';

export const TradeOverview = () => {
  const { strategies, isPending, search } = useStrategyCtx();
  const emptyElement = search ? <StrategyNotFound /> : <StrategyCreateFirst />;

  return (
    <>
      <Outlet />
      <section className="col-span-2">
        <StrategyContent
          strategies={strategies}
          isPending={isPending}
          emptyElement={emptyElement}
        />
      </section>
    </>
  );
};

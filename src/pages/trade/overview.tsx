import { Outlet } from '@tanstack/react-router';
import { StrategyContent } from 'components/strategies/overview';
import { StrategyNotFound } from 'components/strategies/overview/StrategyNotFound';
import { StrategySearch } from 'components/strategies/overview/StrategySearch';
import { TradeExplorerTab } from 'components/trade/TradeExplorerTabs';
import { useStrategyCtx } from 'hooks/useStrategies';
import { StrategyFilterSort } from 'components/strategies/overview/StrategyFilterSort';
import { NoStrategies } from 'components/strategies/common/NoStrategies';

export const TradeOverview = () => {
  const { strategies, isPending, search } = useStrategyCtx();
  const emptyElement = search ? <StrategyNotFound /> : <NoStrategies />;

  return (
    <>
      <Outlet />
      <section
        aria-labelledby="overview-tab"
        className="col-span-2 mx-auto grid w-full max-w-[1220px] gap-20"
      >
        <header className="flex items-center gap-20">
          <TradeExplorerTab current="overview" />
          <StrategySearch className="hidden md:flex" />
          <StrategyFilterSort className="hidden md:flex" />
        </header>
        <StrategyContent
          strategies={strategies}
          isPending={isPending}
          emptyElement={emptyElement}
        />
      </section>
    </>
  );
};
